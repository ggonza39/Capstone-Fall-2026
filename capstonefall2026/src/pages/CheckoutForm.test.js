import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import theme from "../theme/theme";
import { CheckoutForm } from "./CheckoutForm";

jest.mock("@stripe/react-stripe-js", () => ({
    PaymentElement: () => null,
    ExpressCheckoutElement: () => null,
    useStripe: jest.fn(),
    useElements: jest.fn(),
}));

const originalFetch = global.fetch;
let paymentSubmit;

beforeEach(() => {
    jest.clearAllMocks();
    paymentSubmit = jest.fn().mockResolvedValue({});
    useStripe.mockReturnValue({});
    useElements.mockReturnValue({ submit: paymentSubmit });
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ isSimulation: true, success: true }),
    });
});

afterEach(() => {
    global.fetch = originalFetch;
});

function renderCheckout() {
    render(<ThemeProvider theme={theme}><CheckoutForm /></ThemeProvider>);
    return {
        firstName: screen.getByRole("textbox", { name: /First Name/ }),
        lastName: screen.getByRole("textbox", { name: /Last Name/ }),
        email: screen.getByRole("textbox", { name: /Email/ }),
        donate: screen.getByRole("button", { name: "Donate" }),
    };
}

function fillDonor(fields, values = {}) {
    const donor = { firstName: "Maria", lastName: "Garcia", email: "maria@example.org", ...values };
    Object.entries(donor).forEach(([name, value]) => {
        fireEvent.change(fields[name], { target: { value } });
    });
}

function expectLinkedError(input, message) {
    expect(input).toHaveAttribute("aria-invalid", "true");
    const description = document.getElementById(input.getAttribute("aria-describedby"));
    expect(description).toHaveTextContent(message);
}

test("required donor fields show linked helper messages and focus the first invalid input", () => {
    const fields = renderCheckout();
    fillDonor(fields, { firstName: "   ", lastName: "   ", email: "" });

    userEvent.click(fields.donate);

    expectLinkedError(fields.firstName, "Please enter your first name.");
    expectLinkedError(fields.lastName, "Please enter your last name.");
    expectLinkedError(fields.email, "Please enter your email address.");
    expect(fields.firstName).toHaveFocus();
    expect(paymentSubmit).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
});

test.each([
    "maria@@example.org",
    "maria@",
    "maria@example",
    "maria garcia@example.org",
])("invalid email %s blocks payment validation and the donor API", (email) => {
    const fields = renderCheckout();
    fillDonor(fields, { email });

    userEvent.click(fields.donate);

    expectLinkedError(fields.email, "Please enter a valid email address.");
    expect(fields.email).toHaveFocus();
    expect(paymentSubmit).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
});

test("field blur gives validation feedback even while payment services are unavailable", () => {
    useStripe.mockReturnValue(null);
    useElements.mockReturnValue(null);
    const fields = renderCheckout();

    fireEvent.blur(fields.firstName);
    fireEvent.blur(fields.lastName);
    fireEvent.change(fields.email, { target: { value: "maria@example" } });
    fireEvent.blur(fields.email);

    expectLinkedError(fields.firstName, "Please enter your first name.");
    expectLinkedError(fields.lastName, "Please enter your last name.");
    expectLinkedError(fields.email, "Please enter a valid email address.");
    expect(fields.donate).toBeDisabled();
    expect(paymentSubmit).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
});

test("correcting donor details clears helpers and permits the mocked donation submission", async () => {
    const fields = renderCheckout();
    userEvent.click(fields.donate);

    fillDonor(fields, { firstName: "  María  ", lastName: "  O'Neill  ", email: "maria@example" });
    expectLinkedError(fields.email, "Please enter a valid email address.");
    fireEvent.change(fields.email, { target: { value: "maria@example.org" } });

    [fields.firstName, fields.lastName, fields.email].forEach((input) => {
        expect(input).toHaveAttribute("aria-invalid", "false");
    });
    expect(screen.queryByText("Please enter your first name.")).not.toBeInTheDocument();
    expect(screen.queryByText("Please enter your last name.")).not.toBeInTheDocument();
    expect(screen.queryByText("Please enter your email address.")).not.toBeInTheDocument();
    expect(screen.queryByText("Please enter a valid email address.")).not.toBeInTheDocument();

    userEvent.click(fields.donate);

    expect(await screen.findByRole("status")).toHaveTextContent("Demo successful! No actual payment was processed.");
    expect(paymentSubmit).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, request] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/v1/donor-inquiries");
    expect(request.method).toBe("POST");
    expect(JSON.parse(request.body)).toMatchObject({
        firstName: "María",
        lastName: "O'Neill",
        email: "maria@example.org",
    });
});

test("payment validation errors continue to prevent the donor API request", async () => {
    paymentSubmit.mockResolvedValue({ error: { message: "Please complete your payment details." } });
    const fields = renderCheckout();
    fillDonor(fields);

    userEvent.click(fields.donate);

    expect(await screen.findByRole("status")).toHaveTextContent("Please complete your payment details.");
    expect(paymentSubmit).toHaveBeenCalledTimes(1);
    expect(global.fetch).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole("button", { name: "Donate" })).toBeEnabled());
});
