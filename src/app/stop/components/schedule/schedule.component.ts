import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Journey } from '../../models/journey';

@Component({
  selector: 'app-schedule',
  template: `
    @for (h of hours(); track h) {
      <div class="row">
        <div class="hour">{{ h }}</div>
        @let minutes = getMinutes(journeys(), h);
        @for (m of minutes; track m.id) {
          <div class="minute">{{ m.value }}</div>
        }
      </div>
    }
  `,
  styles: `
    .row {
      display: flex;

      .hour {
        font-weight: bold;
      }
      .hour,
      .minute {
        padding: 5px;
      }
    }
  `,
  imports: [CommonModule],
})
export class ScheduleComponent {
  journeys = input.required<Journey[]>();
  hours = computed(() => new Set(this.journeys().map((j) => j.hour)));

  getMinutes(
    journeys: Journey[],
    hour: string,
  ): { id: string; value: string }[] {
    return journeys
      .filter((j) => j.hour === hour)
      .map((j) => ({ id: `${hour}${j.minute}`, value: j.minute }));
  }
}
