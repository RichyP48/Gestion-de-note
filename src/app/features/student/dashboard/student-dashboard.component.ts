import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GradeService, Grade } from '../../../core/services/grade.service';
import { ClassService, Class } from '../../../core/services/class.service';
import { AuthService } from '../../../auth/auth.service';
import { StudentService, StudentSummary } from '../../../core/services/student.service';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">Welcome back, {{ userName }}!</h1>
              <p class="text-blue-100">{{ currentDate | date:'EEEE, MMMM d, y' }}</p>
              <p class="text-blue-200 mt-2">{{ currentSemesterMessage }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <div class="bg-white/20 rounded-lg p-4 text-center">
                <p class="text-sm text-blue-100">Current GPA</p>
                <p class="text-3xl font-bold">{{ currentGPA }}</p>
                <p class="text-xs text-blue-200">{{ gpaChangeMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Courses Enrolled</p>
                <p class="text-xl font-bold text-gray-900">{{ enrolledCourses.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Assignments Completed</p>
                <p class="text-xl font-bold text-gray-900">{{ completedAssignments }}/{{ totalAssignments }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Attendance Rate</p>
                <p class="text-xl font-bold text-gray-900">{{ attendanceRate }}%</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Recent Grades -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Recent Grades</h2>
              <a routerLink="/student/grades" class="text-sm text-blue-600 hover:text-blue-500">View All</a>
            </div>
            <div class="space-y-4">
              <div *ngIf="isLoading" class="text-center py-4">
                <p>Loading grades...</p>
              </div>
              <div *ngIf="!isLoading && recentGrades.length === 0" class="text-center py-4">
                <p>No recent grades found.</p>
              </div>
              <div *ngFor="let grade of recentGrades" class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ grade.subjectName }}</h3>
                    <p class="text-sm text-gray-500">{{ grade.comments }}</p>
                    <p class="text-xs text-gray-400">{{ grade.dateAssigned | date }}</p>
                  </div>
                  <div class="text-right">
                    <p [ngClass]="{
                      'text-green-600': grade.score >= 80,
                      'text-yellow-600': grade.score >= 70 && grade.score < 80,
                      'text-red-600': grade.score < 70
                    }" class="text-2xl font-bold">{{ grade.score }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Assignments -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
              <a routerLink="/student/courses" class="text-sm text-blue-600 hover:text-blue-500">View All</a>
            </div>
            <div class="space-y-4">
              <div *ngFor="let assignment of upcomingAssignments" class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ assignment.title }}</h3>
                    <p class="text-sm text-gray-500">{{ assignment.courseName }}</p>
                    <div class="flex items-center mt-1">
                      <svg class="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p class="text-xs text-gray-400">Due: {{ assignment.dueDate | date }}</p>
                    </div>
                  </div>
                  <div [ngClass]="{
                    'bg-red-100 text-red-800': assignment.daysLeft <= 1,
                    'bg-yellow-100 text-yellow-800': assignment.daysLeft > 1 && assignment.daysLeft <= 3,
                    'bg-blue-100 text-blue-800': assignment.daysLeft > 3
                  }" class="px-2 py-1 rounded-full text-xs">
                    {{ assignment.daysLeft }} day{{ assignment.daysLeft !== 1 ? 's' : '' }} left
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Progress -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Course Progress</h2>
            <a routerLink="/student/courses" class="text-sm text-blue-600 hover:text-blue-500">View Details</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let course of enrolledCourses" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <h3 class="font-medium text-gray-900">{{ course.name }}</h3>
                <p [ngClass]="{
                  'text-green-600': course.averageGrade >= 80,
                  'text-yellow-600': course.averageGrade >= 70 && course.averageGrade < 80,
                  'text-red-600': course.averageGrade < 70
                }" class="text-sm">{{ course.averageGrade }}%</p>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div [ngClass]="{
                  'bg-green-500': course.averageGrade >= 80,
                  'bg-yellow-500': course.averageGrade >= 70 && course.averageGrade < 80,
                  'bg-red-500': course.averageGrade < 70
                }" class="h-2.5 rounded-full" [style.width.%]="course.averageGrade"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>{{ course.completed }} / {{ course.total }} assignments completed</span>
                <span>{{ course.completionPercentage }}% completed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white hover:from-purple-600 hover:to-indigo-700 transition-all cursor-pointer">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-white/20">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1">Grade Report</h3>
                <p class="text-sm text-purple-100 mb-2">Download your detailed grade report</p>
                <a routerLink="/student/grades" class="text-xs text-purple-200 hover:text-white">View Report →</a>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white hover:from-blue-600 hover:to-cyan-700 transition-all cursor-pointer">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-white/20">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1">Calendar</h3>
                <p class="text-sm text-blue-100 mb-2">View your class and exam schedule</p>
                <a routerLink="/student/calendar" class="text-xs text-blue-200 hover:text-white">View Calendar →</a>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white hover:from-green-600 hover:to-teal-700 transition-all cursor-pointer">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-white/20">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1">Messages</h3>
                <p class="text-sm text-green-100 mb-2">Contact your teachers and advisors</p>
                <a routerLink="/student/messages" class="text-xs text-green-200 hover:text-white">View Messages →</a>
              </div>
            </div>
          </div>
        </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  userName: string = 'Student';
  userEmail: string = 'student@example.com';
  userInitials: string = 'S';
  showProfileMenu: boolean = false;
  
  currentDate: Date = new Date();
  currentSemesterMessage: string = 'Spring Semester 2025 - Week 14';
  
  currentGPA: string = '3.7';
  gpaChangeMessage: string = '↑ 0.2 from last semester';
  attendanceRate: number = 95;
  completedAssignments: number = 24;
  totalAssignments: number = 30;
  
  studentSummary: StudentSummary | null = null;
  enrolledCourses: any[] = [];
  recentGrades: Grade[] = [];
  upcomingAssignments: any[] = [];
  
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private gradeService: GradeService,
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
      this.userName = user.username;
      this.userEmail = user.email.replace('@', '&#64;');
      
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
        
        this.userName = `${summary.firstName} ${summary.lastName}`;
        this.userEmail = summary.email.replace('@', '&#64;');
        this.userInitials = summary.firstName.charAt(0) + summary.lastName.charAt(0);
        
        this.currentGPA = (summary.overallAverage / 20).toFixed(1);
        
        this.enrolledCourses = summary.enrolledClasses.map(classItem => {
          const courseGrades = summary.gradesBySubject[classItem.subjectName] || [];
          const totalGrades = courseGrades.length;
          const avgGrade = totalGrades > 0 
            ? courseGrades.reduce((sum, grade) => sum + grade.score, 0) / totalGrades
            : 0;
            
          const completed = Math.floor(Math.random() * 10) + 5;
          const total = completed + Math.floor(Math.random() * 5) + 2;
          const completionPercentage = Math.round((completed / total) * 100);
          
          return {
            id: classItem.classSectionId,
            name: `${classItem.subjectName} (${classItem.classSectionName})`,
            teacherName: classItem.teacherFullName,
            completed: completed,
            total: total,
            completionPercentage: completionPercentage,
            averageGrade: Math.round(avgGrade)
          };
        });
        
        const allGrades = Object.values(summary.gradesBySubject).flat();
        this.recentGrades = allGrades
          .sort((a, b) => new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime())
          .slice(0, 4);
        
        this.completedAssignments = allGrades.length;
        this.totalAssignments = Math.max(allGrades.length, 30);
        
        this.loadUpcomingAssignments();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student summary:', error);
        this.isLoading = false;
        this.loadClassesAndGradesIndividually();
      }
    });
  }
  
  loadClassesAndGradesIndividually(): void {
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.enrolledCourses = classes.map(classItem => {
          const completed = Math.floor(Math.random() * 10) + 5;
          const total = completed + Math.floor(Math.random() * 5) + 2;
          const completionPercentage = Math.round((completed / total) * 100);
          const averageGrade = 65 + Math.floor(Math.random() * 30);
          
          return {
            id: classItem.id,
            name: classItem.name,
            teacherName: classItem.teacherFullName,
            completed: completed,
            total: total,
            completionPercentage: completionPercentage,
            averageGrade: averageGrade
          };
        });
        
        this.loadGrades();
        this.loadUpcomingAssignments();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.isLoading = false;
      }
    });
  }

  loadGrades(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.gradeService.getGrades(user.id).subscribe({
        next: (grades) => {
          this.recentGrades = grades
            .sort((a, b) => new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime())
            .slice(0, 4);
        },
        error: (error) => {
          console.error('Error loading grades:', error);
        }
      });
    }
  }

  loadUpcomingAssignments(): void {
    const today = new Date();
    
    if (this.enrolledCourses.length > 0) {
      this.upcomingAssignments = [
        {
          id: 1,
          title: 'Final Project Submission',
          courseName: this.enrolledCourses[0]?.name || 'Computer Science',
          dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          daysLeft: 2
        },
        {
          id: 2,
          title: 'Lab Report',
          courseName: this.enrolledCourses[1]?.name || 'Physics Advanced',
          dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
          daysLeft: 1
        },
        {
          id: 3,
          title: 'Research Paper',
          courseName: this.enrolledCourses[2]?.name || 'English Literature',
          dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
          daysLeft: 5
        },
        {
          id: 4,
          title: 'Problem Set',
          courseName: this.enrolledCourses[0]?.name || 'Advanced Calculus',
          dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
          daysLeft: 3
        }
      ];
    }
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