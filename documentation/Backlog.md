# Product Backlog

The product backlog for the TSLS-Web project is managed using GitHub Projects.

- [Backlog URL](https://github.com/users/ggonza39/projects/2)

---

## Backlog Ordering Rationale

The product backlog is ordered based on a combination of sponsor-approved requirements, technical dependencies, implementation priorities, risk reduction, and design readiness.

Foundational requirements and design activities are prioritized first because they establish the approved scope and provide the structure needed before significant development can begin. This includes confirming the sponsor requirements baseline, defining the information architecture and user journeys, and creating the initial responsive and accessible wireframes.

The shared REST API contract is prioritized during the initial milestone because the TSLS-Web frontend must be able to work independently from the backend services being developed by Team #30. Establishing the API boundary early reduces integration risk and provides the team with a clear structure for the Mock API and sandbox environment.

The primary audience journeys are prioritized next because they represent the core functionality of the redesigned website. The "I Need Help" path must support workshop discovery, ZIP-code search, workshop information, and registration, while the "I Want to Help" path must provide separate Donate, Volunteer, and Advocate experiences.

Responsive design and accessibility are prioritized alongside the core website implementation because the sponsor identified responsive design as a primary implementation priority and the project is specifically focused on accessibility enhancement. These requirements affect the structure and implementation of the frontend and therefore should not be treated as optional enhancements.

Forms and integration work follows the primary user journeys because the website must preserve the sponsor's existing Gravity Forms/Salesforce and Stripe workflows while allowing the frontend to be independently tested through the agreed integration boundary and Mock API approach.

Performance, technical SEO, and the lightweight administration interface are placed later in the backlog. These are important project requirements, but they depend on the primary website structure and functionality being established first. This ordering allows the team to focus initially on the core user experience, accessibility, and integration foundations.

Because this is the first Product Backlog, the first milestone focuses primarily on requirements and design work due September 30, 2026. The remaining implementation work is ordered for the second milestone, the Interactive Sandbox Prototype.

---

## Original Backlog (Ordered) - 87 total pts (09/23/2026)

1. Establish sponsor requirements baseline and acceptance criteria – 3 pts
2. Define information architecture and user journeys – 5 pts
3. Create responsive, high-contrast wireframes – 8 pts
4. Formalize shared REST API contract with Team #30 – 8 pts
5. Establish GitHub project backlog and development workflow – 3 pts
6. Implement dual-path landing and navigation – 8 pts
7. Implement "I Need Help" workshop discovery and ZIP search – 5 pts
8. Implement workshop details and registration journey – 5 pts
9. Implement "I Want to Help" Donate/Volunteer/Advocate journeys – 8 pts
10. Implement responsive frontend layout and 150% zoom support – 8 pts
11. Implement WCAG accessibility remediation – 8 pts
12. Implement public forms, validation, and integration boundaries – 8 pts
13. Implement Mock API / sandbox integration – 5 pts
14. Implement performance and technical SEO optimization – 8 pts
15. Implement lightweight website administration interface – 5 pts

---

### **Estimation Approach**
Story points were assigned using relative estimation rather than time-based estimation. The team considered factors such as technical complexity, required effort, uncertainty, dependencies, integration risk, and testing requirements.

Each Product Backlog Item (PBI) was compared against the other items to determine whether it was smaller, similar in size, or larger in scope. Higher story points reflect greater implementation complexity, dependencies, or uncertainty, while lower story points represent work that is more narrowly scoped or better understood.

Estimation was performed sequentially from the top of the backlog to the bottom to maintain consistent relative comparison across the Product Backlog.

The first five PBIs are associated with Milestone 1 — Requirements & Design, which is due September 30, 2026. The remaining PBIs are associated with Milestone 2 — Interactive Sandbox Prototype.

---

- **Note:** Each Product Backlog Item (PBI) is listed by its summary title for scannability. The full User Stories, acceptance criteria, and other detailed technical requirements are documented within the description field of each individual item on the GitHub Project board.

- **Note:** User story numbers are identifiers used for referencing issues and tasks in GitHub. 
The order shown here reflects the current priority of the Product Backlog and does not correspond to the story numbering.

- **Note:** This is the team's initial Product Backlog. The backlog may be refined as requirements are clarified, API decisions are finalized with Team #30, sponsor feedback is received, and implementation details become better understood.

- **Note:** The current backlog is organized around the team's two-milestone baseline: Milestone 1 — Requirements & Design, due September 30, 2026, and Milestone 2 — Interactive Sandbox Prototype, due October 28, 2026.

---
