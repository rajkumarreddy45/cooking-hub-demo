import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {
  showLogoutModal: boolean = false;
  username: string = '';
  userRole: string = '';

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.username = userInfo.username;
    this.userRole = this.authService.getUserRole();
  }


  isDropdownHidden: boolean = true;
  toggleDropdown() {
    this.isDropdownHidden = !this.isDropdownHidden;
  }
  
  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeLogoutModal();
    this.router.navigate(['/home']);
  }
}