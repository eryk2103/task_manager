import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { useState, type SubmitEvent, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router";

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
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

    function onSubmit(data: any): void {
        console.log(data);
    }

    return (
        <Stack spacing={3}>
            <Typography variant="h4">Sign up</Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={3}>
                    <TextField id="email" label="Email" variant="outlined" type="email" {...register("email", { required: "Email is required" })} error={!!errors.email} helperText={errors.email?.message as string} />
                    <FormControl sx={{ m: 1 }} variant="outlined" error={!!errors.password}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register("password", { required: "Passsword is required" })}
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
                    <FormControl sx={{ m: 1 }} variant="outlined" error={!!errors.password2}>
                        <InputLabel htmlFor="password2">Confirm password</InputLabel>
                        <OutlinedInput
                            id="password2"
                            type={showPassword2 ? 'text' : 'password'}
                            {...register("password2", { required: "Confirm password is required" })}
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
                        <FormHelperText id="password2">{errors.password2?.message as string}</FormHelperText>
                    </FormControl>
                    <Button variant="contained" size="large" type="submit">Sign up</Button>
                </Stack>
            </form>
            <Link component={RouterLink} to='/login'>Already have an account? Sign in here.</Link>
        </Stack>
    )
}