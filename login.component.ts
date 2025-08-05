import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
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
    if (this.loginForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      
      const loginModel: Login = this.loginForm.value;
      
      this.authService.login(loginModel).subscribe(
        response => {
          this.submitting = false;
          Swal.fire({
            toast: true,
            position: 'top-end', // Places the toast at the top-right corner
            icon: 'success', // Icon type (success, error, warning, info, question)
            title: 'Logged in Successfully',
            showConfirmButton: false, // Removes the confirmation button
            timer: 3000, // Auto-closes the toast after 3 seconds
            timerProgressBar: true, // Shows a progress bar
        });
          // Redirect based on role
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/home']);
          } else {
            this.router.navigate(['/user/home']);
          }
        },
        error => {
          this.submitting = false;
          
          if (error.status === 401) {
            this.errorMessage = error.error;
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.loginForm);
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