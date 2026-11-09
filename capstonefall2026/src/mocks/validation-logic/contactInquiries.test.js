import { validateContactInquiry } from "./contactInquiries.mjs";

describe("validateContactInquiry", () => {
    test("returns no field errors for a valid inquiry", () => {
        const fields = validateContactInquiry({
            firstName: "Alicia",
            lastName: "Martin",
            email: "alicia@example.com",
            inquiryType: "General Question",
        });

        expect(fields).toEqual({});
    });

    test("requires firstName", () => {
        const fields = validateContactInquiry({
            lastName: "Martin",
            email: "alicia@example.com",
            inquiryType: "General Question",
        });

        expect(fields.firstName).toBeDefined();
    });

    test("requires lastName", () => {
        const fields = validateContactInquiry({
            firstName: "Alicia",
            email: "alicia@example.com",
            inquiryType: "General Question",
        });

        expect(fields.lastName).toBeDefined();
    });

    test("requires email", () => {
        const fields = validateContactInquiry({
            firstName: "Alicia",
            lastName: "Martin",
            inquiryType: "General Question",
        });

        expect(fields.email).toBeDefined();
    });

    test("rejects a malformed email", () => {
        const fields = validateContactInquiry({
            firstName: "Alicia",
            lastName: "Martin",
            email: "not-an-email",
            inquiryType: "General Question",
        });

        expect(fields.email).toBeDefined();
    });

    test("requires inquiryType", () => {
        const fields = validateContactInquiry({
            firstName: "Alicia",
            lastName: "Martin",
            email: "alicia@example.com",
        });

        expect(fields.inquiryType).toBeDefined();
    });
});
