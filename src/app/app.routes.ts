import { Routes } from '@angular/router';
import { PingTest } from './pages/ping-test/ping-test';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Home } from './pages/home/home';
import { Comics } from './pages/comics/comics';
import { ComicReader } from './pages/comic-reader/comic-reader';
import { Admin } from './pages/admin/admin';
import { SubscriptionPage } from './pages/subscription/subscription';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SubscriptionGuard } from './guards/subscription.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'ping', component: PingTest },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'comics', component: Comics, canActivate: [AuthGuard] },
  { path: 'comics/:seriesId/read', component: ComicReader, canActivate: [SubscriptionGuard] },
  { path: 'admin', component: Admin, canActivate: [AdminGuard] },
  { path: 'subscription', component: SubscriptionPage, canActivate: [AuthGuard] }
];