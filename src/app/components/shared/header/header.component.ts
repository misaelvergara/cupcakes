import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() title: string = 'Cupcakes gourmet';
  @Input() showCart: boolean = false;
  @Input() cartItemCount: number = 0;
  @Output() cartClick = new EventEmitter<void>();

  onCartClick(): void {
    this.cartClick.emit();
  }
}
