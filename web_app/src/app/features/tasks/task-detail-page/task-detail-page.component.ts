import { Component, inject, signal } from '@angular/core';
import { TaskService } from '../task.service';
import { ActivatedRoute } from '@angular/router';
import { Task, UpdateTask } from '../task.model';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatDivider } from "@angular/material/divider";
import { MatList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-task-detail-page',
  imports: [FormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatButton, MatDivider, MatList, MatListItem],
  templateUrl: './task-detail-page.component.html',
  styleUrl: './task-detail-page.component.css',
})
export class TaskDetailPage {
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);

  task = signal<Task>(<Task>{ id: 0, name: '', status: '' });
  status = signal<string>('');

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getById(id).subscribe({
      next: data => {
        this.task.set(data);
        this.status.set(data.status)
      },
      error: (err) => console.error(err)
    });
  }

  onStatusChange() {
    const task = <UpdateTask>{
      name: this.task().name,
      status: this.status()
    }

    this.taskService.update(this.task().id, task).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err)
    });
  }
}
