import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComicService, ComicSeries, ComicPage } from '../../services/comic.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin implements OnInit, OnDestroy {
  seriesList: ComicSeries[] = [];
  selectedSeries: ComicSeries | null = null;
  selectedSeriesPages: ComicPage[] = [];
  
  seriesForm: FormGroup;
  pageForm: FormGroup;
  
  showSeriesForm = false;
  showPageForm = false;
  isEditMode = false;
  isLoading = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  
  uploadingCover = false;
  uploadingPage = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private comicService: ComicService
  ) {
    this.seriesForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isPremium: [false],
      coverImageUrl: ['']
    });

    this.pageForm = this.fb.group({
      pageNumber: ['', [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSeries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSeries(): void {
    this.isLoading = true;
    this.comicService.getAllSeries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (series) => {
          this.seriesList = series;
          this.isLoading = false;
        },
        error: (err) => {
          this.showMessage('Failed to load comic series', 'error');
          this.isLoading = false;
          console.error('Error loading series:', err);
        }
      });
  }

  selectSeries(series: ComicSeries): void {
    this.selectedSeries = series;
    this.loadSeriesPages(series.id);
  }

  loadSeriesPages(seriesId: string): void {
    this.comicService.getSeriesPages(seriesId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pages) => {
          this.selectedSeriesPages = pages.sort((a, b) => a.pageNumber - b.pageNumber);
        },
        error: (err) => {
          this.showMessage('Failed to load pages', 'error');
          console.error('Error loading pages:', err);
        }
      });
  }

  createNewSeries(): void {
    this.isEditMode = false;
    this.showSeriesForm = true;
    this.seriesForm.reset({ isPremium: false });
  }

  editSeries(series: ComicSeries): void {
    this.isEditMode = true;
    this.showSeriesForm = true;
    this.selectedSeries = series;
    this.seriesForm.patchValue({
      title: series.title,
      description: series.description,
      isPremium: series.isPremium,
      coverImageUrl: series.coverImageUrl
    });
  }

  saveSeries(): void {
    if (this.seriesForm.invalid) return;

    const formData = this.seriesForm.value;
    
    if (this.isEditMode && this.selectedSeries) {
      this.comicService.updateSeries(this.selectedSeries.id, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showMessage('Series updated successfully', 'success');
            this.loadSeries();
            this.cancelSeriesForm();
          },
          error: (err) => {
            this.showMessage('Failed to update series', 'error');
            console.error('Error updating series:', err);
          }
        });
    } else {
      this.comicService.createSeries(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showMessage('Series created successfully', 'success');
            this.loadSeries();
            this.cancelSeriesForm();
          },
          error: (err) => {
            this.showMessage('Failed to create series', 'error');
            console.error('Error creating series:', err);
          }
        });
    }
  }

  deleteSeries(series: ComicSeries): void {
    if (!confirm(`Are you sure you want to delete "${series.title}"?`)) return;

    this.comicService.deleteSeries(series.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('Series deleted successfully', 'success');
          this.loadSeries();
          if (this.selectedSeries?.id === series.id) {
            this.selectedSeries = null;
            this.selectedSeriesPages = [];
          }
        },
        error: (err) => {
          this.showMessage('Failed to delete series', 'error');
          console.error('Error deleting series:', err);
        }
      });
  }

  cancelSeriesForm(): void {
    this.showSeriesForm = false;
    this.seriesForm.reset({ isPremium: false });
    this.isEditMode = false;
  }

  addPage(): void {
    if (!this.selectedSeries) return;
    this.showPageForm = true;
    const nextPageNumber = this.selectedSeriesPages.length > 0
      ? Math.max(...this.selectedSeriesPages.map(p => p.pageNumber)) + 1
      : 1;
    this.pageForm.patchValue({ pageNumber: nextPageNumber });
  }

  savePage(): void {
    if (this.pageForm.invalid || !this.selectedSeries) return;

    const formData = {
      seriesId: this.selectedSeries.id,
      ...this.pageForm.value
    };

    this.comicService.createPage(this.selectedSeries.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('Page added successfully', 'success');
          this.loadSeriesPages(this.selectedSeries!.id);
          this.cancelPageForm();
        },
        error: (err) => {
          this.showMessage('Failed to add page', 'error');
          console.error('Error adding page:', err);
        }
      });
  }

  deletePage(page: ComicPage): void {
    if (!confirm(`Delete page ${page.pageNumber}?`)) return;

    this.comicService.deletePage(page.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('Page deleted successfully', 'success');
          if (this.selectedSeries) {
            this.loadSeriesPages(this.selectedSeries.id);
          }
        },
        error: (err) => {
          this.showMessage('Failed to delete page', 'error');
          console.error('Error deleting page:', err);
        }
      });
  }

  cancelPageForm(): void {
    this.showPageForm = false;
    this.pageForm.reset();
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadImage(input.files[0], 'cover');
    }
  }

  onPageImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadImage(input.files[0], 'page');
    }
  }

  private uploadImage(file: File, type: 'cover' | 'page'): void {
    if (type === 'cover') {
      this.uploadingCover = true;
    } else {
      this.uploadingPage = true;
    }

    this.comicService.uploadImage(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (type === 'cover') {
            this.seriesForm.patchValue({ coverImageUrl: response.url });
            this.uploadingCover = false;
          } else {
            this.pageForm.patchValue({ imageUrl: response.url });
            this.uploadingPage = false;
          }
          this.showMessage('Image uploaded successfully', 'success');
        },
        error: (err) => {
          this.showMessage('Failed to upload image', 'error');
          console.error('Error uploading image:', err);
          if (type === 'cover') {
            this.uploadingCover = false;
          } else {
            this.uploadingPage = false;
          }
        }
      });
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5292${url}`;
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}
