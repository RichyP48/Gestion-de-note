import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../auth/auth.guard';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/teacher-dashboard.component')
      .then(m => m.TeacherDashboardComponent),
    canActivate: [authGuard, roleGuard(['ROLE_TEACHER'])]
  },
  {
    path: 'grades',
    loadComponent: () => import('./grades/teacher-grades.component')
      .then(m => m.TeacherGradesComponent),
    canActivate: [authGuard, roleGuard(['ROLE_TEACHER'])]
  },
  {
    path: 'students',
    loadComponent: () => import('./students/teacher-students.component')
      .then(m => m.TeacherStudentsComponent),
    canActivate: [authGuard, roleGuard(['ROLE_TEACHER'])]
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/teacher-reports.component')
      .then(m => m.TeacherReportsComponent),
    canActivate: [authGuard, roleGuard(['ROLE_TEACHER'])]
  },
  {
    path: 'profile',
    loadComponent: () => import('../../features/profile/user-profile.component')
      .then(m => m.UserProfileComponent),
    canActivate: [authGuard, roleGuard(['ROLE_TEACHER'])]
  }
];
