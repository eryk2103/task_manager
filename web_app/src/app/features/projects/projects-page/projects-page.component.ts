import { Component } from '@angular/core';
import { Projects } from "../projects/projects.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-projects-page',
  imports: [Projects, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPage { }
