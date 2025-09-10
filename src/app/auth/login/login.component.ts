import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private router: Router) { }

  showPassword = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.email.valid && this.password.valid) {
      console.log('Login form submitted: ' + this.email.value + ' ' + this.password.value);
      this.router.navigate(['user/user-create']);
    }
  }
}
