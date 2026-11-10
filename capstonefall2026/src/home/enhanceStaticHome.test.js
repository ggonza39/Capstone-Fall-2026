import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { enhanceStaticHome } from "./enhanceStaticHome";

let dispose;

function fixture() {
    document.body.innerHTML = `
        <a href="#main-content" style="top:-100px">Skip to main content</a>
        <header class="site-header">
            <button class="site-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-busy="false" aria-controls="mobile-navigation">
                <span class="site-menu-icon"><svg class="site-icon" aria-hidden="true"><path d="original-menu"></path></svg></span>Menu
            </button>
        </header>
        <main id="main-content" tabindex="-1">
            <a href="/resources">View Resources</a>
            <form method="get" action="/need-help">
                <div class="home-zip-outline">
                    <input id="home-zip-code" name="zip" aria-label="ZIP Code" aria-invalid="false" aria-describedby="home-zip-code-help" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" required>
                </div>
                <p id="home-zip-code-help">Example: 30301</p>
                <button type="submit">Find Workshops</button>
            </form>
        </main>`;
}

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });
    return { promise, resolve, reject };
}

function menuModule() {
    const controller = { setOpen: jest.fn(), dispose: jest.fn() };
    return { controller, createHomeMenu: jest.fn(() => controller) };
}

beforeEach(() => {
    fixture();
});

afterEach(() => {
    dispose?.();
    dispose = undefined;
    document.body.innerHTML = "";
});

test("keeps native links and a GET form while leaving the menu unloaded initially", () => {
    const loadMenu = jest.fn();
    dispose = enhanceStaticHome({ document, loadMenu });

    expect(screen.getByRole("link", { name: "View Resources" })).toHaveAttribute("href", "/resources");
    const form = screen.getByRole("textbox", { name: "ZIP Code" }).form;
    expect(form).toHaveAttribute("action", "/need-help");
    expect(form).toHaveAttribute("method", "get");
    expect(form.noValidate).toBe(true);
    expect(loadMenu).not.toHaveBeenCalled();
    dispose();
    expect(form.noValidate).toBe(false);
});

test("sanitizes ZIP input and preserves leading zeroes in the workshop navigation", () => {
    const navigate = jest.fn();
    dispose = enhanceStaticHome({ document, navigate });
    const input = screen.getByRole("textbox", { name: "ZIP Code" });

    fireEvent.input(input, { target: { value: "0a0123456" } });
    expect(input).toHaveValue("00123");
    fireEvent.submit(input.form);

    expect(navigate).toHaveBeenCalledWith("/need-help?zip=00123");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test.each(["", "1234"])("blocks an invalid ZIP (%s) with linked helper feedback that clears on edit", (value) => {
    const navigate = jest.fn();
    dispose = enhanceStaticHome({ document, navigate });
    const input = screen.getByRole("textbox", { name: "ZIP Code" });
    fireEvent.input(input, { target: { value } });
    fireEvent.submit(input.form);

    expect(navigate).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.closest(".home-zip-outline")).toHaveClass("home-zip-error");
    expect(screen.getByRole("alert")).toHaveAttribute("id", input.getAttribute("aria-describedby"));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid 5-digit ZIP code.");

    fireEvent.input(input, { target: { value: "30301" } });
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input.closest(".home-zip-outline")).not.toHaveClass("home-zip-error");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(document.getElementById("home-zip-code-help")).toHaveTextContent("Example: 30301");
});

test("loads the menu on request, shows pending status, and reuses its island on reopening", async () => {
    const pending = deferred();
    const loaded = menuModule();
    const loadMenu = jest.fn(() => pending.promise);
    dispose = enhanceStaticHome({ document, loadMenu });
    const button = screen.getByRole("button", { name: "Open navigation menu" });

    userEvent.click(button);
    expect(loadMenu).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("progressbar", { name: "Loading navigation menu" })).toBeInTheDocument();
    pending.resolve(loaded);
    await waitFor(() => expect(loaded.controller.setOpen).toHaveBeenCalledWith(true));
    expect(button).toHaveAttribute("aria-busy", "false");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    userEvent.click(button);
    expect(loaded.controller.setOpen).toHaveBeenLastCalledWith(false);
    userEvent.click(button);
    expect(loaded.controller.setOpen).toHaveBeenLastCalledWith(true);
    expect(loadMenu).toHaveBeenCalledTimes(1);
    expect(loaded.createHomeMenu).toHaveBeenCalledTimes(1);

    loaded.createHomeMenu.mock.calls[0][0].onClose();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
});

