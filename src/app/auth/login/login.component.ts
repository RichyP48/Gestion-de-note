import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s 0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
 template: `
 <div class="  flex ">
    <div class="h-screen flex flex-col items-center justify-center  bg-gradient-to-r from-[#2dd4bf] to-[#1f2937]  w-full ">
      <!-- Logo and Branding -->
      <div @fadeIn class="mb-8 text-center">
        <div class="flex items-center justify-center mb-4">
          
        </div>
       
      </div>
      
      <!-- Login Card -->
      <div @slideIn class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-glow overflow-hidden border border-neutral-200">
          <!-- Card Header -->
          <div class="px-8 py-6 border-b border-neutral-100">
            <h2 class="text-2xl font-bold text-gray-900">Sign In</h2>
            <p class="text-gray-500 text-sm mt-1">Access your personalized dashboard</p>
          </div>
          
          <!-- Login Form -->
          <form class="px-8 py-6 space-y-6" (ngSubmit)="onSubmit()">
            <!-- Username Input -->
            <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  required
                  [(ngModel)]="username"
                  class="bg-white border border-neutral-200 text-gray-900 block w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-[#1fad9f] focus:border-transparent"
                  placeholder="Enter your username"
                >
              </div>
            </div>
            
            <!-- Password Input -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required
                  [(ngModel)]="password"
                  class="bg-white border border-neutral-200 text-gray-900 block w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-[#1fad9f] focus:border-transparent"
                  placeholder="Enter your password"
                >
              </div>
            </div>
            
            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  class="h-4 w-4 text-[#1fad9f] focus:ring-[#1fad9f] border-gray-300 rounded"
                >
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div class="text-sm">
                <a href="#" class="font-medium text-[#1fad9f] hover:text-[#168b82]">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <!-- Error Message -->
            <div *ngIf="error" class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ error }}
            </div>
            
            <!-- Submit Button -->
            <div>
              <button 
                type="submit"
                [disabled]="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1fad9f] hover:bg-[#168b82] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1fad9f] transition-all duration-200"
              >
                <span *ngIf="isLoading" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
          </form>
          
          <!-- Quick Login Buttons -->
          <div class="px-8 py-4 bg-neutral-50 border-t border-neutral-100">
            <div class="text-xs text-center text-gray-400 mb-3">Demo accounts (click to autofill)</div>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                (click)="fillDemoCredentials('student')"
                class="py-1 px-2 bg-neutral-100 rounded border border-neutral-200 text-xs text-gray-700 hover:bg-[#1fad9f]/10"
              >
                Student Demo
              </button>
              <button 
                type="button" 
                (click)="fillDemoCredentials('teacher')"
                class="py-1 px-2 bg-neutral-100 rounded border border-neutral-200 text-xs text-gray-700 hover:bg-[#1fad9f]/10"
              >
                Teacher Demo
              </button>
              <button 
                type="button" 
                (click)="fillDemoCredentials('admin')"
                class="py-1 px-2 bg-neutral-100 rounded border border-neutral-200 text-xs text-gray-700 hover:bg-[#1fad9f]/10"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-6 text-center text-sm text-gray-400">
          <p>2025 Grade48. All rights reserved.</p>
        </div>
      </div>
    </div>
     <div 
        class="w-full relative bg-amber-200 inset-0 bg-cover bg-center"
        style="background-image: url('/slider.jpg');"
    >
    <div class="absolute inset-0 overflow-hidden    bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] opacity-50">
    </div>
      <div class="absolute inset-0 overflow-hidden   bg-gradient-to-r from-primary-800 via-primary-700 to-primary-900 opacity-90">
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r bg-[#2dd4bf] to-[#1f2937] rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl animate-float"></div>
      <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-400 rounded-full blur-3xl animate-pulse-slow"></div>
    </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  fillDemoCredentials(type: 'student' | 'teacher' | 'admin'): void {
    switch (type) {
      case 'student':
        this.username = 'student_john';
        this.password = 'password123';
        break;
      case 'teacher':
        this.username = 'teacher_jane';
        this.password = 'password123';
        break;
      case 'admin':
        this.username = 'admin';
        this.password = 'password123';
        break;
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.error = '';
    this.isLoading = true;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Redirect based on role
        if (response.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else if (response.roles.includes('ROLE_TEACHER')) {
          this.router.navigate(['/teacher']);
        } else if (response.roles.includes('ROLE_STUDENT')) {
          this.router.navigate(['/student']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Invalid username or password. Please try again.';
      }
    });
  }
}
