import { Component, OnInit } from '@angular/core';
import { CookingClassService } from '../../services/cooking-class.service';
import { AuthService } from '../../services/auth.service';
import { CookingClassRequest } from '../../models/cooking-class-request.model';

@Component({
  selector: 'app-userviewappliedrequest',
  templateUrl: './userviewappliedrequest.component.html',
  styleUrls: ['./userviewappliedrequest.component.css']
})
export class UserviewappliedrequestComponent implements OnInit {
  requests: CookingClassRequest[] = [];
  filteredRequests: CookingClassRequest[] = [];
  statusFilter: string = '';
  loading: boolean = true;
  error: string = '';
  selectedRequest: CookingClassRequest | null = null;
  showDetailsModal: boolean = false;

  constructor(
    private cookingClassService: CookingClassService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
  this.loading = true;
  const userInfo = this.authService.getUserInfo();

  this.cookingClassService.getCookingClassRequestsByUserId(userInfo.id).subscribe(
    requests => {
      this.requests = requests;

      // Fetch class details for each request
      this.requests.forEach(request => {
        this.cookingClassService.getCookingClassById(request.cookingClassId).subscribe(
          cookingClass => {
            request.cookingClass = cookingClass; // Attach details to request
          },
          error => {
            console.error(`Error fetching class details for ID ${request.cookingClassId}:`, error);
          }
        );
      });

      this.applyFilters();
      this.loading = false;
    },
    error => {
      console.error('Error loading cooking class requests:', error);
      this.error = 'Failed to load requests. Please try again later.';
      this.loading = false;
    }
  );
}


  applyFilters(): void {
    let filtered = this.requests;
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(request => request.status === this.statusFilter);
    }
    
    this.filteredRequests = filtered;
  }

  viewDetails(request: CookingClassRequest): void {
    this.selectedRequest = request;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRequest = null;
  }
}
