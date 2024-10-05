import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-schedule',
  template: `
    @for (h of hours(); track h) {
      <div class="row">
        <div class="hour">{{ h }}</div>
        @for (m of getMinutes(journeys(), h); track m) {
          <div class="minute">{{ m }}</div>
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
        /* min-width: 28px; */
        /* text-align: right; */
      }
    }
  `,
  imports: [CommonModule],
  standalone: true,
})
export class ScheduleComponent {
  journeys = input.required<Journey[]>();
  hours = computed(() => new Set(this.journeys().map((j) => j.hour)));

  getMinutes(journeys: Journey[], hour: string): string[] {
    return journeys.filter((j) => j.hour === hour).map((j) => j.minute);
  }
}

export type Journey = {
  hour: string;
  minute: string;
};
