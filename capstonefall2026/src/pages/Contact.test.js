import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/theme";
import { apiRequest } from "../mocks/APIClient";
import Contact from "./Contact";

/**
 * REQ-23: General Contact Inquiry API integration tests.
 *
 * Contact.js submits through the shared apiRequest client to
 * POST /api/v1/contact-inquiries (see documentation/api-contract.md, API 3 —
 * General Contact Inquiry).
 */
jest.mock("../mocks/APIClient", () => ({
    apiRequest: jest.fn(),
}));

function renderContact() {
    render(
        <ThemeProvider theme={theme}>
            <Contact />
        </ThemeProvider>
    );

    return {
        firstName: screen.getByRole("textbox", { name: /First Name/ }),
        lastName: screen.getByRole("textbox", { name: /Last Name/ }),
        email: screen.getByRole("textbox", { name: /Email Address/ }),
        message: screen.getByRole("textbox", { name: /How can we help/ }),
        submit: screen.getByRole("button", { name: /Send Message/ }),
    };
}

function fillValidForm(fields) {
    fireEvent.change(fields.firstName, { target: { value: "Alicia" } });
    fireEvent.change(fields.lastName, { target: { value: "Martin" } });
    fireEvent.change(fields.email, { target: { value: "alicia@example.com" } });
    fireEvent.change(fields.message, { target: { value: "I have a question about workshops." } });

    userEvent.click(screen.getByRole("combobox", { name: /Inquiry Type/ }));
    userEvent.click(screen.getByRole("option", { name: "General Question" }));
}

beforeEach(() => {
    jest.clearAllMocks();
});

test("shows required-field errors and does not call the API", async () => {
    const fields = renderContact();

    userEvent.click(fields.submit);

    expect(await screen.findByText("Enter your first name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your last name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Select an inquiry type.")).toBeInTheDocument();
    expect(screen.getByText("Tell us how we can help.")).toBeInTheDocument();
    expect(apiRequest).not.toHaveBeenCalled();
});

test("submits a valid contact inquiry and shows a success message", async () => {
    apiRequest.mockResolvedValueOnce({
        inquiryId: "CI-1001",
        status: "received",
        message: "Your contact inquiry has been received.",
    });

    const fields = renderContact();
    fillValidForm(fields);

    userEvent.click(fields.submit);

    expect(await screen.findByText(/this is a demonstration form/i)).toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledWith(
        "/v1/contact-inquiries",
        "POST",
        expect.objectContaining({
            firstName: "Alicia",
            lastName: "Martin",
            email: "alicia@example.com",
            inquiryType: "General Question",
            message: "I have a question about workshops.",
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

    const fields = renderContact();
    fillValidForm(fields);

    userEvent.click(fields.submit);

    const sendingButton = await screen.findByRole("button", { name: /sending/i });
    expect(sendingButton).toBeDisabled();
    expect(apiRequest).toHaveBeenCalledTimes(1);

    resolveRequest({ inquiryId: "CI-1002", status: "received", message: "ok" });
    expect(await screen.findByText(/this is a demonstration form/i)).toBeInTheDocument();
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

    const fields = renderContact();
    fillValidForm(fields);

    userEvent.click(fields.submit);

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
});

test("shows a generic error message when the sandbox API request fails", async () => {
    apiRequest.mockRejectedValueOnce(new Error("network error"));

    const fields = renderContact();
    fillValidForm(fields);

    userEvent.click(fields.submit);

    expect(
        await screen.findByText(/we could not submit your message/i)
    ).toBeInTheDocument();
});
