import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookingClassService } from '../../services/cooking-class.service';
import { AuthService } from '../../services/auth.service';
import { CookingClass } from '../../models/cooking-class.model';
import { CookingClassRequest } from '../../models/cooking-class-request.model';

@Component({
  selector: 'app-useraddrequest',
  templateUrl: './useraddrequest.component.html',
  styleUrls: ['./useraddrequest.component.css']
})
export class UseraddrequestComponent implements OnInit {
  requestForm: FormGroup;
  cookingClass: CookingClass | null = null;
  loading: boolean = true;
  submitting: boolean = false;
  errorMessage: string = '';
  showSuccessModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookingClassService: CookingClassService,
    private authService: AuthService
  ) 
  {
    this.requestForm = this.fb.group({
      DietaryPreferences: ['', Validators.required],
      CookingGoals: ['', Validators.required],
      Comments: ['']
    });
  }

  ngOnInit(): void {
    const selectedClassId = +localStorage.getItem('selectedClassId');
    console.log(selectedClassId);
    
    if (!selectedClassId) {
      this.router.navigate(['/user/view-classes']);
      return;
    }

    this.loadCookingClass(selectedClassId);
  }

  loadCookingClass(classId: number): void {
    this.cookingClassService.getCookingClassById(classId).subscribe(
      cookingClass => {
        this.cookingClass = cookingClass;
        this.loading = false;
      },
      error => {
        console.error('Error loading cooking class:', error);
        this.errorMessage = 'Failed to load cooking class. Please try again later.';
        this.loading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.requestForm.valid && this.cookingClass) {
      this.submitting = true;
      this.errorMessage = '';
      
      const userInfo = this.authService.getUserInfo();
      const userId = +(userInfo.id);
      
      const request: CookingClassRequest = {
        userId: userId,
        cookingClassId: this.cookingClass.cookingClassId!,
        requestDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        status: 'Pending',
        dietaryPreferences: this.requestForm.value.DietaryPreferences,
        cookingGoals: this.requestForm.value.CookingGoals,
        comments: this.requestForm.value.Comments
      };
      
      this.cookingClassService.addCookingClassRequest(request).subscribe(
        () => {
          this.submitting = false;
          this.showSuccessModal = true;
        },
        error => {
          this.submitting = false;
          
          if (error.error && typeof error.error === 'string' && error.error.includes('already requested')) {
            this.errorMessage = 'You have already requested this cooking class';
          } else {
            this.errorMessage = 'Failed to submit request. Please try again later.';
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.requestForm);
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    localStorage.removeItem('selectedClassId');
    this.router.navigate(['/user/applied-requests']);
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