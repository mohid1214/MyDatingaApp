import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../Core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../Core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {

  protected creds: any = {};
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected busyService = inject(BusyService);

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme())
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if(elem) elem.blur();
  }

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
