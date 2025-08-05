import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  loading: boolean = true;
  error: string = '';
  selectedFeedback: Feedback | null = null;
  showDeleteModal: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.loading = true;
    const userInfo = this.authService.getUserInfo();
    const userId = +(userInfo.id);
    
    this.feedbackService.getAllFeedbacksByUserId(userId).subscribe(
      feedbacks => {
        this.feedbacks = feedbacks;
        this.loading = false;
      },
      error => {
        console.error('Error loading feedbacks:', error);
        this.error = 'Failed to load feedbacks. Please try again later.';
        this.loading = false;
      }
    );
  }

  confirmDelete(feedback: Feedback): void {
    this.selectedFeedback = feedback;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedFeedback = null;
  }

  deleteFeedback(): void {
    if (!this.selectedFeedback || !this.selectedFeedback.feedbackId) {
      return;
    }

    const feedbackId = this.selectedFeedback.feedbackId;
    console.log(feedbackId);
    
    this.feedbackService.deleteFeedback(feedbackId).subscribe(
      () => {
        this.loadFeedbacks();
        this.closeDeleteModal();
      },
      error => {
        alert('');
        Swal.fire({
          toast: true,
          position: 'top-end', // Places the toast at the top-right corner
          icon: 'error', // Icon type (success, error, warning, info, question)
          title: 'Failed to delete feedback. Please try again.',
          showConfirmButton: false, // Removes the confirmation button
          timer: 3000, // Auto-closes the toast after 3 seconds
          timerProgressBar: true, // Shows a progress bar
          background: '#ffd6d6', // Custom background color
      });
        this.closeDeleteModal();
      }
    );
  }
}
