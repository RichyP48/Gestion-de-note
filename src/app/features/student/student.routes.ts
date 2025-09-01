import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../auth/auth.guard';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/student-dashboard.component')
      .then(m => m.StudentDashboardComponent),
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT'])]
  },
  {
    path: 'grades',
    loadComponent: () => import('./grades/student-grades.component')
      .then(m => m.StudentGradesComponent),
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT'])]
  },
  {
    path: 'courses',
    loadComponent: () => import('./courses/student-courses.component')
      .then(m => m.StudentCoursesComponent),
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT'])]
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/student-calendar.component')
      .then(m => m.StudentCalendarComponent),
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT'])]
  },
  {
    path: 'messages',
    loadComponent: () => import('./messages/student-messages.component')
      .then(m => m.StudentMessagesComponent),
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT'])]
  },
  {
    path: 'profile',
    loadComponent: () => import('../../features/profile/user-profile.component')
      .then(m => m.UserProfileComponent),
    canActivate: [authGuard]
  }
];
