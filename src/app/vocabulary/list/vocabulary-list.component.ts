import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-vocabulary-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vocabulary-list.component.html',
  styleUrls: ['./vocabulary-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabularyListComponent implements OnInit {
  vocabulario = signal<any[]>([]);
  categorias = signal<string[]>([]);
  niveles = signal<string[]>([]);

  selectedCategoria = '';
  selectedNivel = '';
  searchTerm = '';

  loading = signal(false);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategorias();
    this.loadNiveles();
    this.loadVocabulario();
  }

  loadCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data);
      },
    });
  }

  loadNiveles() {
    this.apiService.getNiveles().subscribe({
      next: (data) => {
        this.niveles.set(data);
      },
    });
  }

  loadVocabulario() {
    this.loading.set(true);
    this.apiService.getVocabulary(
      this.selectedCategoria || undefined,
      this.selectedNivel || undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (data) => {
        this.vocabulario.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onFilterChange() {
    this.loadVocabulario();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.loadVocabulario();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
