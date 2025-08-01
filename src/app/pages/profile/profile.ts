import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  user: User | null = null;
  editMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  editData: Partial<User> = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    console.log('Loading profile...');
    this.isLoading = true;
    this.errorMessage = '';
    
    // First try to get the current user from the auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      console.log('Using current user from auth service:', currentUser);
      this.user = currentUser;
      this.editData = { ...currentUser };
      this.isLoading = false;
      return;
    }
    
    this.authService.getProfile().subscribe({
      next: (user) => {
        console.log('Profile loaded successfully:', user);
        this.user = user;
        this.editData = { ...user };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Profile loading error:', error);
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editData = { ...this.user };
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile(this.editData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editMode = false;
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update profile';
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editData = { ...this.user };
    this.errorMessage = '';
    this.successMessage = '';
  }
} 