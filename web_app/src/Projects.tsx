import { Box, Button, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import type { Project } from "./models";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + "/projects", {
            method: "get",
            credentials: "include",
        }).then(res => {
            return res.json();
        }).then(data => {
            setProjects(data);
        }).finally(() => {
            setLoading(false);
        })
    }, []);

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4">Projects</Typography>
                <Button variant="outlined" startIcon={<AddIcon />}>
                    New
                </Button>
            </Stack>
            <TextField id="search" label="Search" variant="outlined" disabled={loading} />
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <CircularProgress />
            </Box> : <>
                {projects.length === 0 &&
                    <Box>
                        <Typography variant="body1" sx={{ textAlign: "center", mt: 5 }}>No projects found.</Typography>
                    </Box>
                }
                <List>
                    {projects.map((project, index) =>
                        <Fragment key={project.id}>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to={`/project/${project.id}`}>
                                    <ListItemText primary={project.name} />
                                </ListItemButton>
                            </ListItem>
                            {index !== (projects.length - 1) &&
                                <Divider />
                            }
                        </Fragment>
                    )}
                </List>
            </>
            }
        </Stack>
    )
}