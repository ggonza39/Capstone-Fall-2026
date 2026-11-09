import { validateDonorInquiry } from "./donorInquiries.mjs";

describe("validateDonorInquiry", () => {
    test("returns no field errors for a valid inquiry with email", () => {
        const fields = validateDonorInquiry({
            firstName: "Maria",
            lastName: "Garcia",
            email: "maria@example.org",
        });

        expect(fields).toEqual({});
    });

    test("returns no field errors for a valid inquiry with only phone", () => {
        const fields = validateDonorInquiry({
            firstName: "Maria",
            lastName: "Garcia",
            phone: "111-111-1111",
        });

        expect(fields).toEqual({});
    });

    test("requires firstName", () => {
        const fields = validateDonorInquiry({
            lastName: "Garcia",
            email: "maria@example.org",
        });

        expect(fields.firstName).toBeDefined();
    });

    test("requires lastName", () => {
        const fields = validateDonorInquiry({
            firstName: "Maria",
            email: "maria@example.org",
        });

        expect(fields.lastName).toBeDefined();
    });

    test("requires an email or phone", () => {
        const fields = validateDonorInquiry({
            firstName: "Maria",
            lastName: "Garcia",
        });

        expect(fields.email).toBeDefined();
    });

    test("rejects a malformed email", () => {
        const fields = validateDonorInquiry({
            firstName: "Maria",
            lastName: "Garcia",
            email: "not-an-email",
        });

        expect(fields.email).toBeDefined();
    });

    test.each(["amount", "cardNumber", "cvv", "paymentToken", "paymentMethod"])(
        "rejects a prohibited payment field: %s",
        (field) => {
            const fields = validateDonorInquiry({
                firstName: "Maria",
                lastName: "Garcia",
                email: "maria@example.org",
                [field]: "should-not-be-accepted",
            });

            expect(fields[field]).toBeDefined();
        }
    );
});
