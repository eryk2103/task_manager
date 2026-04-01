import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTask, Task, UpdateTask } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://localhost:8000/api/tasks';

  constructor(private http: HttpClient) { }

  getAll(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { params: { project: projectId } });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  update(id: number, data: UpdateTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
