import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

function renderNavigation(initialEntry = "/") {
    return render(
        <StrictMode>
            <MemoryRouter initialEntries={[initialEntry]}>
                <ScrollToTop />
                <nav>
                    <Link to="/resources">Resources</Link>
                    <Link to="/resources?topic=email#guides">Resource section</Link>
                    <Link to="/">Home</Link>
                </nav>
                <main id="main-content" tabIndex={-1}>Page content</main>
            </MemoryRouter>
        </StrictMode>
    );
}

beforeEach(() => {
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
    window.scrollTo.mockRestore();
});

test("preserves existing browser focus and scroll on the initial document load", () => {
    const existingControl = document.createElement("button");
    document.body.appendChild(existingControl);
    existingControl.focus();

    try {
        renderNavigation();

        expect(existingControl).toHaveFocus();
        expect(screen.getByRole("main")).not.toHaveFocus();
        expect(window.scrollTo).not.toHaveBeenCalled();
    } finally {
        existingControl.remove();
    }
});

test("focuses the main content and resets scroll after each client-side page navigation", () => {
    renderNavigation();
    const main = screen.getByRole("main");
    const focusMain = jest.spyOn(main, "focus");

    userEvent.click(screen.getByRole("link", { name: "Resources" }));

    expect(main).toHaveFocus();
    expect(focusMain).toHaveBeenLastCalledWith({ preventScroll: true });
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(main).toHaveFocus();
    expect(focusMain).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    focusMain.mockRestore();
});

test("leaves focus and scroll unchanged for query and hash navigation within a page", () => {
    renderNavigation("/resources");
    const sectionLink = screen.getByRole("link", { name: "Resource section" });

    userEvent.click(sectionLink);

    expect(sectionLink).toHaveFocus();
    expect(screen.getByRole("main")).not.toHaveFocus();
    expect(window.scrollTo).not.toHaveBeenCalled();
});
