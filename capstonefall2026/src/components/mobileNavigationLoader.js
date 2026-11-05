let navigationPromise;

// Fetch the drawer only when someone opens the mobile menu. A failed download
// can be retried; successful downloads are shared across later openings.
export function loadMobileNavigation() {
    if (!navigationPromise) {
        navigationPromise = import("./MobileNavigation").catch((error) => {
            navigationPromise = undefined;
            throw error;
        });
    }

    return navigationPromise;
}
