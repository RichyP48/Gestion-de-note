import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/admin-users.component')
      .then(m => m.AdminUsersComponent),
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'subjects',
    loadComponent: () => import('./subjects/admin-subjects.component')
      .then(m => m.AdminSubjectsComponent),
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/admin-reports.component')
      .then(m => m.AdminReportsComponent),
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'profile',
    loadComponent: () => import('../../features/profile/user-profile.component')
      .then(m => m.UserProfileComponent),
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
  }
];
