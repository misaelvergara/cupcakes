import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Cupcake } from '../models/cupcake.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  items = this.cartItems.asReadonly();
  
  total = computed(() => {
    return this.cartItems().reduce((sum, item) => {
      return sum + (item.cupcake.price * item.quantity);
    }, 0);
  });

  itemCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  constructor() { }

  addToCart(cupcake: Cupcake): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.cupcake.id === cupcake.id);

    if (existingItem) {
      this.cartItems.set(
        currentItems.map(item =>
          item.cupcake.id === cupcake.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartItems.set([...currentItems, { cupcake, quantity: 1 }]);
    }
  }

  removeFromCart(cupcakeId: number): void {
    this.cartItems.set(
      this.cartItems().filter(item => item.cupcake.id !== cupcakeId)
    );
  }

  updateQuantity(cupcakeId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cupcakeId);
      return;
    }

    this.cartItems.set(
      this.cartItems().map(item =>
        item.cupcake.id === cupcakeId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
