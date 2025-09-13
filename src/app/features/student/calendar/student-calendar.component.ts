import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-student-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],

template: `
  <div class="min-h-screen flex bg-white">

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen  text-white">
      <!-- Navbar -->

      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Calendar</h1>
          <p class="text-gray-300">View your class schedule and upcoming assignments.</p>
        </header>
        <!-- Calendar Placeholder -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
          <div class="text-center py-8">
            <p class="text-lg mb-4">Calendar functionality is coming soon!</p>
            <p class="text-gray-300">This page will display your class schedule, exam dates, and assignment due dates.</p>
          </div>
        </div>
      </main>
    </div>
  </div>`
})
export class StudentCalendarComponent {
  // This is a placeholder component for the calendar functionality
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
