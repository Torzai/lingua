import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: any = null;
  stats: any = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.user = this.authService.getCurrentUser();

    this.apiService.getMyStats().subscribe({
      next: (data) => {
        console.log('Stats recibidas:', data);
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando stats:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToVocabulary() {
    this.router.navigate(['/vocabulary']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}