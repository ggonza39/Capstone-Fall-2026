import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { SANDBOX_SESSION_KEY } from "./sandboxAccess";

beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState({}, "", "/admin");
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

async function openLogin(path = "/admin") {
    window.history.replaceState({}, "", path);
    const view = render(<App />);
    await screen.findByRole("heading", { name: "Admin login", level: 1 }, { timeout: 5000 });
    return view;
}

function submitCredentials(username = "admin", password = "admin123") {
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: username } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
    userEvent.click(screen.getByRole("button", { name: "Log in" }));
}

test.each(["/admin", "/admin/workshops", "/admin/private/nested"])(
    "direct unauthenticated access to %s opens the separate login view",
    async (path) => {
        await openLogin(path);
        expect(window.location.pathname).toBe("/admin/login");
        expect(screen.queryByRole("heading", { name: "Workshop Listing" })).not.toBeInTheDocument();
        expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
        expect(screen.queryByRole("navigation", { name: "Footer navigation" })).not.toBeInTheDocument();
        expect(screen.getByText(/not production authentication or role-based access control/)).toBeInTheDocument();
        expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,nofollow");
        expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    }
);

test("empty credentials show a visible accessible error", async () => {
    await openLogin();
    userEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your username and password.");
    expect(window.location.pathname).toBe("/admin/login");
});

test.each([
    ["admin", "wrong-password"],
    ["visitor", "admin123"],
    ["Admin", "admin123"],
])("credentials %s / %s do not grant access", async (username, password) => {
    await openLogin();
    submitCredentials(username, password);
    expect(screen.getByRole("alert")).toHaveTextContent("Incorrect username or password.");
    expect(window.location.pathname).toBe("/admin/login");
    expect(window.sessionStorage.getItem(SANDBOX_SESSION_KEY)).toBeNull();
    expect(screen.queryByRole("heading", { name: "Administration", level: 1 })).not.toBeInTheDocument();
});

test("the demo account opens all four placeholders without the public layout", async () => {
    await openLogin();
    submitCredentials();
    expect(await screen.findByRole("heading", { name: "Administration", level: 1 })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/admin");
    ["Workshop Listing", "Create a Workshop", "Edit a Workshop", "Selected Informational Content"].forEach((name) => {
        expect(screen.getByRole("heading", { name, level: 2 })).toBeInTheDocument();
        expect(screen.getByRole("region", { name })).toHaveTextContent("Placeholder");
    });
    expect(screen.getAllByText("Placeholder")).toHaveLength(4);
    expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Public website" })).toHaveAttribute("href", "/");
    expect(window.sessionStorage.getItem(SANDBOX_SESSION_KEY)).toBe("active");
    expect(JSON.stringify(window.sessionStorage)).not.toContain("admin123");
    expect(document.title).toBe("Administration | TechSmart Sandbox");
});

test("the same tab retains access after a page remount", async () => {
    const view = await openLogin();
    submitCredentials();
    await screen.findByRole("heading", { name: "Administration", level: 1 });
    view.unmount();
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Administration", level: 1 })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/admin");
});

test("logout clears the demo session and direct access is restricted again", async () => {
    const view = await openLogin();
    submitCredentials();
    await screen.findByRole("heading", { name: "Administration", level: 1 });
    userEvent.click(screen.getByRole("button", { name: "Log out" }));
    await screen.findByRole("heading", { name: "Admin login", level: 1 });
    expect(window.sessionStorage.getItem(SANDBOX_SESSION_KEY)).toBeNull();
    expect(window.location.pathname).toBe("/admin/login");
    view.unmount();
    await openLogin("/admin");
    expect(window.location.pathname).toBe("/admin/login");
    expect(screen.queryByRole("heading", { name: "Workshop Listing" })).not.toBeInTheDocument();
});

test("a stale or unrecognized session marker does not grant access", async () => {
    window.sessionStorage.setItem(SANDBOX_SESSION_KEY, "true");
    await openLogin();
    expect(window.location.pathname).toBe("/admin/login");
});

test("unavailable session storage denies access and reports the login issue", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Storage blocked"); });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage blocked"); });
    await openLogin();
    submitCredentials();
    expect(screen.getByRole("alert")).toHaveTextContent("Sandbox login needs session storage.");
    expect(window.location.pathname).toBe("/admin/login");
    expect(screen.queryByRole("heading", { name: "Administration", level: 1 })).not.toBeInTheDocument();
});

test("an active session visiting the login URL returns to the dashboard", async () => {
    window.sessionStorage.setItem(SANDBOX_SESSION_KEY, "active");
    window.history.replaceState({}, "", "/admin/login");
    render(<App />);
    await screen.findByRole("heading", { name: "Administration", level: 1 });
    await waitFor(() => expect(window.location.pathname).toBe("/admin"));
});
