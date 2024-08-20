import { JsonPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { TflService } from '../../../services/tfl.service';
import { BusRouteService } from '../../services/bus-route.service';
import { MatIcon } from '@angular/material/icon';
import { MatSuffix } from '@angular/material/form-field';
import { BusRoutStopComponent } from '../../components/bus-route-stop/bus-route-stop.component';

@Component({
  selector: 'app-bus-route-details',
  templateUrl: './route-details.component.html',
  styleUrl: './route-details.component.scss',
  imports: [JsonPipe, CommonModule, MatIcon, MatSuffix, RouterModule, BusRoutStopComponent],
  providers: [BusRouteService],
  standalone: true,
})
export class RouteDetailsComponent {
  route = inject(ActivatedRoute);
  busRouteService = inject(BusRouteService);

  data$ = this.route.params.pipe(
    switchMap((params) =>
      this.busRouteService.RouteDetails(params['routeId'], params['direction']),
    ),
  );
}
