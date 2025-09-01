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
  styles: [` 
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
      `],
 template: `
  <div class="min-h-screen flex bg-white">

    <!-- Sidebar -->
<aside class="w-60 bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white flex flex-col py-6 px-4 min-h-screen sticky top-0 left-0 z-30"
      style="height: 100vh; position: sticky; top: 0; overflow-y: auto;">      
     
      <div class="mb-8 flex items-center gap-2">
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Grade48</span>
      </div>
      <nav class="flex-1">
        <ul class="space-y-2">
          <li>
            <a routerLink="/student" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-700 font-semibold transition-colors">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/grades" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span>📊</span> <span>My Grades</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/courses" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span>📚</span> <span>My Courses</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/calendar" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span>🗓️</span> <span>Calendar</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/messages" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span>💬</span> <span>Messages</span>
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
    <div class="flex-1 flex flex-col min-h-screen bg-white">
      <!-- Navbar -->
      <nav class="bg-white border-b border-purple-100 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                Grade48</span>
            </div>
            <div class="ml-6 flex space-x-8 items-center">
              <span class="text-gray-700 font-semibold">Student Portal</span>
            </div>
            <div class="flex items-center">
              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div>
                  <button (click)="toggleProfile()" class="flex items-center max-w-xs bg-black/10 rounded-full p-1 text-sm focus:outline-none hover:bg-black/20">
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-medium text-white">
                      {{ userInitials }}
                    </div>
                    <span class="ml-2 mr-1 text-sm text-gray-700">{{ userEmail }}</span>
                    <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
                <!-- Profile dropdown panel -->
                <div *ngIf="showProfileMenu" 
                    (mouseleave)="closeProfileMenu()"
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="block px-4 py-2 text-xs text-gray-700">Signed in as</div>
                  <div class="block px-4 py-2 text-sm text-gray-900 border-b">{{ userEmail }}</div>
                  <a routerLink="/student/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- ...existing dashboard content... -->
        <!-- Welcome Banner -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-6 shadow-glow transform hover:scale-[1.01] transition-all">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {{ userName }}!</h1>
              <p class="text-purple-700">{{ currentDate | date:'EEEE, MMMM d, y' }}</p>
              <p class="text-gray-500 mt-2">{{ currentSemesterMessage }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <div class="bg-purple-900/50 rounded-lg p-4 text-center">
                <p class="text-sm text-purple-300">Current GPA</p>
                <p class="text-3xl font-bold text-white">{{ currentGPA }}</p>
                <p class="text-xs text-purple-300">{{ gpaChangeMessage }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- ...rest of the dashboard content (stats, grades, assignments, etc.)... -->
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- ...existing stats cards... -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
            <div class="flex items-center">
              <div class="p-3 bg-purple-900/50 rounded-lg">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-300">Courses Enrolled</p>
                <p class="text-xl font-bold text-gray-900">{{ enrolledCourses.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
            <div class="flex items-center">
              <div class="p-3 bg-blue-900/50 rounded-lg">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-300">Assignments Completed</p>
                <p class="text-xl font-bold text-gray-900">{{ completedAssignments }}/{{ totalAssignments }}</p>
              </div>
            </div>
          </div>
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
            <div class="flex items-center">
              <div class="p-3 bg-green-900/50 rounded-lg">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-300">Attendance Rate</p>
                <p class="text-xl font-bold text-gray-900">{{ attendanceRate }}%</p>
              </div>
            </div>
          </div>
        </div>
        <!-- ...rest of the dashboard content (recent grades, assignments, progress, quick links)... -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- ...recent grades and assignments... -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow overflow-hidden">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Recent Grades</h2>
              <a routerLink="/student/grades" class="text-sm text-purple-400 hover:text-purple-300">View All</a>
            </div>
            <div class="space-y-4">
              <div *ngIf="isLoading" class="text-center py-4">
                <p>Loading grades...</p>
              </div>
              <div *ngIf="!isLoading && recentGrades.length === 0" class="text-center py-4">
                <p>No recent grades found.</p>
              </div>
              <div *ngFor="let grade of recentGrades" class="bg-white/5 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ grade.subjectName }}</h3>
                    <p class="text-sm text-gray-500">{{ grade.comments }}</p>
                    <p class="text-xs text-gray-400">{{ grade.dateAssigned | date }}</p>
                  </div>
                  <div class="text-right">
                    <p [ngClass]="{
                      'text-green-400': grade.score >= 80,
                      'text-yellow-400': grade.score >= 70 && grade.score < 80,
                      'text-red-400': grade.score < 70
                    }" class="text-2xl font-bold">{{ grade.score }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow overflow-hidden">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
              <a routerLink="/student/courses" class="text-sm text-purple-400 hover:text-purple-300">View All</a>
            </div>
            <div class="space-y-4">
              <div *ngFor="let assignment of upcomingAssignments" class="bg-white/5 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ assignment.title }}</h3>
                    <p class="text-sm text-gray-500">{{ assignment.courseName }}</p>
                    <div class="flex items-center mt-1">
                      <svg class="w-4 h-4 text-purple-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p class="text-xs text-gray-400">Due: {{ assignment.dueDate | date }}</p>
                    </div>
                  </div>
                  <div [ngClass]="{
                    'bg-red-900/30 text-red-400': assignment.daysLeft <= 1,
                    'bg-yellow-900/30 text-yellow-400': assignment.daysLeft > 1 && assignment.daysLeft <= 3,
                    'bg-blue-900/30 text-blue-400': assignment.daysLeft > 3
                  }" class="px-2 py-1 rounded-full text-xs">
                    {{ assignment.daysLeft }} day{{ assignment.daysLeft !== 1 ? 's' : '' }} left
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Course Progress -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Course Progress</h2>
            <a routerLink="/student/courses" class="text-sm text-purple-400 hover:text-purple-300">View Details</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let course of enrolledCourses" class="bg-white/5 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <h3 class="font-medium text-gray-900">{{ course.name }}</h3>
                <p [ngClass]="{
                  'text-green-400': course.averageGrade >= 80,
                  'text-yellow-400': course.averageGrade >= 70 && course.averageGrade < 80,
                  'text-red-400': course.averageGrade < 70
                }" class="text-sm">{{ course.averageGrade }}%</p>
              </div>
              <div class="w-full bg-black/30 rounded-full h-2.5 mb-1">
                <div [ngClass]="{
                  'bg-green-500': course.averageGrade >= 80,
                  'bg-yellow-500': course.averageGrade >= 70 && course.averageGrade < 80,
                  'bg-red-500': course.averageGrade < 70
                }" class="h-2.5 rounded-full" [style.width.%]="course.averageGrade"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>{{ course.completed }} / {{ course.total }} assignments completed</span>
                <span>{{ course.completionPercentage }}% completed</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Quick Links -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 hover:from-purple-900/40 hover:to-indigo-900/40 transition-all cursor-pointer shadow-glow">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1">Grade Report</h3>
                <p class="text-sm text-gray-300 mb-2">Download your detailed grade report</p>
                <a routerLink="/student/grades" class="text-xs text-purple-400 hover:text-purple-300">View Report →</a>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-xl p-6 hover:from-blue-900/40 hover:to-cyan-900/40 transition-all cursor-pointer shadow-glow">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1">Calendar</h3>
                <p class="text-sm text-gray-300 mb-2">View your class and exam schedule</p>
                <a routerLink="/student/calendar" class="text-xs text-blue-400 hover:text-blue-300">View Calendar →</a>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-xl p-6 hover:from-green-900/40 hover:to-teal-900/40 transition-all cursor-pointer shadow-glow">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-green-500/20 text-green-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1">Messages</h3>
                <p class="text-sm text-gray-300 mb-2">Contact your teachers and advisors</p>
                <a routerLink="/student/messages" class="text-xs text-green-400 hover:text-green-300">View Messages →</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
 `,

})
export class StudentDashboardComponent implements OnInit {
  // User info
  userName: string = 'Student';
  userEmail: string = 'student@example.com';
  userInitials: string = 'S';
  showProfileMenu: boolean = false;
  
