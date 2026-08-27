# Capstone-Fall-2026: Tech Smart Learning for Seniors – Website Modernization and Accessibility Enhancement

## Team Name
- Tech Smart Web Team

## Team Roster & Roles
- **Team Lead & Project Coordinator**
  - Gilberto Gonzalez (Project Management, Requirements Engineering & Sponsor Liaison)
- **UI/UX & Information Architecture Lead**
  - TBD (User Journeys, Personas, Wireframes & Usability Testing)
- **Web Accessibility Specialist & Front-End Developer**
  - TBD (WCAG Compliance, Responsive Design & Accessible Forms)
- **Lead Web Developer**
  - TBD (Core Architecture, Landing Pages & Website Admin System)
- **Integration Engineer & Backend API Specialist**
  - TBD (Shared API Contract, Mock API Endpoints & REST Integration)

## Project Overview
Tech Smart Learning for Seniors is a nonprofit organization focused on helping senior adults successfully use technology and connecting volunteers and supporters with opportunities to assist the senior community.

The primary goal of this capstone project is to design and develop a modern, accessible, and responsive website that clearly serves the organization's major audiences, improves the visitor experience, and provides a technical foundation for future growth. Rather than a simple visual redesign, this project follows an iterative, user-centered design process to restructure content and guide distinct user pathways:

- **People Seeking Help:** Primarily senior adults and others looking for technology assistance, services, or contact details.
- **People Wanting to Help:** Volunteers, donors, and community partners looking to support the organization's mission.
- **Website Administrator:** Authorized personnel responsible for updating site content without editing source code.

## Tools & Collaboration

The project uses the following tools to support design, development, accessibility testing, and project management:

- **Version Control & Project Management:** GitHub  
  GitHub is used to host the source code repository, manage the product backlog, track issues, and document project artifacts. GitHub Issues and Projects serve as the foundation for user stories, tasks, and milestone deliverables (Milestones 1–3), maintaining clear alignment across the team.

- **UI/UX & Information Architecture Design:** Figma & PlantUML  
  Figma and PlantUML are used to build user personas, design site navigation layouts, and map key visitor journeys for "I Need Help" and "I Want to Help" audience pathways prior to major implementation.

- **Frontend Development:** Next.js (React + TypeScript) / Modern Web Framework  
  A modern, responsive front-end stack prioritizing low operational cost, rapid accessibility implementation, accessible UI components, and straightforward REST API integration.

- **Backend & API Infrastructure:** REST API & Mock API Endpoints  
  The website communicates via RESTful API integration. Postman is used to collaborate with Team 30 on the shared API contract. A mocked backend endpoint layer ensures the website team can build, validate, and test form submission workflows independently of the backend delivery timeline.

- **Accessibility & Usability Testing:** WAVE, axe DevTools, Screen Readers (NVDA/VoiceOver)  
  Comprehensive accessibility tooling to enforce WCAG standards, keyboard navigation, proper semantic structure, readable typography, high color contrast, and alt-text implementations for older adult users.

- **CI/CD Pipeline & Hosting:** GitHub Actions & Vercel  
  Automated testing and continuous integration via GitHub Actions enforce code quality standards before merging to `main`. Continuous deployment is powered by Vercel for preview and production builds.

- **Team Communication:** Microsoft Teams  
  Used for weekly meetings, sponsor check-ins, asynchronous team coordination, and development updates.

## Repository Structure
- `/documentation` — Requirements engineering document, API contract specs, and future-development roadmap
- `/design` — Wireframes, user journeys, information architecture maps, and persona assets
- `/src` — Core website source code (frontend layouts, components, admin interface)
- `/mocks` — Mock API server scripts and dummy data response schemas
- `/tests` — Usability testing logs and web accessibility test suites
