import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import waymo210 from "../assets/optimized/waymoLogo-210.webp";
import waymo420 from "../assets/optimized/waymoLogo-420.webp";
import insight210 from "../assets/optimized/insightGlobalLogo-210.webp";
import insight420 from "../assets/optimized/insightGlobalLogo-420.webp";
import cumberland210 from "../assets/optimized/cumberlandLogo-210.webp";
import cumberland420 from "../assets/optimized/cumberlandLogo-420.webp";
import hiller210 from "../assets/optimized/hillerLogo-210.webp";
import hiller420 from "../assets/optimized/hillerLogo-420.webp";
import delta210 from "../assets/optimized/deltaCommunityLogo-210.webp";
import delta420 from "../assets/optimized/deltaCommunityLogo-420.webp";

const partners = [
  {
    id: 1,
    name: "Waymo",
    logo: waymo420,
    srcSet: `${waymo210} 210w, ${waymo420} 420w`,
    tier: "$5,000 and Above",
  },
  {
    id: 2,
    name: "Insight Global",
    logo: insight420,
    srcSet: `${insight210} 210w, ${insight420} 420w`,
    tier: "$5,000 and Above",
  },
  {
    id: 3,
    name: "Cumberland Group",
    logo: cumberland420,
    srcSet: `${cumberland210} 210w, ${cumberland420} 420w`,
    tier: "$5,000 and Above",
  },
  {
    id: 4,
    name: "Hiller",
    logo: hiller420,
    srcSet: `${hiller210} 210w, ${hiller420} 420w`,
    tier: "$5,000 and Above",
  },
  {
    id: 5,
    name: "Delta Community Credit Union",
    logo: delta420,
    srcSet: `${delta210} 210w, ${delta420} 420w`,
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
                  srcSet={partner.srcSet}
                  sizes="210px"
                  alt={`${partner.name} logo`}
                  width={210}
                  height={95}
                  loading="lazy"
                  decoding="async"
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
