import { Component } from '@angular/core';
import { Projects } from "../projects/projects.component";

@Component({
  selector: 'app-projects-page',
  imports: [Projects],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPage {}
