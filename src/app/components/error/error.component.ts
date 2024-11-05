import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error',
  standalone: true,
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
      <span>Something went wrong ...</span>
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
  @Output() onRefresh = new EventEmitter();
}
