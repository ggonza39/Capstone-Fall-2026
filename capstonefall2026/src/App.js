import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import NeedHelp from "./pages/NeedHelp";
import WantToHelp from "./pages/WantToHelp";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";


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
            path="/want-to-help"
            element={<WantToHelp />}
          />

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;