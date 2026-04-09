import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  isDark = signal(this.getInitialTheme());

  constructor() {
    document.documentElement.classList.toggle('dark-mode', this.isDark());
  }

  onToggle(): void {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark-mode', this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('theme');

    if (saved) {
      return saved === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