test.each(["another click", "Escape"])("cancels pending menu loading with %s and ignores its late success", async (cancellation) => {
    const pending = deferred();
    const loaded = menuModule();
    const loadMenu = jest.fn(() => pending.promise);
    dispose = enhanceStaticHome({ document, loadMenu });
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(button);

    if (cancellation === "another click") userEvent.click(button);
    else fireEvent.keyDown(document, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-busy", "false");
    expect(button).toHaveFocus();

    pending.resolve(loaded);
    await pending.promise;
    await Promise.resolve();
    expect(loaded.createHomeMenu).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-expanded", "false");

    userEvent.click(button);
    await waitFor(() => expect(loaded.controller.setOpen).toHaveBeenCalledWith(true));
    expect(loadMenu).toHaveBeenCalledTimes(1);
});

test("allows a failed menu download to be retried successfully", async () => {
    const loaded = menuModule();
    const loadMenu = jest.fn()
        .mockRejectedValueOnce(new Error("Network unavailable"))
        .mockResolvedValueOnce(loaded);
    dispose = enhanceStaticHome({ document, loadMenu });
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent("The navigation menu could not load. Please try again.");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-busy", "false");

    userEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(loaded.controller.setOpen).toHaveBeenCalledWith(true));
    expect(loadMenu).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("shares an in-flight download when the menu is canceled and reopened before it finishes", async () => {
    const pending = deferred();
    const loaded = menuModule();
    const loadMenu = jest.fn(() => pending.promise);
    dispose = enhanceStaticHome({ document, loadMenu });
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(button);
    userEvent.click(button);
    userEvent.click(button);
    pending.resolve(loaded);

    await waitFor(() => expect(loaded.controller.setOpen).toHaveBeenCalledWith(true));
    expect(loadMenu).toHaveBeenCalledTimes(1);
    expect(loaded.createHomeMenu).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-expanded", "true");

    dispose();
    dispose();
    expect(loaded.controller.dispose).toHaveBeenCalledTimes(1);
});

test.each(["Dismiss", "Escape"])("dismisses a menu error with %s and restores the trigger focus", async (dismissal) => {
    const loadMenu = jest.fn().mockRejectedValue(new Error("Network unavailable"));
    dispose = enhanceStaticHome({ document, loadMenu });
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(button);
    await screen.findByRole("alert");

    if (dismissal === "Dismiss") userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    else fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-expanded", "false");
});

test("ignores a canceled request's late failure and can start a new download", async () => {
    const pending = deferred();
    const loaded = menuModule();
    const loadMenu = jest.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(loaded);
    dispose = enhanceStaticHome({ document, loadMenu });
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(button);
    fireEvent.keyDown(document, { key: "Escape" });
    pending.reject(new Error("Late failure"));
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "false"));
    await Promise.resolve();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(loaded.controller.setOpen).toHaveBeenCalledWith(true));
    expect(loadMenu).toHaveBeenCalledTimes(2);
});

test("does not create a drawer after disposal while its download is pending", async () => {
    const pending = deferred();
    const loaded = menuModule();
    dispose = enhanceStaticHome({ document, loadMenu: () => pending.promise });
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    userEvent.click(button);
    dispose();
    pending.resolve(loaded);
    await pending.promise;
    await Promise.resolve();

    expect(loaded.createHomeMenu).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-busy", "false");
});

test("reveals the native skip link on focus and hides it after focus leaves", () => {
    dispose = enhanceStaticHome({ document });
    const skip = screen.getByRole("link", { name: "Skip to main content" });
    skip.focus();
    expect(skip.style.top).toBe("16px");
    screen.getByRole("textbox", { name: "ZIP Code" }).focus();
    expect(skip.style.top).toBe("-100px");
});
