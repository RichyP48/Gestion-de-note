import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GradeService, Grade } from '../../../core/services/grade.service';
import { ClassService, Class, User } from '../../../core/services/class.service';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
 template: `
  <div class="min-h-screen flex bg-white">
    <!-- Sidebar -->
    <aside class="w-60 bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white flex flex-col py-6 px-4 min-h-screen sticky top-0 left-0 z-30"
      style="height: 100vh; position: sticky; top: 0; overflow-y: auto;">
      <style>
        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          background-color: #f5f5f5;
        }
        ::-webkit-scrollbar {
          width: 3px;
          background-color: #f5f5f5;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          background-color: #f5f5f5;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #32b9a9;
        }
      </style>
      <div class="mb-8 flex items-center gap-2">
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Grade48</span>
      </div>
      <nav class="flex-1 hide-scrollbar" style="overflow-y: auto;">
        <ul class="space-y-2">
          <li>
            <a routerLink="/teacher" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/teacher/grades" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>📝</span> <span>Grades</span>
            </a>
          </li>
          <li>
            <a routerLink="/teacher/students" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#32b9a9]/40 font-semibold transition-colors">
              <span>👨‍🎓</span> <span>Students</span>
            </a>
          </li>
          <li>
            <a routerLink="/teacher/reports" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>📊</span> <span>Reports</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="mt-auto">
        <button class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors font-medium">
          <span>🚪</span> <span>Logout</span>
        </button>
      </div>
    </aside>
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-slate-900 text-white">
      <!-- Navbar -->
      <nav class="bg-black/30 backdrop-blur-lg border-b border-teal-500/30 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Grade48</span>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/teacher" class="px-4 py-2 rounded-md bg-teal-700 hover:bg-teal-600 transition-all">
                <span>Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Main Content -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header with animation -->
          <header class="mb-10">
            <h1 class="text-4xl font-black mb-2 animate-fadeIn">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">Student Progress</span>
            </h1>
            <p class="text-gray-300 animate-slideRight">Track and analyze individual student performance.</p>
          </header>

          <!-- Student Search and Filter -->
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow mb-8">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 class="text-xl font-bold">Student Directory</h2>
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative">
                  <input type="text" [(ngModel)]="searchTerm" placeholder="Search students..." class="w-full sm:w-64 bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white pl-10">
                  <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
                <select [(ngModel)]="selectedClassId" class="bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                  <option [ngValue]="null">All Classes</option>
                  <option *ngFor="let class of classes" [ngValue]="class.id">{{ class.name }}</option>
                </select>
                <button (click)="filterStudents()" class="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md transition-all">
                  Apply
                </button>
              </div>
            </div>
            
            <!-- Students Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngIf="isLoading" class="col-span-3 text-center py-8">
                <p class="text-lg">Loading students...</p>
              </div>
              <div *ngIf="!isLoading && students.length === 0" class="col-span-3 text-center py-8">
                <p class="text-lg">No students found.</p>
              </div>
              <div *ngFor="let student of filteredStudents | slice: (currentPage - 1) * pageSize : currentPage * pageSize" class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer">
                <div class="flex items-start gap-4">
                  <div class="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-lg font-bold">
                    {{ student.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium">{{ student.name }}</h3>
                    <p class="text-sm text-gray-300">ID: {{ student.id }}</p>
                    <div class="flex justify-between items-center mt-2">
                      <div>
                        <p class="text-xs text-gray-400">Overall Grade</p>
                        <p class="font-medium" [ngClass]="{
                          'text-green-400': student.overallGrade >= 80,
                          'text-yellow-400': student.overallGrade >= 70 && student.overallGrade < 80,
                          'text-red-400': student.overallGrade < 70
                        }">{{ student.overallGrade }}%</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-400">Attendance</p>
                        <p class="font-medium">{{ student.attendance }}%</p>
                      </div>
                      <div>
                        <button class="text-teal-400 hover:text-teal-300 text-sm">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-between items-center mt-6">
              <div class="text-sm text-gray-400">
                Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredStudents.length) }}</span> of <span class="font-medium">{{ filteredStudents.length }}</span> students
              </div>
              <div class="flex space-x-2">
                <button [disabled]="currentPage === 1" [class.opacity-50]="currentPage === 1" (click)="prevPage()" class="px-3 py-1 bg-teal-800/50 hover:bg-teal-700/50 rounded-md transition-all">
                  Previous
                </button>
                <button [disabled]="currentPage * pageSize >= filteredStudents.length" [class.opacity-50]="currentPage * pageSize >= filteredStudents.length" (click)="nextPage()" class="px-3 py-1 bg-teal-600 hover:bg-teal-500 rounded-md transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Performance Analytics -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Class Performance Overview -->
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow">
              <h2 class="text-xl font-bold mb-4">Class Performance Overview</h2>
              <div class="space-y-4">
                <div *ngFor="let class of classPerformance" class="bg-white/5 p-4 rounded-lg">
                  <div class="flex justify-between mb-2">
                    <h3 class="font-medium">{{ class.name }}</h3>
                    <p class="text-sm" [ngClass]="{
                      'text-green-400': class.averageGrade >= 80,
                      'text-teal-400': class.averageGrade >= 70 && class.averageGrade < 80,
                      'text-yellow-400': class.averageGrade < 70
                    }">Average: {{ class.averageGrade }}%</p>
                  </div>
                  <div class="w-full bg-black/30 rounded-full h-2.5">
                    <div [ngClass]="{
                      'bg-green-500': class.averageGrade >= 80,
                      'bg-teal-500': class.averageGrade >= 70 && class.averageGrade < 80,
                      'bg-yellow-500': class.averageGrade < 70
                    }" class="h-2.5 rounded-full" [style.width.%]="class.averageGrade"></div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{{ class.studentCount }} Students</span>
                    <span>Range: {{ class.minGrade }}% - {{ class.maxGrade }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Top Performers -->
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow">
              <h2 class="text-xl font-bold mb-4">Top Performers</h2>
              <div class="space-y-4">
                <div *ngFor="let student of topPerformers; let i = index" class="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                  <div class="h-10 w-10 rounded-full flex items-center justify-center" [ngClass]="{
                    'bg-yellow-500/20 text-yellow-400': i === 0,
                    'bg-gray-400/20 text-gray-300': i === 1,
                    'bg-amber-600/20 text-amber-500': i === 2
                  }">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium">{{ student.name }}</h3>
                    <p class="text-sm text-gray-300">{{ student.class }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-green-400">{{ student.grade }}%</p>
                    <p class="text-xs text-gray-400">{{ student.improvement }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <span class="text-2xl">📝</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">Send Feedback</h3>
                  <p class="text-sm text-gray-300 mb-2">Provide individual student feedback</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg bg-teal-500/20 text-teal-400">
                  <span class="text-2xl">📊</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">Progress Reports</h3>
                  <p class="text-sm text-gray-300 mb-2">Generate student progress reports</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <span class="text-2xl">📅</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">Schedule Meeting</h3>
                  <p class="text-sm text-gray-300 mb-2">Set up student or parent meetings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
`

})
export class TeacherStudentsComponent implements OnInit {
  // Student data
  students: StudentWithGrades[] = [];
  filteredStudents: StudentWithGrades[] = [];
  classes: Class[] = [];
  classPerformance: ClassPerformance[] = [];
  topPerformers: TopPerformer[] = [];
  
