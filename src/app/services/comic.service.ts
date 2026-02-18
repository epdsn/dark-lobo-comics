import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComicSeries {
  id: string;
  title: string;
  description: string;
  isPremium: boolean;
  coverImageUrl?: string;
  createdAt: Date;
  pageCount: number;
}

export interface ComicPage {
  id: string;
  seriesId: string;
  pageNumber: number;
  imageUrl: string;
}

export interface CreateComicSeriesRequest {
  title: string;
  description: string;
  isPremium: boolean;
  coverImageUrl?: string;
}

export interface UpdateComicSeriesRequest {
  title?: string;
  description?: string;
  isPremium?: boolean;
  coverImageUrl?: string;
}

export interface CreateComicPageRequest {
  seriesId: string;
  pageNumber: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComicService {
  private readonly API_URL = 'http://localhost:5292/api/comics';

  constructor(private http: HttpClient) {}

  getAllSeries(): Observable<ComicSeries[]> {
    return this.http.get<ComicSeries[]>(this.API_URL);
  }

  getSeriesById(id: string): Observable<ComicSeries> {
    return this.http.get<ComicSeries>(`${this.API_URL}/${id}`);
  }

  getSeriesPages(id: string): Observable<ComicPage[]> {
    return this.http.get<ComicPage[]>(`${this.API_URL}/${id}/pages`);
  }

  createSeries(request: CreateComicSeriesRequest): Observable<ComicSeries> {
    return this.http.post<ComicSeries>(this.API_URL, request);
  }

  updateSeries(id: string, request: UpdateComicSeriesRequest): Observable<ComicSeries> {
    return this.http.put<ComicSeries>(`${this.API_URL}/${id}`, request);
  }

  deleteSeries(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  createPage(seriesId: string, request: CreateComicPageRequest): Observable<ComicPage> {
    return this.http.post<ComicPage>(`${this.API_URL}/${seriesId}/pages`, request);
  }

  updatePage(pageId: string, pageNumber: number, imageUrl: string): Observable<ComicPage> {
    return this.http.put<ComicPage>(`${this.API_URL}/pages/${pageId}`, { pageNumber, imageUrl });
  }

  deletePage(pageId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/pages/${pageId}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>('http://localhost:5292/api/upload/image', formData);
  }
}
