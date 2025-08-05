import { Component, OnInit } from '@angular/core';
import { CookingClassService } from '../../services/cooking-class.service';
import { CookingClassRequest } from '../../models/cooking-class-request.model';

@Component({
  selector: 'app-adminviewappliedrequest',
  templateUrl: './adminviewappliedrequest.component.html',
  styleUrls: ['./adminviewappliedrequest.component.css']
})
export class AdminviewappliedrequestComponent implements OnInit {
  requests: CookingClassRequest[] = [];
  filteredRequests: CookingClassRequest[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  loading: boolean = true;
  error: string = '';
  selectedRequest: CookingClassRequest | null = null;
  showProfileModal: boolean = false;

  constructor(private cookingClassService: CookingClassService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.cookingClassService.getAllCookingClassRequests().subscribe(
      requests => {
        this.requests = requests;
        this.filteredRequests = requests;
        console.log(requests);
        this.loading = false;
      },
      error => {
        console.error('Error loading cooking class requests:', error);
        this.error = 'Failed to load requests. Please try again later.';
        this.loading = false;
      }
    );
  }

  search(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.requests;
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        request => request.cookingClass?.className.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(request => request.status === this.statusFilter);
    }
    
    this.filteredRequests = filtered;
  }

  updateStatus(requestId: number, status: string): void {
    const request = this.requests.find(r => r.cookingClassRequestId === requestId);
    if (!request) return;
    
    const updatedRequest = { ...request, status: status };
    
    this.cookingClassService.updateCookingClassRequest(requestId.toString(), updatedRequest).subscribe(
      () => {
        const index = this.requests.findIndex(r => r.cookingClassRequestId === requestId);
        if (index !== -1) {
          this.requests[index].status = status;
          this.applyFilters(); // Re-apply filters to update the filtered list
        }
      },
      error => {
        console.error('Error updating request status:', error);
        Swal.fire({
          toast: true,
          position: 'top-end', // Places the toast at the top-right corner
          icon: 'error', // Icon type (success, error, warning, info, question)
          title: 'Failed to update request status. Please try again.',
          showConfirmButton: false, // Removes the confirmation button
          timer: 3000, // Auto-closes the toast after 3 seconds
          timerProgressBar: true, // Shows a progress bar
          background: '#ffd6d6', // Custom background color
      });
      }
    );
  }

  viewProfile(request: CookingClassRequest): void {
    this.selectedRequest = request;
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedRequest = null;
  }
}