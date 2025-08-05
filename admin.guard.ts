import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    if (this.authService.isLoggedIn() && this.authService.isUser()) {
      this.router.navigate(['/user/home']);
      return false;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}