import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { useState, type SubmitEvent, type MouseEvent } from "react";
import { Link as RouterLink } from "react-router";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

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
            <Typography variant="h4">Sign up</Typography>
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
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <InputLabel htmlFor="password2">Confirm password</InputLabel>
                        <OutlinedInput
                            id="password2"
                            type={showPassword2 ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword2 ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword2}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm password"
                        />
                    </FormControl>
                    <Button variant="contained" size="large">Sign up</Button>
                </Stack>
            </form>
            <Link component={RouterLink} to='/login'>Already have an account? Sign in here.</Link>
        </Stack>
    )
}