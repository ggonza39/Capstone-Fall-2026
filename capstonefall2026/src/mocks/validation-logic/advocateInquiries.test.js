import { validateAdvocateInquiry } from "./advocateInquiries.mjs";

describe("validateAdvocateInquiry", () => {
    test("returns no field errors for a valid advocate inquiry", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            phone: "4045550100",
            interests: ["sharePrograms"],
            message: "I would like to help spread the word.",
        });

        expect(fields).toEqual({});
    });

    test("requires firstName", () => {
        const fields = validateAdvocateInquiry({
            lastName: "Johnson",
            email: "mary@example.com",
            interests: ["sharePrograms"],
            message: "I would like to help.",
        });

        expect(fields.firstName).toBeDefined();
    });

    test("requires lastName", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            email: "mary@example.com",
            interests: ["sharePrograms"],
            message: "I would like to help.",
        });

        expect(fields.lastName).toBeDefined();
    });

    test("requires an email", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            lastName: "Johnson",
            interests: ["sharePrograms"],
            message: "I would like to help.",
        });

        expect(fields.email).toBeDefined();
    });

    test("rejects a malformed email", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            lastName: "Johnson",
            email: "not-an-email",
            interests: ["sharePrograms"],
            message: "I would like to help.",
        });

        expect(fields.email).toBeDefined();
    });

    test("requires at least one advocacy interest", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            interests: [],
            message: "I would like to help.",
        });

        expect(fields.interests).toBeDefined();
    });

    test("rejects an unknown advocacy interest value", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            interests: ["not-a-real-interest"],
            message: "I would like to help.",
        });

        expect(fields.interests).toBeDefined();
    });

    test("requires a message", () => {
        const fields = validateAdvocateInquiry({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
            interests: ["sharePrograms"],
        });

        expect(fields.message).toBeDefined();
    });
});
