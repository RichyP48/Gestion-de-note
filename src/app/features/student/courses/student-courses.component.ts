import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService, Class } from '../../../core/services/class.service';
import { AuthService } from '../../../auth/auth.service';
import { StudentService, StudentSummary } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
template: `
  <div class="min-h-screen flex bg-primary-50">
 

    
      <main class="  w-full  mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">My Courses</h1>
          <p class="text-gray-300">View all your enrolled courses</p>
        </header>
        <!-- Filter Controls -->
        <div class="flex mb-6 items-center space-x-4">
          <div class="flex-1">
            <select 
              [(ngModel)]="selectedSemester" 
              (change)="applyFilters()"
              class="bg-black/30 backdrop-blur-md border border-primary-500/50 text-gray-200 rounded-lg block w-full p-2.5"
            >
              <option [ngValue]="null">All Semesters</option>
              <option *ngFor="let semester of semesters" [value]="semester">{{ semester }}</option>
            </select>
          </div>
          <div class="flex-1">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="applyFilters()"
              placeholder="Search courses..." 
              class="bg-black/30 backdrop-blur-md border border-primary-500/50 text-gray-200 rounded-lg block w-full p-2.5" 
            />
          </div>
        </div>
        <!-- Courses List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let course of filteredCourses" class="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden shadow-glow">
            <div class="px-6 py-5 border-b border-primary-500/30">
              <h3 class="text-xl font-semibold text-white">{{ course.subjectName }}</h3>
              <p class="text-sm text-gray-300">{{ course.classSectionName }}</p>
            </div>
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm text-gray-300">Teacher:</span>
                <span class="text-sm font-medium text-white">{{ course.teacherFullName }}</span>
              </div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm text-gray-300">Semester:</span>
                <span class="text-sm font-medium text-white">{{ course.semesterName }}</span>
              </div>
              <div class="flex items-center justify-between" *ngIf="course.averageGrade !== undefined">
                <span class="text-sm text-gray-300">Current Grade:</span>
                <span [class]="getGradeClass(course.averageGrade)" class="text-sm font-bold">
                  {{ course.averageGrade }}%
                </span>
              </div>
            </div>
            <div class="px-6 py-3 bg-gradient-to-r from-primary-900/40 to-priamry-500/40">
              <a [routerLink]="['/student/grades']" [queryParams]="{courseId: course.classSectionId}" class="text-sm font-medium text-primary-300 hover:text-primary-200">
                View Course Details →
              </a>
            </div>
          </div>
        </div>
        <!-- No courses message -->
        <div *ngIf="filteredCourses.length === 0 && !isLoading" class="bg-black/30 backdrop-blur-md rounded-xl p-8 text-center shadow-glow">
          <p class="text-lg text-white mb-2" *ngIf="searchQuery">No courses match your search criteria.</p>
          <p class="text-lg text-white mb-2" *ngIf="!searchQuery && selectedSemester">No courses found for the selected semester.</p>
          <p class="text-lg text-white mb-2" *ngIf="!searchQuery && !selectedSemester">You are not enrolled in any courses.</p>
        </div>
        <!-- Loading indicator -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </main>
   
  </div>`
//  `
})
export class StudentCoursesComponent implements OnInit {
  // User info
  userEmail: string = 'student@example.com';
  userInitials: string = 'S';
  showProfileMenu: boolean = false;
  
  // Filters
  selectedSemester: string | null = null;
  searchQuery: string = '';
  
  // Data
  studentSummary: StudentSummary | null = null;
  enrolledCourses: any[] = [];
  filteredCourses: any[] = [];
  semesters: string[] = [];
  
  // UI state
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private classService: ClassService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadStudentData();
  }

  loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email.replace('@', '&#64;'); // Escape @ to prevent template parsing issues
      
      // Get initials from username (assuming username could be in the format "firstname.lastname")
      const nameParts = user.username.split(/[\s_.]/);
      if (nameParts.length > 1) {
        this.userInitials = nameParts[0].charAt(0).toUpperCase() + 
                           (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '');
      } else {
        this.userInitials = user.username.substring(0, 2).toUpperCase();
      }
    }
  }

  loadStudentData(): void {
    this.isLoading = true;
    
    this.studentService.getStudentSummary().subscribe({
      next: (summary) => {
        this.studentSummary = summary;
        
        // Update user info with actual data from backend
        this.userEmail = summary.email.replace('@', '&#64;');
        this.userInitials = summary.firstName.charAt(0) + summary.lastName.charAt(0);
        
        // Load enrolled courses
        this.enrolledCourses = summary.enrolledClasses.map(classItem => {
          // Find grades for this course's subject
          const subjectGrades = summary.gradesBySubject[classItem.subjectName] || [];
          
          // Calculate average grade if there are any grades
          let averageGrade;
          if (subjectGrades.length > 0) {
            const totalScore = subjectGrades.reduce((sum, grade) => sum + grade.score, 0);
            averageGrade = Math.round(totalScore / subjectGrades.length);
          }
          
          return {
            ...classItem,
            averageGrade
          };
        });
        
        // Extract unique semesters for the filter dropdown
        this.semesters = [...new Set(this.enrolledCourses.map(course => course.semesterName))];
        
        this.filteredCourses = [...this.enrolledCourses];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student summary:', error);
        this.isLoading = false;
        
        // Fallback to individual API calls if the summary endpoint fails
        this.loadClassesIndividually();
      }
    });
  }
  
  loadClassesIndividually(): void {
    // This is a fallback method if the summary endpoint fails
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.enrolledCourses = classes.map(classItem => {
          // Generate mock data for demo purposes
          return {
            classSectionId: classItem.id,
            classSectionName: classItem.name,
            subjectId: classItem.subjectId,
            subjectName: classItem.subjectName,
            teacherId: classItem.teacherId,
            teacherFullName: classItem.teacherFullName,
            semesterId: 1, // Mock semester ID
            semesterName: 'Fall 2024', // Mock semester name
            averageGrade: 70 + Math.floor(Math.random() * 30) // Random grade between 70-100
          };
        });
        
        // Extract unique semesters for the filter dropdown (mock data)
        this.semesters = ['Fall 2024', 'Spring 2025'];
        
        this.filteredCourses = [...this.enrolledCourses];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredCourses = this.enrolledCourses.filter(course => {
      // Filter by semester if selected
      const semesterMatch = !this.selectedSemester || 
                          course.semesterName === this.selectedSemester;
      
      // Filter by search query
      const searchMatch = !this.searchQuery || 
                        course.subjectName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        course.classSectionName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        course.teacherFullName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return semesterMatch && searchMatch;
    });
  }

  getGradeClass(grade: number): string {
    if (grade >= 90) return 'text-green-400';
    if (grade >= 80) return 'text-blue-400';
    if (grade >= 70) return 'text-yellow-300';
    if (grade >= 60) return 'text-orange-400';
    return 'text-red-400';
  }

  toggleProfile(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(): void {
    this.showProfileMenu = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
