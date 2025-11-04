import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cupcake } from '../models/cupcake.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CupcakeService {
  private apiUrl = `${environment.apiUrl}/cupcakes`;
  private cupcakes = signal<Cupcake[]>([]);
  
  allCupcakes = this.cupcakes.asReadonly();

  constructor(private http: HttpClient) {
    this.loadCupcakes();
  }

  // Carrega cupcakes do backend
  private loadCupcakes(): void {
    this.http.get<Cupcake[]>(this.apiUrl).subscribe({
      next: (cupcakes) => {
        this.cupcakes.set(cupcakes);
      },
      error: (error) => {
        console.error('Error loading cupcakes:', error);
      }
    });
  }

  getCupcakes(): Cupcake[] {
    return this.cupcakes();
  }

  getCupcakeById(id: number): Cupcake | undefined {
    return this.cupcakes().find(c => c.id === id);
  }

  addCupcake(cupcake: Omit<Cupcake, 'id'>): Observable<Cupcake> {
    return this.http.post<Cupcake>(this.apiUrl, cupcake).pipe(
      tap(newCupcake => {
        this.cupcakes.set([...this.cupcakes(), newCupcake]);
      })
    );
  }

  updateCupcake(cupcake: Cupcake): Observable<Cupcake> {
    return this.http.put<Cupcake>(`${this.apiUrl}/${cupcake.id}`, cupcake).pipe(
      tap(updatedCupcake => {
        this.cupcakes.set(
          this.cupcakes().map(c => c.id === updatedCupcake.id ? updatedCupcake : c)
        );
      })
    );
  }

  deleteCupcake(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.cupcakes.set(
          this.cupcakes().filter(c => c.id !== id)
        );
      })
    );
  }

  // Recarrega cupcakes do servidor (útil para sincronizar)
  refresh(): void {
    this.loadCupcakes();
  }
}
