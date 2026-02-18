import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // First check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if content is premium
    const isPremium = route.data['isPremium'] === true;
    
    // If content is free or user is admin, allow access
    if (!isPremium || this.authService.isAdmin()) {
      return true;
    }

    // Check if user has active subscription
    if (this.authService.hasActiveSubscription()) {
      return true;
    }

    // Redirect to subscription page if premium content without subscription
    this.router.navigate(['/subscription']);
    return false;
  }
}
