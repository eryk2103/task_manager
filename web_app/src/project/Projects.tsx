import { Box, Button, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText, Pagination, Stack, Typography } from "@mui/material";
import { Fragment, useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import type { Project } from "./models";
import SearchField from "../shared/SearchField";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + "/projects?search=" + search + '&page=' + pagination.page + '&limit=' + 10, {
            method: "get",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            setProjects(data.data);
            setPagination(data.meta);
        }).finally(() => {
            setLoading(false);
        })
    }, [search, pagination.page]);

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPagination({ ...pagination, page: value });
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4">Projects</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/project/new')}>
                    New
                </Button>
            </Stack>
            <SearchField loading={loading} onChange={setSearch} />
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
                {pagination.pages > 1 &&
                    <Stack spacing={2} direction="row-reverse">
                        <Pagination count={pagination.pages} variant="outlined" shape="rounded" page={pagination.page} onChange={handlePageChange} />
                    </Stack>
                }
            </>
            }
        </Stack>
    )
}