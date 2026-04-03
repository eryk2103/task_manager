import { Box, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router";

export default function AppLayout() {
    return (<>
        <Paper square elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" color="primary">DevFlow</Typography>
        </Paper>
        <Box padding={2}>
            <Outlet />
        </Box>
    </>);
}