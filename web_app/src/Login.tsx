import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { useState, type SubmitEvent, type MouseEvent } from "react";
import { Link as RouterLink } from "react-router";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
        event.preventDefault();
        console.log('sign in')
    }

    return (
        <Stack spacing={3}>
            <Typography variant="h4">Sign in</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField id="email" label="Email" variant="outlined" type="email" />
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <Button variant="contained" size="large">Sign in</Button>
                </Stack>
            </form>
            <Link component={RouterLink} to='/register'>Don't have an account? Sign up here.</Link>
        </Stack>
    )
}