import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/cupcake.model';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  // Usa signal diretamente para atualização automática
  orders = computed(() => {
    return [...this.orderService.allOrders()].reverse(); // Mais recente primeiro
  });

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  getStatusLabel(status: Order['status']): string {
    const labels = {
      'pending': 'Solicitado',
      'sent': 'Enviado',
      'completed': 'Recebido',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  markAsReceived(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'completed').subscribe({
      next: () => {
        console.log('Order marked as completed');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Erro ao atualizar status do pedido. Tente novamente.');
      }
    });
  }

  cancelOrder(orderId: string): void {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.orderService.updateOrderStatus(orderId, 'cancelled').subscribe({
        next: () => {
          console.log('Order cancelled');
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Erro ao cancelar pedido. Tente novamente.');
        }
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/customer']);
  }

  getPaymentMethodLabel(method: 'credit' | 'pix'): string {
    return method === 'credit' ? 'Cartão de Crédito' : 'PIX';
  }
}
