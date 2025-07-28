import { Routes } from '@angular/router';
import { PingTest } from './pages/ping-test/ping-test';

export const routes: Routes = [
  { path: 'ping', component: PingTest },
  { path: '', redirectTo: 'ping', pathMatch: 'full' }
];