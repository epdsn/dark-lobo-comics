import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { SubscriptionService, Subscription } from '../../services/subscription.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.html',
  styleUrls: ['./subscription.scss']
})
export class SubscriptionPage implements OnInit, OnDestroy {
  user: User | null = null;
  subscription: Subscription | null = null;
  isLoading = true;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  
  // Stripe test price ID - replace with your actual price ID
  priceId = 'price_test_premium_monthly';
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    
    if (this.hasActiveSubscription()) {
      this.loadSubscription();
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSubscription(): void {
    this.subscriptionService.getMySubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subscription) => {
          this.subscription = subscription;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error loading subscription:', err);
        }
      });
  }

  hasActiveSubscription(): boolean {
    return this.authService.hasActiveSubscription();
  }

  getSubscriptionStatus(): string {
    return this.authService.getSubscriptionStatus();
  }

  subscribe(): void {
    // In a real implementation, this would integrate with Stripe's payment modal
    // For now, we'll show a message that Stripe integration is needed
    this.showMessage('Stripe integration required. Please configure Stripe in your backend and add Stripe.js to process payments.', 'error');
    
    // Example of what the implementation would look like:
    /*
    const stripe = (window as any).Stripe('your_publishable_key');
    
    // Create payment method and subscribe
    this.subscriptionService.createSubscription({
      paymentMethodId: 'pm_card_visa', // From Stripe Elements
      priceId: this.priceId
    }).subscribe({
      next: () => {
        this.showMessage('Subscription activated successfully!', 'success');
        // Reload user profile to get updated subscription status
        this.authService.getProfile().subscribe();
        this.loadSubscription();
      },
      error: (err) => {
        this.showMessage('Failed to create subscription', 'error');
        console.error('Error creating subscription:', err);
      }
    });
    */
  }

  cancelSubscription(): void {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    this.subscriptionService.cancelSubscription(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('Subscription will be cancelled at the end of the billing period', 'success');
          // Reload user profile
          this.authService.getProfile()
            .pipe(takeUntil(this.destroy$))
            .subscribe();
          this.loadSubscription();
        },
        error: (err) => {
          this.showMessage('Failed to cancel subscription', 'error');
          console.error('Error cancelling subscription:', err);
        }
      });
  }

  goToComics(): void {
    this.router.navigate(['/comics']);
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}
