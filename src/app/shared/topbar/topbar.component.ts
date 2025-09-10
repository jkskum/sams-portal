import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopBarComponent {

  constructor(
    private router: Router,
  ) {}


  onLogout() {
    this.router.navigate(['/auth/login']);
  }
}
