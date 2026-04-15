export type Project = {
    id: number;
    name: string;
    description: string;
}

export type NewTask = {
    name: string;
    description: string;
    projectId: number;
}