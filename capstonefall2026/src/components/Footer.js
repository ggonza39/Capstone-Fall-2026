import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";


function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",

        mt: "auto",

        py: 4,
      }}
    >
      <Container maxWidth="lg">

        <Stack
          spacing={2}
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
        >

          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
            }}
          >
            TechSmart Learning for Seniors
          </Typography>


          <Stack
            component="nav"
            aria-label="Footer navigation"

            direction={{
              xs: "column",
              sm: "row",
            }}

            spacing={{
              xs: 1,
              sm: 3,
            }}
          >
            <Link
              component={RouterLink}
              to="/need-help"
              color="inherit"
            >
              I Need Help
            </Link>

            <Link
              component={RouterLink}
              to="/want-to-help"
              color="inherit"
            >
              I Want to Help
            </Link>

            <Link
              component={RouterLink}
              to="/resources"
              color="inherit"
            >
              Resources
            </Link>

            <Link
              component={RouterLink}
              to="/contact"
              color="inherit"
            >
              Contact
            </Link>
          </Stack>


          <Typography variant="body2">
            © {currentYear} TechSmart Learning for Seniors
          </Typography>

        </Stack>

      </Container>
    </Box>
  );
}

export default Footer;