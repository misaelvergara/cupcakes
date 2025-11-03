import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

// Import dos componentes admin
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { ManageCupcakesComponent } from './components/admin/manage-cupcakes/manage-cupcakes.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    HomeAdminComponent,
    ManageCupcakesComponent,
    AdminOrdersComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cupcakes';
  isCustomerHomePage = true;
  isAdminHomePage = true;

  // Estado da navegação do admin
  adminCurrentView: 'home' | 'orders' | 'cupcakes' = 'home';
  private adminHistory: ('home' | 'orders' | 'cupcakes')[] = ['home'];

  constructor(
    private router: Router
  ) {
    // Monitora mudanças de rota para atualizar o estado do cliente
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isCustomerHomePage = event.url === '/customer' || event.url === '/';
      });
  }

  // Navegação do cliente
  goBackCustomer(): void {
    if (!this.isCustomerHomePage) {
      window.history.back();
    }
  }

  goHomeCustomer(): void {
    this.router.navigate(['/customer']);
  }

  // Navegação do admin
  navigateAdmin(view: 'home' | 'orders' | 'cupcakes'): void {
    this.adminCurrentView = view;
    this.adminHistory.push(view);
    this.isAdminHomePage = view === 'home';
  }

  goBackAdmin(): void {
    if (this.adminHistory.length > 1) {
      this.adminHistory.pop();
      this.adminCurrentView = this.adminHistory[this.adminHistory.length - 1];
      this.isAdminHomePage = this.adminCurrentView === 'home';
    }
  }

  goHomeAdmin(): void {
    this.adminCurrentView = 'home';
    this.adminHistory = ['home'];
    this.isAdminHomePage = true;
  }
}
