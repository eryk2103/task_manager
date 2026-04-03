import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { Link } from "react-router";

const data = [{ id: 0, name: "Task manager" }, { id: 1, name: "Car renting system" }, { id: 2, name: "Premier league fixtures website" }];
export default function Projects() {
    const [projects, setProjects] = useState(data);

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Projects</Typography>
            <TextField id="search" label="Search" variant="outlined" />
            {!projects &&
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
        </Stack>
    )
}