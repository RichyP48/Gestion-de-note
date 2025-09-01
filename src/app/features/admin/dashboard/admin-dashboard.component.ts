import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StatisticsService, Statistics } from '../../../core/services/statistics.service';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { UserProfile } from '../../../core/services/user.service';
import { AuthService } from '../../../auth/auth.service';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  template: `
    <div class="min-h-screen bg-[#f6f6f6] text-[#3d3d3d] flex">
  <aside class="w-56 bg-gradient-to-t from-[#2dd4bf] to-[#1f2937] text-white flex flex-col py-6 px-4 min-h-screen fixed top-0">
    <div class="mb-8 flex items-center gap-2">
      <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-[#2dd4bf]">Grade48</span>
    </div>
    <nav class="flex-1">
      <ul class="space-y-2">
        <li>
          <a routerLink="/admin/dashboard" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
            <span>🏠</span> <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a routerLink="/admin/users" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
            <span>🧑‍🤝‍🧑</span> <span>Users</span>
          </a>
        </li>
        <li>
          <a routerLink="/admin/subjects" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
            <span>📚</span> <span>Subjects</span>
          </a>
        </li>
        <li>
          <a routerLink="/admin/reports" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
            <span>📝</span> <span>Reports</span>
          </a>
        </li>
        <li>
          <a routerLink="/admin/settings" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2dd4bf] transition-colors font-medium">
            <span>⚙️</span> <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="mt-auto">
      <button (click)="logout()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2dd4bf] hover:bg-[#09998680] transition-colors font-medium">
        <span>🚪</span> <span>Logout</span>
      </button>
    </div>
  </aside>
  <div class="flex-1 flex flex-col min-h-screen">
    <nav class="bg-white border-b border-indigo-100 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2dd4bf] to-[#087062]">Grade48</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="px-4 py-2 rounded-md bg-[#2dd4bf] text-white hover:bg-[#40eed7cc] transition-all">
              <span>Settings</span>
            </button>
            <div class="relative" clickOutside (clickOutside)="showProfileMenu = false">
              <button (click)="toggleProfileMenu()" class="relative h-10 w-10 rounded-full bg-[#2dd4bf] overflow-hidden">
                <span class="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">A</span>
              </button>
              
              <div *ngIf="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800 border border-indigo-100 animate-fadeIn">
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-medium">Admin User</p>
                  <p class="text-xs text-gray-500">admin&#64;school.edu</p>
                </div>
                <a routerLink="/admin/profile" class="block px-4 py-2 text-sm hover:bg-indigo-100 transition-all">Your Profile</a>
                <div class="border-t border-gray-200"></div>
                <a (click)="logout()" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all cursor-pointer">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="py-10 flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="mb-10">
          <h1 class="text-4xl font-black mb-2 animate-fadeIn">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400">Admin Dashboard</span>
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
                    <span class="text-lg">{{ stat.icon }}</span>
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
                <span class="text-xl">{{ action.icon }}</span>
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
                    <span>✏️</span>
                  </button>
                  <button class="p-2 rounded-full bg-rose-600/20 hover:bg-rose-600/40 text-xs transition-colors">
                    <span>🗑️</span>
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
    { title: 'Total Students', value: '458', trend: 12, icon: '👨‍🎓' },
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
      icon: '🧑‍🤝‍🧑',
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
    // Fetch real data from the server
    this.loadRealData();
  }

  private loadMockData(): void {
    // Mock user data
    this.recentUsers = [
      { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'STUDENT' },
      { id: 2, username: 'mary_smith', firstName: 'Mary', lastName: 'Smith', email: 'mary@example.com', role: 'TEACHER' },
      { id: 3, username: 'robert_brown', firstName: 'Robert', lastName: 'Brown', email: 'robert@example.com', role: 'STUDENT' },
      { id: 4, username: 'laura_wilson', firstName: 'Laura', lastName: 'Wilson', email: 'laura@example.com', role: 'TEACHER' }
    ];

    // Mock subject data
    this.subjects = [
      { id: 1, name: 'Mathematics', coefficient: 2 },
      { id: 2, name: 'Physics', coefficient: 2 },
      { id: 3, name: 'Chemistry', coefficient: 1.5 },
      { id: 4, name: 'Biology', coefficient: 1.5 },
      { id: 5, name: 'Computer Science', coefficient: 2 }
    ];
  }

  // Fetch real data from the server
  private loadRealData(): void {
    // Add error handling for API requests
    const handleError = (error: any) => {
      console.error('Error fetching data:', error);
      // Fallback to mock data if server is not available
      this.loadMockData();
    };

    // Get recent users
    this.adminUserService.getAllUsers().subscribe({
      next: (users) => {
        this.recentUsers = users.slice(0, 4);
      },
      error: handleError
    });

    // Get subjects
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
      },
      error: handleError
    });

    // Get statistics and update stats cards
    this.statisticsService.getOverallStatistics().subscribe({
      next: (stats) => {
        // Update stats cards with real data
        this.statsCards = [
          { 
            title: 'Total Students', 
            value: stats.totalStudents.toString(), 
            trend: this.calculateTrend(stats.totalStudents), 
            icon: '👨‍🎓' 
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
            trend: 0, // Assuming classes don't change frequently
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

  // Helper method to calculate trend percentage (mock calculation for demo)
  private calculateTrend(currentValue: number, variationFactor: number = 5): number {
    // This is a simplified mock calculation
    // In a real app, you would compare with historical data
    const randomVariation = (Math.random() * 2 - 1) * variationFactor;
    return parseFloat(randomVariation.toFixed(1));
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
