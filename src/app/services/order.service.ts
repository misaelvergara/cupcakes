import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Order } from '../models/cupcake.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private orders = signal<Order[]>([]);
  
  allOrders = this.orders.asReadonly();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  // Carrega pedidos do backend
  private loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (orders) => {
        // Converte as datas de string para Date
        const ordersWithDates = orders.map(order => ({
          ...order,
          date: new Date(order.date)
        }));
        this.orders.set(ordersWithDates);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  createOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Observable<Order> {
    const newOrder = {
      ...order,
      id: this.generateOrderId()
    };

    return this.http.post<Order>(this.apiUrl, newOrder).pipe(
      tap(createdOrder => {
        const orderWithDate = {
          ...createdOrder,
          date: new Date(createdOrder.date)
        };
        this.orders.set([...this.orders(), orderWithDate]);
      })
    );
  }

  getOrders(): Order[] {
    return this.orders();
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find(order => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(() => {
        this.orders.set(
          this.orders().map(order =>
            order.id === id ? { ...order, status } : order
          )
        );
      })
    );
  }

  // Recarrega pedidos do servidor
  refresh(): void {
    this.loadOrders();
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
