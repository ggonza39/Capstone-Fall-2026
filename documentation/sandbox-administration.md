# Sandbox administration

Use **Admin** in the desktop header or mobile menu to open `/admin`. This area has its own administration header, navigation, login, and dashboard, separate from the public TSLS-Web layout.

## Demo access

- Username: `admin`
- Password: `admin123`

Visitors without an active sandbox session are redirected to `/admin/login`, including visitors who enter an administration URL directly. Successful login opens `/admin`. The dashboard contains four clearly labeled placeholder sections:

- Workshop Listing
- Create a Workshop
- Edit a Workshop
- Selected Informational Content

The sections do not create, edit, or delete content, display live records, or call administrative APIs. They demonstrate the planned administration areas only.

## Sandbox access mechanism and limits

This client-side mechanism is for **sandbox/testing purposes only**. It is **not production authentication or role-based access control**. Both the login screen and dashboard display this limitation.

The demonstration credentials are hardcoded and visible in the client source. The browser checks them and stores only an `active` marker under `tsls.sandbox.admin.session` in `sessionStorage`; it never stores the password. This flag is editable through browser tools, so the gate is bypassable. It does not protect APIs, sensitive data, or actual administrative operations.

Access persists through refreshes in the same tab. **Log out** clears the marker and returns to the login screen. If session storage is unavailable, access is denied. Browser tab duplication or a tab opened by another page may copy session storage; it is not an identity boundary. Production resources require server-enforced authentication and authorization before any real administrative functionality is added.

Administration routes use `noindex,nofollow` metadata and are omitted from the public sitemap. These indexing settings are not security controls.

## Implementation

- `capstonefall2026/src/admin/AdminApp.js`: separate layout, login, guarded routes, logout, and placeholders.
- `capstonefall2026/src/admin/sandboxAccess.js`: demonstration credential check and session marker.
- `capstonefall2026/src/admin/Admin.css`: responsive administration styles.
- `capstonefall2026/src/App.js`: loads administration separately from the public page layout.
- `capstonefall2026/src/components/navigation.js`: shared desktop, mobile, and rendered-homepage Admin link.

## Manual verification

1. Log out, then open `/admin` and `/admin/workshops` directly. Confirm both lead to `/admin/login` without displaying the dashboard.
2. Submit empty or incorrect credentials. Confirm an accessible error appears and access is denied.
3. Log in with `admin` / `admin123`. Confirm `/admin` opens with all four placeholder sections and the sandbox notice.
4. Refresh the dashboard. Confirm the current tab retains access.
5. Log out, then use browser Back or visit `/admin` again. Confirm the dashboard remains restricted.
6. Check the Admin link in desktop navigation and the mobile menu, including the production homepage.
7. Check keyboard navigation, narrow-screen layout, and the link back to the public website.

## Automated verification

`capstonefall2026/src/admin/AdminAccess.test.js` covers guarded URLs, invalid credentials, the successful demo login, placeholder content, session refresh, logout, and unavailable storage. The shared header and SEO tests also verify the new navigation link and administration metadata.

From `capstonefall2026`, run the focused tests and build:

```powershell
npm test -- --watchAll=false --runInBand --testTimeout=15000 --runTestsByPath src/admin/AdminAccess.test.js src/components/Header.test.js src/seo/metadata.test.js src/App.test.js
npm run build
```

For browser verification, serve the production build using `capstonefall2026/serve.json` so secondary routes load `app.html`. Set `PUPPETEER_CORE_PATH` to an existing `puppeteer-core` installation and optionally `CHROME_PATH` to your Chrome executable. From the repository root, run:

```powershell
node tests/administration/check-sandbox-admin.cjs http://127.0.0.1:4174/
```

The browser check covers the rendered homepage links, desktop/mobile navigation, login/logout, refresh, direct-route restrictions, four screen widths, and browser errors. It runs separately from Lighthouse and does not establish new performance scores.
