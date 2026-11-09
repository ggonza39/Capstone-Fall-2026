import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { workshops } from "../mocks/data/workshops";
import seoConfig from "../seo/config.json";
import { resolveSiteOrigin } from "../seo/metadata";
import RouteMetadata from "../seo/RouteMetadata";
import { getWorkshopById } from "../services/workshopService";
import WorkshopDetail from "./WorkshopDetail";

jest.mock("../services/workshopService", () => ({
    getWorkshopById: jest.fn(),
    registerForWorkshop: jest.fn(),
}));

const { registerForWorkshop } = jest.requireMock("../services/workshopService");

/**
 * Only reset the SEO metadata tags WorkshopDetail.js manages (applyPageMetadata
 * in src/seo/metadata.js), instead of wiping the entire <head>. Clearing all of
 * document.head (including Emotion/MUI's injected <style> tags) breaks MUI's
 * cached style-sheet node references across tests in this file and causes a
 * jsdom "NotFoundError: The child can not be found in the parent." the next
 * time a MUI component needs to insert a new CSS rule.
 */
function clearSeoMetaTags() {
    document.head
        .querySelectorAll('title, meta[name="description" i], meta[name="robots" i], link[rel~="canonical" i]')
        .forEach((node) => node.remove());
}

beforeEach(() => {
    clearSeoMetaTags();
});

afterEach(() => {
    clearSeoMetaTags();
});

