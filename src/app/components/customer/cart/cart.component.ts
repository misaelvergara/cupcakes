import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems = this.cartService.items;
  total = this.cartService.total;
  address = '';
  selectedPayment: 'credit' | 'pix' | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  removeItem(cupcakeId: number): void {
    this.cartService.removeFromCart(cupcakeId);
  }

  selectPayment(method: 'credit' | 'pix'): void {
    this.selectedPayment = method;
    this.processOrder();
  }

  processOrder(): void {
    if (!this.address.trim()) {
      alert('Por favor, digite seu endereço');
      return;
    }

    if (!this.selectedPayment) {
      return;
    }

    this.orderService.createOrder({
      items: this.cartItems(),
      total: this.total(),
      address: this.address,
      paymentMethod: this.selectedPayment
    }).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/customer/confirmation'], { 
          state: { orderId: order.id } 
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Erro ao criar pedido. Tente novamente.');
      }
    });
  }
}
