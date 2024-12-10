import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { delay, of, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-refresh-with-progress',
  styles: `
    @property --progress {
      syntax: '<percentage>';
      inherits: false;
      initial-value: 0%;
    }

    button {
      --progress: 0%;

      margin-left: auto;
      background-image: conic-gradient(
        from 0deg,
        #0003 var(--progress),
        transparent 0
      );
    }
  `,
  template: `
    <button
      class="refresh"
      mat-mini-fab
      aria-label="Refresh arrivals"
      [ngStyle]="style$ | async"
      (click)="refresh.emit()"
    >
      <mat-icon>refresh</mat-icon>
    </button>
  `,
  imports: [MatIcon, MatButtonModule, CommonModule],
})
export class RefreshWithProgressComponent {
  duration = input.required<number>();
  reset = input<number | null>();
  refresh = output<void>();

  style$ = toObservable(this.reset).pipe(
    switchMap((_) =>
      of({
        '--progress': '100%',
        transition: `--progress ${this.duration() - 1}s linear`,
      }).pipe(delay(1000), startWith({})),
    ),
  );
}
