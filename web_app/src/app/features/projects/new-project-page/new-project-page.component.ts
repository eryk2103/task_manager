import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { CreateProject } from '../project.model';
import { Router, RouterLink } from '@angular/router';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-new-project-page',
  imports: [ReactiveFormsModule, RouterLink, MatFormField, MatInput, MatError, MatButton, MatLabel],
  templateUrl: './new-project-page.component.html',
  styleUrl: './new-project-page.component.css',
})
export class NewProjectPage {
  projectService = inject(ProjectService);
  router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    description: new FormControl('', [Validators.maxLength(1000)])
  });
  error: string | null = null;

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  onSubmit() {
    this.name?.setValue((this.name?.value || '').trim());

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newProject = <CreateProject>{
      name: this.name?.value,
      description: this.description?.value
    }

    this.projectService.create(newProject).subscribe({
      next: res => this.router.navigate(['/']),
      error: err => this.error = err
    })
  }

  closeAlert() {
    this.error = null;
  }
}
