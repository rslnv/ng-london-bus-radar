import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, input, signal, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { TimeToStationPipe } from '../../../pipes/time-to-station.pipe';
import { LineFilterComponent } from '../../components/line-filter/line-filter.components';
import { StopService } from '../../services/stop.service';
import { TimetableComponent } from '../timetable/timetable.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ArrivalTimeSpan } from '../../models/arrival-time-span';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    LineFilterComponent,
    TimeToStationPipe,
    TimetableComponent,
    MatButtonToggleModule,
  ],
  standalone: true,
})
export class StopArrivalsComponent {
  private stopService = inject(StopService);

  lineId = input.required<string>();

  stopId = input.required<string>();
  stopId$ = toObservable(this.stopId);

  lineFilter = signal<string | null>(null);
  private lineFilter$ = toObservable(this.lineFilter);

  arrivalTimeSpan = signal<ArrivalTimeSpan>('live');

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
