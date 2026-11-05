import { lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Keep the homepage eager; other journeys load only when their route is visited.
// In particular, loading Home must not initialize the donation page's Stripe SDK.
const NeedHelp = lazy(() => import("./pages/NeedHelp"));
const WantToHelp = lazy(() => import("./pages/WantToHelp"));
const Resources = lazy(() => import("./pages/Resources"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const WorkshopDetail = lazy(() => import("./pages/WorkshopDetail"));
const Donate = lazy(() => import("./pages/Donate"));

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
