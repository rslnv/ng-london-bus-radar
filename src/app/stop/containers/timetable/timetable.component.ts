import { Component, inject, input } from '@angular/core';
import { StopService } from '../../services/stop.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from '../../components/schedule/schedule.component';

@Component({
  selector: 'app-stop-timetable',
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
  imports: [CommonModule, ScheduleComponent],
  standalone: true,
})
export class TimetableComponent {
  private stopService = inject(StopService);

  lineId = input.required<string>();
  stopId = input.required<string>();

  data$ = combineLatest([
    toObservable(this.stopId),
    toObservable(this.lineId),
  ]).pipe(switchMap(([s, l]) => this.stopService.timetable(s, l)));
}
