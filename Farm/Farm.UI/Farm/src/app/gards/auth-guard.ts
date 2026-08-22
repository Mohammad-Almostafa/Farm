import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const requiredRole = route.data['role'] as string || route.parent?.data['role'] as string;
  const userRole = localStorage.getItem('role');

  if (!userRole) {
    router.navigate(['/admin']);
    return false;
  }

  if (userRole !== requiredRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
