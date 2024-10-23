import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading',
  styles: `
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3em;
    }
  `,
  template: `
    <div>
      <mat-icon>hourglass_empty</mat-icon>
      <span>Loading ...</span>
    </div>
  `,
  imports: [MatIconModule],
  standalone: true,
})
export class LoadingComponent {}
