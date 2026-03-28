export interface Project {
    id: number;
    name: string;
    description: string; //markdown
}

export interface CreateProject {
    name: string;
    description: string;
}

export interface UpdateProject {
    name: string;
    description: string;
}