import { Routes } from '@angular/router';
import { ProjectsPage } from './projects/projects-page/projects-page.component';
import { NewProjectPage } from './projects/new-project-page/new-project-page.component';

export const routes: Routes = [
    {
        path: 'projects',
        component: ProjectsPage,
    },
    {
        path: 'projects/new',
        component: NewProjectPage
    }
];
