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

  constructor(
    private cupcakeService: CupcakeService
  ) {}

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
      } as Cupcake);
      this.editingCupcake = null;
    } else {
      // Add new
      this.cupcakeService.addCupcake(this.newCupcake as Omit<Cupcake, 'id'>);
    }

    this.resetForm();
  }

  editCupcake(cupcake: Cupcake): void {
    this.editingCupcake = cupcake;
    this.newCupcake = { ...cupcake };
  }

  deleteCupcake(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cupcake?')) {
      this.cupcakeService.deleteCupcake(id);
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
