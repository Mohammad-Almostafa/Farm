import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActionableTask } from '../../Models/actionable-task';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {
  displayedColumns: string[] = ['taskType', 'farmName', 'fieldName', 'cropName', 'taskTime', 'isCompleted'];
  dataSource = signal<ActionableTask[]>([]);

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.dataSource.set(tasks);
      },
      error: () => {
          this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
      }
    });
  }

  toggleCompletion(task: ActionableTask): void {
    const updatedStatus = !task.isCompleted;
    task.isCompleted = updatedStatus;
    this.taskService.toggleTaskCompletion(task.id, updatedStatus).subscribe({
      error: () => {
        task.isCompleted = !updatedStatus;
        this.snackBar.open('Failed to update task status', 'Close', { duration: 3000 });
      }
    });
  }
}
