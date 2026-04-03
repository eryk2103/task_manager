import { Breadcrumbs, Button, ButtonGroup, Divider, FormControl, InputLabel, Link, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup, Typography, type SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router";

const data = { id: 1, name: "Set up development environment", status: "TODO", projectId: 1, description: "Build a responsive login page with validation and API integration. Handle errors, loading states, and ensure consistency with the design system." }
const statuses = ["IDEA", "TODO", "IN_PROGRESS", "DONE"];

export default function TaskDetail() {
    const [task, setTask] = useState(data);

    const handleStatusChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
        setTask({ ...task, status: newValue });
    };

    return (
        <Stack spacing={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" component={RouterLink} to="/">
                    Projects
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to={`/project/${task.projectId}`}
                >
                    Tasks
                </Link>
                <Typography sx={{ color: 'text.primary' }}>Task overview</Typography>
            </Breadcrumbs>
            <Typography variant="h4">{task.name}</Typography>
            <Stack spacing={2} direction="row">
                <Button variant="outlined" color="primary">Edit</Button>
                <Button variant="outlined" color="error">Delete</Button>
            </Stack>
            <Divider />
            <Typography variant="h5">Status</Typography>
            <ToggleButtonGroup value={task.status} exclusive onChange={handleStatusChange} color="primary">
                {statuses.map((status) => (
                    <ToggleButton key={status} value={status}>
                        {status}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Divider />
            <Typography variant="h5">Description</Typography>
            <Typography variant="body1">{task.description}</Typography>
        </Stack>
    )
}