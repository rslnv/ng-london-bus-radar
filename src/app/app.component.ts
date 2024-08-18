import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FindRouteComponent } from './bus/containers/find-route/find-route.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FindRouteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'ng-london-bus-radar';
}
