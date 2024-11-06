import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, SidenavComponent],
})
export class AppComponent {
  title = 'ng-london-bus-radar';
}
