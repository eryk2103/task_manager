import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatActionList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, RouterLink, MatFormField, MatLabel, MatSelect, MatOption, MatActionList, MatListItem],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  status = 'IDEA';
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
