import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerData: RegisterRequest = {
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  };
  
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('Register form submitted:', this.registerData);
    console.log('Confirm password:', this.confirmPassword);
    console.log('Form valid:', true); // We'll check this later
    
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Validate required fields
    if (!this.registerData.email || !this.registerData.password || !this.registerData.username) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    // Validate password requirements
    if (!this.isPasswordValid()) {
      this.errorMessage = 'Password does not meet requirements. Please check the password requirements below.';
      return;
    }

    // Clean up the data - remove empty strings for optional fields
    const cleanData = {
      ...this.registerData,
      firstName: this.registerData.firstName || undefined,
      lastName: this.registerData.lastName || undefined
    };
    
    console.log('Cleaned registration data:', cleanData);

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(cleanData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.error);
        console.error('Full error response:', error);
        this.isLoading = false;
        
        // Try to extract more detailed error information
        if (error.error && typeof error.error === 'object') {
          if (error.error.errors) {
            // Handle validation errors
            const validationErrors = Object.values(error.error.errors).flat();
            this.errorMessage = validationErrors.join(', ');
          } else if (error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please check your input and try again.';
          }
        } else if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.registerData.password);
  }

  hasNonAlphanumeric(): boolean {
    return /[^a-zA-Z0-9]/.test(this.registerData.password);
  }

  isPasswordValid(): boolean {
    return this.registerData.password.length >= 6 && 
           this.hasUppercase() && 
           this.hasNonAlphanumeric();
  }
} 