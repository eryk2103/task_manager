import { Alert, Box, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./auth/authContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import { Unauthorized } from "./errors";

export default function AppLayout() {
    const { loading, logout, user } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout().catch(err => {
            if (err instanceof Unauthorized) {
                setError('You are already logged out');
                navigate("/login");
            }
            else {
                setError('Something went wrong');
            }
        })
    }
    return (<>
        <Paper square elevation={1} sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" color="primary" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>DevFlow</Typography>
            {user &&
                <IconButton aria-label="delete" onClick={() => handleLogout()}>
                    <LogoutIcon />
                </IconButton>
            }
        </Paper>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <CircularProgress />
        </Box> :
            <Box padding={2}>
                {error && <Alert severity="error" onClose={() => { setError('') }} sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>}
                <Stack direction="row" justifyContent="center">
                    <Stack spacing={3} width={{ xs: '100%', md: 900 }}>
                        <Outlet />
                    </Stack>
                </Stack>
            </Box>
        }
    </>);
}