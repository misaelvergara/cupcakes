import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cupcakes';
  isHomePage = true;

  constructor(
    private location: Location,
    private router: Router
  ) {
    // Monitora mudanças de rota para atualizar o estado
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isHomePage = event.url === '/customer' || event.url === '/';
      });
  }

  goBack(): void {
    if (!this.isHomePage) {
      this.location.back();
    }
  }

  goHome(): void {
    this.router.navigate(['/customer']);
  }
}
