import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import DevicesIcon from "@mui/icons-material/Devices";

function About() {
    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#F4F8FC",
                    py: { xs: 5, md: 7 },
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h1" component="h1" gutterBottom>
                        About TechSmart
                    </Typography>

                    <Typography variant="body1" sx={{ maxWidth: "65ch" }}>
                        Learn more about TechSmart Learning for Seniors and our work helping older adults build
                        confidence with technology.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Box component="section" aria-labelledby="mission-heading">
                    <Typography id="mission-heading" variant="h2" component="h2" gutterBottom>
                        Our Mission
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: "70ch",
                            mb: 6,
                        }}
                    >
                        Mission content will be added using sponsor-approved TechSmart content.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                height: "100%",
                            }}
                        >
                            <Stack spacing={2}>
                                <SchoolIcon color="primary" sx={{ fontSize: 48 }} aria-hidden="true" />

                                <Typography variant="h3" component="h3">
                                    Learn
                                </Typography>

                                <Typography>Accessible technology education designed for older adults.</Typography>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                height: "100%",
                            }}
                        >
                            <Stack spacing={2}>
                                <DevicesIcon color="primary" sx={{ fontSize: 48 }} aria-hidden="true" />

                                <Typography variant="h3" component="h3">
                                    Connect
                                </Typography>

                                <Typography>Build confidence using everyday technology and digital tools.</Typography>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                height: "100%",
                            }}
                        >
                            <Stack spacing={2}>
                                <GroupsIcon color="primary" sx={{ fontSize: 48 }} aria-hidden="true" />

                                <Typography variant="h3" component="h3">
                                    Community
                                </Typography>

                                <Typography>Connect older adults with learning opportunities and support.</Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default About;
