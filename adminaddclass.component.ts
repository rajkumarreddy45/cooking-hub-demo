import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookingClassService } from '../../services/cooking-class.service';
import { CookingClass } from '../../models/cooking-class.model';

@Component({
  selector: 'app-adminaddclass',
  templateUrl: './adminaddclass.component.html',
  styleUrls: ['./adminaddclass.component.css']
})
export class AdminaddclassComponent implements OnInit {
  classForm: FormGroup;
  errorMessage: string = '';
  showSuccessModal: boolean = false;
  submitting: boolean = false;
  skillLevels: string[] = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private fb: FormBuilder,
    private cookingClassService: CookingClassService,
    private router: Router
  ) {
    this.classForm = this.fb.group({
      className: ['', Validators.required],
      cuisineType: ['', Validators.required],
      chefName: ['', Validators.required],
      location: ['', Validators.required],
      durationInHours: ['', [Validators.required, Validators.min(1)]],
      fee: ['', [Validators.required, Validators.min(1)]],
      ingredientsProvided: ['', Validators.required],
      skillLevel: ['', Validators.required],
      specialRequirements: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.classForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      
      const cookingClass: CookingClass = this.classForm.value;
      
      this.cookingClassService.addCookingClass(cookingClass).subscribe(
        () => {
          this.submitting = false;
          this.showSuccessModal = true;
        },
        error => {
          this.submitting = false;
          
          if (error.error && typeof error.error === 'string' && error.error.includes('already exists')) {
            this.errorMessage = 'Cooking class with the same name already exists';
          } else {
            this.errorMessage = 'Failed to add cooking class. Please try again.';
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.classForm);
      this.errorMessage = 'All fields are required';
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/admin/view-class']);
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