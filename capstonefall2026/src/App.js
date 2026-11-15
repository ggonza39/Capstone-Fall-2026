import { lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";

// The homepage/shared shell use static CSS. Keep the MUI theme and its styling
// runtime alongside the secondary pages that need them, outside startup work.
function lazyThemedPage(loadPage) {
  return lazy(async () => {
    const [pageModule, themeModule] = await Promise.all([
      loadPage(),
      import("./theme/PageTheme"),
    ]);
    const Page = pageModule.default;
    const PageTheme = themeModule.default;
    return { default: function ThemedPage() { return <PageTheme><Page /></PageTheme>; } };
  });
}

// Keep the homepage eager; other journeys load only when their route is visited.
// In particular, loading Home must not initialize the donation page's Stripe SDK.
const NeedHelp = lazyThemedPage(() => import("./pages/NeedHelp"));
const WantToHelp = lazyThemedPage(() => import("./pages/WantToHelp"));
const Advocate = lazyThemedPage(() => import("./pages/Advocate"));
const Resources = lazyThemedPage(() => import("./pages/Resources"));
const About = lazyThemedPage(() => import("./pages/About"));
const Contact = lazyThemedPage(() => import("./pages/Contact"));
const WorkshopDetail = lazyThemedPage(() => import("./pages/WorkshopDetail"));
const Donate = lazyThemedPage(() => import("./pages/Donate"));
const NotFound = lazyThemedPage(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/need-help"
            element={<NeedHelp />}
          />

          <Route 
            path="/workshops/:id"
            element={<WorkshopDetail />}
          />

          <Route
            path="/want-to-help"
            element={<WantToHelp />}
          />

          <Route
            path="/advocate"
            element={<Advocate />}
          />

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/donate"
            element={<Donate />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route path="*" element={<NotFound />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
