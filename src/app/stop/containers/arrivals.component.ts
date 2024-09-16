import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { StopPoint } from '../../models/api/stop-point';
import { TimeToStationPipe } from '../../pipes/time-to-station.pipe';
import { TflService } from '../../services/tfl.service';
import { LineFilterComponent } from '../components/line-filter.components';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss',
  imports: [CommonModule, LineFilterComponent, TimeToStationPipe],
  providers: [TflService],
  standalone: true,
})
export class StopArrivalsComponent {
  private tflService = inject(TflService);

  lineId = input.required<string>();

  stopId = input.required<string>();
  stopId$ = toObservable(this.stopId);

  filter = signal<string | null>(null);
  private filter$ = toObservable(this.filter);

  details$ = this.stopId$.pipe(
    switchMap((s) => this.tflService.stopPointDetails(s)),
  );

  arrivals$ = this.stopId$.pipe(
    switchMap((s) =>
      this.tflService.stopPointArrivals(s).pipe(
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

  stopProperties(stop: StopPoint) {
    const child = stop.children.find((s) => s.id === this.stopId());

    return {
      stopLetter: stop.stopLetter ?? child?.stopLetter,
      towards: child?.additionalProperties.find((ap) => ap.key === 'Towards')
        ?.value,
    };
  }
}
