import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-customer',
  standalone: true,
  imports: [],
  templateUrl: './home-customer.component.html',
  styleUrl: './home-customer.component.scss'
})
export class HomeCustomerComponent {
  constructor(private router: Router) {}

  goToOrders(): void {
    this.router.navigate(['/customer/orders']);
  }

  goToCupcakes(): void {
    this.router.navigate(['/customer/cupcakes']);
  }
}
