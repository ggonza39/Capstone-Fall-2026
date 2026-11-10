import { validateAssistanceRequest } from "./assistanceRequests.mjs";

describe("validateAssistanceRequest", () => {
    test("returns no field errors for a valid request with email", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            helpCategory: "smartphone",
            description: "I need help learning how to make a video call.",
        });

        expect(fields).toEqual({});
    });

    test("returns no field errors for a valid request with only phone", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            lastName: "Johnson",
            phone: "4045550100",
            helpCategory: "smartphone",
            description: "I need help learning how to make a video call.",
        });

        expect(fields).toEqual({});
    });

    test("requires firstName", () => {
        const fields = validateAssistanceRequest({
            lastName: "Johnson",
            email: "mary@example.com",
            helpCategory: "smartphone",
            description: "Help needed.",
        });

        expect(fields.firstName).toBeDefined();
    });

    test("requires lastName", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            email: "mary@example.com",
            helpCategory: "smartphone",
            description: "Help needed.",
        });

        expect(fields.lastName).toBeDefined();
    });

    test("requires an email or phone", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            lastName: "Johnson",
            helpCategory: "smartphone",
            description: "Help needed.",
        });

        expect(fields.email).toBeDefined();
    });

    test("rejects a malformed email", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            lastName: "Johnson",
            email: "not-an-email",
            helpCategory: "smartphone",
            description: "Help needed.",
        });

        expect(fields.email).toBeDefined();
    });

    test("requires helpCategory", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            description: "Help needed.",
        });

        expect(fields.helpCategory).toBeDefined();
    });

    test("requires description", () => {
        const fields = validateAssistanceRequest({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            helpCategory: "smartphone",
        });

        expect(fields.description).toBeDefined();
    });
});