  // Date & Semester
  currentDate: Date = new Date();
  currentSemesterMessage: string = 'Spring Semester 2025 - Week 14';
  
  // Academic info
  currentGPA: string = '3.7';
  gpaChangeMessage: string = '↑ 0.2 from last semester';
  attendanceRate: number = 95;
  completedAssignments: number = 24;
  totalAssignments: number = 30;
  
  // Data
  studentSummary: StudentSummary | null = null;
  enrolledCourses: any[] = [];
  recentGrades: Grade[] = [];
  upcomingAssignments: any[] = [];
  
  // UI state
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
      // Extract name from username or use username as fallback
      this.userName = user.username;
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
        this.userName = `${summary.firstName} ${summary.lastName}`;
        this.userEmail = summary.email.replace('@', '&#64;');
        this.userInitials = summary.firstName.charAt(0) + summary.lastName.charAt(0);
        
        // Format GPA from overall average
        this.currentGPA = (summary.overallAverage / 20).toFixed(1); // Convert percentage to 4.0 scale (approximation)
        
        // Process enrolled classes
        this.enrolledCourses = summary.enrolledClasses.map(classItem => {
          // Calculate data for each course based on grades
          const courseGrades = summary.gradesBySubject[classItem.subjectName] || [];
          const totalGrades = courseGrades.length;
          const avgGrade = totalGrades > 0 
            ? courseGrades.reduce((sum, grade) => sum + grade.score, 0) / totalGrades
            : 0;
            
          // Generate random data for the UI elements that don't have direct API data
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
        
        // Get recent grades (across all subjects)
        const allGrades = Object.values(summary.gradesBySubject).flat();
        this.recentGrades = allGrades
          .sort((a, b) => new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime())
          .slice(0, 4); // Show only the 4 most recent grades
        
        // Calculate actual completed assignments (where we have grades)
        this.completedAssignments = allGrades.length;
        // Set a reasonable number for total assignments
        this.totalAssignments = Math.max(allGrades.length, 30);
        
        // Load upcoming assignments (mock data as it's not in the API)
        this.loadUpcomingAssignments();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student summary:', error);
        this.isLoading = false;
        
        // Fallback to individual API calls if the summary endpoint fails
        this.loadClassesAndGradesIndividually();
      }
    });
  }
  
  loadClassesAndGradesIndividually(): void {
    // This is a fallback method if the summary endpoint fails
    // Load enrolled courses
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.enrolledCourses = classes.map(classItem => {
          // Generate random data for demo purposes
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
        
        // Load recent grades
        this.loadGrades();
        
        // Load upcoming assignments
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
          // Sort by date, most recent first
          this.recentGrades = grades
            .sort((a, b) => new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime())
            .slice(0, 4); // Show only the 4 most recent grades
        },
        error: (error) => {
          console.error('Error loading grades:', error);
        }
      });
    }
  }

  loadUpcomingAssignments(): void {
    // Mock data for upcoming assignments (would be fetched from an API in a real application)
    const today = new Date();
    
    // Create assignments based on enrolled course names
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
    } else {
      this.upcomingAssignments = [
        {
          id: 1,
          title: 'Final Project Submission',
          courseName: 'Computer Science',
          dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          daysLeft: 2
        },
        {
          id: 2,
          title: 'Physics Lab Report',
          courseName: 'Physics Advanced',
          dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
          daysLeft: 1
        },
        {
          id: 3,
          title: 'Research Paper',
          courseName: 'English Literature',
          dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
          daysLeft: 5
        },
        {
          id: 4,
          title: 'Math Problem Set',
          courseName: 'Advanced Calculus',
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
