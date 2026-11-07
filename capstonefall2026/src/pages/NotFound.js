import { Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NotFound() {
    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Typography component="h1" variant="h2" gutterBottom>
                Page Not Found
            </Typography>
            <Typography sx={{ mb: 3 }}>
                We could not find this page. Visit the home page or find technology help to continue.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button component={RouterLink} to="/" variant="contained">Go to Home</Button>
                <Button component={RouterLink} to="/need-help" variant="outlined">Find Technology Help</Button>
            </Stack>
        </Container>
    );
}

export default NotFound;
