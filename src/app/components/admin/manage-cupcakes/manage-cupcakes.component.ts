import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CupcakeService } from '../../../services/cupcake.service';
import { Cupcake } from '../../../models/cupcake.model';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-manage-cupcakes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './manage-cupcakes.component.html',
  styleUrl: './manage-cupcakes.component.scss'
})
export class ManageCupcakesComponent {
  @Output() homeClick = new EventEmitter<void>();
  
  // Usa signal diretamente para atualização automática
  cupcakes = this.cupcakeService.allCupcakes;
  
  editingCupcake: Cupcake | null = null;
  newCupcake: Partial<Cupcake> = {
    name: '',
    price: 0,
    image: '',
    description: ''
  };

  // Array de URLs reais de imagens de cupcakes
  private cupcakeImages = [
    'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=400&h=400&fit=crop&q=80'
  ];

  constructor(
    private cupcakeService: CupcakeService
  ) {}

  generateRandomImage(): void {
    // Seleciona uma imagem aleatória do array de cupcakes reais
    const randomIndex = Math.floor(Math.random() * this.cupcakeImages.length);
    this.newCupcake.image = this.cupcakeImages[randomIndex];
  }

  addOrUpdateCupcake(): void {
    if (!this.newCupcake.name || !this.newCupcake.price || !this.newCupcake.image) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.editingCupcake) {
      // Update existing
      this.cupcakeService.updateCupcake({
        ...this.editingCupcake,
        ...this.newCupcake
      } as Cupcake).subscribe({
        next: () => {
          this.editingCupcake = null;
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating cupcake:', error);
          alert('Erro ao atualizar cupcake. Tente novamente.');
        }
      });
    } else {
      // Add new
      this.cupcakeService.addCupcake(this.newCupcake as Omit<Cupcake, 'id'>).subscribe({
        next: () => {
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding cupcake:', error);
          alert('Erro ao adicionar cupcake. Tente novamente.');
        }
      });
    }
  }

  editCupcake(cupcake: Cupcake): void {
    this.editingCupcake = cupcake;
    this.newCupcake = { ...cupcake };
  }

  deleteCupcake(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cupcake?')) {
      this.cupcakeService.deleteCupcake(id).subscribe({
        next: () => {
          console.log('Cupcake deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting cupcake:', error);
          alert('Erro ao deletar cupcake. Tente novamente.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingCupcake = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newCupcake = {
      name: '',
      price: 0,
      image: '',
      description: ''
    };
  }

  goHome(): void {
    this.homeClick.emit();
  }
}
