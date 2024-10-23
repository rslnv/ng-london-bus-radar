import { Component, output } from '@angular/core';
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
      <span>Something went wrong ...</span>
      <button mat-flat-button (click)="onRefresh.emit()">
        <mat-icon>refresh</mat-icon>
        Refresh
      </button>
    </div>
  `,
  imports: [MatButtonModule, MatIconModule],
  standalone: true,
})
export class ErrorComponent {
  onRefresh = output();
}
