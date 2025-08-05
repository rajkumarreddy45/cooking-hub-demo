import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('statsSection', { static: true }) statsSection!: ElementRef;
  isAdmin: boolean = false;
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const userInfo = this.authService.getUserInfo();
    this.username = userInfo.username;
  }

  ngAfterViewInit() {
    this.observeStatsSection();
    this.animateHeroSection();
  }

  observeStatsSection() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateNumbers();
            observer.disconnect(); // Stop observing after animation starts
          }
        });
      },
      { threshold: 0.5 } // Animation triggers when 50% of the section is visible
    );

    observer.observe(this.statsSection.nativeElement);
  }

  animateNumbers() {
    // Define stat animations
    const stats = [
      { id: '#stat1', endValue: 12 },
      { id: '#stat2', endValue: 500 },
      { id: '#stat3', endValue: 50 },
      { id: '#stat4', endValue: 10 },
    ];

    // Animate stats using GSAP
    stats.forEach(stat => {
      gsap.to(stat.id, {
        innerHTML: stat.endValue,
        duration: 3,
        ease: "power1.out",
        snap: { innerHTML: 1 }
      });
    });
  }

  animateHeroSection() {
    const tl = gsap.timeline();

    // Left div slides in from the left
    tl.from("#leftDiv", {
      x: "-100%",
      opacity: 0,
      duration: 1,
      ease: "power1.out"
    });

    // Right div slides in from the right
    tl.from("#rightDiv", {
      x: "100%",
      opacity: 0,
      duration: 1,
      ease: "power1.out"
    }, "-=0.5"); // Overlap animations slightly
  }
}
