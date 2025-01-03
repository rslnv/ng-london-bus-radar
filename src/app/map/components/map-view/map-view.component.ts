import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { Map } from 'maplibre-gl';
import { debounceTime, filter, map, Subject, tap } from 'rxjs';
import { MapCenter } from '../../models/map-center';
import { StopListItem } from '../../../models/stop-list-item';

@Component({
  selector: 'app-map-view',
  styles: `
    mgl-map {
      width: 100%;
      height: 100%;
    }
    .marker {
      background-color: #fff;
      padding: 1em;
    }
  `,
  template: `
    <mgl-map
      [style]="'https://tiles.openfreemap.org/styles/bright'"
      [zoom]="[17]"
      [center]="[-0.4095075214752038, 51.4467535422277]"
      [maxBounds]="[-0.7, 51.2, 0.4, 51.8]"
      [preserveDrawingBuffer]="true"
      (mapLoad)="map = $event; moveSubject.next()"
      (move)="moveSubject.next()"
    >
      @for (stop of this.stops(); track stop.id) {
        <mgl-marker [lngLat]="[stop.longitude, stop.latitude]">
          <div (click)="click(stop.id)" class="marker">
            {{ stop.stopLetter }}
          </div>
        </mgl-marker>
      }
    </mgl-map>
  `,
  imports: [MapComponent, MarkerComponent],
})
export class MapViewComponent {
  stops = input<StopListItem[]>([]);
  mapCenter = output<MapCenter>();

  map: Map | null = null;

  moveSubject = new Subject<void>();
  move$ = this.moveSubject
    .pipe(
      filter((_) => !!this.map),
      debounceTime(500),
      map((_) => {
        const center = this.map!.getCenter().wrap();
        const zoom = this.map!.getZoom();
        return {
          latitude: center.lat,
          longitude: center.lng,
          zoom: zoom,
        };
      }),
      tap((m) => {
        this.mapCenter.emit(m);
      }),
      takeUntilDestroyed(),
    )
    .subscribe();

  click(stopId: string) {
    console.log('Clicking stop', stopId);
  }
}
