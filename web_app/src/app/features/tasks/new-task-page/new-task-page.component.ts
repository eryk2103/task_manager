import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { CreateTask } from '../task.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-task-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-task-page.component.html',
  styleUrl: './new-task-page.component.css',
})
export class NewTaskPage {
  taskService = inject(TaskService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  projectId = Number(this.route.snapshot.paramMap.get('id'));

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)])
  });

  get name() {
    return this.form.get('name');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const task = <CreateTask>{
      name: this.name?.value?.trim(),
      projectId: this.projectId
    }

    this.taskService.create(task).subscribe({
      next: () => this.router.navigate(['/projects/', this.projectId]),
      error: (err) => console.error(err)
    })
  }
}
