import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  allowedStatus = ['IDEA', 'TODO', 'IN_PROGRESS', 'DONE']

  status = this.allowedStatus[0];
  tasks = signal<Task[]>([]);

  projectId = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAll(this.projectId, this.status).subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error(err)
    })
  }

  onStatusChange() {
    this.loadTasks();
  }
}
