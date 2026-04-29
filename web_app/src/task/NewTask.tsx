import { Alert, Box, Breadcrumbs, Button, FormControl, InputLabel, Link, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import useApiFetch from "../useApiFetch";

const types = ["Feature", "Bug", "Refactor", "Improve", "Other"];
const statuses = ["IDEA", "TODO", "IN_PROGRESS", "DONE"];
const priorities = ["LOW", "MID", "HIGH", "CRITICAL"];

export default function NewTask() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { id } = useParams();
    const { apiFetch } = useApiFetch();

    const onSubmit = async (data: any) => {
        try {
            const res = await apiFetch('/tasks', {
                method: 'post',
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
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                {...register("type", { required: "Type is required" })}
                                defaultValue={types[0].toUpperCase()}
                                label="Type"
                            >
                                {types.map(type => <MenuItem value={type.toUpperCase()}>{type}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status"
                                {...register("status", { required: "Status is required" })}
                                defaultValue={statuses[1]}
                                label="Status"
                            >
                                {statuses.map(status => <MenuItem value={status}>{status}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="priority-label">Priority</InputLabel>
                            <Select
                                labelId="priority-label"
                                id="priroity"
                                {...register("priority", { required: "Priority is required" })}
                                defaultValue={priorities[1]}
                                label="Priority"
                            >
                                {priorities.map(priority => <MenuItem value={priority}>{priority}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Box>
                        <Button variant="contained" type="submit" size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>Submit</Button>
                    </Box>
                </Stack>
            </form>
        </Stack>
    );
}