import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarItem } from '../sidebar/sidebar.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar 
        [menuItems]="menuItems"
        [userName]="userName"
        [userRole]="userRole"
        [isOpen]="sidebarOpen"
        (sidebarToggled)="onSidebarToggle($event)">
      </app-sidebar>
      
      <div class="flex-1 transition-all duration-300 ease-in-out"
           [ngClass]="{'ml-64': sidebarOpen, 'ml-0': !sidebarOpen, 'md:ml-64': true}">
        <!-- Header/Navbar -->
        <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button (click)="onSidebarToggle(!sidebarOpen)" 
                      class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h1 class="text-xl font-semibold text-gray-900">{{ getPageTitle() }}</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Bienvenue, {{ userName }}</span>
            </div>
          </div>
        </header>
        
        <!-- Main Content -->
        <main class="flex-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent implements OnInit {
  menuItems: SidebarItem[] = [];
  userName: string = '';
  userRole: string = '';
  sidebarOpen: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.username || 'Utilisateur';
        this.userRole = user.roles[0] || 'Utilisateur';
        this.setMenuItems(user.roles[0]);
      }
    });
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username || 'Utilisateur';
      this.userRole = user.roles[0] || 'Utilisateur';
      this.setMenuItems(user.roles[0]);
    }
  }

  private setMenuItems(role: string) {
    const normalizedRole = role?.toUpperCase().replace('ROLE_', '');
    
    switch (normalizedRole) {
      case 'ADMIN':
        this.menuItems = [
          { label: 'Dashboard', route: '/admin/dashboard', icon: 'layout-dashboard' },
          { label: 'Utilisateurs', route: '/admin/users', icon: 'users' },
          { label: 'Matières', route: '/admin/subjects', icon: 'building' },
          { label: 'Rapports', route: '/admin/reports', icon: 'bar-chart' }
        ];
        break;
      case 'TEACHER':
        this.menuItems = [
          { label: 'Dashboard', route: '/teacher/dashboard', icon: 'layout-dashboard' },
          { label: 'Étudiants', route: '/teacher/students', icon: 'graduation-cap' },
          { label: 'Notes', route: '/teacher/grades', icon: 'file-check' },
          { label: 'Rapports', route: '/teacher/reports', icon: 'bar-chart' }
        ];
        break;
      case 'STUDENT':
        this.menuItems = [
          { label: 'Dashboard', route: '/student/dashboard', icon: 'layout-dashboard' },
          { label: 'Cours', route: '/student/courses', icon: 'briefcase' },
          { label: 'Notes', route: '/student/grades', icon: 'file-text' },
          { label: 'Calendrier', route: '/student/calendar', icon: 'building-2' },
          { label: 'Messages', route: '/student/messages', icon: 'user' }
        ];
        break;
      default:
        this.menuItems = [];
    }
  }

  onSidebarToggle(isOpen: boolean) {
    this.sidebarOpen = isOpen;
  }

  getPageTitle(): string {
    switch (this.userRole) {
      case 'ADMIN':
        return 'Administration';
      case 'TEACHER':
        return 'Espace Enseignant';
      case 'STUDENT':
        return 'Espace Étudiant';
      default:
        return 'Dashboard';
    }
  }
}