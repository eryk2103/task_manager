import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogTitle, Divider, Link, List, ListItem, ListItemButton, ListItemText, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import type { Project } from "./models";

type Task = {
    id: number;
    name: string;
}

type Status = "IDEA" | "TODO" | "IN_PROGRESS" | "DONE";

export default function ProjectTasks() {
    const [project, setProject] = useState<Project | undefined>();
    const [status, setStatus] = useState<Status>("TODO");
    const [tasks, setTasks] = useState<Task[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/projects/' + id, {
            method: 'get',
            credentials: 'include'
        }).then(res => {
            return res.json();
        }).then(data => {
            setProject(data);
        })
    }, [])

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/tasks?project=' + id + '&status=' + status, {
            method: 'get',
            credentials: 'include'
        }).then(res => {
            return res.json();
        }).then(data => {
            setTasks(data);
        });

    }, [status])

    const handleStatusChange = (event: React.SyntheticEvent, newValue: Status) => {
        setStatus(newValue);
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const deleteProject = () => {
        fetch(import.meta.env.VITE_API_URL + '/projects/' + id, {
            method: 'delete',
            credentials: "include"
        }).then(res => {
            if (res.ok) {
                navigate('/')
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
                    {"Are you sure you want to delete this project?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={deleteProject}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Stack spacing={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" component={RouterLink} to="/">
                        Projects
                    </Link>
                    <Typography sx={{ color: 'text.primary' }}>Tasks</Typography>
                </Breadcrumbs>
                <Box>
                    <Typography variant="h4">{project?.name}</Typography>
                    <Typography variant="body1">{project?.description}</Typography>
                    <Stack spacing={2} direction="row" mt={2}>
                        <Button variant="outlined" color="primary" onClick={() => { navigate(`/project/${id}/edit`) }}>Edit</Button>
                        <Button variant="outlined" color="error" onClick={handleClickOpen}>Delete</Button>
                    </Stack>
                </Box>
                <Divider />
                <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">Tasks</Typography>
                        <Button variant="outlined" color="primary" onClick={() => navigate(`/project/${id}/new-task`)}>New task</Button>
                    </Stack>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: 2 }}>
                        <Tabs aria-label="task status" value={status} onChange={handleStatusChange} variant="scrollable"
                            scrollButtons allowScrollButtonsMobile>
                            <Tab label="Idea" value="IDEA" />
                            <Tab label="Todo" value="TODO" />
                            <Tab label="In progress" value="IN_PROGRESS" />
                            <Tab label="Done" value="DONE" />
                        </Tabs>
                    </Box>
                    {tasks.length === 0 &&
                        <Box>
                            <Typography variant="body1" sx={{ textAlign: "center", mt: 5 }}>No tasks found.</Typography>
                        </Box>
                    }
                    <List>
                        {tasks.map((task, index) =>
                            <Fragment key={task.id}>
                                <ListItem disablePadding>
                                    <ListItemButton component={RouterLink} to={`/task/${task.id}`}>
                                        <ListItemText primary={task.name} />
                                    </ListItemButton>
                                </ListItem>
                                {index !== (tasks.length - 1) &&
                                    <Divider />
                                }
                            </Fragment>
                        )}
                    </List>
                </Box>
            </Stack>
        </>
    )
}