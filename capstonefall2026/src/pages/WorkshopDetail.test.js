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
}));

let originalHead;

beforeEach(() => {
    originalHead = document.head.innerHTML;
    document.head.innerHTML = "";
});

afterEach(() => {
    document.head.innerHTML = originalHead;
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
