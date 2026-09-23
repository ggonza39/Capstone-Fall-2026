# Product Backlog

The product backlog for the TSLS-Web project is managed using GitHub Projects.

- [Backlog URL](https://github.com/users/ggonza39/projects/2)

---

## Backlog Ordering Rationale

The product backlog is ordered based on a combination of sponsor-approved requirements, technical dependencies, implementation priorities, risk reduction, and design readiness.

Foundational requirements and design activities are prioritized first in Milestone 1 (due September 30, 2026) because they establish the approved scope and provide the structure needed before significant development can begin. This includes confirming the sponsor requirements baseline, defining the information architecture and user journeys, creating initial responsive wireframes, establishing development and CI/CD workflows, and defining the frontend integration boundary and Mock API schema.

The primary audience journeys are prioritized next in Milestone 2 — Interactive Sandbox Prototype (due October 28, 2026) because they represent the core functionality of the redesigned website. The "I Need Help" path must support workshop discovery, ZIP-code search, workshop information, and registration, while the "I Want to Help" path must provide separate Donate, Volunteer, and Advocate experiences. Responsive design, WCAG accessibility remediation, and local Mock API endpoint integrations are prioritized alongside these core user journeys to ensure a fully functional, testable web prototype.

Final production readiness, platform integrations, performance optimization, and administrative capabilities are addressed in Milestone 3 — Production Release & Handover (due December 4, 2026). Preserving external integration workflows (Gravity Forms/Salesforce and Stripe) and finalizing technical SEO, performance audits, and lightweight administration tools depend on established frontend structures and validated prototype user feedback.

---

## Original Backlog (Ordered) - 87 total pts (09/23/2026)

1. Establish sponsor requirements baseline and acceptance criteria – 3 pts
2. Define information architecture and user journeys – 5 pts
3. Create responsive, high-contrast wireframes – 8 pts
4. Define frontend integration boundary and Mock API contract – 8 pts
5. Establish GitHub project backlog and development workflow – 3 pts
6. Implement dual-path landing and navigation – 8 pts
7. Implement "I Need Help" workshop discovery and ZIP search – 5 pts
8. Implement workshop details and registration journey – 5 pts
9. Implement "I Want to Help" Donate/Volunteer/Advocate journeys – 8 pts
10. Implement responsive frontend layout and 150% zoom support – 8 pts
11. Implement WCAG accessibility remediation – 8 pts
12. Implement Mock API / sandbox integration – 5 pts
13. Implement public forms, validation, and integration boundaries – 8 pts
14. Implement performance and technical SEO optimization – 8 pts
15. Implement lightweight website administration interface – 5 pts

---

### **Estimation Approach**
Story points were assigned using relative estimation rather than time-based estimation. The team considered factors such as technical complexity, required effort, uncertainty, dependencies, integration risk, and testing requirements.

Each Product Backlog Item (PBI) was compared against the other items to determine whether it was smaller, similar in size, or larger in scope. Higher story points reflect greater implementation complexity, dependencies, or uncertainty, while lower story points represent work that is more narrowly scoped or better understood.

Estimation was performed sequentially from the top of the backlog to the bottom to maintain consistent relative comparison across the Product Backlog.

The items are distributed across three strategic project milestones:
- **Milestone 1 — Requirements & Design (Due September 30, 2026):** PBIs 1–5 (27 pts total) focus on establishing baseline requirements, user journey maps, wireframes, frontend integration boundaries/Mock API contracts, and dev infrastructure.
- **Milestone 2 — Interactive Sandbox Prototype (Due October 28, 2026):** PBIs 6–12 (39 pts total) focus on core dual-path navigation, workshop discovery, primary audience journeys, responsive layouts, accessibility remediation, and mock API integration.
- **Milestone 3 — Production Release & Handover (Due December 4, 2026):** PBIs 13–15 (21 pts total) focus on live external form/CRM/payment integration boundaries, performance & SEO optimizations, and administrative management features.

---

- **Note:** Each Product Backlog Item (PBI) is listed by its summary title for scannability. The full User Stories, acceptance criteria, and other detailed technical requirements are documented within the description field of each individual item on the GitHub Project board.

- **Note:** User story numbers are identifiers used for referencing issues and tasks in GitHub. 
The order shown here reflects the current priority of the Product Backlog and does not correspond to the story numbering.

- **Note:** This is the team's initial Product Backlog. The backlog may be refined as requirements are clarified, sponsor feedback is received, and implementation details become better understood.

- **Note:** The current backlog is organized around the team's three-milestone baseline: Milestone 1 — Requirements & Design (due September 30, 2026), Milestone 2 — Interactive Sandbox Prototype (due October 28, 2026), and Milestone 3 — Production Release & Handover (due December 4, 2026).

---
