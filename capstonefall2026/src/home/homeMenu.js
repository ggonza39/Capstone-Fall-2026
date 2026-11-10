import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MobileNavigation from "../components/MobileNavigation";
import navigation from "../components/navigation";

// Loaded only after a menu request. Keep the existing themed drawer, keyboard
// behavior and focus trap without hydrating the otherwise static homepage.
export function createHomeMenu({ onClose, document: pageDocument = document }) {
    const container = pageDocument.createElement("div");
    container.setAttribute("data-home-menu", "");
    pageDocument.body.appendChild(container);
    const root = createRoot(container);
    let disposed = false;

    return {
        setOpen(open) {
            if (disposed) return;
            root.render(
                <BrowserRouter window={pageDocument.defaultView}>
                    <MobileNavigation
                        open={open}
                        onClose={onClose}
                        navigation={navigation}
                        pathname={pageDocument.defaultView.location.pathname}
                        reloadDocument
                    />
                </BrowserRouter>
            );
        },
        dispose() {
            if (disposed) return;
            disposed = true;
            root.unmount();
            container.remove();
        },
    };
}
