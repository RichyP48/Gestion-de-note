import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { StudentService, StudentSummary } from '../../core/services/student.service';
import { UserService, UserProfile, PasswordChange } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-black/30 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Grade48</span>
          </div>
          <div class="ml-6 flex space-x-8 items-center">
            <a [routerLink]="getDashboardLink()" class="text-white hover:text-purple-200 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-transparent">
              Dashboard
            </a>
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
        <h1 class="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p class="text-gray-300">View and update your personal information</p>
      </header>
      
      <!-- Loading indicator -->
      <div *ngIf="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
      
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Profile Form -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
          <h2 class="text-xl font-semibold text-white mb-4">Personal Information</h2>
          
          <form class="space-y-6" (ngSubmit)="updateProfile()">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  [(ngModel)]="profile.firstName"
                  class="bg-black/30 border border-purple-500/50 text-white block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  [(ngModel)]="profile.lastName"
                  class="bg-black/30 border border-purple-500/50 text-white block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  [(ngModel)]="profile.email"
                  class="bg-black/30 border border-purple-500/50 text-white block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
              <div>
                <label for="username" class="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  [(ngModel)]="profile.username"
                  disabled
                  class="bg-black/30 border border-purple-500/50 text-gray-400 block w-full px-3 py-2 rounded-lg cursor-not-allowed"
                >
                <p class="text-xs text-gray-400 mt-1">Username cannot be changed</p>
              </div>
            </div>
            
            <!-- Success/Error Messages -->
            <div *ngIf="profileSuccessMessage" class="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
              {{ profileSuccessMessage }}
            </div>
            
            <div *ngIf="profileErrorMessage" class="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {{ profileErrorMessage }}
            </div>
            
            <!-- Form Actions -->
            <div class="flex justify-end">
              <button 
                type="submit"
                [disabled]="isProfileSaving"
                class="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                <span *ngIf="isProfileSaving" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isProfileSaving ? 'Saving...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
        
        <!-- Change Password Form -->
        <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-glow">
          <h2 class="text-xl font-semibold text-white mb-4">Change Password</h2>
          
          <form class="space-y-6" (ngSubmit)="changePassword()">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  name="currentPassword"
                  [(ngModel)]="passwordForm.currentPassword"
                  class="bg-black/30 border border-purple-500/50 text-white block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword"
                  [(ngModel)]="passwordForm.newPassword"
                  class="bg-black/30 border border-purple-500/50 text-white block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  [(ngModel)]="passwordForm.confirmPassword"
                  class="bg-black/30 border border-purple-500/50 text-white block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
            </div>
            
            <!-- Success/Error Messages -->
            <div *ngIf="passwordSuccessMessage" class="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
              {{ passwordSuccessMessage }}
            </div>
            
            <div *ngIf="passwordErrorMessage" class="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {{ passwordErrorMessage }}
            </div>
            
            <!-- Form Actions -->
            <div class="flex justify-end">
              <button 
                type="submit"
                [disabled]="isPasswordSaving"
                class="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                <span *ngIf="isPasswordSaving" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isPasswordSaving ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
`
})
export class UserProfileComponent implements OnInit {
  // User info
  userEmail: string = '';
  userInitials: string = '';
  showProfileMenu: boolean = false;
  userRole: string = '';
  userId: number = 0;
  
  // Profile data
  profile: UserProfile = {
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  };
  
  // Password change form
  passwordForm: PasswordChange = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // UI state
  isLoading: boolean = false;
  isProfileSaving: boolean = false;
  isPasswordSaving: boolean = false;
  profileSuccessMessage: string = '';
  profileErrorMessage: string = '';
  passwordSuccessMessage: string = '';
  passwordErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadProfileData();
  }

  loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
      this.userId = user.id;
      
      // Determine user role
      if (user.roles.includes('ROLE_ADMIN')) {
        this.userRole = 'admin';
      } else if (user.roles.includes('ROLE_TEACHER')) {
        this.userRole = 'teacher';
      } else if (user.roles.includes('ROLE_STUDENT')) {
        this.userRole = 'student';
      }
      
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

  loadProfileData(): void {
    this.isLoading = true;
    
    // Get user profile from the API
    this.userService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.userEmail = profile.email;
        this.userInitials = profile.firstName.charAt(0) + profile.lastName.charAt(0);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile data:', error);
        
        // Try to get profile data from the student summary endpoint as fallback
        if (this.userRole === 'student') {
          this.loadStudentProfileData();
        } else {
          // Fallback to using the current user data from auth service
          const user = this.authService.getCurrentUser();
          if (user) {
            this.profile = {
              id: user.id,
              username: user.username,
              firstName: '', // These fields aren't in the AuthResponse
              lastName: '',  // These fields aren't in the AuthResponse
              email: user.email,
              role: this.userRole
            };
          }
          
          this.isLoading = false;
        }
      }
    });
  }

  loadStudentProfileData(): void {
    this.studentService.getStudentSummary().subscribe({
      next: (summary) => {
        this.profile = {
          id: summary.studentId,
          username: summary.username,
          firstName: summary.firstName,
          lastName: summary.lastName,
          email: summary.email,
          role: 'student'
        };
        
        // Update user info with actual data from backend
        this.userEmail = summary.email;
        this.userInitials = summary.firstName.charAt(0) + summary.lastName.charAt(0);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student profile data:', error);
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';
    
    this.isProfileSaving = true;
    
    // Create a profile update object (omitting the password)
    const profileUpdate = {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.profile.email
    };
    
    // Call the API to update the profile
    this.userService.updateUserProfile(this.userId, profileUpdate).subscribe({
      next: (updatedProfile) => {
        this.isProfileSaving = false;
        this.profileSuccessMessage = 'Profile updated successfully';
        
        // Update the profile data
        this.profile = updatedProfile;
        
        // Update the user info in the UI
        this.userEmail = updatedProfile.email;
        this.userInitials = updatedProfile.firstName.charAt(0) + updatedProfile.lastName.charAt(0);
      },
      error: (error) => {
        this.isProfileSaving = false;
        this.profileErrorMessage = error.error?.message || 'An error occurred while updating your profile';
        console.error('Error updating profile:', error);
      }
    });
  }

  changePassword(): void {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
    
    // Validate password fields
    if (!this.passwordForm.currentPassword) {
      this.passwordErrorMessage = 'Please enter your current password';
      return;
    }
    
    if (!this.passwordForm.newPassword) {
      this.passwordErrorMessage = 'Please enter a new password';
      return;
    }
    
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordErrorMessage = 'New password and confirmation do not match';
      return;
    }
    
    this.isPasswordSaving = true;
    
    // Call the API to change the password
    this.userService.changePassword(this.userId, this.passwordForm).subscribe({
      next: () => {
        this.isPasswordSaving = false;
        this.passwordSuccessMessage = 'Password changed successfully';
        
        // Clear password fields after successful update
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        this.isPasswordSaving = false;
        this.passwordErrorMessage = error.error?.message || 'An error occurred while changing your password';
        console.error('Error changing password:', error);
      }
    });
  }

  getDashboardLink(): string {
    return `/${this.userRole}`;
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
