import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubjectService, Subject } from '../../../core/services/subject.service';

@Component({
  selector: 'app-admin-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-white text-gray-900 flex">
    <!-- Sidebar -->
    <aside class="w-56 bg-gradient-to-r from-[#2dd4bf] to-[#1f2937]  text-white flex flex-col py-6 px-4 min-h-screen sticky top-0">
      <div class="mb-8 flex items-center gap-2">
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Grade48</span>
      </div>
      <nav class="flex-1">
        <ul class="space-y-2">
          <li>
            <a routerLink="/admin/dashboard" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/users" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              <span>🧑‍🤝‍🧑</span> <span>Users</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/subjects" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-700 font-semibold transition-colors">
              <span>📚</span> <span>Subjects</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/reports" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              <span>📝</span> <span>Reports</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/settings" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
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
              <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Grade48</span>
            </div>
            <div class="flex items-center space-x-4">
              <button class="px-4 py-2 rounded-md bg-indigo-700 text-white hover:bg-indigo-600 transition-all">
                <span>Settings</span>
              </button>
              <button class="relative h-10 w-10 rounded-full bg-indigo-600 overflow-hidden">
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
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400">Subject Management</span>
            </h1>
            <p class="text-gray-500 animate-slideRight">Create and manage subjects in the system.</p>
          </header>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Subject Form Panel -->
            <div class="backdrop-blur-md bg-gray-50 border border-gray-200 rounded-xl p-6 h-min sticky top-24">
              <h2 class="text-xl font-bold mb-4 text-gray-900">{{ editingSubject ? 'Edit Subject' : 'Add New Subject' }}</h2>
              
              <form [formGroup]="subjectForm" (ngSubmit)="saveSubject()">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input 
                      type="text" 
                      formControlName="name"
                      class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                      placeholder="e.g. Mathematics">
                    <div *ngIf="subjectForm.get('name')?.invalid && subjectForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
                      Subject name is required
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
                    <input 
                      type="number" 
                      min="0.5"
                      step="0.5"
                      formControlName="coefficient"
                      class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                      placeholder="e.g. 2">
                    <div *ngIf="subjectForm.get('coefficient')?.invalid && subjectForm.get('coefficient')?.touched" class="text-red-500 text-xs mt-1">
                      Coefficient is required (min 0.5)
                    </div>
                  </div>
                  
                  <div class="pt-2">
                    <button 
                      type="submit"
                      [disabled]="subjectForm.invalid"
                      [ngClass]="{'opacity-50 cursor-not-allowed': subjectForm.invalid}"
                      class="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2">
                      <span>{{ editingSubject ? 'Update Subject' : 'Add Subject' }}</span>
                    </button>
                  </div>
                  
                  <div *ngIf="editingSubject" class="pt-2">
                    <button 
                      type="button"
                      (click)="cancelEdit()"
                      class="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors flex items-center justify-center gap-2">
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- Subjects Panel -->
            <div class="lg:col-span-2 backdrop-blur-md bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900">Subject List</h2>
                <div>
                  <input 
                    type="text" 
                    placeholder="Search subjects..." 
                    class="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900"
                    (input)="searchSubjects($event)">
                </div>
              </div>
              
              <!-- Subject Cards -->
              <div class="grid grid-cols-1 gap-4 animate-staggered-fade-in">
                <div *ngIf="filteredSubjects.length === 0" class="text-center p-8 text-gray-400">
                  No subjects found
                </div>
                <div 
                  *ngFor="let subject of filteredSubjects; let i = index"
                  [ngClass]="[i % 4 === 0 ? 'border-l-blue-500' : '',
                             i % 4 === 1 ? 'border-l-teal-500' : '',
                             i % 4 === 2 ? 'border-l-amber-500' : '',
                             i % 4 === 3 ? 'border-l-rose-500' : '']"
                  class="group transition-all duration-200 border-l-4 hover:border-opacity-100 border-opacity-70 bg-gradient-to-r from-gray-50 to-transparent rounded-r-lg p-4 flex items-center justify-between hover:shadow-glow hover:from-gray-100">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ subject.name }}</h3>
                    <p class="text-sm text-gray-500">
                      Coefficient: <span class="text-gray-900">{{ subject.coefficient }}</span>
                    </p>
                  </div>
                  <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      (click)="editSubject(subject)" 
                      class="p-2 rounded-full bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-800 transition-colors">
                      <span class="text-xs">✏️</span>
                    </button>
                    <button 
                      (click)="confirmDeleteSubject(subject)" 
                      class="p-2 rounded-full bg-rose-600/20 hover:bg-rose-600/40 text-rose-800 transition-colors">
                      <span class="text-xs">🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Delete Confirmation Modal -->
          <div *ngIf="subjectToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
              <div class="text-center">
                <div class="mb-4 text-4xl">⚠️</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p class="text-gray-700 mb-6">Are you sure you want to delete <span class="font-semibold">{{ subjectToDelete.name }}</span>? This action cannot be undone.</p>
                
                <div class="flex justify-center space-x-4">
                  <button 
                    (click)="subjectToDelete = null"
                    class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors">
                    Cancel
                  </button>
                  <button 
                    (click)="deleteSubject()"
                    class="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors">
                    Delete Subject
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
    
    .shadow-glow {
      box-shadow: 0 0 15px 0 rgba(156, 163, 175, 0.1);
    }
    
    @keyframes staggeredFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-staggered-fade-in > * {
      animation: staggeredFadeIn 0.5s ease-out forwards;
      opacity: 0;
    }
    
    .animate-staggered-fade-in > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-staggered-fade-in > *:nth-child(2) { animation-delay: 0.15s; }
    .animate-staggered-fade-in > *:nth-child(3) { animation-delay: 0.2s; }
    .animate-staggered-fade-in > *:nth-child(4) { animation-delay: 0.25s; }
    .animate-staggered-fade-in > *:nth-child(5) { animation-delay: 0.3s; }
    .animate-staggered-fade-in > *:nth-child(6) { animation-delay: 0.35s; }
    .animate-staggered-fade-in > *:nth-child(7) { animation-delay: 0.4s; }
    .animate-staggered-fade-in > *:nth-child(8) { animation-delay: 0.45s; }
    .animate-staggered-fade-in > *:nth-child(9) { animation-delay: 0.5s; }
    .animate-staggered-fade-in > *:nth-child(10) { animation-delay: 0.55s; }
  `]
})
export class AdminSubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  subjectForm: FormGroup;
  editingSubject: Subject | null = null;
  subjectToDelete: Subject | null = null;
  
  constructor(
    private subjectService: SubjectService,
    private fb: FormBuilder
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      coefficient: [1, [Validators.required, Validators.min(0.5)]]
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  private loadMockSubjects(): void {
    this.subjects = [
      { id: 1, name: 'Mathematics', coefficient: 2 },
      { id: 2, name: 'Physics', coefficient: 2 },
      { id: 3, name: 'Chemistry', coefficient: 1.5 },
      { id: 4, name: 'Biology', coefficient: 1.5 },
      { id: 5, name: 'Computer Science', coefficient: 2 },
      { id: 6, name: 'History', coefficient: 1 },
      { id: 7, name: 'Literature', coefficient: 1 },
      { id: 8, name: 'Physical Education', coefficient: 0.5 }
    ];
    this.filteredSubjects = [...this.subjects];
  }

  // Fetch subjects from the server
  private loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.filteredSubjects = [...this.subjects];
      },
      error: (error) => {
        console.error('Error fetching subjects:', error);
        // Fallback to mock data if server is not available
        this.loadMockSubjects();
      }
    });
  }

  searchSubjects(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredSubjects = this.subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredSubjects = [...this.subjects];
    }
  }

  editSubject(subject: Subject): void {
    this.editingSubject = subject;
    this.subjectForm.patchValue({
      name: subject.name,
      coefficient: subject.coefficient
    });
  }

  cancelEdit(): void {
    this.editingSubject = null;
    this.subjectForm.reset({
      coefficient: 1
    });
  }

  saveSubject(): void {
    if (this.subjectForm.valid) {
      if (this.editingSubject) {
        // Update existing subject
        const updatedSubject: Omit<Subject, 'id'> = {
          name: this.subjectForm.value.name,
          coefficient: this.subjectForm.value.coefficient
        };
        
        // Call the service to update the subject on the server
        this.subjectService.updateSubject(this.editingSubject.id, updatedSubject).subscribe({
          next: (subject) => {
            const index = this.subjects.findIndex(s => s.id === subject.id);
            if (index !== -1) {
              this.subjects[index] = subject;
              this.filteredSubjects = [...this.subjects];
            }
            this.editingSubject = null;
            this.subjectForm.reset({ coefficient: 1 });
          },
          error: (error) => {
            console.error('Error updating subject:', error);
            alert('Failed to update subject. Please try again.');
          }
        });
      } else {
        // Create new subject
        const newSubject: Omit<Subject, 'id'> = this.subjectForm.value;
        
        // Call the service to create the subject on the server
        this.subjectService.createSubject(newSubject).subscribe({
          next: (subject) => {
            this.subjects.push(subject);
            this.filteredSubjects = [...this.subjects];
            this.subjectForm.reset({ coefficient: 1 });
          },
          error: (error) => {
            console.error('Error creating subject:', error);
            alert('Failed to create subject. Please try again.');
          }
        });
      }
    }
  }

  confirmDeleteSubject(subject: Subject): void {
    this.subjectToDelete = subject;
  }
     logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  deleteSubject(): void {
    if (this.subjectToDelete) {
      // Call the service to delete the subject on the server
      this.subjectService.deleteSubject(this.subjectToDelete.id).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(s => s.id !== this.subjectToDelete?.id);
          this.filteredSubjects = this.filteredSubjects.filter(s => s.id !== this.subjectToDelete?.id);
          this.subjectToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting subject:', error);
          alert('Failed to delete subject. Please try again.');
          this.subjectToDelete = null;
        }
      });
    }
  }
}
