import { Component, input } from '@angular/core';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-speed-dial',
  imports: [SpeedDialModule],
  templateUrl: './speeddial.html',
  styleUrl: './speeddial.css',
})
export class SpeedDialComponent {
}