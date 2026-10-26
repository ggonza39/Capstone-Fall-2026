import { isWorkshopFull, validateWorkshopRegistration } from "./workshopRegistration.mjs";

describe("validateWorkshopRegistration", () => {
    test("returns no field errors for a valid registration with email", () => {
        const fields = validateWorkshopRegistration({
            firstName: "Mary",
            lastName: "Johnson",
            email: "mary@example.com",
        });

        expect(fields).toEqual({});
    });

    test("returns no field errors for a valid registration with only phone", () => {
        const fields = validateWorkshopRegistration({
            firstName: "Mary",
            lastName: "Johnson",
            phone: "4045550100",
        });

        expect(fields).toEqual({});
    });

    test("requires firstName", () => {
        const fields = validateWorkshopRegistration({
            lastName: "Johnson",
            email: "mary@example.com",
        });

        expect(fields.firstName).toBeDefined();
    });

    test("requires lastName", () => {
        const fields = validateWorkshopRegistration({
            firstName: "Mary",
            email: "mary@example.com",
        });

        expect(fields.lastName).toBeDefined();
    });

    test("requires an email or phone", () => {
        const fields = validateWorkshopRegistration({
            firstName: "Mary",
            lastName: "Johnson",
        });

        expect(fields.email).toBeDefined();
    });

    test("rejects a malformed email", () => {
        const fields = validateWorkshopRegistration({
            firstName: "Mary",
            lastName: "Johnson",
            email: "not-an-email",
        });

        expect(fields.email).toBeDefined();
    });
});

describe("isWorkshopFull", () => {
    test("returns true when seatAvailability is zero", () => {
        expect(isWorkshopFull({ seatAvailability: 0 })).toBe(true);
    });

    test("returns true when the workshop is missing", () => {
        expect(isWorkshopFull(undefined)).toBe(true);
    });

    test("returns false when seats remain", () => {
        expect(isWorkshopFull({ seatAvailability: 5 })).toBe(false);
    });
});
