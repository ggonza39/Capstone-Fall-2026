import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

import Home from "./Home";

function SearchDestination() {
    const location = useLocation();
    return <p>Workshop search: {location.pathname}{location.search}</p>;
}

function renderHome() {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/need-help" element={<SearchDestination />} />
            </Routes>
        </MemoryRouter>
    );

    const input = screen.getByRole("textbox", { name: "ZIP Code" });
    const submit = within(input.closest("form")).getByRole("button", { name: "Find Workshops" });
    return { input, submit };
}

test("renders the hero immediately and gives the ZIP field an accessible description", () => {
    const { input } = renderHome();

    expect(screen.getByRole("heading", { level: 1, name: "Technology Made Simple." })).toBeInTheDocument();
    [
        ["I Need Technology Help", "/need-help"],
        ["I Want to Help", "/want-to-help"],
        ["Find Workshops", "/need-help"],
        ["View Resources", "/resources"],
        ["Get Help", "/need-help"],
        ["Donate", "/want-to-help#donate"],
        ["Volunteer", "/want-to-help#volunteer"],
        ["Advocate", "/want-to-help#advocate"],
    ].forEach(([name, href]) => {
        expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    });
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("maxlength", "5");
    expect(input).toHaveAttribute("aria-describedby", "home-zip-code-help");
    expect(document.getElementById(input.getAttribute("aria-describedby"))).toHaveTextContent("Example: 30301");
});

test("sanitizes pasted ZIP input and limits the controlled value to five digits", () => {
    const { input } = renderHome();

    fireEvent.change(input, { target: { value: "a30b30199" } });

    expect(input).toHaveValue("30301");
});

test("rejects an incomplete ZIP and clears its linked error when corrected", async () => {
    const { input, submit } = renderHome();

    await userEvent.type(input, "30");
    userEvent.click(submit);

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(document.getElementById(input.getAttribute("aria-describedby"))).toHaveTextContent("Enter a valid 5-digit ZIP code.");
    expect(screen.queryByText(/Workshop search:/)).not.toBeInTheDocument();

    await userEvent.type(input, "301");

    expect(input).toHaveValue("30301");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(document.getElementById(input.getAttribute("aria-describedby"))).toHaveTextContent("Example: 30301");
});

test("submits a five-digit ZIP to the help route without losing leading zeroes", async () => {
    const { input, submit } = renderHome();

    await userEvent.type(input, "00501");
    userEvent.click(submit);

    expect(await screen.findByText("Workshop search: /need-help?zip=00501")).toBeInTheDocument();
});
