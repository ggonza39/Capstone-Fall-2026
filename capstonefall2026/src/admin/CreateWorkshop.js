import React, { useEffect, useRef, useState } from "react";
import { createWorkshop } from "../services/workshopService";

/**
 * PBI-15: Create Workshop
 *
 * Allows administrators to create workshops in the sandbox.
 * No production workshop records are modified.
 */

const initialFormData = {
  title: "",
  dateTime: "",
  location: "",
  roomNumber: "",
  instructorName: "",
  accessibilityFeatures: "",
  seatAvailability: "",
};

export default function CreateWorkshop() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorSubmissionCount, setErrorSubmissionCount] = useState(0);
  const formRef = useRef(null);

    // Focus the first invalid field only after a failed submission.
    useEffect(() => {
        if (errorSubmissionCount === 0) {
            return;
        }

        const firstInvalidField = Object.keys(errors).find(
            (fieldName) => Boolean(errors[fieldName])
        );

        if (!firstInvalidField) {
            return;
        }

        const field = Array.from(
            formRef.current?.querySelectorAll("[name]") || []
        ).find((input) => input.name === firstInvalidField);

        field?.focus();
        // Focus should change only after a failed submission,
        // not when individual field errors are cleared.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorSubmissionCount]);

  // Update the corresponding field when an administrator types.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear the field's previous error when its value changes.
    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  }

    async function handleSubmit(event) {
        event.preventDefault();

        setErrors({});
        setFeedback(null);
        setIsSubmitting(true);

        try {
            // Validate the date before converting it to ISO format.
            const selectedDate = new Date(formData.dateTime);
            if (
                !formData.dateTime ||
                Number.isNaN(selectedDate.getTime())
            ) {
                setErrors({
                    dateTime: "Please select a valid workshop date and time.",
                });

                setErrorSubmissionCount((count) => count + 1);

                setFeedback({
                    type: "error",
                    message: "Please correct the highlighted field.",
                });
                return;
            }

            // Convert the form values into the format expected by the API.
            const workshopData = {
                title: formData.title.trim(),
                dateTime: selectedDate.toISOString(),
                location: formData.location.trim(),
                roomNumber: formData.roomNumber.trim(),
                instructorName: formData.instructorName.trim(),
                accessibilityFeatures: formData.accessibilityFeatures
                    .split(",")
                    .map((feature) => feature.trim())
                    .filter(Boolean),
                seatAvailability:
                formData.seatAvailability.trim() === ""
                    ? null
                    : Number(formData.seatAvailability),
            };

            // Send the workshop information to the sandbox API.
            const response = await createWorkshop(workshopData);

            setFeedback({
                type: "success",
                message: `${response.workshop.title} was created successfully! Workshop ID: ${response.workshop.id}`,
            });

            // Clear the form after successful creation.
            setFormData(initialFormData);
        } catch (error) {
            const apiError = error.response?.data?.error;

            if (apiError?.fields && Object.keys(apiError.fields).length > 0) {
                setErrors(apiError.fields);
                setErrorSubmissionCount((count) => count + 1);
            }

            setFeedback({
                type: "error",
                message:
                    apiError?.message ||
                    "Unable to create the workshop. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form 
            ref={formRef}
            className="admin-create-workshop"
            onSubmit={handleSubmit}
        >

            {feedback && (
                <div
                    className={`admin-feedback admin-feedback--${feedback.type}`}
                    role={feedback.type === "error" ? "alert" : "status"}
                >
                    <p>{feedback.message}</p>
                </div>
            )}
            <p>
                Create a workshop for the sandbox environment.
                No production workshop records will be changed.
            </p>

            <div>
                <label htmlFor="workshop-title">Workshop Title *</label>
                <input
                    id="workshop-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? "workshop-title-error" : undefined}
                    required
                />

                {errors.title && (
                    <p id="workshop-title-error" className="admin-field-error">
                        {errors.title}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="workshop-date-time">Date and Time *</label>
                <input
                    id="workshop-date-time"
                    name="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.dateTime)}
                    aria-describedby={errors.dateTime ? "workshop-date-time-error" : undefined}
                    required
                />

                {errors.dateTime && (
                    <p id="workshop-date-time-error" className="admin-field-error">
                        {errors.dateTime}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="workshop-location">Location *</label>
                <input
                    id="workshop-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={
                        errors.location ? "workshop-location-error" : undefined
                    }
                    required
                />

                {errors.location && (
                    <p id="workshop-location-error" className="admin-field-error">
                        {errors.location}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="workshop-room">Room Number</label>
                <input
                    id="workshop-room"
                    name="roomNumber"
                    type="text"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.roomNumber)}
                    aria-describedby={
                        errors.roomNumber ? "workshop-room-error" : undefined
                    }
                />

                {errors.roomNumber && (
                    <p id="workshop-room-error" className="admin-field-error">
                        {errors.roomNumber}
                    </p>

                )}
            </div>

            <div>
                <label htmlFor="workshop-instructor">Instructor Name *</label>
                <input
                    id="workshop-instructor"
                    name="instructorName"
                    type="text"
                    value={formData.instructorName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.instructorName)}
                    aria-describedby={
                        errors.instructorName ? "workshop-instructor-error" : undefined
                    }
                    required
                />
                {errors.instructorName && (
                    <p
                        id="workshop-instructor-error"
                        className="admin-field-error"
                    >
                        {errors.instructorName}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="workshop-accessibility">
                    Accessibility Features
                </label>
                <textarea
                    id="workshop-accessibility"
                    name="accessibilityFeatures"
                    value={formData.accessibilityFeatures}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.accessibilityFeatures)}
                    aria-describedby={
                        errors.accessibilityFeatures
                            ? "workshop-accessibility-error"
                            : "workshop-accessibility-help"
                    }
                    placeholder="Example: Wheelchair accessible, Large-print handouts"
                    rows="3"
                />
                <small id="workshop-accessibility-help">
                    Separate multiple features with commas.
                </small>

                {errors.accessibilityFeatures && (
                    <p
                        id="workshop-accessibility-error"
                        className="admin-field-error"
                    >
                        {errors.accessibilityFeatures}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="workshop-seats">Available Seats *</label>
                <input
                    id="workshop-seats"
                    name="seatAvailability"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.seatAvailability}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.seatAvailability)}
                    aria-describedby={
                        errors.seatAvailability ? "workshop-seats-error" : undefined
                    }
                    required
                />

                {errors.seatAvailability && (
                    <p id="workshop-seats-error" className="admin-field-error">
                        {errors.seatAvailability}
                    </p>
                )}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Workshop..." : "Create Workshop"}
            </button>
        </form>
    );
}
