export type Project = {
    id: number;
    name: string;
    description: string;
}

export type Task = {
    id: number;
    name: string;
    status: string;
    projectId: number;
    type: string;
    priority: string;
}

export type EditTask = {
    name: string;
    status: string;
    type: string;
}

export type NewTask = {
    name: string;
    projectId: number;
    type: string;
    status: string;
    priority: string;
}