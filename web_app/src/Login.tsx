import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { useState, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";
import { useAuth } from "./authContext";
import { Unauthorized } from "./errors";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    function onSubmit(data: any): void {
        login(data.email, data.password)
            .then(() => {
                navigate("/");
            })
            .catch(err => {
                if (err instanceof Unauthorized) {
                    setError('Invalid credentials');
                }
                else {
                    setError('Something went wrong');
                }
            });
    }

    return (
        <Stack direction="row" justifyContent="center">
            <Stack spacing={3} width={{ xs: '100%', md: 700 }}>
                {error && <Alert severity="error">
                    {error}
                </Alert>}
                <Typography variant="h4">Sign in</Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        <TextField id="email" label="Email" variant="outlined" type="email" {...register("email", { required: "Email is required" })} error={!!errors.email}
                            helperText={errors.email?.message as string} autoComplete="email" />
                        <FormControl sx={{ m: 1 }} variant="outlined" error={!!errors.password}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                {...register("password", { required: "Password is required" })}
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
                            <FormHelperText id="password">{errors.password?.message as string}</FormHelperText>
                        </FormControl>
                        <Button variant="contained" size="large" type="submit">Sign in</Button>
                    </Stack>
                </form>
                <Link component={RouterLink} to='/register'>Don't have an account? Sign up here.</Link>
            </Stack>
        </Stack>
    )
}