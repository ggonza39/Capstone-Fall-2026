import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NeedHelp from "./NeedHelp";
import { getWorkshopsByZip } from "../services/workshopService";

/**
 * PBI-12 UI-level tests for the workshop search journey. workshopService is
 * mocked here so these tests exercise NeedHelp.js's loading/empty/error
 * states directly, independent of the MSW sandbox layer (see
 * src/mocks/handlers.js). Workshop detail and sandbox registration moved to
 * WorkshopDetail.js (PBI-13) — see WorkshopDetail.test.js for those cases.
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

    test("links each workshop result to its detail/registration page", async () => {
        getWorkshopsByZip.mockResolvedValueOnce({ zipCode: "30301", workshops: [SAMPLE_WORKSHOP] });

        renderNeedHelp();

        await userEvent.type(screen.getByLabelText(/zip code/i), "30301");
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        const detailsLink = await screen.findByRole("link", { name: /view workshop details/i });
        expect(detailsLink).toHaveAttribute("href", `/workshops/${SAMPLE_WORKSHOP.id}`);
    });
});
