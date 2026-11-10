import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Home.css";

// Reuse the existing Material artwork without runtime styling for static icons.
// Decorative icons do not supply the accessible name of a control.
const iconPaths = {
    help: ["M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"],
    volunteer: ["M1 11h4v11H1zm15-7.75C16.65 2.49 17.66 2 18.7 2 20.55 2 22 3.45 22 5.3c0 2.27-2.91 4.9-6 7.7-3.09-2.81-6-5.44-6-7.7C10 3.45 11.45 2 13.3 2c1.04 0 2.05.49 2.7 1.25M20 17h-7l-2.09-.73.33-.94L13 16h2.82c.65 0 1.18-.53 1.18-1.18 0-.49-.31-.93-.77-1.11L8.97 11H7v9.02L14 22l8.01-3c-.01-1.1-.9-2-2.01-2"],
    school: ["M5 13.18v4L12 21l7-3.82v-4L12 17zM12 3 1 9l11 6 9-4.91V17h2V9z"],
    book: [
        "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1m0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5z",
        "M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99M13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83m4.5 1.84c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24",
    ],
    location: ["M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5"],
};

function HomeIcon({ name, className = "" }) {
    return (
        <svg className={`home-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {iconPaths[name].map((path, index) => <path key={index} d={path} />)}
        </svg>
    );
}

function Home() {
    const navigate = useNavigate();
    const [zipCode, setZipCode] = useState("");
    const [zipError, setZipError] = useState(false);

    const handleWorkshopSearch = (event) => {
        event.preventDefault();
        if (!/^\d{5}$/.test(zipCode)) {
            setZipError(true);
            return;
        }
        setZipError(false);
        navigate(`/need-help?zip=${zipCode}`);
    };

    return (
        <>
            <section className="home-section home-hero">
                <div className="home-container">
                    <div className="home-hero-content">
                        <h1>Technology Made Simple.</h1>
                        <p className="home-hero-description">
                            TechSmart Learning for Seniors is a non-profit organization committed to teaching older
                            adults the latest tools and technology to help them lead active lives.
                        </p>
                        <div className="home-hero-actions">
                            <RouterLink className="home-button" to="/need-help">
                                <span className="home-button-icon"><HomeIcon name="help" /></span>
                                I Need Technology Help
                            </RouterLink>
                            <RouterLink className="home-button home-button-outlined" to="/want-to-help">
                                <span className="home-button-icon"><HomeIcon name="volunteer" /></span>
                                I Want to Help
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section" aria-labelledby="help-heading">
                <div className="home-container">
                    <h2 id="help-heading">How Can We Help?</h2>
                    <div className="home-cards">
                        <div className="home-card">
                            <div className="home-card-content">
                                <HomeIcon name="school" className="home-card-icon" />
                                <h3>Find a Workshop</h3>
                                <p>Find technology workshops and learning opportunities near you.</p>
                                <RouterLink className="home-button" to="/need-help">Find Workshops</RouterLink>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-content">
                                <HomeIcon name="book" className="home-card-icon" />
                                <h3>Technology Resources</h3>
                                <p>Explore simple technology guides and educational resources.</p>
                                <RouterLink className="home-button" to="/resources">View Resources</RouterLink>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-content">
                                <HomeIcon name="help" className="home-card-icon" />
                                <h3>Get Technology Help</h3>
                                <p>Find support when you need help using everyday technology.</p>
                                <RouterLink className="home-button" to="/need-help">Get Help</RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section home-workshop-search" aria-labelledby="workshop-heading">
                <div className="home-container home-container-md">
                    <h2 id="workshop-heading">Find a Workshop Near You</h2>
                    <p className="home-search-description">Enter your ZIP code to find technology workshops in your area.</p>
                    <form onSubmit={handleWorkshopSearch} noValidate>
                        <div className="home-search-fields">
                            <div className="home-zip-control">
                                <div className={`home-zip-outline${zipError ? " home-zip-error" : ""}`}>
                                    <input
                                        className="home-zip-input"
                                        id="home-zip-code"
                                        type="text"
                                        aria-label="ZIP Code"
                                        aria-describedby="home-zip-code-help"
                                        aria-invalid={zipError}
                                        placeholder="ZIP Code"
                                        value={zipCode}
                                        inputMode="numeric"
                                        maxLength={5}
                                        onChange={(event) => {
                                            const value = event.target.value.replace(/\D/g, "");
                                            setZipCode(value.slice(0, 5));
                                            if (zipError) setZipError(false);
                                        }}
                                    />
                                </div>
                                <p className="home-zip-helper" id="home-zip-code-help" role={zipError ? "alert" : undefined}>
                                    {zipError ? "Enter a valid 5-digit ZIP code." : "Example: 30301"}
                                </p>
                            </div>
                            <button className="home-button home-search-button" type="submit">
                                <span className="home-button-icon"><HomeIcon name="location" /></span>
                                Find Workshops
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="home-section" aria-labelledby="give-heading">
                <div className="home-container">
                    <h2 id="give-heading">Want to Make a Difference?</h2>
                    <p className="home-give-description">Help TechSmart support older adults as they learn to use technology.</p>
                    <div className="home-give-actions">
                        <RouterLink className="home-button" to="/want-to-help#donate">Donate</RouterLink>
                        <RouterLink className="home-button home-button-outlined" to="/want-to-help#volunteer">Volunteer</RouterLink>
                        <RouterLink className="home-button home-button-outlined" to="/want-to-help#advocate">Advocate</RouterLink>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
