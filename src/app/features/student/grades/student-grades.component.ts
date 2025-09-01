import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GradeService, Grade } from '../../../core/services/grade.service';
import { ClassService, Class } from '../../../core/services/class.service';
import { AuthService } from '../../../auth/auth.service';
import { StudentService, StudentSummary } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-grades',
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
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Grade48</span>
      </div>
      <nav class="flex-1 hide-scrollbar" style="overflow-y: auto;">
        <ul class="space-y-2">
          <li>
            <a routerLink="/student" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/grades" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#32b9a9]/40 font-semibold transition-colors">
              <span>📊</span> <span>My Grades</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/courses" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>📚</span> <span>My Courses</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/calendar" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>🗓️</span> <span>Calendar</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/messages" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
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
    <div class="flex-1 flex flex-col min-h-screen  text-white">
      <!-- Navbar -->
      <nav class="bg-black/30 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                Grade48</span>
            </div>
            <div class="ml-6 flex space-x-8 items-center">
              <span class="text-gray-200 font-semibold">Student Portal</span>
            </div>
            <div class="flex items-center">
              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div>
                  <button (click)="toggleProfile()" class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm shadow-lg focus:outline-none" aria-expanded="false" aria-haspopup="true">
                    <span class="sr-only">Open user menu</span>
                    <span>{{ userInitials }}</span>
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
        <!-- Header -->
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">My Grades</h1>
          <p class="text-gray-300">View and track your academic performance across all courses.</p>
        </header>
        <!-- Filters -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-6 shadow-glow">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex-1">
              <label for="semester" class="block text-sm font-medium text-gray-300 mb-1">Semester</label>
              <select id="semester" [(ngModel)]="selectedSemester" class="w-full bg-black/30 border border-purple-500/30 rounded-md px-3 py-2 text-white">
                <option [ngValue]="null">All Semesters</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2024">Spring 2024</option>
              </select>
            </div>
            <div class="flex-1">
              <label for="course" class="block text-sm font-medium text-gray-300 mb-1">Course</label>
              <select id="course" [(ngModel)]="selectedCourseId" class="w-full bg-black/30 border border-purple-500/30 rounded-md px-3 py-2 text-white">
                <option [ngValue]="null">All Courses</option>
                <option *ngFor="let course of enrolledCourses" [value]="course.id">{{ course.name }}</option>
              </select>
            </div>
            <div class="flex-1">
              <label for="gradeType" class="block text-sm font-medium text-gray-300 mb-1">Grade Type</label>
              <select id="gradeType" [(ngModel)]="selectedGradeType" class="w-full bg-black/30 border border-purple-500/30 rounded-md px-3 py-2 text-white">
                <option value="all">All Types</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div class="flex items-end">
              <button (click)="applyFilters()" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        <!-- GPA Card -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-6 shadow-glow">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white mb-2">Semester GPA Overview</h2>
              <p class="text-gray-300">Your current academic standing</p>
            </div>
            <div class="flex gap-6 mt-4 md:mt-0">
              <div class="bg-purple-900/50 rounded-lg p-4 text-center min-w-[120px]">
                <p class="text-sm text-purple-300">Current GPA</p>
                <p class="text-3xl font-bold text-white">{{ currentGPA }}</p>
                <p class="text-xs text-purple-300">{{ gpaChangeMessage }}</p>
              </div>
              <div class="bg-blue-900/50 rounded-lg p-4 text-center min-w-[120px]">
                <p class="text-sm text-blue-300">Cumulative GPA</p>
                <p class="text-3xl font-bold text-white">{{ cumulativeGPA }}</p>
                <p class="text-xs text-blue-300">Overall standing</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Grades Table -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow overflow-hidden">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-white">Grade Details</h2>
            <button class="text-sm text-purple-400 hover:text-purple-300 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Download Report
            </button>
          </div>
          <div *ngIf="isLoading" class="text-center py-8">
            <p class="text-lg">Loading grades...</p>
          </div>
          <div *ngIf="!isLoading && filteredGrades.length === 0" class="text-center py-8">
            <p class="text-lg">No grades found matching your criteria.</p>
          </div>
          <div *ngIf="!isLoading && filteredGrades.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assignment</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Grade</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Comments</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700 bg-black/20">
                <tr *ngFor="let grade of filteredGrades" class="hover:bg-white/5 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">{{ grade.subjectName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ getAssignmentName(grade) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ grade.dateAssigned | date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="{
                      'text-green-400': grade.score >= 80,
                      'text-yellow-400': grade.score >= 70 && grade.score < 80,
                      'text-red-400': grade.score < 70
                    }" class="font-bold">{{ grade.score }}%</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-300">{{ grade.comments }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Grade Distribution -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <!-- Grade Distribution Card -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
            <h2 class="text-xl font-bold text-white mb-4">Grade Distribution</h2>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="w-20 text-sm text-gray-300">A (90-100%)</div>
                <div class="flex-1 ml-2">
                  <div class="w-full bg-black/30 rounded-full h-2.5">
                    <div class="bg-green-500 h-2.5 rounded-full" [style.width.%]="gradeDistribution.a"></div>
                  </div>
                </div>
                <div class="ml-2 text-sm text-gray-300">{{ gradeDistribution.a }}%</div>
              </div>
              <div class="flex items-center">
                <div class="w-20 text-sm text-gray-300">B (80-89%)</div>
                <div class="flex-1 ml-2">
                  <div class="w-full bg-black/30 rounded-full h-2.5">
                    <div class="bg-blue-500 h-2.5 rounded-full" [style.width.%]="gradeDistribution.b"></div>
                  </div>
                </div>
                <div class="ml-2 text-sm text-gray-300">{{ gradeDistribution.b }}%</div>
              </div>
              <div class="flex items-center">
                <div class="w-20 text-sm text-gray-300">C (70-79%)</div>
                <div class="flex-1 ml-2">
                  <div class="w-full bg-black/30 rounded-full h-2.5">
                    <div class="bg-yellow-500 h-2.5 rounded-full" [style.width.%]="gradeDistribution.c"></div>
                  </div>
                </div>
                <div class="ml-2 text-sm text-gray-300">{{ gradeDistribution.c }}%</div>
              </div>
              <div class="flex items-center">
                <div class="w-20 text-sm text-gray-300">D (60-69%)</div>
                <div class="flex-1 ml-2">
                  <div class="w-full bg-black/30 rounded-full h-2.5">
                    <div class="bg-orange-500 h-2.5 rounded-full" [style.width.%]="gradeDistribution.d"></div>
                  </div>
                </div>
                <div class="ml-2 text-sm text-gray-300">{{ gradeDistribution.d }}%</div>
              </div>
              <div class="flex items-center">
                <div class="w-20 text-sm text-gray-300">F (0-59%)</div>
                <div class="flex-1 ml-2">
                  <div class="w-full bg-black/30 rounded-full h-2.5">
                    <div class="bg-red-500 h-2.5 rounded-full" [style.width.%]="gradeDistribution.f"></div>
                  </div>
                </div>
                <div class="ml-2 text-sm text-gray-300">{{ gradeDistribution.f }}%</div>
              </div>
            </div>
          </div>
          <!-- Course Performance -->
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
            <h2 class="text-xl font-bold text-white mb-4">Course Performance</h2>
            <div class="space-y-4">
              <div *ngFor="let course of coursePerformance" class="bg-white/5 p-4 rounded-lg">
                <div class="flex justify-between mb-2">
                  <h3 class="font-medium text-white">{{ course.name }}</h3>
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
                <div class="text-xs text-gray-400">
                  <span>{{ course.gradeCount }} grades</span>
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
export class StudentGradesComponent implements OnInit {
  // User info
  userEmail: string = 'student@example.com';
  userInitials: string = 'S';
  showProfileMenu: boolean = false;
  
  // Academic info
  currentGPA: string = '3.7';
  cumulativeGPA: string = '3.5';
  gpaChangeMessage: string = '↑ 0.2 from last semester';
  
  // Filters
  selectedSemester: string | null = null;
  selectedCourseId: number | null = null;
  selectedGradeType: string = 'all';
  
  // Data
  studentSummary: StudentSummary | null = null;
  enrolledCourses: any[] = [];
  allGrades: Grade[] = [];
  filteredGrades: Grade[] = [];
  
  // Grade distribution
  gradeDistribution = {
    a: 25,
    b: 35,
    c: 20,
    d: 10,
    f: 10
  };
  
  // Course performance
  coursePerformance: any[] = [];
  
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
        
        // Format GPA from overall average (approximate conversion from percentage to 4.0 scale)
        this.currentGPA = (summary.overallAverage / 20).toFixed(1);
        this.cumulativeGPA = (summary.overallAverage / 20 - 0.2).toFixed(1); // For demo purposes
        
        // Load enrolled courses
        this.enrolledCourses = summary.enrolledClasses.map(classItem => ({
          id: classItem.classSectionId,
          name: `${classItem.subjectName} (${classItem.classSectionName})`,
          subjectId: classItem.subjectId,
          subjectName: classItem.subjectName,
          teacherName: classItem.teacherFullName,
          semester: classItem.semesterName
        }));
        
        // Collect all grades from all subjects
        this.allGrades = Object.values(summary.gradesBySubject).flat();
        this.filteredGrades = [...this.allGrades];
        
        // Calculate course performance
        this.calculateCoursePerformance();
        
        // Calculate grade distribution
        this.calculateGradeDistribution();
        
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
        this.enrolledCourses = classes;
        
        // Load grades
        this.loadGrades();
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
          this.allGrades = grades;
          this.filteredGrades = [...grades];
          
          // Calculate course performance
          this.calculateCoursePerformance();
          
          // Calculate grade distribution
          this.calculateGradeDistribution();
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading grades:', error);
          this.isLoading = false;
        }
      });
    }
  }

  calculateCoursePerformance(): void {
    if (this.studentSummary) {
      // Use the gradesBySubject data from the summary
      this.coursePerformance = Object.entries(this.studentSummary.gradesBySubject).map(([subjectName, grades]) => {
        const total = grades.reduce((sum, grade) => sum + grade.score, 0);
        const average = grades.length > 0 ? total / grades.length : 0;
        
        return {
          name: subjectName,
          averageGrade: Math.round(average),
          gradeCount: grades.length
        };
      });
    } else {
      // Fallback to the old method
      const courseMap = new Map<number, { name: string, grades: Grade[] }>();
      
      // Group grades by subject
      this.allGrades.forEach(grade => {
        if (!courseMap.has(grade.subjectId)) {
          courseMap.set(grade.subjectId, { 
            name: grade.subjectName,
            grades: []
          });
        }
        
        courseMap.get(grade.subjectId)?.grades.push(grade);
      });
      
      // Calculate average grade for each course
      this.coursePerformance = Array.from(courseMap.values()).map(course => {
        const total = course.grades.reduce((sum, grade) => sum + grade.score, 0);
        const average = course.grades.length > 0 ? total / course.grades.length : 0;
        
        return {
          name: course.name,
          averageGrade: Math.round(average),
          gradeCount: course.grades.length
        };
      });
    }
  }

  calculateGradeDistribution(): void {
    const totalGrades = this.allGrades.length;
    if (totalGrades === 0) return;
    
    let aCount = 0, bCount = 0, cCount = 0, dCount = 0, fCount = 0;
    
    this.allGrades.forEach(grade => {
      if (grade.score >= 90) aCount++;
      else if (grade.score >= 80) bCount++;
      else if (grade.score >= 70) cCount++;
      else if (grade.score >= 60) dCount++;
      else fCount++;
    });
    
    this.gradeDistribution = {
      a: Math.round((aCount / totalGrades) * 100),
      b: Math.round((bCount / totalGrades) * 100),
      c: Math.round((cCount / totalGrades) * 100),
      d: Math.round((dCount / totalGrades) * 100),
      f: Math.round((fCount / totalGrades) * 100)
    };
  }

  applyFilters(): void {
    this.filteredGrades = this.allGrades.filter(grade => {
      // Filter by subject/course if selected
      const courseMatch = !this.selectedCourseId || 
                         grade.subjectId === Number(this.selectedCourseId);
      
      // Filter by grade type if selected
      let typeMatch = true;
      if (this.selectedGradeType !== 'all') {
        typeMatch = grade.comments?.toLowerCase().includes(this.selectedGradeType.toLowerCase()) || false;
      }
      
      // Filter by semester if selected (based on the enrolledClasses data)
      let semesterMatch = true;
      if (this.selectedSemester && this.studentSummary) {
        // Find the class section for this grade
        const classSection = this.studentSummary.enrolledClasses.find(c => 
          c.subjectId === grade.subjectId
        );
        
        // Check if the semester matches the selected one
        if (classSection) {
          semesterMatch = classSection.semesterName === this.selectedSemester;
        }
      }
      
      return courseMatch && typeMatch && semesterMatch;
    });
  }

  getAssignmentName(grade: Grade): string {
    // Extract assignment name from comments or return a default
    if (grade.comments) {
      // Try to extract assignment name based on patterns in the comments
      if (grade.comments.includes('Assignment')) {
        return 'Assignment';
      } else if (grade.comments.includes('Quiz')) {
        return 'Quiz';
      } else if (grade.comments.includes('Exam')) {
        return 'Exam';
      } else if (grade.comments.includes('Project')) {
        return 'Project';
      } else if (grade.comments.includes('Midterm')) {
        return 'Midterm';
      } else if (grade.comments.includes('Final')) {
        return 'Final Exam';
      }
    }
    
    return 'Assignment';
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
