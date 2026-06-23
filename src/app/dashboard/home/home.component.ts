import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  user = signal<any>(null);
  stats = signal<any>(null);
  loading = signal(true);

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.user.set(this.authService.getCurrentUser());

    this.apiService.getMyStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando stats:', err);
        this.loading.set(false);
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
