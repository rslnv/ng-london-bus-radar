import { Component, inject } from '@angular/core';
import { TflService } from '../../services/tfl.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StopPoint } from '../../models/api/stop-point';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  imports: [CommonModule],
  providers: [TflService],
  standalone: true,
})
export class StopArrivalsComponent {
  private route = inject(ActivatedRoute);
  private tflService = inject(TflService);

  details$ = this.route.params.pipe(
    switchMap((params) => this.tflService.stopPointDetails(params['stopId'])),
  );

  data$ = this.route.params.pipe(
    switchMap((params) => this.tflService.stopPointArrivals(params['stopId'])),
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