test("workshop client navigation removes stale canonical metadata on errors and restores it on return", async () => {
    const workshop = workshops[0];
    const validPath = `/workshops/${workshop.id}`;
    const missingId = "technical-seo-missing";
    const siteOrigin = resolveSiteOrigin(process.env.REACT_APP_SITE_URL || seoConfig.siteOrigin);
    getWorkshopById
        .mockResolvedValueOnce(workshop)
        .mockRejectedValueOnce(new Error("Workshop not found"))
        .mockResolvedValueOnce(workshop);

    render(
        <MemoryRouter initialEntries={[validPath]}>
            <RouteMetadata />
            <nav aria-label="Workshop test navigation">
                <Link to={validPath}>Open known workshop</Link>
                <Link to={`/workshops/${missingId}`}>Open missing workshop</Link>
            </nav>
            <main>
                <Routes>
                    <Route path="/workshops/:id" element={<WorkshopDetail />} />
                </Routes>
            </main>
        </MemoryRouter>
    );

    async function expectKnownWorkshop() {
        expect(await screen.findByRole("heading", { level: 1, name: workshop.title })).toBeInTheDocument();
        await waitFor(() => expect(document.title).toBe(`${workshop.title} | TechSmart`));
        expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
        expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
        expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}${validPath}`);
        expect(screen.getAllByRole("main")).toHaveLength(1);
        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    }

    await expectKnownWorkshop();
    userEvent.click(screen.getByRole("link", { name: "Open missing workshop" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Workshop Not Found" })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe("Workshop Not Found | TechSmart"));
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    userEvent.click(screen.getByRole("link", { name: "Open known workshop" }));
    await expectKnownWorkshop();
    expect(getWorkshopById.mock.calls.map(([id]) => id)).toEqual([workshop.id, missingId, workshop.id]);
});

/**
 * PBI-13: workshop registration now lives on WorkshopDetail.js (moved from the
 * NeedHelp.js inline dialog). These tests exercise the sandbox registration
 * API integration (POST /api/workshops/:id/registrations) directly against
 * this page — see also src/mocks/validation-logic/workshopRegistration.test.js
 * for the handler/business-logic-level tests.
 */
describe("workshop registration (sandbox)", () => {
    const SAMPLE_DETAIL = {
        id: "WS-2001",
        title: "Tablet Basics",
        dateTime: "2026-11-04T10:00:00-04:00",
        location: "Marietta Senior Center",
        roomNumber: "Room 2",
        instructorName: "John Carter",
        accessibilityFeatures: ["Wheelchair accessible"],
        seatAvailability: 8,
    };

    function renderWorkshopDetail(id = SAMPLE_DETAIL.id) {
        render(
            <MemoryRouter initialEntries={[`/workshops/${id}`]}>
                <Routes>
                    <Route path="/workshops/:id" element={<WorkshopDetail />} />
                </Routes>
            </MemoryRouter>
        );
    }

    async function openRegistrationForm(detail = SAMPLE_DETAIL) {
        getWorkshopById.mockResolvedValueOnce(detail);

        renderWorkshopDetail(detail.id);

        userEvent.click(await screen.findByRole("button", { name: /register for this workshop/i }));

        await screen.findByLabelText(/first name/i);
    }

    async function fillAndSubmit({ firstName = "Mary", lastName = "Johnson", email = "mary@example.com" } = {}) {
        if (firstName) await userEvent.type(screen.getByLabelText(/first name/i), firstName);
        if (lastName) await userEvent.type(screen.getByLabelText(/last name/i), lastName);
        if (email) await userEvent.type(screen.getByLabelText(/email address/i), email);

        userEvent.click(screen.getByRole("button", { name: /submit registration/i }));
    }

    test("submits a successful sandbox registration and shows a confirmation", async () => {
        registerForWorkshop.mockResolvedValueOnce({
            registrationId: "WR-1001",
            status: "received",
            message: "This is a sandbox registration demonstration for Milestone 2.",
        });

        await openRegistrationForm();
        await fillAndSubmit();

        expect(await screen.findByText(/confirmation: wr-1001/i)).toBeInTheDocument();
        expect(registerForWorkshop).toHaveBeenCalledWith(
            SAMPLE_DETAIL.id,
            expect.objectContaining({ firstName: "Mary", lastName: "Johnson", email: "mary@example.com" })
        );
    });

    test("disables the submit button while the request is in flight to prevent duplicate submissions", async () => {
        let resolveRegistration;
        registerForWorkshop.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveRegistration = resolve;
            })
        );

        await openRegistrationForm();
        await fillAndSubmit();

        const submitButton = screen.getByRole("button", { name: /submitting/i });
        expect(submitButton).toBeDisabled();
        expect(registerForWorkshop).toHaveBeenCalledTimes(1);

        resolveRegistration({ registrationId: "WR-1002", status: "received", message: "ok" });
        expect(await screen.findByText(/confirmation: wr-1002/i)).toBeInTheDocument();
    });

    test("shows required-field errors and does not call the API", async () => {
        await openRegistrationForm();

        userEvent.click(screen.getByRole("button", { name: /submit registration/i }));

        expect(await screen.findByText(/please enter your first name/i)).toBeInTheDocument();
        expect(screen.getByText(/please enter your last name/i)).toBeInTheDocument();
        expect(registerForWorkshop).not.toHaveBeenCalled();
    });

    test("shows field validation errors returned by the sandbox API", async () => {
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

        await openRegistrationForm();
        await fillAndSubmit();

        expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    });

    test("shows a full-workshop message when the sandbox API reports WORKSHOP_FULL", async () => {
        registerForWorkshop.mockRejectedValueOnce({
            response: { data: { error: { code: "WORKSHOP_FULL", message: "This workshop is full." } } },
        });

        await openRegistrationForm();
        await fillAndSubmit();

        expect(await screen.findByText(/this workshop is full/i)).toBeInTheDocument();
    });

    test("shows a not-found message if the workshop disappears before registration completes", async () => {
        registerForWorkshop.mockRejectedValueOnce({
            response: { data: { error: { code: "NOT_FOUND", message: "The requested workshop does not exist." } } },
        });

        await openRegistrationForm();
        await fillAndSubmit();

        expect(await screen.findByRole("heading", { level: 1, name: "Workshop Not Found" })).toBeInTheDocument();
    });
});
