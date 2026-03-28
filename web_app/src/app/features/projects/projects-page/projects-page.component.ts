import { Component } from '@angular/core';
import { Projects } from "../projects/projects.component";
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects-page',
  imports: [Projects, RouterLink, FormsModule],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPage {
  search: string = '';
}
