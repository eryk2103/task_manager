import { Alert, Box, Breadcrumbs, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate, useParams } from "react-router";

export default function NewTask() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { id } = useParams();

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/tasks', {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify({ ...data, projectId: Number(id) })
            });
            if (res.ok) {
                navigate('/project/' + id);
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
                <Link underline="hover" color="inherit" component={RouterLink} to={`/project/${id}`}>
                    Tasks
                </Link>
                <Typography sx={{ color: 'text.primary' }}>New task</Typography>
            </Breadcrumbs>
            <Typography variant="h4">New task</Typography>
            {error && <Alert severity="error">
                {error}
            </Alert>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={3}>
                    <TextField id="name" label="Name" variant="outlined" {...register("name", { required: "Name is required" })} error={!!errors.name}
                        helperText={errors.name?.message as string} />
                    <Box>
                        <Button variant="contained" type="submit" size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>Submit</Button>
                    </Box>
                </Stack>
            </form>
        </Stack>
    );
}