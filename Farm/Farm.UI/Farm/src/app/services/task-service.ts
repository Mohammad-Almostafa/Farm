// src/app/services/task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionableTask } from '../Models/actionable-task';


@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5052/api/v1/task';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<ActionableTask[]> {
    return this.http.get<ActionableTask[]>(this.apiUrl);
    }

  toggleTaskCompletion(id: string, isCompleted: boolean): Observable<ActionableTask> {
    return this.http.put<ActionableTask>(`${this.apiUrl}/${id}/toggle-completion`,  isCompleted );
    }
}
