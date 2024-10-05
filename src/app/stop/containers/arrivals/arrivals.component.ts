import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { TimeToStationPipe } from '../../../pipes/time-to-station.pipe';
import { LineFilterComponent } from '../../components/line-filter.components';
import { StopService } from '../../services/stop.service';
import { TimetableComponent } from '../timetable/timetable.component';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss',
  imports: [
    CommonModule,
    LineFilterComponent,
    TimeToStationPipe,
    TimetableComponent,
  ],
  standalone: true,
})
export class StopArrivalsComponent {
  private stopService = inject(StopService);

  lineId = input.required<string>();

  stopId = input.required<string>();
  stopId$ = toObservable(this.stopId);

  filter = signal<string | null>(null);
  private filter$ = toObservable(this.filter);

  details$ = this.stopId$.pipe(switchMap((s) => this.stopService.details(s)));

  arrivals$ = this.stopId$.pipe(
    switchMap((s) =>
      this.stopService.arrivals(s).pipe(
        switchMap((predictions) =>
          this.filter$.pipe(
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
