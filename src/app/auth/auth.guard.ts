import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.parseUrl('/login');
    }

    const hasRole = allowedRoles.some(role => authService.hasRole(role));
    if (!hasRole) {
      // Redirect to appropriate dashboard based on user's role
      const user = authService.getCurrentUser();
      if (user?.roles.includes('ROLE_ADMIN')) {
        return router.parseUrl('/admin');
      } else if (user?.roles.includes('ROLE_TEACHER')) {
        return router.parseUrl('/teacher');
      } else if (user?.roles.includes('ROLE_STUDENT')) {
        return router.parseUrl('/student');
      }
      return router.parseUrl('/');
    }

    return true;
  };
};
