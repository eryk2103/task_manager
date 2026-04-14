import { Alert, Breadcrumbs, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";

export default function Newproject() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/projects', {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify({ ...data })
            });
            if (res.ok) {
                navigate('/');
            }
            else {
                setError('Something went wrong')
            }
        }
        catch (err) {
            setError('Something went wrong')
        }

    }

    return (
        <Stack spacing={3}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" component={RouterLink} to="/">
                    Projects
                </Link>
                <Typography sx={{ color: 'text.primary' }}>New project</Typography>
            </Breadcrumbs>
            <Typography variant="h4">New project</Typography>
            {error && <Alert severity="error">
                {error}
            </Alert>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={3}>
                    <TextField id="name" label="Name" variant="outlined" {...register("name", { required: "Name is required" })} error={!!errors.name}
                        helperText={errors.name?.message as string} />
                    <TextField id="description" label="Description" variant="outlined" multiline rows={4} {...register("description", { required: "Description is required" })} error={!!errors.description}
                        helperText={errors.description?.message as string} />
                    <Button variant="contained" type="submit" fullWidth size="large">Submit</Button>
                </Stack>
            </form>
        </Stack>
    );
}