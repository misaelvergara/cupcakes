import { Injectable } from '@angular/core';
import { Cupcake } from '../models/cupcake.model';

@Injectable({
  providedIn: 'root'
})
export class CupcakeService {
  private cupcakes: Cupcake[] = [
    {
      id: 1,
      name: 'Cupcakke de morango',
      price: 10.89,
      image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop',
      description: 'Delicioso cupcake de morango com cobertura cremosa'
    },
    {
      id: 2,
      name: 'Cupcakke de maracujá',
      price: 10.89,
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&h=400&fit=crop',
      description: 'Cupcake tropical de maracujá com decoração especial'
    }
  ];

  constructor() { }

  getCupcakes(): Cupcake[] {
    return this.cupcakes;
  }

  getCupcakeById(id: number): Cupcake | undefined {
    return this.cupcakes.find(c => c.id === id);
  }
}
