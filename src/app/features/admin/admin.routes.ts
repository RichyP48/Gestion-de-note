import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/components/dashboard-layout/dashboard-layout.component')
      .then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/admin-users.component')
          .then(m => m.AdminUsersComponent)
      },
      {
        path: 'subjects',
        loadComponent: () => import('./subjects/admin-subjects.component')
          .then(m => m.AdminSubjectsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/admin-reports.component')
          .then(m => m.AdminReportsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('../../features/profile/user-profile.component')
          .then(m => m.UserProfileComponent)
      }
    ]
  }
];
