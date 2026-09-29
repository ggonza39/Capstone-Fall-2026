import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";


function Home() {
  const navigate = useNavigate()

  return (
    <>

      <Box
        component="section"
        sx={{
          backgroundColor: "#F4F8FC",

          py: {
            xs: 6,
            md: 10,
          },
        }}
      >
        <Container maxWidth="lg">

          <Stack
            spacing={3}
            alignItems="flex-start"
            sx={{
              maxWidth: 760,
            }}
          >

            <Typography
              variant="h1"
              component="h1"
            >
              Technology Made Simple.
            </Typography>


            <Typography
              variant="body1"
              sx={{
                fontSize: {
                  xs: "1.125rem",
                  md: "1.25rem",
                },

                maxWidth: "60ch",
              }}
            >
               TechSmart Learning for Seniors is a non-profit 
               organization committed to teaching older 
               adults the latest tools and technology to 
               help them lead active lives.
            </Typography>


            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >

              <Button
                variant="contained"
                size="large"
                startIcon={<HelpOutlineIcon />}
                onClick={() =>
                  navigate("/need-help")
                }
              >
                I Need Help
              </Button>


              <Button
                variant="outlined"
                size="large"
                startIcon={
                  <VolunteerActivismIcon />
                }
                onClick={() =>
                  navigate("/want-to-help")
                }
              >
                I Want to Help
              </Button>

            </Stack>

          </Stack>

        </Container>
      </Box>



    </>
  );
}

export default Home;