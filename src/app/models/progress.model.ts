export interface Progress {
  id: string;
  userId: string;
  vocabularyId: string;
  repeticiones: number;
  dominio: number;
  correctas: number;
  incorrectas: number;
  ultimaPracticaFecha?: string;
  createdAt: string;
  updatedAt: string;
}
