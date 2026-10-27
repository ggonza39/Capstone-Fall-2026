import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import waymoLogo from "../assets/waymoLogo.jfif";
import insightGlobalLogo from "../assets/insightGlobalLogo.jfif";
import cumberlandLogo from "../assets/cumberlandLogo.jfif";
import hillerLogo from "../assets/hillerLogo.jfif";
import deltaCommunityLogo from "../assets/deltaCommunityLogo.jfif";

const partners = [
  {
    id: 1,
    name: "Waymo",
    logo: waymoLogo,
    tier: "$5,000 and Above",
  },
  {
    id: 2,
    name: "Insight Global",
    logo: insightGlobalLogo,
    tier: "$5,000 and Above",
  },
  {
    id: 3,
    name: "Cumberland Group",
    logo: cumberlandLogo,
    tier: "$5,000 and Above",
  },
  {
    id: 4,
    name: "Hiller",
    logo: hillerLogo,
    tier: "$5,000 and Above",
  },
  {
    id: 5,
    name: "Delta Community Credit Union",
    logo: deltaCommunityLogo,
    tier: "$2,500 and Above",
  },
];

function PartnersSection() {
  return (
    <Box
      component="section"
      aria-labelledby="partners-heading"
      sx={{
        backgroundColor: "#FFFFFF",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          id="partners-heading"
          variant="h2"
          component="h2"
          gutterBottom
        >
          Our Community Partners &amp; Supporters
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "75ch",
            mb: 2,
          }}
        >
          TechSmart Learning for Seniors is grateful
          for the organizations and individuals who
          support technology education for older adults.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "75ch",
            mb: 5,
          }}
        >
          Through financial contributions, volunteer
          time, and community resources, our supporters
          help older adults build digital skills,
          confidence, and meaningful connections.
        </Typography>

        <Grid container spacing={2.5}>
          {partners.map((partner) => (
            <Grid
              key={partner.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  p: 2.5,
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  component="img"
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    maxWidth: 210,
                    height: 95,
                    objectFit: "contain",
                    display: "block",
                  }}
                />

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {partner.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {partner.tier}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack
          spacing={2}
          alignItems="flex-start"
          sx={{ mt: 5 }}
        >
        </Stack>
      </Container>
    </Box>
  );
}

export default PartnersSection;
