import { Routes } from '@angular/router';
import { ProjectsPage } from './features/projects/projects-page/projects-page.component';
import { NewProjectPage } from './features/projects/new-project-page/new-project-page.component';
import { ProjectDetailPage } from './features/projects/project-detail-page/project-detail-page.component';
import { Login } from './features/auth/login/login.component';
import { Register } from './features/auth/register/register.component';
import { authGuard } from './features/auth/auth.guard';
import { NewTaskPage } from './features/tasks/new-task-page/new-task-page.component';
import { TaskDetailPage } from './features/tasks/task-detail-page/task-detail-page.component';


export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ProjectsPage,
            },
            {
                path: 'projects/new',
                component: NewProjectPage
            },
            {
                path: 'projects/:id',
                component: ProjectDetailPage
            },
            {
                path: 'projects/:id/tasks/new',
                component: NewTaskPage
            },
            {
                path: 'tasks/:id',
                component: TaskDetailPage
            }
        ]
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    }
];
