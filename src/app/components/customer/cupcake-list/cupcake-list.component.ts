import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CupcakeService } from '../../../services/cupcake.service';
import { CartService } from '../../../services/cart.service';
import { Cupcake } from '../../../models/cupcake.model';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-cupcake-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cupcake-list.component.html',
  styleUrl: './cupcake-list.component.scss'
})
export class CupcakeListComponent {
  // Usa signals diretamente para atualização automática
  cupcakes = this.cupcakeService.allCupcakes;
  cartItemCount = this.cartService.itemCount;

  constructor(
    private cupcakeService: CupcakeService,
    private cartService: CartService,
    private router: Router
  ) {}

  viewDetails(cupcake: Cupcake): void {
    this.router.navigate(['/customer/cupcake', cupcake.id]);
  }

  goToCart(): void {
    this.router.navigate(['/customer/cart']);
  }
}
