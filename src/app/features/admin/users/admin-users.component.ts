import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminUserService, CreateUserRequest } from '../../../core/services/admin-user.service';
import { UserProfile } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
   <div class="min-h-screen bg-white text-gray-900 flex">
    <!-- Sidebar -->
    <aside class="w-56 bg-gradient-to-t from-[#2dd4bf] to-[#1f2937] text-white flex flex-col py-6 px-4 z-[500] h-screen fixed top-0">
      <div class="mb-8 flex items-center gap-2">
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-[#2dd4bf]">Grade48</span>
      </div>
      <nav class="flex-1">
        <ul class="space-y-2">
          <li>
            <a routerLink="/admin/dashboard" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/users" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2dd4bf] font-semibold transition-colors">
              <span>🧑‍🤝‍🧑</span> <span>Users</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/subjects" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
              <span>📚</span> <span>Subjects</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/reports" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
              <span>📝</span> <span>Reports</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/settings" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
              <span>⚙️</span> <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="mt-auto">
        <button (click)="logout()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors font-medium">
          <span>🚪</span> <span>Logout</span>
        </button>
      </div>
    </aside>
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Navbar -->
      <nav class="bg-white border-b border-indigo-100 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
             
            </div>
            <div class="flex items-center space-x-4">
              <button class="px-4 py-2 rounded-md bg-[#2dd4bf] text-white hover:bg-[#2dd4bf] transition-all">
                <span>Settings</span>
              </button>
              <button class="relative h-10 w-10 rounded-full bg-[#2dd4bf] overflow-hidden">
                <span class="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">A</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="py-10 flex-1">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header with animation -->
          <header class="mb-10">
            <h1 class="text-4xl font-black mb-2 animate-fadeIn">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400">User Management</span>
            </h1>
            <p class="text-gray-500 animate-slideRight">Add, update, and remove users from the system.</p>
          </header>

          <!-- Control Panel -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <!-- Filters -->
            <div class="lg:col-span-1 backdrop-blur-md bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 class="text-xl font-bold mb-4 text-gray-900">Filters</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    (change)="filterUsers($event)" 
                    class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                    (input)="searchUsers($event)">
                </div>
              </div>
              
              <!-- Add User Button -->
              <div class="mt-6">
                <button 
                  (click)="showAddUserForm = true" 
                  class="w-full py-2 rounded-lg bg-[#2dd4bf] text-white hover:bg-[#046b5d] transition-colors">
                  <span class="flex items-center justify-center gap-2">
                    <span>➕</span>
                    <span>Add New User</span>
                  </span>
                </button>
              </div>
            </div>

            <!-- User List -->
            <div class="lg:col-span-3 backdrop-blur-md bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 class="text-xl font-bold mb-4 text-gray-900">Users</h2>
              
              <!-- User Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Username</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-100">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] flex items-center justify-center text-white">
                            <span class="font-bold text-sm">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                              [ngClass]="{
                                'bg-green-100 text-green-800': user.role === 'ADMIN',
                                'bg-blue-100 text-blue-800': user.role === 'TEACHER',
                                'bg-amber-100 text-amber-800': user.role === 'STUDENT'
                              }">
                          {{ user.role }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex space-x-2">
                          <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-400 transition-colors">
                            <span>✏️</span>
                          </button>
                          <button (click)="confirmDeleteUser(user)" class="text-rose-600 hover:text-rose-400 transition-colors">
                            <span>🗑️</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="filteredUsers.length === 0">
                      <td colspan="5" class="px-6 py-4 text-center text-gray-400">No users found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Add User Form Modal -->
          <div *ngIf="showAddUserForm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">Add New User</h3>
                <button (click)="showAddUserForm = false" class="text-gray-400 hover:text-gray-700 transition-colors">
                  <span>❌</span>
                </button>
              </div>
              
              <!-- Add User Form -->
              <form [formGroup]="userForm" (ngSubmit)="submitUserForm()">
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        type="text" 
                        formControlName="firstName"
                        class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                      <div *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched" class="text-red-500 text-xs mt-1">
                        Required field
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        formControlName="lastName"
                        class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                      <div *ngIf="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched" class="text-red-500 text-xs mt-1">
                        Required field
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      formControlName="username"
                      class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                    <div *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched" class="text-red-500 text-xs mt-1">
                      Required field
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      formControlName="email"
                      class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                    <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
                      Valid email required
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      formControlName="password"
                      class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                    <div *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched" class="text-red-500 text-xs mt-1">
                      Password is required (min 6 characters)
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                      formControlName="role"
                      class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                      <option value="ADMIN">Admin</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="STUDENT">Student</option>
                    </select>
                  </div>
                  
                  <div class="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button"
                      (click)="showAddUserForm = false"
                      class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors">
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      [disabled]="userForm.invalid"
                      [ngClass]="{'opacity-50 cursor-not-allowed': userForm.invalid}"
                      class="px-4 py-2 rounded-lg bg-[#2dd4bf] text-white hover:bg-indigo-500 transition-colors">
                      Save User
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Delete Confirmation Modal -->
          <div *ngIf="userToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
              <div class="text-center">
                <div class="mb-4 text-4xl">⚠️</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p class="text-gray-700 mb-6">Are you sure you want to delete {{ userToDelete.firstName }} {{ userToDelete.lastName }}? This action cannot be undone.</p>
                
                <div class="flex justify-center space-x-4">
                  <button 
                    (click)="userToDelete = null"
                    class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors">
                    Cancel
                  </button>
                  <button 
                    (click)="deleteUser()"
                    class="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors">
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .animate-slideRight {
      animation: slideRight 0.5s ease-out forwards;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: UserProfile[] = [];
  filteredUsers: UserProfile[] = [];
  userForm: FormGroup;
  showAddUserForm = false;
  userToDelete: UserProfile | null = null;
  
  constructor(
    private adminUserService: AdminUserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['STUDENT', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadMockUsers(): void {
    this.users = [
      { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'STUDENT' },
      { id: 2, username: 'mary_smith', firstName: 'Mary', lastName: 'Smith', email: 'mary@example.com', role: 'TEACHER' },
      { id: 3, username: 'robert_brown', firstName: 'Robert', lastName: 'Brown', email: 'robert@example.com', role: 'STUDENT' },
      { id: 4, username: 'laura_wilson', firstName: 'Laura', lastName: 'Wilson', email: 'laura@example.com', role: 'TEACHER' },
      { id: 5, username: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'ADMIN' },
      { id: 6, username: 'sarah_jones', firstName: 'Sarah', lastName: 'Jones', email: 'sarah@example.com', role: 'STUDENT' },
      { id: 7, username: 'mike_taylor', firstName: 'Mike', lastName: 'Taylor', email: 'mike@example.com', role: 'TEACHER' },
      { id: 8, username: 'emma_miller', firstName: 'Emma', lastName: 'Miller', email: 'emma@example.com', role: 'STUDENT' }
    ];
    this.filteredUsers = [...this.users];
  }

  // Fetch users from the server
  private loadUsers(): void {
    this.adminUserService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Fallback to mock data if server is not available
        this.loadMockUsers();
      }
    });
  }

  filterUsers(event: Event): void {
    const role = (event.target as HTMLSelectElement).value;
    if (role) {
      this.filteredUsers = this.users.filter(user => user.role === role);
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  searchUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredUsers = this.users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  submitUserForm(): void {
    if (this.userForm.valid) {
      if (this.editingUser) {
        // Handle updating an existing user
        const updatedUser: Partial<UserProfile> = {
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
          email: this.userForm.value.email,
          role: this.userForm.value.role
        };
        
        // Add password only if provided
        if (this.userForm.value.password) {
          updatedUser.password = this.userForm.value.password;
        }
        
        // Call the service to update the user on the server
        this.adminUserService.updateUser(this.editingUser.id, updatedUser).subscribe({
          next: (user) => {
            const index = this.users.findIndex(u => u.id === user.id);
            if (index !== -1) {
              this.users[index] = user;
              this.filteredUsers = [...this.users];
            }
            
            // Reset form and editing state
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
          }
        });
      } else {
        // Handle creating a new user
        const newUser: CreateUserRequest = this.userForm.value;
        
        // Call the service to create a new user on the server
        this.adminUserService.createUser(newUser).subscribe({
          next: (user) => {
            this.users.push(user);
            this.filteredUsers = [...this.users];
            
            // Reset form
            this.resetForm();
          },
          error: (error) => {
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
          }
        });
      }
    }
  }
  
  // Helper method to reset the form and editing state
  resetForm(): void {
    // Reset the form with default role
    this.userForm.reset({
      role: 'STUDENT'
    });
    
    // Restore password validation for new users
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
      passwordControl.updateValueAndValidity();
    }
    
    // Clear editing state
    this.editingUser = null;
    this.showAddUserForm = false;
  }
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Add a property to track the user being edited
  editingUser: UserProfile | null = null;
  
  editUser(user: UserProfile): void {
    this.editingUser = user;
    this.showAddUserForm = true;
    
    // Populate the form with the user's data, but exclude the password field
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Make the password field optional when editing
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      passwordControl.clearValidators();
      passwordControl.updateValueAndValidity();
    }
  }

  confirmDeleteUser(user: UserProfile): void {
    this.userToDelete = user;
  }

  deleteUser(): void {
    if (this.userToDelete) {
      // Call the service to delete the user on the server
      this.adminUserService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== this.userToDelete?.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== this.userToDelete?.id);
          this.userToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
          this.userToDelete = null;
        }
      });
    }
  }
}
