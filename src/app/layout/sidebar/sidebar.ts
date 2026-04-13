import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, TooltipModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private router = inject(Router);

  //per trasformare  url del router in signal reattivo
  readonly currentUrl = toSignal(this.router.events);
  isExpanded = false;

  goTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
