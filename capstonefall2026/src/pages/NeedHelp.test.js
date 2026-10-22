import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NeedHelp from "./NeedHelp";
import { getWorkshopById, getWorkshopsByZip, registerForWorkshop } from "../services/workshopService";

/**
 * PBI-12 UI-level tests for the workshop search, detail, and sandbox
 * registration journey. workshopService is mocked here so these tests
 * exercise NeedHelp.js's loading/empty/success/error/full states directly,
 * independent of the MSW sandbox layer (see src/mocks/handlers.js and
 * src/mocks/validation-logic/workshopRegistration.test.js for the
 * handler/business-logic-level tests).
 */
jest.mock("../services/workshopService");

const SAMPLE_WORKSHOP = {
    id: "WS-1001",
    title: "Smartphone Basics for Beginners",
    date: "2026-10-04",
    time: "10:00",
    address: "123 Main St, Marietta, GA",
    distanceMiles: 3.2,
    eventType: "In-Person",
};

const SAMPLE_DETAIL = {
    id: "WS-1001",
    title: "Smartphone Basics for Beginners",
    dateTime: "2026-10-04T10:00:00-04:00",
    location: "Marietta Senior Center, 123 Main St, Marietta, GA",
    roomNumber: "Room 2",
    instructorName: "John Carter",
    accessibilityFeatures: ["Wheelchair accessible"],
    seatAvailability: 8,
};

function renderNeedHelp() {
    render(
        <MemoryRouter>
            <NeedHelp />
        </MemoryRouter>
    );
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe("workshop search", () => {
    test("shows a validation message for an invalid ZIP and does not call the service", async () => {
        renderNeedHelp();

        await userEvent.type(screen.getByLabelText(/zip code/i), "abc");
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(await screen.findByText(/enter a valid 5-digit zip code/i)).toBeInTheDocument();
        expect(getWorkshopsByZip).not.toHaveBeenCalled();
    });

    test("displays workshop results for a valid ZIP", async () => {
        getWorkshopsByZip.mockResolvedValueOnce({ zipCode: "30301", workshops: [SAMPLE_WORKSHOP] });

        renderNeedHelp();

        await userEvent.type(screen.getByLabelText(/zip code/i), "30301");
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(await screen.findByText(SAMPLE_WORKSHOP.title)).toBeInTheDocument();
        expect(getWorkshopsByZip).toHaveBeenCalledWith("30301");
    });

    test("shows an empty-results message when no workshops are returned", async () => {
        getWorkshopsByZip.mockResolvedValueOnce({ zipCode: "30301", workshops: [] });

        renderNeedHelp();

        await userEvent.type(screen.getByLabelText(/zip code/i), "30301");
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(await screen.findByText(/no workshops were found near 30301/i)).toBeInTheDocument();
    });

    test("shows a generic error message when the search fails", async () => {
        getWorkshopsByZip.mockRejectedValueOnce(new Error("network error"));

        renderNeedHelp();

        await userEvent.type(screen.getByLabelText(/zip code/i), "30301");
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(await screen.findByText(/we could not load workshops/i)).toBeInTheDocument();
    });
});

describe("workshop registration (sandbox)", () => {
    async function searchAndOpenRegistration() {
        getWorkshopsByZip.mockResolvedValueOnce({ zipCode: "30301", workshops: [SAMPLE_WORKSHOP] });

        renderNeedHelp();

        await userEvent.type(screen.getByLabelText(/zip code/i), "30301");
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        await screen.findByText(SAMPLE_WORKSHOP.title);

        userEvent.click(screen.getByRole("button", { name: /register for workshop/i }));
    }

    test("loads workshop details and submits a successful sandbox registration", async () => {
        getWorkshopById.mockResolvedValueOnce(SAMPLE_DETAIL);
        registerForWorkshop.mockResolvedValueOnce({
            registrationId: "WR-1001",
            status: "received",
            message: "This is a sandbox registration demonstration for Milestone 2.",
            workshop: { id: "WS-1001", title: SAMPLE_WORKSHOP.title, dateTime: SAMPLE_DETAIL.dateTime, location: SAMPLE_DETAIL.location },
        });

        await searchAndOpenRegistration();

        expect(await screen.findByLabelText(/^first name/i)).toBeInTheDocument();
        expect(getWorkshopById).toHaveBeenCalledWith("WS-1001");

        await userEvent.type(screen.getByLabelText(/^first name/i), "Mary");
        await userEvent.type(screen.getByLabelText(/^last name/i), "Johnson");
        await userEvent.type(screen.getByLabelText(/^email/i), "mary@example.com");

        userEvent.click(screen.getByRole("button", { name: /submit registration/i }));

        expect(await screen.findByText(/confirmation: wr-1001/i)).toBeInTheDocument();
        expect(registerForWorkshop).toHaveBeenCalledWith(
            "WS-1001",
            expect.objectContaining({ firstName: "Mary", lastName: "Johnson", email: "mary@example.com" })
        );
    });

    test("shows a full-workshop message when seats are unavailable", async () => {
        getWorkshopById.mockResolvedValueOnce({ ...SAMPLE_DETAIL, seatAvailability: 0 });

        await searchAndOpenRegistration();

        expect(await screen.findByText(/this workshop is full/i)).toBeInTheDocument();
    });

    test("shows field validation errors returned by the sandbox API", async () => {
        getWorkshopById.mockResolvedValueOnce(SAMPLE_DETAIL);
        registerForWorkshop.mockRejectedValueOnce({
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

        await searchAndOpenRegistration();

        await screen.findByLabelText(/^first name/i);

        await userEvent.type(screen.getByLabelText(/^first name/i), "Mary");
        await userEvent.type(screen.getByLabelText(/^last name/i), "Johnson");
        await userEvent.type(screen.getByLabelText(/^email/i), "mary@example.com");

        userEvent.click(screen.getByRole("button", { name: /submit registration/i }));

        expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    });

    test("shows a not-found message if the workshop disappears before registration completes", async () => {
        getWorkshopById.mockResolvedValueOnce(SAMPLE_DETAIL);
        registerForWorkshop.mockRejectedValueOnce({
            response: {
                data: {
                    error: { code: "NOT_FOUND", message: "The requested workshop does not exist." },
                },
            },
        });

        await searchAndOpenRegistration();

        await screen.findByLabelText(/^first name/i);

        await userEvent.type(screen.getByLabelText(/^first name/i), "Mary");
        await userEvent.type(screen.getByLabelText(/^last name/i), "Johnson");
        await userEvent.type(screen.getByLabelText(/^email/i), "mary@example.com");

        userEvent.click(screen.getByRole("button", { name: /submit registration/i }));

        expect(await screen.findByText(/we could not load this workshop/i)).toBeInTheDocument();
    });
});
