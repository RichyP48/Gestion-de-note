import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ClassService } from '../../../core/services/class.service';
import { StatisticsService } from '../../../core/services/statistics.service';
import { GradeService } from '../../../core/services/grade.service';


@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
        <!-- Header -->
        <header class="mb-10">
          <h1 class="text-4xl font-black mb-2 animate-fadeIn">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">Teacher Dashboard</span>
          </h1>
          <p class="text-gray-500 animate-slideRight">Manage your classes and student grades efficiently.</p>
        </header>

        <!-- Stats Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div *ngFor="let stat of statsCards; let i = index" 
              [ngClass]="['transform transition-all duration-300 hover:scale-105 hover:rotate-1 cursor-pointer', 'animate-fadeIn']"
              [style.animation-delay]="i * 0.1 + 's'">
            <div class="h-full bg-gradient-to-br rounded-xl overflow-hidden shadow-lg relative">
              <div [ngClass]="[
                i === 0 ? 'from-blue-600/90 to-teal-900/90' : '',
                i === 1 ? 'from-teal-600/90 to-cyan-900/90' : '',
                i === 2 ? 'from-cyan-600/90 to-blue-900/90' : '',
                i === 3 ? 'from-indigo-600/90 to-blue-900/90' : ''
              ]" class="absolute inset-0 bg-gradient-to-br"></div>
              
              <div class="relative h-full p-6 backdrop-blur-sm bg-black/10 flex flex-col justify-between text-white">
                <div class="flex justify-between items-start mb-2">
                  <p class="text-gray-200 font-medium text-sm">{{ stat.title }}</p>
                  <div class="p-2 rounded-lg" [ngClass]="[
                    i === 0 ? 'bg-blue-500/20' : '',
                    i === 1 ? 'bg-teal-500/20' : '',
                    i === 2 ? 'bg-cyan-500/20' : '',
                    i === 3 ? 'bg-indigo-500/20' : ''
                  ]">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path *ngIf="i === 0" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      <path *ngIf="i === 1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      <path *ngIf="i === 2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      <path *ngIf="i === 3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-3xl font-bold">{{ stat.value }}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <span [ngClass]="{
                      'text-green-400': stat.trend > 0,
                      'text-red-400': stat.trend < 0,
                      'text-gray-400': stat.trend === 0
                    }" class="text-xs flex items-center">
                      <span *ngIf="stat.trend > 0">↑</span>
                      <span *ngIf="stat.trend < 0">↓</span>
                      <span *ngIf="stat.trend === 0">=</span>
                      {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                    </span>
                    <span class="text-gray-400 text-xs">vs last semester</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Classes List -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl p-6 shadow-sm h-full">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-900">My Classes</h2>
                <button class="px-3 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white text-sm transition-all">
                  View All
                </button>
              </div>
              <div class="space-y-4">
                <div *ngFor="let class of classes" class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="font-medium text-gray-900">{{ class.name }}</h3>
                      <p class="text-sm text-gray-500">{{ class.students }} students</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm">Avg. Grade: <span [ngClass]="{
                        'text-green-600': class.averageGrade >= 80,
                        'text-yellow-600': class.averageGrade >= 70 && class.averageGrade < 80,
                        'text-red-600': class.averageGrade < 70
                      }">{{ class.averageGrade }}%</span></p>
                      <p class="text-xs text-gray-400">Last updated: {{ class.lastUpdated }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recent Activities -->
          <div>
            <div class="bg-white rounded-xl p-6 shadow-sm h-full">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
              <div class="space-y-4">
                <div *ngFor="let activity of recentActivities" class="relative pl-6 pb-4 border-l border-gray-200">
                  <div class="absolute left-0 top-0 -ml-3 h-6 w-6 rounded-full flex items-center justify-center" [ngClass]="{
                    'bg-green-100 text-green-600': activity.type === 'grade',
                    'bg-blue-100 text-blue-600': activity.type === 'comment',
                    'bg-yellow-100 text-yellow-600': activity.type === 'attendance'
                  }">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path *ngIf="activity.type === 'grade'" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      <path *ngIf="activity.type === 'comment'" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      <path *ngIf="activity.type === 'attendance'" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let action of quickActions; let i = index" 
              class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              [style.animation-delay]="i * 0.1 + 's'"
              routerLink="{{ action.route }}">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg" [ngClass]="{
                'bg-blue-100 text-blue-600': i === 0,
                'bg-teal-100 text-teal-600': i === 1,
                'bg-indigo-100 text-indigo-600': i === 2
              }">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="i === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  <path *ngIf="i === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  <path *ngIf="i === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1 text-gray-900">{{ action.title }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ action.description }}</p>
                <p class="text-xs text-gray-400">{{ action.time }}</p>
              </div>
            </div>
          </div>
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
export class TeacherDashboardComponent implements OnInit {
  showProfileMenu: boolean = false;
  
  statsCards = [
    { title: 'Total Students', value: '124', trend: 8 },
    { title: 'Class Average', value: '78%', trend: 3.2 },
    { title: 'Assignments', value: '32', trend: 0 },
    { title: 'Completion Rate', value: '86%', trend: -2.1 }
  ];
  
  classes = [
    { name: 'Mathematics 101', students: 28, averageGrade: 82, lastUpdated: '2 days ago' },
    { name: 'Physics Advanced', students: 22, averageGrade: 76, lastUpdated: 'Yesterday' },
    { name: 'Computer Science', students: 25, averageGrade: 88, lastUpdated: 'Today' },
    { name: 'Chemistry Lab', students: 18, averageGrade: 72, lastUpdated: '3 days ago' }
  ];
  
  recentActivities = [
    { type: 'grade', description: 'Graded Physics midterm exams', time: '2 hours ago' },
    { type: 'comment', description: 'Left feedback on John Smith\'s project', time: 'Yesterday' },
    { type: 'attendance', description: 'Marked attendance for CS class', time: '2 days ago' },
    { type: 'grade', description: 'Updated Math quiz scores', time: '3 days ago' }
  ];
  
  quickActions = [
    {
      title: 'Enter Grades',
      description: 'Update student grades and assessments',
      time: 'Last entry: Today',
      route: '/teacher/grades'
    },
    {
      title: 'Student Progress',
      description: 'View detailed student performance',
      time: 'Last viewed: Yesterday',
      route: '/teacher/students'
    },
    {
      title: 'Generate Reports',
      description: 'Create reports for classes or students',
      time: 'Last report: 3 days ago',
      route: '/teacher/reports'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private classService: ClassService,
    private statisticsService: StatisticsService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.loadRealData();
  }

  private loadRealData(): void {
    // Implementation for loading real data from services
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}