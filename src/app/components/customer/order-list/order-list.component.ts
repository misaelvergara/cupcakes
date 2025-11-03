import { Component, OnInit } from '@angular/core';
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
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrders().reverse(); // Mais recente primeiro
  }

  getStatusLabel(status: Order['status']): string {
    const labels = {
      'pending': 'Enviado',
      'sent': 'Enviado',
      'completed': 'Finalizado'
    };
    return labels[status] || status;
  }

  markAsReceived(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'completed');
    this.orders = this.orderService.getOrders().reverse();
  }

  cancelOrder(orderId: string): void {
    // Para simplificar, vamos apenas remover visualmente
    // Em produção, você criaria um método no service
    this.orders = this.orders.filter(order => order.id !== orderId);
  }

  goHome(): void {
    this.router.navigate(['/customer']);
  }

  getPaymentMethodLabel(method: 'credit' | 'pix'): string {
    return method === 'credit' ? 'Cartão de Crédito' : 'PIX';
  }
}
