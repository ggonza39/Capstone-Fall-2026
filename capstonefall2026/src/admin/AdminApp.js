import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import RouteMetadata from "../seo/RouteMetadata";
import ScrollToTop from "../components/ScrollToTop";
import { hasSandboxAccess, signInSandbox, signOutSandbox } from "./sandboxAccess";
import "./Admin.css";

const sections = [
    {
        id: "workshop-listing",
        title: "Workshop Listing",
        description: "A place to review and manage the workshop list.",
        detail: "Workshop records and listing controls will appear here in a future implementation.",
    },
    {
        id: "create-workshop",
        title: "Create a Workshop",
        description: "A place to add a new workshop.",
        detail: "The workshop creation form will appear here in a future implementation.",
    },
    {
        id: "edit-workshop",
        title: "Edit a Workshop",
        description: "A place to update an existing workshop.",
        detail: "Workshop selection and editing controls will appear here in a future implementation.",
    },
    {
        id: "informational-content",
        title: "Selected Informational Content",
        description: "A place to maintain selected information on the public website.",
        detail: "Content selection and editing controls will appear here in a future implementation.",
    },
];

function SandboxNotice() {
    return (
        <div className="admin-sandbox-notice">
            <strong>Sandbox/testing demonstration only.</strong>{" "}
            This client-side access gate is not production authentication or role-based access control.
        </div>
    );
}

function AdminLogin({ onSignIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = (event) => {
        event.preventDefault();
        setError("");
        if (!username || !password) {
            setError("Enter your username and password.");
            return;
        }
        try {
            if (!signInSandbox(username, password)) {
                setError("Incorrect username or password. Please try again.");
                return;
            }
            onSignIn();
        } catch (loginError) {
            setError(loginError.message);
        }
    };

    return (
        <main className="admin-login-main" id="main-content" tabIndex={-1}>
            <div className="admin-login-intro">
                <p className="admin-eyebrow">TSLS-Web administration</p>
                <h1>Admin login</h1>
                <p>Sign in to explore the administration sandbox.</p>
            </div>
            <div className="admin-login-card">
                <form onSubmit={submit} noValidate aria-label="Sandbox admin login">
                    <label htmlFor="admin-username">Username</label>
                    <input
                        id="admin-username"
                        name="username"
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        required
                        value={username}
                        onChange={(event) => { setUsername(event.target.value); setError(""); }}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? "admin-login-error" : undefined}
                    />
                    <label htmlFor="admin-password">Password</label>
                    <input
                        id="admin-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => { setPassword(event.target.value); setError(""); }}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? "admin-login-error" : undefined}
                    />
                    {error && <p className="admin-login-error" id="admin-login-error" role="alert">{error}</p>}
                    <button className="admin-button admin-button-primary" type="submit">Log in</button>
                </form>
                <SandboxNotice />
            </div>
            <a className="admin-return-link" href="/">Return to the public website</a>
        </main>
    );
}

function AdminDashboard() {
    return (
        <div className="admin-workspace">
            <aside className="admin-sidebar">
                <p className="admin-eyebrow">Workspace</p>
                <nav aria-label="Administration sections">
                    {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
                </nav>
                <p className="admin-sidebar-note">Demonstration workspace<br />Signed in as <strong>admin</strong></p>
            </aside>
            <main className="admin-dashboard-main" id="main-content" tabIndex={-1}>
                <div className="admin-page-heading">
                    <p className="admin-eyebrow">TSLS-Web sandbox</p>
                    <h1>Administration</h1>
                    <p>Welcome, admin. Explore the planned workshop and content management areas below.</p>
                </div>
                <SandboxNotice />
                <div className="admin-section-grid">
                    {sections.map((section, index) => (
                        <section className="admin-section-card" key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                            <div className="admin-card-topline">
                                <span className="admin-section-number" aria-hidden="true">0{index + 1}</span>
                                <span className="admin-placeholder-badge">Placeholder</span>
                            </div>
                            <h2 id={`${section.id}-title`}>{section.title}</h2>
                            <p>{section.description}</p>
                            <p className="admin-placeholder-detail">{section.detail}</p>
                        </section>
                    ))}
                </div>
                <p className="admin-workspace-note">These sections are placeholders.</p>
            </main>
        </div>
    );
}

export default function AdminApp() {
    const [signedIn, setSignedIn] = useState(hasSandboxAccess);
    const navigate = useNavigate();
    const authenticated = signedIn && hasSandboxAccess();

    const logOut = () => {
        signOutSandbox();
        setSignedIn(false);
        navigate("/admin/login", { replace: true });
    };

    return (
        <div className="sandbox-admin">
            <RouteMetadata />
            <ScrollToTop />
            <a className="admin-skip-link" href="#main-content">Skip to administration content</a>
            <header className="admin-topbar">
                <div className="admin-brand"><span className="admin-brand-mark" aria-hidden="true">TS</span><span>TechSmart <strong>Administration</strong></span></div>
                <div className="admin-topbar-actions">
                    <span className="admin-environment">Sandbox</span>
                    <a href="/">Public website</a>
                    {authenticated && <button className="admin-button admin-button-logout" type="button" onClick={logOut}>Log out</button>}
                </div>
            </header>
            <Routes>
                <Route path="login" element={authenticated ? <Navigate to="/admin" replace /> : <AdminLogin onSignIn={() => { setSignedIn(true); navigate("/admin", { replace: true }); }} />} />
                <Route index element={authenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="*" element={<Navigate to={authenticated ? "/admin" : "/admin/login"} replace />} />
            </Routes>
        </div>
    );
}
