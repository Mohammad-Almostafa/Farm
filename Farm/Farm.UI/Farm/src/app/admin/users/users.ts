import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AccountService } from '../../services/account-service';
import { UserModel } from '../adminModel/userModel';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'userName', 'email', 'password', 'role', 'edit', 'delete'];
  dataSource = signal<UserModel[]>([]);
  editingUserId = signal<string | null>(null);

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.accountService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.set(users);
      },
      error: () => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
      }
    });
  }

  startEdit(user: UserModel): void {
    this.editingUserId.set(user.id || null);
  }

  saveUser(user: UserModel): void {
    this.accountService.updateUser(user.id, user).subscribe({
      next: () => {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.editingUserId.set(null);
        this.updateUserInDataSource(user);
      },
      error: () => {
        console.log(user)
        this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
        this.editingUserId.set(null);
      }
    });
  }

  cancelEdit(): void {
    this.editingUserId.set(null);
    this.loadUsers();
  }

  private updateUserInDataSource(updatedUser: UserModel): void {
    const currentData = this.dataSource();
    const index = currentData.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      const newData = [...currentData];
      newData[index] = updatedUser;
      this.dataSource.set(newData);
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.accountService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => {
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isEditing(userId: string): boolean {
    return this.editingUserId() === userId;
  }
}
