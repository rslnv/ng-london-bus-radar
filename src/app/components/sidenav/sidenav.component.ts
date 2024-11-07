import { AsyncPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
  ],
})
export class SidenavComponent {
  isHandset = input.required<boolean>();
  isExpanded = signal(false);

  toggleIsExpanded = () => this.isExpanded.update((value) => !value);
  hideSidenav = () => this.isExpanded.set(false);

  menuItems = [
    { icon: 'directions_bus', label: 'Stops', link: ['stop'] },
    { icon: 'route', label: 'Routes', link: ['bus'] },
  ];
}
