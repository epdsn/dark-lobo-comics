import { Routes } from '@angular/router';
import { PingTest } from './pages/ping-test/ping-test';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'ping', component: PingTest },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];