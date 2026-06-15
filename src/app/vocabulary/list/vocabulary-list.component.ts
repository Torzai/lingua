import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
})
export class VocabularyListComponent implements OnInit {
  vocabulario: any[] = [];
  categorias: string[] = [];
  niveles: string[] = [];

  selectedCategoria = '';
  selectedNivel = '';
  searchTerm = '';

  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCategorias();
    this.loadNiveles();
    this.loadVocabulario();
  }

  loadCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
    });
  }

  loadNiveles() {
    this.apiService.getNiveles().subscribe({
      next: (data) => {
        this.niveles = data;
      },
    });
  }

  loadVocabulario() {
    this.loading = true;
    this.apiService.getVocabulary(
      this.selectedCategoria || undefined,
      this.selectedNivel || undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (data) => {
        console.log('Vocabulario recibido:', data);
        this.vocabulario = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
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