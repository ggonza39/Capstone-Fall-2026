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

import tablet480 from "../assets/optimized/senior-tablet-learning-480.webp";
import tablet800 from "../assets/optimized/senior-tablet-learning-800.webp";
import tablet1200 from "../assets/optimized/senior-tablet-learning-1200.webp";
import laptop480 from "../assets/optimized/senior-laptop-learning-480.webp";
import laptop800 from "../assets/optimized/senior-laptop-learning-800.webp";
import laptop1200 from "../assets/optimized/senior-laptop-learning-1200.webp";
import mobile480 from "../assets/optimized/senior-mobile-learning-480.webp";
import mobile800 from "../assets/optimized/senior-mobile-learning-800.webp";
import mobile1200 from "../assets/optimized/senior-mobile-learning-1200.webp";
import group480 from "../assets/optimized/senior-group-learning-480.webp";
import group800 from "../assets/optimized/senior-group-learning-800.webp";
import group1200 from "../assets/optimized/senior-group-learning-1200.webp";

// Account for the source pixels cropped by objectFit: cover as well as slot width.
// The tablet source is 16:9; the other photos are approximately 3:2.
const photoSizes = "(min-width: 900px) 368px, (min-width: 600px) max(345px, calc(50vw - 32px)), max(330px, calc(100vw - 32px))";
const tabletSizes = "(min-width: 900px) 436px, (min-width: 600px) max(409px, calc(50vw - 32px)), max(392px, calc(100vw - 32px))";

const impactPhotos = [
  {
    id: 1,
    src: tablet800,
    srcSet: `${tablet480} 480w, ${tablet800} 800w, ${tablet1200} 1200w`,
    sizes: tabletSizes,
    height: 675,
    alt: "Older adult receiving guidance while learning to use a tablet.",
  },
  {
    id: 2,
    src: laptop800,
    srcSet: `${laptop480} 480w, ${laptop800} 800w, ${laptop1200} 1200w`,
    height: 800,
    alt: "Two older adults practicing computer skills together.",
  },
  {
    id: 3,
    src: mobile800,
    srcSet: `${mobile480} 480w, ${mobile800} 800w, ${mobile1200} 1200w`,
    height: 800,
    alt: "Volunteer helping an older adult use a smartphone.",
  },
  {
    id: 4,
    src: group800,
    srcSet: `${group480} 480w, ${group800} 800w, ${group1200} 1200w`,
    height: 800,
    alt: "Older adults participating in a technology learning session.",
  },
];

function ImpactSection() {
  return (
    <Box
      component="section"
      id="community-impact"
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
                      srcSet={photo.srcSet}
                      sizes={photo.sizes || photoSizes}
                      alt={photo.alt}
                      width={1200}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
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
