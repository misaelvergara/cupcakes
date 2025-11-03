import { Routes } from '@angular/router';
import { HomeCustomerComponent } from './components/customer/home-customer/home-customer.component';
import { CupcakeListComponent } from './components/customer/cupcake-list/cupcake-list.component';
import { CupcakeDetailComponent } from './components/customer/cupcake-detail/cupcake-detail.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { OrderConfirmationComponent } from './components/customer/order-confirmation/order-confirmation.component';
import { OrderListComponent } from './components/customer/order-list/order-list.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { ManageCupcakesComponent } from './components/admin/manage-cupcakes/manage-cupcakes.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customer', pathMatch: 'full' },
  { path: 'customer', component: HomeCustomerComponent },
  { path: 'customer/orders', component: OrderListComponent },
  { path: 'customer/cupcakes', component: CupcakeListComponent },
  { path: 'customer/cupcake/:id', component: CupcakeDetailComponent },
  { path: 'customer/cart', component: CartComponent },
  { path: 'customer/confirmation', component: OrderConfirmationComponent },
  { path: 'admin', component: HomeAdminComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/manage-cupcakes', component: ManageCupcakesComponent },
  { path: '**', redirectTo: '/customer' }
];
