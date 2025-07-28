import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5292/api';

  constructor(private http: HttpClient) {}

  ping(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test/ping`);
  }
}