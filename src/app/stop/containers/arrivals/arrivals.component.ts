import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { map, switchMap, tap } from 'rxjs';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import { BusArrivalComponent } from '../../components/bus-arrival/bus-arrival.component';
import { LineFilterComponent } from '../../components/line-filter/line-filter.components';
import { StopService } from '../../services/stop.service';
import { TimetableComponent } from '../timetable/timetable.component';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    LineFilterComponent,
    TimetableComponent,
    MatButtonToggleModule,
    BusStopComponent,
    BusArrivalComponent,
  ],
})
export class StopArrivalsComponent {
  private stopService = inject(StopService);

  lineId = input.required<string>();

  stopId = input.required<string>();
  stopId$ = toObservable(this.stopId);

  lineFilter = signal<string | null>(null);
  private lineFilter$ = toObservable(this.lineFilter);

  arrivalTimeSpan = signal<'live' | 'timetable'>('live');

  details$ = this.stopId$.pipe(switchMap((s) => this.stopService.details(s)));

  arrivals$ = this.stopId$.pipe(
    switchMap((s) =>
      this.stopService.arrivals(s).pipe(
        switchMap((predictions) =>
          this.lineFilter$.pipe(
            tap(console.log),
            map((f) => {
              if (!f) {
                return predictions;
              }
              return predictions.filter((p) => p.lineId === f);
            }),
          ),
        ),
      ),
    ),
    tap(console.log),
  );
}
