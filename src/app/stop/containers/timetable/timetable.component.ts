import { CommonModule } from '@angular/common';
import { Component, inject, input, linkedSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, combineLatest, of, startWith, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateLoading,
} from '../../../models/view-state';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
import { StopTimetable } from '../../models/stop-timetable';
import { StopService } from '../../services/stop.service';

@Component({
  selector: 'app-stop-timetable',
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ScheduleComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatIconModule,
    LoadingComponent,
    ErrorComponent,
  ],
})
export class TimetableComponent {
  private stopService = inject(StopService);

  lineId = input.required<string>();
  stopId = input.required<string>();

  refresherSubject = new BehaviorSubject<void>(undefined);

  timetableIndex = linkedSignal({
    source: this.lineId,
    computation: (_) => 0,
  });

  data$ = combineLatest([
    toObservable(this.stopId),
    toObservable(this.lineId),
  ]).pipe(
    switchMap(([s, l]) =>
      this.stopService.timetable(s, l).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => {
          console.error('Unable to find bus routes', err);
          return of({ state: 'error', error: err } as VM);
        }),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  viewModel$ = this.refresherSubject.pipe(switchMap((_) => this.data$));
}

type VM = ViewStateDone<StopTimetable> | ViewStateLoading | ViewStateError;
