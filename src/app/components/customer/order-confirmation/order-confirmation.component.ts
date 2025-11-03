import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent {
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/customer']);
  }
}
