import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../auth/auth.guard';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/components/dashboard-layout/dashboard-layout.component')
      .then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/student-dashboard.component')
          .then(m => m.StudentDashboardComponent)
      },
      {
        path: 'grades',
        loadComponent: () => import('./grades/student-grades.component')
          .then(m => m.StudentGradesComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./courses/student-courses.component')
          .then(m => m.StudentCoursesComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./calendar/student-calendar.component')
          .then(m => m.StudentCalendarComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./messages/student-messages.component')
          .then(m => m.StudentMessagesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('../../features/profile/user-profile.component')
          .then(m => m.UserProfileComponent)
      }
    ]
  }
];
