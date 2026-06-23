export interface User {
  id: string;
  email: string;
  nombre: string;
  avatar?: string;
  idiomaNativo: string;
  idiomaNivelES: number;
  idiomaNivelIT: number;
  puntos: number;
  premium: boolean;
  premiumExpira?: string;
  racha: number;
  ultimaPracticaFecha?: string;
  totalDiasActivos: number;
  createdAt: string;
  updatedAt: string;
}
