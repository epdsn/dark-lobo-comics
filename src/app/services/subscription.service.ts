import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Subscription {
  id: string;
  userId: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateSubscriptionRequest {
  paymentMethodId: string;
  priceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly API_URL = 'http://localhost:5292/api/subscriptions';
  
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMySubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.API_URL}/my-subscription`)
      .pipe(
        tap(subscription => this.subscriptionSubject.next(subscription))
      );
  }

  createSubscription(request: CreateSubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.API_URL}/create`, request)
      .pipe(
        tap(subscription => this.subscriptionSubject.next(subscription))
      );
  }

  cancelSubscription(cancelAtPeriodEnd: boolean = true): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/cancel`, { cancelAtPeriodEnd })
      .pipe(
        tap(() => {
          if (!cancelAtPeriodEnd) {
            this.subscriptionSubject.next(null);
          }
        })
      );
  }

  hasActiveSubscription(): boolean {
    const subscription = this.subscriptionSubject.value;
    return subscription?.status === 'Active' || subscription?.status === 'active';
  }

  getCurrentSubscription(): Subscription | null {
    return this.subscriptionSubject.value;
  }
}
