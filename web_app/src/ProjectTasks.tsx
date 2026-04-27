import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogTitle, Divider, Link, List, ListItem, ListItemButton, ListItemText, Pagination, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Fragment, useEffect, useState, type ChangeEvent } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import type { Project, Task } from "./models";

type Status = "IDEA" | "TODO" | "IN_PROGRESS" | "DONE";

export default function ProjectTasks() {
    const [project, setProject] = useState<Project | undefined>();
    const [status, setStatus] = useState<Status>("TODO");
    const [tasks, setTasks] = useState<Task[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ page: 1, limit: 3, $total: 0, pages: 0 });
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/projects/' + id, {
            method: 'get',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            return res.json();
        }).then(data => {
            setProject(data);
        })
    }, [])

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/tasks?project=' + id + '&status=' + status + '&page=' + page + '&limit=' + 10, {
            method: 'get',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            return res.json();
        }).then(data => {
            setTasks(data.data);
            setPagination(data.meta);
        });

    }, [status, page])

    const handleStatusChange = (_event: React.SyntheticEvent, newValue: Status) => {
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

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

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
                    {pagination.pages > 1 &&
                        <Stack spacing={2} direction="row-reverse">
                            <Pagination count={pagination.pages} variant="outlined" shape="rounded" page={pagination.page} onChange={handlePageChange} />

                        </Stack>
                    }
                </Box>
            </Stack>
        </>
    )
}