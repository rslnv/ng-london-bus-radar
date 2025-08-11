import { CommonModule } from '@angular/common';
import { Component, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
import { TimetableStore } from '../../services/timetable.store';

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
  timetableStore = inject(TimetableStore);

  lineId = input.required<string>();
  stopId = input.required<string>();
  filter = linkedSignal(() => ({
    stopId: this.stopId(),
    lineId: this.lineId(),
  }));

  timetableIndex = linkedSignal({
    source: this.lineId,
    computation: (_) => 0,
  });

  constructor() {
    this.timetableStore.load(this.filter);
  }
}
