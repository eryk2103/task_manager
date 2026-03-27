import { Routes } from '@angular/router';
import { ProjectsPage } from './projects/projects-page/projects-page.component';
import { NewProjectPage } from './projects/new-project-page/new-project-page.component';
import { DashboardPage } from './dashboard/dashboard-page/dashboard-page.component';
import { TasksPage } from './tasks/tasks-page/tasks-page.component';
import { SettingsPage } from './settings/settings-page/settings-page.component';
import { ProjectDetailPage } from './projects/project-detail-page/project-detail-page.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardPage
    },
    {
        path: 'projects',
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
        path: 'tasks',
        component: TasksPage
    },
    {
        path: 'settings',
        component: SettingsPage
    }
];
