import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../Core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink,RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected creds: any = {};
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.toast.success('Login successful!');
        this.router.navigateByUrl('/members');
        this.creds = {};
      },
      error: error => {
        console.log(error.error);
        this.toast.error(error.error);
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
