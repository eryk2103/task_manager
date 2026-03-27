import { Component, inject, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [AsyncPipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class Projects {
  private projectService = inject(ProjectService);

  $projects: Observable<Project[]> = this.projectService.getAll();

}
