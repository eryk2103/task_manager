import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { Link } from "react-router";
type Task = {
    id: number;
    name: string;
}

type Status = "IDEA" | "TODO" | "IN_PROGRESS" | "DONE";

const data = { id: 0, name: "Task manager", description: "Task manager for solo developers" }
const data2 = {
    "IDEA": [
        { "id": 1, "name": "Brainstorm new features" },
        { "id": 2, "name": "Sketch app wireframes" },
        { "id": 3, "name": "Research competitor apps" },
        { "id": 4, "name": "Create mind map" },
        { "id": 5, "name": "Gather user feedback" },
        { "id": 6, "name": "Plan MVP scope" },
        { "id": 7, "name": "List potential integrations" },
        { "id": 8, "name": "Define user personas" }
    ],
    "TODO": [
        { "id": 9, "name": "Set up project repo" },
        { "id": 10, "name": "Install dependencies" },
        { "id": 11, "name": "Configure ESLint" },
        { "id": 12, "name": "Set up CI/CD pipeline" },
        { "id": 13, "name": "Create database schema" },
        { "id": 14, "name": "Define API endpoints" },
        { "id": 15, "name": "Write initial README" },
        { "id": 16, "name": "Add environment variables" }
    ],
    "IN_PROGRESS": [
        { "id": 17, "name": "Implement login page" },
        { "id": 18, "name": "Create dashboard layout" },
        { "id": 19, "name": "Connect API for tasks" },
        { "id": 20, "name": "Build task filtering" },
        { "id": 21, "name": "Add theme switching" },
        { "id": 22, "name": "Implement notifications" },
        { "id": 23, "name": "Fix UI bugs on mobile" },
        { "id": 24, "name": "Optimize images" }
    ],
    "DONE": [
        { "id": 25, "name": "Finalize project plan" },
        { "id": 26, "name": "Complete initial designs" },
        { "id": 27, "name": "Set up development environment" },
        { "id": 28, "name": "Create initial components" },
        { "id": 29, "name": "Write basic unit tests" },
        { "id": 30, "name": "Deploy first staging version" },
        { "id": 31, "name": "Team meeting to review plan" },
        { "id": 32, "name": "Document coding guidelines" }
    ]
}


export default function ProjectTasks() {
    const [project, setProject] = useState(data);
    const [status, setStatus] = useState<Status>("TODO");
    const [tasks, setTasks] = useState<Record<Status, Task[]>>(data2);

    const handleStatusChange = (event: React.SyntheticEvent, newValue: Status) => {
        setStatus(newValue);
    };

    return (
        <Stack spacing={2}>
            <Box>
                <Typography variant="h4">{project.name}</Typography>
                <Typography variant="body1">{project.description}</Typography>
            </Box>
            <Divider />
            <Box>
                <Typography variant="h5">Tasks</Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs aria-label="task status" value={status} onChange={handleStatusChange} variant="scrollable"
                        scrollButtons allowScrollButtonsMobile>
                        <Tab label="Idea" value="IDEA" />
                        <Tab label="Todo" value="TODO" />
                        <Tab label="In progress" value="IN_PROGRESS" />
                        <Tab label="Done" value="DONE" />
                    </Tabs>
                </Box>
                <List>
                    {tasks[status].map((task, index) =>
                        <Fragment key={task.id}>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to={`/task/${task.id}`}>
                                    <ListItemText primary={task.name} />
                                </ListItemButton>
                            </ListItem>
                            {index !== (tasks[status].length - 1) &&
                                <Divider />
                            }
                        </Fragment>
                    )}
                </List>
            </Box>

        </Stack>
    )
}