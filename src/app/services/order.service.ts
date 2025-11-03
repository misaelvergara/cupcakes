import { Injectable, signal } from '@angular/core';
import { Order } from '../models/cupcake.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = signal<Order[]>([]);
  
  allOrders = this.orders.asReadonly();

  constructor() { }

  createOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Order {
    const newOrder: Order = {
      ...order,
      id: this.generateOrderId(),
      date: new Date(),
      status: 'pending'
    };

    this.orders.set([...this.orders(), newOrder]);
    return newOrder;
  }

  getOrders(): Order[] {
    return this.orders();
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find(order => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): void {
    this.orders.set(
      this.orders().map(order =>
        order.id === id ? { ...order, status } : order
      )
    );
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
