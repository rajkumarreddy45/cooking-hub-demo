import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookingClassService } from '../../services/cooking-class.service';
import { CookingClass } from '../../models/cooking-class.model';

@Component({
  selector: 'app-adminviewclass',
  templateUrl: './adminviewclass.component.html',
  styleUrls: ['./adminviewclass.component.css']
})
export class AdminviewclassComponent implements OnInit {
  cookingClasses: CookingClass[] = [];
  filteredClasses: CookingClass[] = [];
  searchTerm: string = '';
  selectedClass: CookingClass | null = null;
  loading: boolean = true;
  error: string = '';
  showDeleteModal: boolean = false;

  constructor(
    private cookingClassService: CookingClassService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCookingClasses();
  }

  loadCookingClasses(): void {
    this.loading = true;
    this.cookingClassService.getAllCookingClasses().subscribe(
      classes => {
        this.cookingClasses = classes;
        this.filteredClasses = classes;
        this.loading = false;
      },
      error => {
        console.error('Error loading cooking classes:', error);
        this.error = 'Failed to load cooking classes. Please try again later.';
        this.loading = false;
      }
    );
  }

  search(): void {
    if (!this.searchTerm) {
      this.filteredClasses = this.cookingClasses;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClasses = this.cookingClasses.filter(
      classItem => classItem.className.toLowerCase().includes(term)
    );
  }

  editClass(classId: number): void {
    this.router.navigate([`/admin/edit-class/${classId}`]);
  }

  confirmDelete(cookingClass: CookingClass): void {
    this.selectedClass = cookingClass;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedClass = null;
  }

  deleteClass(): void {
    if (!this.selectedClass || !this.selectedClass.cookingClassId) {
      return;
    }

    const classId = this.selectedClass.cookingClassId;
    
    this.cookingClassService.deleteCookingClass(classId).subscribe(
      () => {
        this.loadCookingClasses();
        this.closeDeleteModal();
      },
      error => {
        console.error('Error deleting cooking class:', error);
        if (error.error && typeof error.error === 'string' && error.error.includes('referenced in a request')) {
          Swal.fire({
            toast: true,
            position: 'top-end', // Places the toast at the top-right corner
            icon: 'error', // Icon type (success, error, warning, info, question)
            title: 'Cannot be deleted as it is referenced in a request',
            showConfirmButton: false, // Removes the confirmation button
            timer: 3000, // Auto-closes the toast after 3 seconds
            timerProgressBar: true, // Shows a progress bar
        });
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end', // Places the toast at the top-right corner
            icon: 'error', // Icon type (success, error, warning, info, question)
            title: 'Failed to delete cooking class. Please try again.',
            showConfirmButton: false, // Removes the confirmation button
            timer: 3000, // Auto-closes the toast after 3 seconds
            timerProgressBar: true, // Shows a progress bar
        })
        }
        this.closeDeleteModal();
      }
    );
  }
}