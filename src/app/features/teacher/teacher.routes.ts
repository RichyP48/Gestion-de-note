import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../auth/auth.guard';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/components/dashboard-layout/dashboard-layout.component')
      .then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard, roleGuard(['ROLE_TEACHER'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/teacher-dashboard.component')
          .then(m => m.TeacherDashboardComponent)
      },
      {
        path: 'grades',
        loadComponent: () => import('./grades/teacher-grades.component')
          .then(m => m.TeacherGradesComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./students/teacher-students.component')
          .then(m => m.TeacherStudentsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/teacher-reports.component')
          .then(m => m.TeacherReportsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('../../features/profile/user-profile.component')
          .then(m => m.UserProfileComponent)
      }
    ]
  }
];
