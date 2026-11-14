// Public demonstration credentials and a client-side flag are intentionally
// sandbox-only. This is not production authentication or authorization.
export const SANDBOX_SESSION_KEY = "tsls.sandbox.admin.session";
const SESSION_MARKER = "active";

export function hasSandboxAccess() {
    try {
        return window.sessionStorage.getItem(SANDBOX_SESSION_KEY) === SESSION_MARKER;
    } catch {
        return false;
    }
}

export function signInSandbox(username, password) {
    if (username !== "admin" || password !== "admin123") {
        return false;
    }

    try {
        // Store a demonstration session marker only, never the credentials.
        window.sessionStorage.setItem(SANDBOX_SESSION_KEY, SESSION_MARKER);
        if (!hasSandboxAccess()) {
            throw new Error("Session could not be read.");
        }
        return true;
    } catch {
        throw new Error("Sandbox login needs session storage. Enable it in your browser and try again.");
    }
}

export function signOutSandbox() {
    try {
        window.sessionStorage.removeItem(SANDBOX_SESSION_KEY);
    } catch {
        // The view also clears its in-memory access state. Unavailable storage
        // is denied by hasSandboxAccess rather than granting fallback access.
    }
}
