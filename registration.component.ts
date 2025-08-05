import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  submitting: boolean = false;
  roles: string[] = ['Admin', 'User'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
      Email: ['', [Validators.required, Validators.email]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.minLength(10),
      Validators.maxLength(10)]],
      Password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      UserRole: ['User', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/home']);
      } else {
        this.router.navigate(['/user/home']);
      }
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userModel: User = this.registrationForm.value;
      console.log(userModel);

      this.authService.register(userModel).subscribe(
        response => {
          console.log('Success Response:', response);

          this.successMessage = 'Registration successful!';

          // Navigate to login after a brief delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
          this.submitting = false;
        },
        error => {
          this.submitting = false;
          console.error('Error:', error);


          if (error.status === 400) {
            this.errorMessage = 'Invalid registration data';
          } else if (error.error && typeof error.error === 'string' && error.error.includes('already exists')) {
            this.errorMessage = 'User already exists';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  // Helper to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}