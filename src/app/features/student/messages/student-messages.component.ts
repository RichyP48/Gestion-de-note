import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-student-messages',
  standalone: true,
  imports: [CommonModule, RouterModule],
template: `
  <div class="min-h-screen flex bg-white">
    <!-- Sidebar -->
    <!-- <aside class="w-60 bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white flex flex-col py-6 px-4 min-h-screen sticky top-0 left-0 z-30"
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
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-500">Grade48</span>
      </div>
      <nav class="flex-1 hide-scrollbar" style="overflow-y: auto;">
        <ul class="space-y-2">
          <li>
            <a routerLink="/student" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/student/grades" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
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
            <a routerLink="/student/messages" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#32b9a9]/40 font-semibold transition-colors">
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
    </aside> -->
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 via-primary-800 to-slate-900 text-white">
      <!-- Navbar -->

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Messages</h1>
          <p class="text-gray-300">Contact your teachers and advisors.</p>
        </header>
        <!-- Messages Placeholder -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
          <div class="text-center py-8">
            <p class="text-lg mb-4">Messaging functionality is coming soon!</p>
            <p class="text-gray-300">This page will allow you to communicate with your teachers and advisors.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
`

})
export class StudentMessagesComponent {
  // This is a placeholder component for the messaging functionality
  // It will be implemented in a future update
  
  // User info
  userEmail: string = 'student@example.com';
  userInitials: string = 'ST';
  showProfileMenu: boolean = false;
  
  constructor(private authService: AuthService) {
    this.loadUserInfo();
  }
  
  loadUserInfo(): void {
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
