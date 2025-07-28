import { Component } from '@angular/core';
import { ApiService } from '../../sevices/api';
@Component({
  selector: 'app-ping-test',
  imports: [],
  templateUrl: './ping-test.html',
  styleUrl: './ping-test.scss'
})
export class PingTest {
  msg = 'Loading...';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.ping().subscribe({
      next: res => this.msg = res.message,
      error: err => this.msg = 'Error: ' + err.message
    });
  }
}
