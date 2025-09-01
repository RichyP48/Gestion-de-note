import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ClassService } from '../../../core/services/class.service';
import { StatisticsService } from '../../../core/services/statistics.service';
import { GradeService } from '../../../core/services/grade.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
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
            <a routerLink="/teacher" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#32b9a9]/40 font-semibold transition-colors">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/teacher/grades" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>📝</span> <span>Grades</span>
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
        <button class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors font-medium" (click)="logout()">
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
              <button class="px-4 py-2 rounded-md bg-teal-700 hover:bg-teal-600 transition-all">
                <span>My Classes</span>
              </button>
              <div class="relative" clickOutside (clickOutside)="showProfileMenu = false">
                <button (click)="toggleProfileMenu()" class="relative h-10 w-10 rounded-full bg-teal-600 overflow-hidden">
                  <span class="absolute inset-0 flex items-center justify-center font-bold text-xl">T</span>
                </button>
                <!-- Profile Dropdown Menu -->
                <div *ngIf="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800 border border-teal-100 animate-fadeIn">
                  <div class="px-4 py-2 border-b border-gray-200">
                    <p class="text-sm font-medium">Teacher User</p>
                    <p class="text-xs text-gray-500">teacher&#64;school.edu</p>
                  </div>
                  <a routerLink="/teacher/profile" class="block px-4 py-2 text-sm hover:bg-teal-100 transition-all">Your Profile</a>
                  <div class="border-t border-gray-200"></div>
                  <a (click)="logout()" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all cursor-pointer">Logout</a>
                </div>
              </div>
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
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">Teacher Dashboard</span>
            </h1>
            <p class="text-gray-300 animate-slideRight">Manage your classes and student grades efficiently.</p>
          </header>

          <!-- Stats Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div *ngFor="let stat of statsCards; let i = index" 
                [ngClass]="['transform transition-all duration-300 hover:scale-105 hover:rotate-1 cursor-pointer', 'animate-fadeIn']"
                [style.animation-delay]="i * 0.1 + 's'">
              <div class="h-full bg-gradient-to-br rounded-xl overflow-hidden shadow-glow relative">
                <!-- Custom gradients for each card -->
                <div [ngClass]="[
                  i === 0 ? 'from-blue-600/90 to-teal-900/90' : '',
                  i === 1 ? 'from-teal-600/90 to-cyan-900/90' : '',
                  i === 2 ? 'from-cyan-600/90 to-blue-900/90' : '',
                  i === 3 ? 'from-indigo-600/90 to-blue-900/90' : ''
                ]" class="absolute inset-0 bg-gradient-to-br"></div>
                
                <!-- Glass effect -->
                <div class="relative h-full p-6 backdrop-blur-sm bg-black/10 flex flex-col justify-between">
                  <div class="flex justify-between items-start mb-2">
                    <p class="text-gray-200 font-medium text-sm">{{ stat.title }}</p>
                    <div class="p-2 rounded-lg" [ngClass]="[
                      i === 0 ? 'bg-blue-500/20' : '',
                      i === 1 ? 'bg-teal-500/20' : '',
                      i === 2 ? 'bg-cyan-500/20' : '',
                      i === 3 ? 'bg-indigo-500/20' : ''
                    ]">
                      <span class="text-lg">{{ stat.icon }}</span>
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
              <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow h-full">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-bold text-white">My Classes</h2>
                  <button class="px-3 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white text-sm transition-all">
                    View All
                  </button>
                </div>
                <div class="space-y-4">
                  <div *ngFor="let class of classes" class="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                    <div class="flex justify-between items-center">
                      <div>
                        <h3 class="font-medium">{{ class.name }}</h3>
                        <p class="text-sm text-gray-300">{{ class.students }} students</p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm">Avg. Grade: <span [ngClass]="{
                          'text-green-400': class.averageGrade >= 80,
                          'text-yellow-400': class.averageGrade >= 70 && class.averageGrade < 80,
                          'text-red-400': class.averageGrade < 70
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
              <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow h-full">
                <h2 class="text-xl font-bold text-white mb-4">Recent Activities</h2>
                <div class="space-y-4">
                  <div *ngFor="let activity of recentActivities" class="relative pl-6 pb-4 border-l border-gray-700">
                    <div class="absolute left-0 top-0 -ml-3 h-6 w-6 rounded-full flex items-center justify-center" [ngClass]="{
                      'bg-green-500/20 text-green-400': activity.type === 'grade',
                      'bg-blue-500/20 text-blue-400': activity.type === 'comment',
                      'bg-yellow-500/20 text-yellow-400': activity.type === 'attendance'
                    }">
                      <span class="text-xs">{{ 
                        activity.type === 'grade' ? '📝' : 
                        activity.type === 'comment' ? '💬' : '📅' 
                      }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ activity.description }}</p>
                      <p class="text-xs text-gray-400">{{ activity.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let action of quickActions; let i = index" 
                class="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-glow hover:bg-white/10 transition-all cursor-pointer"
                [style.animation-delay]="i * 0.1 + 's'"
                routerLink="{{ action.route }}">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-lg" [ngClass]="{
                  'bg-blue-500/20 text-blue-400': i === 0,
                  'bg-teal-500/20 text-teal-400': i === 1,
                  'bg-indigo-500/20 text-indigo-400': i === 2
                }">
                  <span class="text-2xl">{{ action.icon }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1">{{ action.title }}</h3>
                  <p class="text-sm text-gray-300 mb-2">{{ action.description }}</p>
                  <p class="text-xs text-gray-400">{{ action.time }}</p>
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
export class TeacherDashboardComponent implements OnInit {
  showProfileMenu: boolean = false;
  
  // Stats cards data
  statsCards = [
    { title: 'Total Students', value: '124', trend: 8, icon: '👨‍🎓' },
    { title: 'Class Average', value: '78%', trend: 3.2, icon: '📊' },
    { title: 'Assignments', value: '32', trend: 0, icon: '📝' },
    { title: 'Completion Rate', value: '86%', trend: -2.1, icon: '📈' }
  ];
  
  // Classes data
  classes = [
    { name: 'Mathematics 101', students: 28, averageGrade: 82, lastUpdated: '2 days ago' },
    { name: 'Physics Advanced', students: 22, averageGrade: 76, lastUpdated: 'Yesterday' },
    { name: 'Computer Science', students: 25, averageGrade: 88, lastUpdated: 'Today' },
    { name: 'Chemistry Lab', students: 18, averageGrade: 72, lastUpdated: '3 days ago' }
  ];
  
  // Recent activities
  recentActivities = [
    { type: 'grade', description: 'Graded Physics midterm exams', time: '2 hours ago' },
    { type: 'comment', description: 'Left feedback on John Smith\'s project', time: 'Yesterday' },
    { type: 'attendance', description: 'Marked attendance for CS class', time: '2 days ago' },
    { type: 'grade', description: 'Updated Math quiz scores', time: '3 days ago' }
  ];
  
  // Quick actions
  quickActions = [
    {
      icon: '📝',
      title: 'Enter Grades',
      description: 'Update student grades and assessments',
      time: 'Last entry: Today',
      route: '/teacher/grades'
    },
    {
      icon: '👨‍🎓',
      title: 'Student Progress',
      description: 'View detailed student performance',
      time: 'Last viewed: Yesterday',
      route: '/teacher/students'
    },
    {
      icon: '📊',
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
    // In a real application, we would load data from services
    this.loadRealData();
  }

  private loadRealData(): void {
    // This would be implemented to fetch real data from the server
    // For now, we're using the mock data initialized above
  }

  // Toggle profile dropdown menu
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  // Handle user logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