  // Filters and pagination
  searchTerm: string = '';
  selectedClassId: number | null = null;
  currentPage: number = 1;
  pageSize: number = 9;
  
  // Loading state
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  // For template use
  Math = Math;

  constructor(
    private classService: ClassService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    // Load real data from the server
    this.loadClasses();
    this.loadStudents();
  }

  // Load classes taught by the current teacher
  loadClasses(): void {
    this.isLoading = true;
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.calculateClassPerformance(classes);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.errorMessage = 'Failed to load classes. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Load all students from the teacher's classes
  loadStudents(): void {
    this.isLoading = true;
    
    // Get all classes first
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        // For each class, get the students
        const studentPromises: Promise<void>[] = [];
        
        classes.forEach(classItem => {
          const promise = new Promise<void>((resolve) => {
            this.classService.getStudentsInClass(classItem.id).subscribe({
              next: (students) => {
                // For each student, get their grades
                students.forEach(student => {
                  this.gradeService.getGrades(student.id).subscribe({
                    next: (grades) => {
                      // Calculate average grade
                      const average = grades.length > 0 
                        ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length 
                        : 0;
                      
                      // Add student to the list if not already there
                      if (!this.students.some(s => s.id === student.id)) {
                        this.students.push({
                          id: student.id,
                          name: `${student.firstName} ${student.lastName}`,
                          overallGrade: Math.round(average),
                          attendance: Math.round(85 + Math.random() * 15), // Mock attendance for now
                          classId: classItem.id,
                          className: classItem.name
                        });
                      }
                      
                      // Update filtered students
                      this.filterStudents();
                      
                      // Find top performers
                      this.calculateTopPerformers();
                      
                      resolve();
                    },
                    error: (error) => {
                      console.error(`Error loading grades for student ${student.id}:`, error);
                      resolve();
                    }
                  });
                });
              },
              error: (error) => {
                console.error(`Error loading students for class ${classItem.id}:`, error);
                resolve();
              }
            });
          });
          
          studentPromises.push(promise);
        });
        
        // When all promises are resolved
        Promise.all(studentPromises).then(() => {
          this.isLoading = false;
        });
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.errorMessage = 'Failed to load classes. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Filter students based on search term and selected class
  filterStudents(): void {
    this.filteredStudents = this.students.filter(student => {
      // Filter by search term
      const matchesSearch = !this.searchTerm || 
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filter by class
      const matchesClass = !this.selectedClassId || 
        student.classId === this.selectedClassId;
      
      return matchesSearch && matchesClass;
    });
    
    // Reset pagination
    this.currentPage = 1;
  }

  // Calculate class performance metrics
  calculateClassPerformance(classes: Class[]): void {
    this.classPerformance = [];
    
    classes.forEach(classItem => {
      // Get all students in this class
      this.classService.getStudentsInClass(classItem.id).subscribe({
        next: (students) => {
          let totalGrade = 0;
          let studentCount = 0;
          let minGrade = 100;
          let maxGrade = 0;
          
          // For each student, get their grades
          students.forEach(student => {
            this.gradeService.getGrades(student.id, classItem.subjectId).subscribe({
              next: (grades) => {
                if (grades.length > 0) {
                  const average = grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;
                  totalGrade += average;
                  studentCount++;
                  
                  minGrade = Math.min(minGrade, average);
                  maxGrade = Math.max(maxGrade, average);
                  
                  // If this is the last student, add the class performance
                  if (studentCount === students.length) {
                    this.classPerformance.push({
                      id: classItem.id,
                      name: classItem.name,
                      averageGrade: Math.round(totalGrade / studentCount),
                      studentCount: studentCount,
                      minGrade: Math.round(minGrade),
                      maxGrade: Math.round(maxGrade)
                    });
                  }
                }
              }
            });
          });
        }
      });
    });
  }

  // Calculate top performers
  calculateTopPerformers(): void {
    // Sort students by overall grade
    const sortedStudents = [...this.students].sort((a, b) => b.overallGrade - a.overallGrade);
    
    // Take top 3
    this.topPerformers = sortedStudents.slice(0, 3).map(student => ({
      name: student.name,
      class: student.className,
      grade: student.overallGrade,
      improvement: `+${Math.round(Math.random() * 10)}% from last month` // Mock improvement for now
    }));
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredStudents.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

// Interfaces
interface StudentWithGrades {
  id: number;
  name: string;
  overallGrade: number;
  attendance: number;
  classId: number;
  className: string;
}

interface ClassPerformance {
  id: number;
  name: string;
  averageGrade: number;
  studentCount: number;
  minGrade: number;
  maxGrade: number;
}

interface TopPerformer {
  name: string;
  class: string;
  grade: number;
  improvement: string;
}
