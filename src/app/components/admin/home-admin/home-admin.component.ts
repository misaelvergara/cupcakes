import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent {
  @Output() ordersClick = new EventEmitter<void>();
  @Output() cupcakesClick = new EventEmitter<void>();

  goToOrders(): void {
    this.ordersClick.emit();
  }

  goToManageCupcakes(): void {
    this.cupcakesClick.emit();
  }
}
