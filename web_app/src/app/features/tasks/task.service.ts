import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTask, Task, UpdateTask } from './task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(projectId: number, status: string = ''): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl + "tasks", { params: { project: projectId, status: status } });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}tasks/${id}`);
  }

  create(data: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl + "tasks", data);
  }

  update(id: number, data: UpdateTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}tasks/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}tasks/${id}`);
  }
}
