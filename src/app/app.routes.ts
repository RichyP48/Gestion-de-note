import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard, roleGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [roleGuard(['ROLE_ADMIN'])],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'teacher',
    canActivate: [roleGuard(['ROLE_TEACHER'])],
    loadChildren: () => import('./features/teacher/teacher.routes').then(m => m.TEACHER_ROUTES)
  },
  {
    path: 'student',
    canActivate: [roleGuard(['ROLE_STUDENT'])],
    loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
