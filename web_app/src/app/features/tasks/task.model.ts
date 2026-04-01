export interface Task {
    id: number;
    name: string;
    status: string;
    projectId: number;
}

export interface CreateTask {
    name: string;
    projectId: number;
}

export interface UpdateTask {
    name: string;
    status: string;
}