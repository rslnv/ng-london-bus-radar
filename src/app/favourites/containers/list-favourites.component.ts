import { Component, inject } from '@angular/core';
import { FavouritesStore } from '../services/favourites.store';
import { CommonModule } from '@angular/common';
import { BusStopComponent } from '../../components/bus-stop/bus-stop.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-favourites',
  styles: `
    .content {
      .item {
        display: flex;
        gap: 0.3em;
        align-items: center;
        margin-bottom: 1em;

        app-bus-stop {
          width: 100%;
          cursor: pointer;
        }
      }

      p {
        text-align: center;
      }
    }
  `,
  template: `
    <div class="content">
      @for (item of store.items(); track item) {
        <div class="item">
          <app-bus-stop [stop]="item" [routerLink]="['/stop', item.id]" />
          <button
            mat-icon-button
            aria-label="Remove from favourites"
            (click)="remove(item.id)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      } @empty {
        <p>No results</p>
      }
    </div>
  `,
  imports: [
    CommonModule,
    BusStopComponent,
    MatButtonModule,
    MatIcon,
    RouterModule,
  ],
})
export class ListFavouritesComponent {
  store = inject(FavouritesStore);

  remove(id: string) {
    this.store.remove(id);
  }
}
