import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error',
  styles: `
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3em;
    }
  `,
  template: `
    <div>
      @if (errorMessage()) {
        <span>{{ errorMessage() }}</span>
      } @else {
        <span>Something went wrong ...</span>
      }

      @if (onRefresh.observed) {
        <button mat-flat-button (click)="onRefresh.emit()">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      }
    </div>
  `,
  imports: [MatButtonModule, MatIconModule],
})
export class ErrorComponent {
  errorData = input.required<HttpErrorResponse>();
  @Output() onRefresh = new EventEmitter();

  errorMessage = computed(
    () =>
      this.errorData().error?.message ??
      this.errorData().error?.error ??
      this.errorData().message,
  );
}
