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
}

export type EditTask = {
    name: string;
    status: string;
}

export type NewTask = {
    name: string;
    description: string;
    projectId: number;
}