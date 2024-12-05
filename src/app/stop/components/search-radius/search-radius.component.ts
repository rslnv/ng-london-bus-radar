import { Component, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-search-radius',
  styles: `
    .container {
      margin: 1em 1em 0 1em;

      .label {
        display: flex;
        justify-content: space-between;
      }

      mat-slider {
        display: block;
      }
    }
  `,
  template: `
    <div class="container">
      <div class="label">
        <span>Radius (meters)</span>
        <span>
          <strong>{{ radiusControl.value }}</strong>
        </span>
      </div>
      <mat-slider min="50" max="500" step="50" showTickMarks="true">
        <input matSliderThumb [formControl]="radiusControl" />
      </mat-slider>
    </div>
  `,
  imports: [MatSliderModule, ReactiveFormsModule],
})
export class SearchRadiusComponent {
  searchRadius = output<number>();

  radiusControl = new FormControl<number>(0, { nonNullable: true });

  constructor() {
    this.radiusControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((radius) => {
          localStorage.setItem('busSearchRadius', radius.toString());
          this.searchRadius.emit(radius);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

    let radius = +(localStorage.getItem('busSearchRadius') ?? '');
    if (Number.isNaN(radius) || radius < 50 || radius > 500) {
      radius = 200;
    }
    this.radiusControl.setValue(radius);
  }
}
