import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectService } from '../project.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project } from '../project.model';
import { TasksPage } from "../../tasks/tasks-page/tasks-page.component";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink, TasksPage, MatButton],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.css',
})
export class ProjectDetailPage implements OnInit {
  projectService = inject(ProjectService);
  route = inject(ActivatedRoute);

  project = signal<Project | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getById(id).subscribe({
      next: data => {
        this.project.set(data);
      },
      error: () => this.error.set('Project not found')
    });
  }
}
