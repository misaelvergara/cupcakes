import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/cupcake.model';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
  @Output() homeClick = new EventEmitter<void>();
  
  // Usa signal diretamente para atualização automática
  orders = computed(() => {
    return [...this.orderService.allOrders()].reverse(); // Mais recente primeiro
  });

  constructor(
    private orderService: OrderService
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

  getStatusClass(status: Order['status']): string {
    if (status === 'completed') return 'completed';
    if (status === 'sent') return 'sent';
    if (status === 'cancelled') return 'cancelled';
    return 'pending';
  }

  markAsSent(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'sent').subscribe({
      next: () => {
        console.log('Order marked as sent');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Erro ao atualizar status do pedido. Tente novamente.');
      }
    });
  }

  markAsCancelled(orderId: string): void {
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
    this.homeClick.emit();
  }

  getPaymentMethodLabel(method: 'credit' | 'pix'): string {
    return method === 'credit' ? 'CC' : 'PIX';
  }
}
