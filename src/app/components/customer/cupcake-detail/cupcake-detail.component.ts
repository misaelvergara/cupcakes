import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CupcakeService } from '../../../services/cupcake.service';
import { CartService } from '../../../services/cart.service';
import { Cupcake } from '../../../models/cupcake.model';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-cupcake-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cupcake-detail.component.html',
  styleUrl: './cupcake-detail.component.scss'
})
export class CupcakeDetailComponent implements OnInit {
  cupcake: Cupcake | undefined;
  cartItemCount = this.cartService.itemCount;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cupcakeService: CupcakeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cupcake = this.cupcakeService.getCupcakeById(id);
    
    if (!this.cupcake) {
      this.router.navigate(['/customer/cupcakes']);
    }
  }

  addToCart(): void {
    if (this.cupcake) {
      this.cartService.addToCart(this.cupcake);
      this.router.navigate(['/customer/cupcakes']);
    }
  }

  goToCart(): void {
    this.router.navigate(['/customer/cart']);
  }
}
