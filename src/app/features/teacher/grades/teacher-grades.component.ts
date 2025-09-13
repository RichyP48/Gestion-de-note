import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GradeService, Grade } from '../../../core/services/grade.service';
import { ClassService, Class, User } from '../../../core/services/class.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-teacher-grades',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
template: `
  <div class="min-h-screen flex bg-white">
  
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen bg-gradient-to-br  text-white">
     
 
      
      <!-- Main Content -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header with animation -->
          <header class="mb-10">
            <h1 class="text-4xl font-black mb-2 animate-fadeIn">
              <span class="bg-clip-text text-primary-100">Grade Management</span>
            </h1>
            <p class="text-gray-300 animate-slideRight">Enter and manage student grades for your classes.</p>
          </header>

          <!-- Grade Management Interface -->
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow mb-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">Select Class</h2>
              <div class="flex space-x-2">
                <select class="bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white" [(ngModel)]="selectedClassId">
                  <option value="">All Classes</option>
                  <option *ngFor="let class of classes" [value]="class.id">{{ class.name }}</option>
                </select>
                <button class="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md transition-all" (click)="selectClass(selectedClassId)">
                  Apply
                </button>
              </div>
            </div>
            
            <!-- Grades Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assignment 1</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assignment 2</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Midterm</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Final</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Average</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700 bg-black/20">
                  <tr *ngFor="let student of students; let i = index" class="hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">{{ student.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ student.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="number" [(ngModel)]="student.grades.assignment1" class="w-16 bg-black/30 border border-teal-500/30 rounded px-2 py-1 text-white">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="number" [(ngModel)]="student.grades.assignment2" class="w-16 bg-black/30 border border-teal-500/30 rounded px-2 py-1 text-white">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="number" [(ngModel)]="student.grades.midterm" class="w-16 bg-black/30 border border-teal-500/30 rounded px-2 py-1 text-white">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="number" [(ngModel)]="student.grades.final" class="w-16 bg-black/30 border border-teal-500/30 rounded px-2 py-1 text-white">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-medium" [ngClass]="{
                      'text-green-400': student.grades.average >= 80,
                      'text-yellow-400': student.grades.average >= 70 && student.grades.average < 80,
                      'text-red-400': student.grades.average < 70
                    }">
                      {{ student.grades.average }}%
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-teal-400 hover:text-teal-300 mr-3" (click)="saveGrade(student, 'assignment1')">Save</button>
                      <button class="text-red-400 hover:text-red-300">Reset</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-between items-center mt-6">
              <div class="text-sm text-gray-400">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">24</span> students
              </div>
              <div class="flex space-x-2">
                <button class="px-3 py-1 bg-teal-800/50 hover:bg-teal-700/50 rounded-md transition-all">
                  Previous
                </button>
                <button class="px-3 py-1 bg-teal-600 hover:bg-teal-500 rounded-md transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Bulk Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <span class="text-2xl">📊</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">Export Grades</h3>
                  <p class="text-sm text-gray-300 mb-2">Download grades as CSV or PDF</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg bg-teal-500/20 text-teal-400">
                  <span class="text-2xl">📝</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">Batch Update</h3>
                  <p class="text-sm text-gray-300 mb-2">Update multiple grades at once</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <span class="text-2xl">📧</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">Send Notifications</h3>
                  <p class="text-sm text-gray-300 mb-2">Notify students about grades</p>
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
export class TeacherGradesComponent implements OnInit {
  // Student data with grades
  students: StudentWithGrades[] = [];
  classes: Class[] = [];
  selectedClassId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  showProfileMenu: boolean = false;
  userInitials: string = '';
  userEmail: string = '';

  constructor(
    private gradeService: GradeService,
    private classService: ClassService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
      
      // Get initials from username
      const nameParts = user.username.split(/[\s_.]/);
      if (nameParts.length > 1) {
        this.userInitials = nameParts[0].charAt(0).toUpperCase() + 
                           (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '');
      } else {
        this.userInitials = user.username.substring(0, 2).toUpperCase();
      }
    } else {
      this.userInitials = 'T';
      this.userEmail = 'teacher@example.com';
    }
  }

  ngOnInit(): void {
    // Load real data from the server
    this.loadClasses();
  }

  // Load classes taught by the current teacher
  loadClasses(): void {
    this.isLoading = true;
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.isLoading = false;
        
        // If classes are available, load students for the first class
        if (classes.length > 0) {
          this.selectClass(classes[0].id);
        }
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.errorMessage = 'Failed to load classes. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Select a class and load its students with grades
  selectClass(classId: number | null): void {
    if (!classId) return;
    
    this.selectedClassId = classId;
    this.isLoading = true;
    this.errorMessage = null;
    
    // First get the students in the class
    this.classService.getStudentsInClass(classId).subscribe({
      next: (students) => {
        // Then get the grades for this class
        this.gradeService.getGrades(undefined, this.getSubjectIdForClass(classId)).subscribe({
          next: (grades) => {
            // Map students to include their grades
            this.students = students.map(student => {
              const studentGrades = grades.filter(g => g.studentId === student.id);
              
              // Calculate average grade
              const average = studentGrades.length > 0 
                ? studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length 
                : 0;
              
              return {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                grades: {
                  assignment1: this.findGradeByType(studentGrades, 'assignment1'),
                  assignment2: this.findGradeByType(studentGrades, 'assignment2'),
                  midterm: this.findGradeByType(studentGrades, 'midterm'),
                  final: this.findGradeByType(studentGrades, 'final'),
                  average: Math.round(average)
                }
              };
            });
            
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading grades:', error);
            this.errorMessage = 'Failed to load grades. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.errorMessage = 'Failed to load students. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Helper method to find a specific grade type for a student
  findGradeByType(grades: Grade[], type: string): number {
    const grade = grades.find(g => g.comments && g.comments.includes(type));
    return grade ? grade.score : 0;
  }

  // Helper method to get the subject ID for a class
  getSubjectIdForClass(classId: number): number {
    const classObj = this.classes.find(c => c.id === classId);
    return classObj ? classObj.subjectId : 0;
  }

  // Save a student's grade
  saveGrade(student: StudentWithGrades, gradeType: string): void {
    const score = student.grades[gradeType as keyof typeof student.grades];
    
    // Find if this grade already exists
    this.gradeService.getGrades(student.id, this.getSubjectIdForClass(this.selectedClassId!)).subscribe({
      next: (grades) => {
        const existingGrade = grades.find(g => g.comments && g.comments.includes(gradeType));
        
        if (existingGrade) {
          // Update existing grade
          this.gradeService.updateGrade(existingGrade.id, { 
            score: score,
            comments: `Updated ${gradeType} grade for ${student.name}`
          }).subscribe({
            next: () => {
              console.log(`Grade updated successfully for ${student.name}`);
              // Recalculate average
              this.recalculateAverage(student);
            },
            error: (error) => {
              console.error('Error updating grade:', error);
            }
          });
        } else {
          // Create new grade
          this.gradeService.createGrade({
            score: score,
            comments: `New ${gradeType} grade for ${student.name}`,
            studentId: student.id,
            subjectId: this.getSubjectIdForClass(this.selectedClassId!)
          }).subscribe({
            next: () => {
              console.log(`Grade created successfully for ${student.name}`);
              // Recalculate average
              this.recalculateAverage(student);
            },
            error: (error) => {
              console.error('Error creating grade:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking existing grades:', error);
      }
    });
  }

  // Recalculate a student's average grade
  recalculateAverage(student: StudentWithGrades): void {
    const grades = Object.values(student.grades).filter((g: any) => typeof g === 'number' && g > 0);
    if (grades.length > 0) {
      const sum = grades.reduce((a: number, b: number) => a + b, 0) as number;
      student.grades.average = Math.round(sum / grades.length);
    } else {
      student.grades.average = 0;
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(): void {
    this.showProfileMenu = false;
  }

  logout(): void {
    this.authService.logout();
  }
}

// Interface for student with grades
interface StudentWithGrades {
  id: number;
  name: string;
  grades: {
    assignment1: number;
    assignment2: number;
    midterm: number;
    final: number;
    average: number;
    [key: string]: number; // Add index signature to allow string indexing
  };
}
