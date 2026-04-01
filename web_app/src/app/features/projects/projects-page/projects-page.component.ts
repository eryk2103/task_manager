import { Component } from '@angular/core';
import { Projects } from "../projects/projects.component";
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-projects-page',
  imports: [Projects, RouterLink, FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatIcon],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPage {
  search: string = '';
}
