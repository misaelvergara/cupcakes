import { Routes } from '@angular/router';
import { HomeCustomerComponent } from './components/customer/home-customer/home-customer.component';
import { CupcakeListComponent } from './components/customer/cupcake-list/cupcake-list.component';
import { CupcakeDetailComponent } from './components/customer/cupcake-detail/cupcake-detail.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { OrderConfirmationComponent } from './components/customer/order-confirmation/order-confirmation.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customer', pathMatch: 'full' },
  { path: 'customer', component: HomeCustomerComponent },
  { path: 'customer/cupcakes', component: CupcakeListComponent },
  { path: 'customer/cupcake/:id', component: CupcakeDetailComponent },
  { path: 'customer/cart', component: CartComponent },
  { path: 'customer/confirmation', component: OrderConfirmationComponent },
  { path: '**', redirectTo: '/customer' }
];
