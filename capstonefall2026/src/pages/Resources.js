import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ComputerIcon from "@mui/icons-material/Computer";
import SecurityIcon from "@mui/icons-material/Security";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

//*** Mock data for resources until we have real data from the sponsor ***
const resources = [
    {
        id: 1,
        title: "Smartphone Help",
        description: "Learn the basics of using smartphones, apps, settings, and common features.",
        icon: <SmartphoneIcon />,
    },
    {
        id: 2,
        title: "Computer Help",
        description: "Find simple guidance for using computers, the internet, email, and other tools.",
        icon: <ComputerIcon />,
    },
    {
        id: 3,
        title: "Online Safety",
        description: "Learn how to recognize scams, protect your information, and stay safer online.",
        icon: <SecurityIcon />,
    },
    {
        id: 4,
        title: "Video Tutorials",
        description: "Watch technology lessons and demonstrations at your own pace.",
        icon: <VideoLibraryIcon />,
    },
];

function Resources() {
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
                        Technology Resources
                    </Typography>

                    <Typography variant="body1" sx={{ maxWidth: "65ch" }}>
                        Explore simple guides and learning resources designed to help you use technology with
                        confidence.
                    </Typography>
                </Container>
            </Box>

            <Box component="section" aria-labelledby="resource-heading" sx={{ py: { xs: 6, md: 8 } }}>
                <Container maxWidth="lg">
                    <Typography id="resource-heading" variant="h2" component="h2" gutterBottom>
                        What Would You Like to Learn?
                    </Typography>

                    <Grid container spacing={3}>
                        {resources.map((resource) => (
                            <Grid key={resource.id} size={{ xs: 12, sm: 6 }}>
                                <Card variant="outlined" sx={{ height: "100%" }}>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                color: "primary.main",
                                                mb: 2,

                                                "& svg": {
                                                    fontSize: 48,
                                                },
                                            }}
                                            aria-hidden="true"
                                        >
                                            {resource.icon}
                                        </Box>

                                        <Typography variant="h3" component="h3" gutterBottom>
                                            {resource.title}
                                        </Typography>

                                        <Typography variant="body1" sx={{ mb: 3 }}>
                                            {resource.description}
                                        </Typography>

                                        <Button variant="outlined">View {resource.title}</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default Resources;
