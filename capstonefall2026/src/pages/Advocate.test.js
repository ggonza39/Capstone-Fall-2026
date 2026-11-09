import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/theme";
import { apiRequest } from "../mocks/APIClient";
import Advocate from "./Advocate";

/**
 * PBI-13: Advocate Interest Form API integration tests.
 *
 * Advocate.js submits through the shared apiRequest client to
 * POST /api/v1/advocate-inquiries (see documentation/api-contract.md, API 6 —
 * Advocate Interest Inquiry, and src/mocks/handlers.js for the sandbox
 * handler/business-logic-level tests in
 * src/mocks/validation-logic/advocateInquiries.test.js).
 */
jest.mock("../mocks/APIClient", () => ({
    apiRequest: jest.fn(),
}));

function renderAdvocate() {
    render(
        <ThemeProvider theme={theme}>
            <Advocate />
        </ThemeProvider>
    );

    return {
        firstName: screen.getByRole("textbox", { name: /First Name/ }),
        lastName: screen.getByRole("textbox", { name: /Last Name/ }),
        email: screen.getByRole("textbox", { name: /Email Address/ }),
        message: screen.getByRole("textbox", { name: /Tell Us About Your Interest/ }),
        interestCheckbox: screen.getByRole("checkbox", { name: /Share TSLS programs/ }),
        submit: screen.getByRole("button", { name: /Submit Advocate Request/ }),
    };
}

async function fillValidForm(fields) {
    fireEvent.change(fields.firstName, { target: { value: "Mary" } });
    fireEvent.change(fields.lastName, { target: { value: "Johnson" } });
    fireEvent.change(fields.email, { target: { value: "mary@example.com" } });
    userEvent.click(fields.interestCheckbox);
    fireEvent.change(fields.message, { target: { value: "I would like to help spread the word." } });
}

beforeEach(() => {
    jest.clearAllMocks();
});

test("shows linked required-field errors and does not call the API", async () => {
    const fields = renderAdvocate();

    userEvent.click(fields.submit);

    expect(await screen.findByText("First Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email Address is required.")).toBeInTheDocument();
    expect(screen.getByText("Select at least one advocacy interest.")).toBeInTheDocument();
    expect(screen.getByText("Tell us about your interest is required.")).toBeInTheDocument();
    expect(fields.firstName).toHaveFocus();
    expect(apiRequest).not.toHaveBeenCalled();
});

test("submits a valid advocate inquiry and shows a success confirmation", async () => {
    apiRequest.mockResolvedValueOnce({
        inquiryId: "AI-1001",
        status: "received",
        message: "Your advocate interest request has been received.",
    });

    const fields = renderAdvocate();
    await fillValidForm(fields);

    userEvent.click(fields.submit);

    expect(await screen.findByRole("status")).toHaveTextContent(/thank you for your interest/i);
    expect(apiRequest).toHaveBeenCalledWith(
        "/v1/advocate-inquiries",
        "POST",
        expect.objectContaining({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            interests: ["sharePrograms"],
            message: "I would like to help spread the word.",
        })
    );
});

test("disables the submit button while the request is in flight to prevent duplicate submissions", async () => {
    let resolveRequest;
    apiRequest.mockReturnValueOnce(
        new Promise((resolve) => {
            resolveRequest = resolve;
        })
    );

    const fields = renderAdvocate();
    await fillValidForm(fields);

    userEvent.click(fields.submit);

    const submittingButton = await screen.findByRole("button", { name: /submitting/i });
    expect(submittingButton).toBeDisabled();
    expect(apiRequest).toHaveBeenCalledTimes(1);

    resolveRequest({ inquiryId: "AI-1002", status: "received", message: "ok" });
    expect(await screen.findByRole("status")).toBeInTheDocument();
});

test("shows field validation errors returned by the sandbox API", async () => {
    apiRequest.mockRejectedValueOnce({
        response: {
            data: {
                error: {
                    code: "VALIDATION_ERROR",
                    message: "The request contains invalid or missing information.",
                    fields: { email: "Enter a valid email address." },
                },
            },
        },
    });

    const fields = renderAdvocate();
    await fillValidForm(fields);

    userEvent.click(fields.submit);

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
});

test("shows a generic error message when the sandbox API request fails", async () => {
    apiRequest.mockRejectedValueOnce(new Error("network error"));

    const fields = renderAdvocate();
    await fillValidForm(fields);

    userEvent.click(fields.submit);

    expect(
        await screen.findByText(/we could not submit your advocate interest request/i)
    ).toBeInTheDocument();
});
