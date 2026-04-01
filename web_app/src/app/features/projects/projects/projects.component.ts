import { Component, inject, Input } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { MatActionList, MatDivider, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-projects',
  imports: [AsyncPipe, RouterLink, MatActionList, MatListItem, MatDivider],
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
