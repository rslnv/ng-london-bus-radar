import { Component, inject, signal } from '@angular/core';
import { TflService } from '../../services/tfl.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap, tap, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StopPoint } from '../../models/api/stop-point';
import { LineFilterComponent } from '../components/line-filter.components';
import { toObservable } from '@angular/core/rxjs-interop';
import { TimeToStationPipe } from '../../pipes/time-to-station.pipe';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss',
  imports: [CommonModule, LineFilterComponent, TimeToStationPipe],
  providers: [TflService],
  standalone: true,
})
export class StopArrivalsComponent {
  private route = inject(ActivatedRoute);
  private tflService = inject(TflService);

  filter = signal<string | null>(null);
  private filter$ = toObservable(this.filter);
  preSelectedLine = signal<string | null>(null);

  data$ = this.route.params.pipe(
    tap((params) => this.preSelectedLine.set(params['lineId'])),
    switchMap((params) =>
      combineLatest({
        details: this.tflService.stopPointDetails(params['stopId']),
        arrivals: this.tflService.stopPointArrivals(params['stopId']).pipe(
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
      }),
    ),
    tap(console.log),
  );

  stopProperties(stop: StopPoint) {
    const stopId = this.route.snapshot.params['stopId'];
    const child = stop.children.find((s) => s.id === stopId);

    return {
      stopLetter: stop.stopLetter ?? child?.stopLetter,
      towards: child?.additionalProperties.find((ap) => ap.key === 'Towards')
        ?.value,
    };
  }
}
