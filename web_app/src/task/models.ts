export const TASK_TYPES = ["FEATURE", "BUG", "REFACTOR", "IMPROVE", "OTHER"] as const;
export const TASK_STATUSES = ["IDEA", "TODO", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MID", "HIGH", "CRITICAL"] as const;

export type TaskType = typeof TASK_TYPES[number];
export type TaskStatus = typeof TASK_STATUSES[number];
export type TaskPriority = typeof TASK_PRIORITIES[number];

export type Task = {
    id: number;
    projectId: number;
    name: string;
    status: TaskStatus;
    type: TaskType;
    priority: TaskPriority;
}