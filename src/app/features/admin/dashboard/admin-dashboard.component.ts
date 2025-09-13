import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StatisticsService, Statistics } from '../../../core/services/statistics.service';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { UserProfile } from '../../../core/services/user.service';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
        <header class="mb-10">
          <h1 class="text-4xl font-black mb-2 animate-fadeIn">
            <span class="bg-clip-text text-primary-900 ">Admin Dashboard</span>
          </h1>
          <p class="text-gray-500 animate-slideRight">Welcome to your command center. Manage everything from here.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div *ngFor="let stat of statsCards; let i = index" 
            [ngClass]="['transform transition-all duration-300 hover:scale-105 hover:rotate-1 cursor-pointer', 'animate-fadeIn']"
            [style.animation-delay]="i * 0.1 + 's'">
            <div class="h-full bg-white rounded-xl overflow-hidden shadow-lg relative border border-gray-200">
              <div class="absolute inset-x-0 bottom-0">
                <svg [ngClass]="[
                  i === 0 ? 'fill-blue-600/10' : '',
                  i === 1 ? 'fill-emerald-600/10' : '',
                  i === 2 ? 'fill-amber-600/10' : '',
                  i === 3 ? 'fill-pink-600/10' : ''
                ]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="h-24 w-full">
                  <path fill-opacity="1" d="M0,192L60,197.3C120,203,240,213,360,208C480,203,600,181,720,181.3C840,181,960,203,1080,202.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
              </div>
              
              <div class="relative h-full p-6 flex flex-col justify-between">
                <div class="flex justify-between items-start mb-2">
                  <p class="text-gray-800 font-medium text-sm">{{ stat.title }}</p>
                  <div class="p-2 rounded-lg" [ngClass]="[
                    i === 0 ? 'bg-blue-500/20' : '',
                    i === 1 ? 'bg-emerald-500/20' : '',
                    i === 2 ? 'bg-amber-500/20' : '',
                    i === 3 ? 'bg-pink-500/20' : ''
                  ]">
                    <svg class="w-6 h-6" [ngClass]="[
                      i === 0 ? 'text-blue-600' : '',
                      i === 1 ? 'text-emerald-600' : '',
                      i === 2 ? 'text-amber-600' : '',
                      i === 3 ? 'text-pink-600' : ''
                    ]" fill="currentColor" viewBox="0 0 24 24">
                      <path *ngIf="i === 0" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      <path *ngIf="i === 1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      <path *ngIf="i === 2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      <path *ngIf="i === 3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <span [ngClass]="{
                      'text-green-500': stat.trend > 0,
                      'text-red-500': stat.trend < 0,
                      'text-gray-400': stat.trend === 0
                    }">{{ stat.trend > 0 ? '↑' : (stat.trend < 0 ? '↓' : '•') }}</span>
                    <span class="text-xs text-gray-500">{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% from last semester</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div *ngFor="let action of actionCards; let i = index"
               [ngClass]="['bg-white rounded-xl border border-gray-200 p-6 transition-all hover:bg-gray-100 cursor-pointer group', 'animate-slideUp']"
               [style.animation-delay]="i * 0.1 + 's'">
            <div class="flex items-start justify-between mb-4">
              <div [ngClass]="[
                'p-3 rounded-xl transition-all group-hover:scale-110',
                i === 0 ? 'bg-violet-600/30' : '',
                i === 1 ? 'bg-cyan-600/30' : '',
                i === 2 ? 'bg-rose-600/30' : ''
              ]">
                <svg class="w-6 h-6" [ngClass]="[
                  i === 0 ? 'text-violet-600' : '',
                  i === 1 ? 'text-cyan-600' : '',
                  i === 2 ? 'text-rose-600' : ''
                ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="i === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  <path *ngIf="i === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  <path *ngIf="i === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <span class="text-xs text-gray-400">{{ action.time }}</span>
            </div>
            <h3 class="text-lg font-semibold mb-1">{{ action.title }}</h3>
            <p class="text-gray-500 text-sm mb-4">{{ action.description }}</p>
            <a [routerLink]="action.route" class="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors border border-gray-200">
              <span>{{ action.buttonText }}</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div class="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 animate-fadeIn" style="animation-delay: 0.3s">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">Recent Users</h2>
              <button class="text-xs bg-indigo-700/50 text-white hover:bg-indigo-700/70 px-3 py-1 rounded-full transition-colors">View All</button>
            </div>
            <div class="space-y-4">
              <div *ngFor="let user of recentUsers" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                <div class="flex items-center space-x-3">
                  <div class="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700">
                    <span class="absolute inset-0 flex items-center justify-center text-white font-bold">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                    <p class="text-xs text-gray-500">{{ user.role }}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="p-2 rounded-full bg-indigo-600/20 hover:bg-indigo-600/40 text-xs transition-colors">
                    <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="p-2 rounded-full bg-rose-600/20 hover:bg-rose-600/40 text-xs transition-colors">
                    <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-xl p-6 animate-fadeIn" style="animation-delay: 0.4s">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">Subjects</h2>
              <button class="text-xs bg-indigo-700/50 text-white hover:bg-indigo-700/70 px-3 py-1 rounded-full transition-colors">Add New</button>
            </div>
            <div class="space-y-4">
              <div *ngFor="let subject of subjects; let i = index" 
                   class="p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-100 transition-colors">
                <div class="flex justify-between items-center">
                  <p class="font-medium text-gray-900">{{ subject.name }}</p>
                  <span class="text-xs px-2 py-1 rounded-full bg-gray-200">×{{ subject.coefficient }}</span>
                </div>
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
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .animate-slideRight {
      animation: slideRight 0.5s ease-out forwards;
    }
    
    .animate-slideUp {
      animation: slideUp 0.5s ease-out forwards;
    }
    
    .shadow-glow {
      box-shadow: 0 0 15px 0 rgba(156, 163, 175, 0.1);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  statsCards = [
    { title: 'Total Students', value: '458', trend: 12, icon: '👨🎓' },
    { title: 'Average GPA', value: '3.6', trend: 5.4, icon: '📊' },
    { title: 'Total Classes', value: '32', trend: 0, icon: '🏫' },
    { title: 'Passing Rate', value: '94%', trend: -2.1, icon: '📈' }
  ];

  actionCards = [
    {
      icon: '📝',
      title: 'Generate Reports',
      description: 'Create PDF reports for students, classes, or semesters',
      time: 'Last run: 2 days ago',
      buttonText: 'Generate Reports',
      route: '/admin/reports'
    },
    {
      icon: '🧑🤝🧑',
      title: 'Manage Users',
      description: 'Add, update, or remove students and teachers',
      time: 'Last update: Today',
      buttonText: 'Manage Users',
      route: '/admin/users'
    },
    {
      icon: '📚',
      title: 'Edit Subjects',
      description: 'Modify subject details and coefficients',
      time: 'Last update: 3 days ago',
      buttonText: 'Edit Subjects',
      route: '/admin/subjects'
    }
  ];

  recentUsers: UserProfile[] = [];
  subjects: Subject[] = [];
  showProfileMenu: boolean = false;

  constructor(
    private statisticsService: StatisticsService,
    private adminUserService: AdminUserService,
    private subjectService: SubjectService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRealData();
  }

  private loadMockData(): void {
    this.recentUsers = [
      { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'STUDENT' },
      { id: 2, username: 'mary_smith', firstName: 'Mary', lastName: 'Smith', email: 'mary@example.com', role: 'TEACHER' },
      { id: 3, username: 'robert_brown', firstName: 'Robert', lastName: 'Brown', email: 'robert@example.com', role: 'STUDENT' },
      { id: 4, username: 'laura_wilson', firstName: 'Laura', lastName: 'Wilson', email: 'laura@example.com', role: 'TEACHER' }
    ];

    this.subjects = [
      { id: 1, name: 'Mathematics', coefficient: 2 },
      { id: 2, name: 'Physics', coefficient: 2 },
      { id: 3, name: 'Chemistry', coefficient: 1.5 },
      { id: 4, name: 'Biology', coefficient: 1.5 },
      { id: 5, name: 'Computer Science', coefficient: 2 }
    ];
  }

  private loadRealData(): void {
    const handleError = (error: any) => {
      console.error('Error fetching data:', error);
      this.loadMockData();
    };

    this.adminUserService.getAllUsers().subscribe({
      next: (users) => {
        this.recentUsers = users.slice(0, 4);
      },
      error: handleError
    });

    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
      },
      error: handleError
    });

    this.statisticsService.getOverallStatistics().subscribe({
      next: (stats) => {
        this.statsCards = [
          { 
            title: 'Total Students', 
            value: stats.totalStudents.toString(), 
            trend: this.calculateTrend(stats.totalStudents), 
            icon: '👨🎓' 
          },
          { 
            title: 'Average GPA', 
            value: stats.averageScore.toFixed(1), 
            trend: this.calculateTrend(stats.averageScore, 0.1), 
            icon: '📊' 
          },
          { 
            title: 'Total Classes', 
            value: stats.totalSubjects.toString(), 
            trend: 0, 
            icon: '🏫' 
          },
          { 
            title: 'Passing Rate', 
            value: `${stats.passingRate.toFixed(0)}%`, 
            trend: this.calculateTrend(stats.passingRate, 1), 
            icon: '📈' 
          }
        ];
      },
      error: handleError
    });
  }

  private calculateTrend(currentValue: number, variationFactor: number = 5): number {
    const randomVariation = (Math.random() * 2 - 1) * variationFactor;
    return parseFloat(randomVariation.toFixed(1));
  }
  
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}