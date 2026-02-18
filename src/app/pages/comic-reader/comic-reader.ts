import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicService, ComicPage, ComicSeries } from '../../services/comic.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comic-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comic-reader.html',
  styleUrls: ['./comic-reader.scss']
})
export class ComicReader implements OnInit, OnDestroy {
  series: ComicSeries | null = null;
  pages: ComicPage[] = [];
  currentPageIndex = 0;
  isLoading = true;
  error: string | null = null;
  readingMode: 'sequential' | 'scroll' = 'sequential';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comicService: ComicService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const seriesId = params['seriesId'];
        if (seriesId) {
          this.loadComic(seriesId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadComic(seriesId: string): void {
    this.isLoading = true;
    this.error = null;

    // Load series info
    this.comicService.getSeriesById(seriesId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (series) => {
          this.series = series;
        },
        error: (err) => {
          this.error = 'Failed to load comic series';
          this.isLoading = false;
          console.error('Error loading series:', err);
        }
      });

    // Load pages
    this.comicService.getSeriesPages(seriesId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pages) => {
          this.pages = pages.sort((a, b) => a.pageNumber - b.pageNumber);
          this.isLoading = false;
          
          // Preload first two pages
          if (this.pages.length > 0) {
            this.preloadImage(0);
            if (this.pages.length > 1) {
              this.preloadImage(1);
            }
          }
        },
        error: (err) => {
          this.error = 'Failed to load comic pages';
          this.isLoading = false;
          console.error('Error loading pages:', err);
        }
      });
  }

  private preloadImage(index: number): void {
    if (index >= 0 && index < this.pages.length) {
      const img = new Image();
      img.src = this.getImageUrl(this.pages[index].imageUrl);
    }
  }

  get currentPage(): ComicPage | null {
    return this.pages[this.currentPageIndex] || null;
  }

  nextPage(): void {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      
      // Preload next page
      if (this.currentPageIndex < this.pages.length - 1) {
        this.preloadImage(this.currentPageIndex + 1);
      }
    }
  }

  previousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

  goToPage(index: number): void {
    if (index >= 0 && index < this.pages.length) {
      this.currentPageIndex = index;
      
      // Preload next page
      if (index < this.pages.length - 1) {
        this.preloadImage(index + 1);
      }
    }
  }

  toggleReadingMode(): void {
    this.readingMode = this.readingMode === 'sequential' ? 'scroll' : 'sequential';
  }

  goBack(): void {
    this.router.navigate(['/comics']);
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5292${url}`;
  }
}
