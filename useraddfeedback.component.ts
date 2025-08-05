import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  errorMessage: string = '';
  showSuccessModal: boolean = false;
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      feedbackText: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      
      const userInfo = this.authService.getUserInfo();
      const userId = +(userInfo.id);
      
      const feedback: Feedback = {
        userId: userId,
        feedbackText: this.feedbackForm.value.feedbackText,
        date: new Date()
      };
      
      this.feedbackService.sendFeedback(feedback).subscribe(
        () => {
          this.submitting = false;
          this.showSuccessModal = true;
        },
        error => {
          this.submitting = false;
          this.errorMessage = 'Failed to submit feedback. Please try again later.';
        }
      );
    } else {
      this.markFormGroupTouched(this.feedbackForm);
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/user/view-feedback']);
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


