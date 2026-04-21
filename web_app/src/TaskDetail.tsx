import { Box, Breadcrumbs, Button, Chip, Dialog, DialogActions, DialogTitle, Divider, Link, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { type Task } from "./models";
import CheckIcon from '@mui/icons-material/Check';

const statuses = ["IDEA", "TODO", "IN_PROGRESS", "DONE"];

export default function TaskDetail() {
    const [task, setTask] = useState<Task>({ id: 0, name: '', projectId: 0, status: "", type: "", priority: "" });
    const [statusSuccess, setStatusSuccess] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/tasks/' + id, {
            method: 'get',
            credentials: "include"
        }).then(res => {
            return res.json();
        }).then(data => {
            setTask(data);
        })
    }, []);

    const handleStatusChange = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
        fetch(import.meta.env.VITE_API_URL + '/tasks/' + id, {
            method: 'put',
            credentials: "include",
            body: JSON.stringify({ ...task, status: newValue })
        }).then(res => {
            return res.json();
        }).then(data => {
            setTask(data);
            setStatusSuccess(true);
        })
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const deleteTask = () => {
        fetch(import.meta.env.VITE_API_URL + '/tasks/' + id, {
            method: 'delete',
            credentials: "include"
        }).then(res => {
            if (res.ok) {
                navigate('/project/' + task.projectId)
            }
        });
    };

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
                slotProps={{ paper: { sx: { alignSelf: 'flex-start', mt: '20%' } } }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete this task?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={deleteTask}>Delete</Button>
                </DialogActions>
            </Dialog>
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
                <Box>
                    <Typography variant="h4">{task.name}</Typography>
                    <Stack alignItems="start" direction="row" sx={{ mt: 1 }} spacing={1}>
                        <Chip label={task.type} variant="outlined" size="small" />
                        <Chip label={task.priority} variant="outlined" size="small" />
                    </Stack>
                </Box>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" color="error" onClick={handleClickOpen}>Delete</Button>
                    <Button variant="outlined" color="info" onClick={() => navigate('/task/' + task.id + '/edit')}>Edit</Button>
                </Stack>
                <Divider />
                <Typography variant="h5">Status</Typography>
                <Stack spacing={1}>
                    <ToggleButtonGroup value={task.status} exclusive onChange={handleStatusChange} color="primary">
                        {statuses.map((status) => (
                            <ToggleButton key={status} value={status}>
                                {status}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    {statusSuccess &&
                        <Typography variant="body2" color="success"><CheckIcon fontSize="inherit" sx={{ verticalAlign: "middle", mr: 0.5 }} />status changed</Typography>
                    }
                </Stack>
                <Divider />
                {/* <Typography variant="h5">Description</Typography>
            <Typography variant="body1">{task.description}</Typography> */}
            </Stack>
        </>
    )
}