import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

import SkipLink from "../components/SkipLink";
import Header from "../components/Header";
import Footer from "../components/Footer";


function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        flexDirection: "column",
      }}
    >

      {/* <SkipLink /> Temporary button will revist later*/}


      <Header />


      <Box
        component="main"

        id="main-content"

        tabIndex={-1}

        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>

      <Footer />

    </Box>
  );
}

export default MainLayout;