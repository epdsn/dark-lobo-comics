import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ComicSlide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  currentSlide = 0;
  private intervalId?: number;
  
  slides: ComicSlide[] = [
    {
      id: 0,
      title: 'Welcome to Dark Lobo Comics',
      subtitle: 'Discover the world of dark, compelling stories and unforgettable characters',
      backgroundImage: 'linear-gradient(135deg, #000000 0%, #1a0000 100%)',
      ctaText: 'Get Started',
      ctaLink: '/register',
      secondaryText: 'Sign In',
      secondaryLink: '/login'
    },
    {
      id: 1,
      title: 'The Shadow Within',
      subtitle: 'A psychological thriller that will keep you guessing until the very end',
      backgroundImage: 'linear-gradient(135deg, #8b0000 0%, #000000 100%)',
      ctaText: 'Read Now',
      ctaLink: '/comics',
      secondaryText: 'Learn More',
      secondaryLink: '/comics'
    },
    {
      id: 2,
      title: 'Neon Nights',
      subtitle: 'Cyberpunk adventures in a neon-lit dystopian future',
      backgroundImage: 'linear-gradient(135deg, #ff0000 0%, #000000 100%)',
      ctaText: 'Explore Series',
      ctaLink: '/comics',
      secondaryText: 'View Gallery',
      secondaryLink: '/comics'
    },
    {
      id: 3,
      title: 'The Void Chronicles',
      subtitle: 'Cosmic horror meets space exploration in this epic saga',
      backgroundImage: 'linear-gradient(135deg, #000000 0%, #1a0000 100%)',
      ctaText: 'Start Reading',
      ctaLink: '/comics',
      secondaryText: 'Browse Collection',
      secondaryLink: '/comics'
    }
  ];

  constructor(
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      // Start slideshow immediately
      this.startSlideshow();
    }
  }

  ngOnDestroy() {
    this.stopSlideshow();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  startSlideshow() {
    if (typeof window !== 'undefined') {
      console.log('Starting slideshow timer...');
      this.intervalId = window.setInterval(() => {
        console.log('Timer triggered - advancing slide from', this.currentSlide, 'to', (this.currentSlide + 1) % this.slides.length);
        this.nextSlide();
      }, 5000); // Reduced to 3 seconds for testing
    }
  }

  stopSlideshow() {
    if (typeof window !== 'undefined' && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    console.log('nextSlide() called - currentSlide before:', this.currentSlide);
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    console.log('nextSlide() called - currentSlide after:', this.currentSlide);
    
    // Force change detection with multiple approaches
    this.cdr.detectChanges();
    this.appRef.tick();
    console.log('Change detection triggered with appRef.tick()');
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.cdr.detectChanges();
  }

  goToSlide(index: number) {
    console.log('goToSlide() called - changing to slide:', index);
    this.currentSlide = index;
    this.cdr.detectChanges();
    this.appRef.tick();
    console.log('goToSlide() completed - currentSlide is now:', this.currentSlide);
  }

  onSlideChange() {
    // Optional: You can add any additional logic here when slides change
    // For now, we'll let the automatic slideshow continue running
    console.log('Manual slide change to:', this.currentSlide);
  }
} 