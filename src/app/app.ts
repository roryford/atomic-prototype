import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Button],
  template: `
    <nav class="app-nav">
      <div class="nav-brand">Atomic POC</div>
      <div class="nav-links">
        <p-button label="Dashboard" [link]="true" routerLink="/dashboard" severity="secondary" [text]="true" />
        <p-button label="List" [link]="true" routerLink="/list" severity="secondary" [text]="true" />
        <p-button label="Detail" [link]="true" routerLink="/detail/1" severity="secondary" [text]="true" />
      </div>
    </nav>
    <main class="app-content">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--p-content-background);
    }

    .app-nav {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 8px 24px;
      background: var(--p-content-background);
      border-bottom: 1px solid var(--p-content-border-color);
    }

    .nav-brand {
      font-family: Inter, sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--p-primary-color);
    }

    .nav-links {
      display: flex;
      gap: 8px;
    }

    .app-content {
      flex: 1;
      padding: 24px;
      background: var(--p-content-background);
    }
  `,
})
export class App {}
