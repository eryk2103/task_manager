import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-projects',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class Projects {
  private projectService = inject(ProjectService);

  private query$ = new BehaviorSubject<string>(''); // reactive query source

  @Input()
  set query(value: string) {
    this.query$.next(value);
  }

  projects$: Observable<Project[]> = this.query$.pipe(
    debounceTime(100),
    distinctUntilChanged(),
    switchMap((q) => this.projectService.getAll(q))
  );

  ngOnInit(): void {
    this.query$.next(this.query$.value);
  }
}
