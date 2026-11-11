const closeIcon = '<svg class="site-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
const loadingIcon = '<span role="progressbar" aria-label="Loading navigation menu" class="site-menu-progress"><svg viewBox="22 22 44 44" aria-hidden="true" focusable="false"><circle cx="44" cy="44" r="20.2" fill="none" stroke="currentColor" stroke-width="3.6"></circle></svg></span>';

// The server-rendered homepage already contains its content, links and native
// form. Enhance its two interactions without loading React or the router.
export function enhanceStaticHome({
    document: pageDocument = document,
    loadMenu = () => import("./homeMenu"),
    navigate = (url) => pageDocument.defaultView.location.assign(url),
} = {}) {
    const removers = [];
    const listen = (element, eventName, listener) => {
        if (!element) return;
        element.addEventListener(eventName, listener);
        removers.push(() => element.removeEventListener(eventName, listener));
    };

    const zipInput = pageDocument.getElementById("home-zip-code");
    const zipHelper = pageDocument.getElementById("home-zip-code-help");
    const zipOutline = zipInput?.closest(".home-zip-outline");
    const zipForm = zipInput?.closest("form");
    const originalNoValidate = zipForm?.noValidate;
    const zipHint = zipHelper?.textContent || "Example: 30301";

    const setZipError = (invalid) => {
        zipInput?.setAttribute("aria-invalid", String(invalid));
        zipOutline?.classList.toggle("home-zip-error", invalid);
        if (zipHelper) {
            zipHelper.textContent = invalid ? "Enter a valid 5-digit ZIP code." : zipHint;
            if (invalid) zipHelper.setAttribute("role", "alert");
            else zipHelper.removeAttribute("role");
        }
    };

    if (zipForm) {
        // Native required/pattern validation remains available without JS. Once
        // enhanced, the existing visible helper supplies the validation message.
        const sanitizeZip = () => {
            zipInput.value = zipInput.value.replace(/\D/g, "").slice(0, 5);
            if (zipInput.getAttribute("aria-invalid") === "true") setZipError(false);
        };
        listen(zipInput, "input", sanitizeZip);
        listen(zipInput, "change", sanitizeZip);
        listen(zipForm, "submit", (event) => {
            event.preventDefault();
            if (!/^\d{5}$/.test(zipInput.value)) {
                setZipError(true);
                return;
            }
            setZipError(false);
            navigate(`/need-help?zip=${zipInput.value}`);
        });
        zipForm.noValidate = true;
    }

    const skipLink = pageDocument.querySelector('a[href="#main-content"]');
    listen(skipLink, "focus", () => {
        skipLink.style.top = "16px";
        skipLink.style.outline = "none";
    });
    listen(skipLink, "blur", () => { skipLink.style.top = "-100px"; });

    const menuButton = pageDocument.querySelector(".site-menu-button");
    const menuIcon = menuButton?.querySelector(".site-menu-icon");
    const originalIcon = menuIcon?.innerHTML;
    let disposed = false;
    let menuOpen = false;
    let menuLoading = false;
    let menuError = "";
    let requestId = 0;
    let menuModule;
    let menuPromise;
    let menuController;
    let errorPanel;

    const renderMenuButton = () => {
        if (!menuButton) return;
        menuButton.setAttribute("aria-label", menuLoading ? "Loading navigation menu" : menuOpen ? "Close navigation menu" : "Open navigation menu");
        menuButton.setAttribute("aria-busy", String(menuLoading));
        menuButton.setAttribute("aria-expanded", String(menuOpen));
        if (menuIcon) menuIcon.innerHTML = menuLoading ? loadingIcon : menuOpen ? closeIcon : originalIcon;
    };

    const removeError = () => {
        errorPanel?.remove();
        errorPanel = undefined;
    };

    const closeMenu = (restoreFocus = false) => {
        requestId += 1;
        menuOpen = false;
        menuLoading = false;
        menuError = "";
        menuController?.setOpen(false);
        removeError();
        renderMenuButton();
        if (restoreFocus) menuButton?.focus();
    };

    const getMenuModule = () => {
        if (menuModule) return Promise.resolve(menuModule);
        if (!menuPromise) {
            menuPromise = Promise.resolve(loadMenu()).then((loadedModule) => {
                menuModule = loadedModule;
                return loadedModule;
            }, (error) => {
                menuPromise = undefined;
                throw error;
            });
        }
        return menuPromise;
    };

    const openMenu = async () => {
        const currentRequest = ++requestId;
        menuButton?.focus();
        menuError = "";
        removeError();
        menuOpen = true;

        if (menuController) {
            menuController.setOpen(true);
            renderMenuButton();
            return;
        }

        menuLoading = true;
        renderMenuButton();
        try {
            const loadedModule = await getMenuModule();
            if (disposed || currentRequest !== requestId || !menuOpen) return;
            menuController = loadedModule.createHomeMenu({
                document: pageDocument,
                onClose: () => closeMenu(true),
            });
            menuController.setOpen(true);
            menuLoading = false;
            renderMenuButton();
        } catch {
            if (disposed || currentRequest !== requestId || !menuOpen) return;
            menuLoading = false;
            menuOpen = false;
            menuError = "The navigation menu could not load. Please try again.";
            renderMenuButton();
            errorPanel = pageDocument.createElement("div");
            errorPanel.className = "site-menu-error";
            errorPanel.setAttribute("role", "alert");
            const message = pageDocument.createElement("p");
            message.textContent = menuError;
            errorPanel.appendChild(message);
            const retry = pageDocument.createElement("button");
            retry.type = "button";
            retry.className = "site-shell-button site-menu-recovery";
            retry.textContent = "Retry";
            retry.addEventListener("click", openMenu);
            errorPanel.appendChild(retry);
            const dismiss = pageDocument.createElement("button");
            dismiss.type = "button";
            dismiss.className = "site-shell-button site-menu-recovery";
            dismiss.textContent = "Dismiss";
            dismiss.addEventListener("click", () => closeMenu(true));
            errorPanel.appendChild(dismiss);
            menuButton?.closest("header")?.appendChild(errorPanel);
        }
    };

    listen(menuButton, "click", () => {
        if (menuOpen) closeMenu();
        else openMenu();
    });
    listen(pageDocument, "keydown", (event) => {
        if (event.key === "Escape" && (menuLoading || menuError)) {
            event.preventDefault();
            closeMenu(true);
        }
    });

    return function dispose() {
        if (disposed) return;
        disposed = true;
        requestId += 1;
        removers.forEach((remove) => remove());
        removeError();
        menuController?.dispose();
        menuOpen = false;
        menuLoading = false;
        renderMenuButton();
        if (zipForm) zipForm.noValidate = originalNoValidate;
    };
}

export default enhanceStaticHome;
