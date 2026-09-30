import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CampaignIcon from "@mui/icons-material/Campaign";

/**
 * PBI-9 Implement "I Want to Help" Donate/Volunteer/Advocate journeys
 * 
 * Engagement Landing Hub: Build the “I Want to Help” landing experience with three clearly
 * identified pathways—Donate, Volunteer, and Advocate—each providing a distinct purpose, 
 * clear call to action, and direct route to its applicable destination without unnecessary 
 * intermediate navigation.
 * 
 */
function WantToHelp() {
    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#F4F8FC",

                    py: {
                        xs: 5,
                        md: 7,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h1" component="h1" gutterBottom>
                        I Want to Help
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: "65ch",
                        }}
                    >
                        Your support helps TechSmart provide technology education and resources for older adults.
                    </Typography>
                </Container>
            </Box>

            {/* Help Options */}

            <Box
                component="section"
                aria-labelledby="help-options-heading"
                sx={{
                    py: {
                        xs: 6,
                        md: 8,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Typography id="help-options-heading" variant="h2" component="h2" textAlign="center" gutterBottom>
                        How Would You Like to Help?
                    </Typography>

                    <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{
                            maxWidth: 700,
                            mb: 5,
                        }}
                    >
                        Donate, volunteer your time, or learn how you can advocate for technology education.
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Donate */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Card
                                id="donate"
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <FavoriteIcon
                                        color="primary"
                                        aria-hidden="true"
                                        sx={{
                                            fontSize: 52,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h3" component="h3" gutterBottom>
                                        Donate
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 6,
                                        }}
                                    >
                                        Support technology education and learning opportunities for older adults.
                                    </Typography>

                                    {/* Sponsor wants users to use the organization's existing Stripe payment workflow. */}
                                    <Button variant="contained">Donate</Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Volunteer */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Card
                                id="volunteer"
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <VolunteerActivismIcon
                                        color="primary"
                                        aria-hidden="true"
                                        sx={{
                                            fontSize: 52,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h3" component="h3" gutterBottom>
                                        Volunteer
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 3,
                                        }}
                                    >
                                        Share your time and skills by helping older adults become more confident with
                                        technology.
                                    </Typography>

                                    {/* Sponsor wants users to be directed to Hands on Atlanta */}
                                    <Button variant="contained">Volunteer</Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Advocate */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Card
                                id="advocate"
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <CampaignIcon
                                        color="primary"
                                        aria-hidden="true"
                                        sx={{
                                            fontSize: 52,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h3" component="h3" gutterBottom>
                                        Advocate
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 3,
                                        }}
                                    >
                                        Learn about TechSmart's community impact and help spread awareness about
                                        technology education for older adults.
                                    </Typography>

                                    {/* Sponsor wants explain the organization's community impact 
                                        and provide an engagement path when sponsor-approved content 
                                        becomes available */}
                                    <Button variant="contained">Learn About Our Impact</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default WantToHelp;
