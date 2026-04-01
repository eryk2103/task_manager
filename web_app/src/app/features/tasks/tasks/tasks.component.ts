import { Component, inject, Input } from '@angular/core';
import { TaskService } from '../task.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { Task } from '../task.model';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [AsyncPipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class Tasks {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  projectId = Number(this.route.snapshot.paramMap.get('id'));
  tasks$: Observable<Task[]> = this.taskService.getAll(this.projectId);
}
