import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";

import Header from "./Header";
import { loadMobileNavigation } from "./mobileNavigationLoader";

jest.mock("./mobileNavigationLoader", () => ({
    loadMobileNavigation: jest.fn(),
}));

// react-scripts resets mocks before each test; retain any eager import side effect.
const menuRequestsDuringImport = loadMobileNavigation.mock.calls.length;

function RouteControls() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>
            <button onClick={() => navigate("/resources")}>Navigate elsewhere</button>
            <p data-testid="current-route">{location.pathname}</p>
        </>
    );
}

function renderHeader() {
    return render(
        <MemoryRouter>
            <Header />
            <RouteControls />
        </MemoryRouter>
    );
}

function deferredModule() {
    let resolve;
    const promise = new Promise((resolvePromise) => { resolve = resolvePromise; });
    return { promise, resolve };
}

function LoadedMenu({ open, onClose }) {
    return open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation">
            <button onClick={onClose}>Close navigation menu</button>
        </nav>
    ) : null;
}

beforeEach(() => {
    loadMobileNavigation.mockReset();
});

test("keeps the menu code unloaded until the user asks to open it", () => {
    renderHeader();

    expect(menuRequestsDuringImport).toBe(0);
    expect(loadMobileNavigation).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "TechSmart Learning for Seniors home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
});

test("reports pending loading and reuses the loaded menu after closing", async () => {
    const pending = deferredModule();
    loadMobileNavigation.mockReturnValueOnce(pending.promise);
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });

    userEvent.click(menuButton);

    expect(menuButton).toHaveTextContent("Menu");
    expect(menuButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("progressbar", { name: "Loading navigation menu" })).toBeInTheDocument();

    await act(async () => {
        pending.resolve({ default: LoadedMenu });
        await pending.promise;
    });

    expect(await screen.findByRole("navigation", { name: "Mobile navigation" })).toHaveAttribute("id", "mobile-navigation");
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(menuButton).not.toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    userEvent.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("button", { name: "Close navigation menu" }));
    userEvent.click(menuButton);

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(loadMobileNavigation).toHaveBeenCalledTimes(1);
});

test.each(["another click", "Escape"])("cancels pending menu loading with %s and ignores its late completion", async (cancelWith) => {
    const pending = deferredModule();
    loadMobileNavigation.mockReturnValueOnce(pending.promise);
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-busy", "true");

    if (cancelWith === "Escape") {
        fireEvent.keyDown(menuButton, { key: "Escape" });
    } else {
        userEvent.click(menuButton);
    }

    await act(async () => {
        pending.resolve({ default: LoadedMenu });
        await pending.promise;
    });

    expect(menuButton).not.toHaveAttribute("aria-busy", "true");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
});

test("does not open a late-loading menu after the current route changes", async () => {
    const pending = deferredModule();
    loadMobileNavigation.mockReturnValueOnce(pending.promise);
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(menuButton);
    userEvent.click(screen.getByRole("button", { name: "Navigate elsewhere" }));

    await act(async () => {
        pending.resolve({ default: LoadedMenu });
        await pending.promise;
    });

    expect(screen.getByTestId("current-route")).toHaveTextContent("/resources");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).not.toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
});

test("offers retry after a failed chunk request", async () => {
    loadMobileNavigation
        .mockRejectedValueOnce(new Error("Chunk request failed"))
        .mockResolvedValueOnce({ default: LoadedMenu });
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });

    userEvent.click(menuButton);
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent(/menu/i);
    expect(within(error).getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
    expect(menuButton).not.toHaveAttribute("aria-busy", "true");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    userEvent.click(within(error).getByRole("button", { name: /retry/i }));

    expect(await screen.findByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(loadMobileNavigation).toHaveBeenCalledTimes(2);
});

test("the real loaded drawer supports Escape, focus return, and navigation", async () => {
    const MobileNavigation = require("./MobileNavigation").default;
    loadMobileNavigation.mockResolvedValueOnce({ default: MobileNavigation });
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(menuButton);

    const firstMenu = await screen.findByRole("navigation", { name: "Mobile navigation" });
    expect(within(firstMenu).getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
    const paper = firstMenu.closest(".MuiDrawer-paper");
    await waitFor(() => expect(paper.contains(document.activeElement)).toBe(true));
    fireEvent.keyDown(document.activeElement, { key: "Escape" });

    await waitForElementToBeRemoved(firstMenu);
    await waitFor(() => expect(menuButton).toHaveFocus());

    userEvent.click(menuButton);
    const secondMenu = await screen.findByRole("navigation", { name: "Mobile navigation" });
    userEvent.click(within(secondMenu).getByRole("link", { name: "Resources" }));

    await waitFor(() => expect(screen.getByTestId("current-route")).toHaveTextContent("/resources"));
    await waitForElementToBeRemoved(secondMenu);
    expect(loadMobileNavigation).toHaveBeenCalledTimes(1);
});
