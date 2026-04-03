import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router";
import { useAuth } from "./authContext";

export default function AppLayout() {
    const { loading } = useAuth();
    return (<>
        <Paper square elevation={1} sx={{ p: 2 }}>
            <Typography variant="h5" color="primary">DevFlow</Typography>
        </Paper>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <CircularProgress />
        </Box> :
            <Box padding={2}>
                <Outlet />
            </Box>
        }
    </>);
}