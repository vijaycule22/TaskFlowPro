import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Partial<Todo> = { title: '', description: '', completed: false };
  editingTodo: Todo | null = null;
  showAddDialog = false;
  showEditDialog = false;
  loading = false;
  titleError: string | null = null;

  constructor(
    private todoService: TodoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    console.log('TodoListComponent initialized');
    this.loadTodos();
  }

  // Computed properties for statistics
  get completedCount(): number {
    return this.todos.filter((todo) => todo.completed).length;
  }

  get pendingCount(): number {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tasks. Please try again.',
        });
        this.loading = false;
      },
    });
  }

  addTodo(): void {
    this.titleError = null;
    if (!this.newTodo.title?.trim()) {
      this.titleError = 'Task title is required.';
      return;
    }

    this.loading = true;
    this.todoService.createTodo(this.newTodo as Todo).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
        this.showAddDialog = false;
        this.loading = false;
        this.titleError = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task created successfully!',
        });
      },
      error: (error) => {
        console.error('Error creating todo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create task. Please try again.',
        });
        this.loading = false;
      },
    });
  }

  toggleTodo(todo: Todo): void {
    if (!todo.id) return;

    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: (result) => {
        const index = this.todos.findIndex((t) => t.id === result.id);
        if (index !== -1) {
          this.todos[index] = result;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: result.completed
            ? 'Task marked as completed!'
            : 'Task marked as pending!',
        });
      },
      error: (error) => {
        console.error('Error toggling todo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status. Please try again.',
        });
      },
    });
  }

  editTodo(todo: Todo): void {
    this.editingTodo = { ...todo };
    this.titleError = null;
    this.showEditDialog = true;
  }

  updateTodo(): void {
    if (!this.editingTodo?.title?.trim()) {
      this.titleError = 'Task title is required.';
      return;
    }

    if (!this.editingTodo || !this.editingTodo.id) return;

    this.loading = true;
    this.todoService
      .updateTodo(this.editingTodo.id, this.editingTodo)
      .subscribe({
        next: (updatedTodo) => {
          const index = this.todos.findIndex((t) => t.id === updatedTodo.id);
          if (index !== -1) {
            this.todos[index] = updatedTodo;
          }
          this.showEditDialog = false;
          this.editingTodo = null;
          this.loading = false;
          this.titleError = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task updated successfully!',
          });
        },
        error: (error) => {
          console.error('Error updating todo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update task. Please try again.',
          });
          this.loading = false;
        },
      });
  }

  deleteTodo(todo: Todo): void {
    if (!todo.id) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the task "<strong>${todo.title}</strong>"? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.todoService.deleteTodo(todo.id!).subscribe({
          next: () => {
            this.todos = this.todos.filter((t) => t.id !== todo.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Task deleted successfully!',
              life: 3000,
            });
          },
          error: (error) => {
            console.error('Error deleting todo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete task. Please try again.',
              life: 3000,
            });
          },
        });
      },
    });
  }

  openAddDialog(): void {
    console.log('openAddDialog called');
    this.newTodo = { title: '', description: '', completed: false };
    this.titleError = null;
    this.showAddDialog = true;
    console.log('showAddDialog set to:', this.showAddDialog);
  }

  cancelEdit(): void {
    this.showEditDialog = false;
    this.editingTodo = null;
    this.titleError = null;
  }
}
