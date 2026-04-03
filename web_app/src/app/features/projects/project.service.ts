import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProject, Project, UpdateProject } from './project.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(search: string = ''): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl + "projects", { params: { search: search } });
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}projects/${id}`);
  }

  create(data: CreateProject): Observable<Project> {
    return this.http.post<Project>(this.apiUrl + "projects", data);
  }

  update(id: number, data: UpdateProject): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}projects/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}projects/${id}`);
  }
}
