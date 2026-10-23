import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import DevicesIcon from "@mui/icons-material/Devices";
import FavoriteIcon from "@mui/icons-material/Favorite";

import tabletLearning from "../assets/senior-tablet-learning.jfif";
import laptopLearning from "../assets/senior-laptop-learning.jfif";
import smartphoneHelp from "../assets/senior-mobile-learning.jfif";
import groupWorkshop from "../assets/senior-group-learning.jfif";

const impactPhotos = [
  {
    id: 1,
    src: tabletLearning,
    alt: "Older adult receiving guidance while learning to use a tablet.",
  },
  {
    id: 2,
    src: laptopLearning,
    alt: "Two older adults practicing computer skills together.",
  },
  {
    id: 3,
    src: smartphoneHelp,
    alt: "Volunteer helping an older adult use a smartphone.",
  },
  {
    id: 4,
    src: groupWorkshop,
    alt: "Older adults participating in a technology learning session.",
  },
];

function ImpactSection() {
  return (
    <Box
      component="section"
      aria-labelledby="impact-heading"
      sx={{
        backgroundColor: "#FFFFFF",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
        >
          {/* LEFT SIDE: IMPACT CONTENT */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              id="impact-heading"
              variant="h2"
              component="h2"
              gutterBottom
            >
              Making an Impact Together
            </Typography>

            
            <Typography variant="body1" sx={{ mb: 2 }}>
            Since 2012, TechSmart Learning for Seniors has
            educated more than 7,000 older adults across
            metro Atlanta.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
            Through technology education, volunteers, donations,
            and community partnerships, TechSmart helps older
            adults build digital skills, gain confidence, and
            stay connected.
            </Typography>



            <Stack spacing={2}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <GroupsIcon
                    aria-hidden="true"
                    sx={{
                      color: "primary.main",
                      fontSize: 40,
                    }}
                  />

                  <Box>
                    <Typography
                      variant="h3"
                      component="p"
                      sx={{
                        color: "primary.main",
                      }}
                    >
                      7,000+
                    </Typography>

                    <Typography variant="body2">
                      Older adults educated since 2012
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <DevicesIcon
                    aria-hidden="true"
                    sx={{
                      color: "primary.main",
                      fontSize: 40,
                    }}
                  />

                  <Box>
                    <Typography
                      variant="h3"
                      component="p"
                      sx={{
                        color: "primary.main",
                      }}
                    >
                      Technology Education
                    </Typography>

                    <Typography variant="body2">
                      Helping older adults learn everyday
                      digital skills.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <FavoriteIcon
                    aria-hidden="true"
                    sx={{
                      color: "primary.main",
                      fontSize: 40,
                    }}
                  />

                  <Box>
                    <Typography
                      variant="h3"
                      component="p"
                      sx={{
                        color: "primary.main",
                      }}
                    >
                      Stronger Communities
                    </Typography>

                    <Typography variant="body2">
                      Supporting confidence, independence,
                      and connection through technology.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT SIDE: COMMUNITY PHOTOS */}
          <Grid
                size={{ xs: 12, md: 7 }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
                >
            <Box
              component="figure"
              sx={{ m: 0 }}
            >
              <Grid container spacing={2}>
                {impactPhotos.map((photo) => (
                  <Grid
                    key={photo.id}
                    size={{ xs: 12, sm: 6 }}
                  >
                    <Box
                      component="img"
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: {
                        xs: 220,
                        sm: 230,
                        md: 245,
                        },
                        objectFit: "cover",
                        borderRadius: 2,
                        display: "block",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography
                component="figcaption"
                variant="body2"
                sx={{
                    mt: 2,
                    color: "text.secondary",
                }}
                >
                AI-generated illustrations of senior technology learning.
                </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ImpactSection;