import { Breadcrumbs, Button, ButtonGroup, Dialog, DialogActions, DialogTitle, Divider, FormControl, InputLabel, Link, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup, Typography, type SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { type Task } from "./models";

const statuses = ["IDEA", "TODO", "IN_PROGRESS", "DONE"];

export default function TaskDetail() {
    const [task, setTask] = useState<Task>({ id: 0, name: '', projectId: 0, status: "" });
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

    const handleStatusChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
        fetch(import.meta.env.VITE_API_URL + '/tasks/' + id, {
            method: 'put',
            credentials: "include",
            body: JSON.stringify({ ...task, status: newValue })
        }).then(res => {
            return res.json();
        }).then(data => {
            setTask(data);
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
                <Typography variant="h4">{task.name}</Typography>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" color="error" onClick={handleClickOpen}>Delete</Button>
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
                {/* <Typography variant="h5">Description</Typography>
            <Typography variant="body1">{task.description}</Typography> */}
            </Stack>
        </>
    )
}