import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BusStopComponent } from '../../components/bus-stop/bus-stop.component';
import { FavouritesStore } from '../services/favourites.store';

@Component({
  selector: 'app-list-favourites',
  styleUrl: './list-favourites.component.scss',
  templateUrl: './list-favourites.component.html',
  imports: [
    BusStopComponent,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CommonModule,
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

  drop(event: CdkDragDrop<string[]>) {
    this.store.setOrder(event.previousIndex, event.currentIndex);
  }
}
