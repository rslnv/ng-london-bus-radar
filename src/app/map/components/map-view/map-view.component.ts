import { Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import {
  AttributionControlDirective,
  ControlComponent,
  GeolocateControlDirective,
  MapComponent,
  MarkerComponent,
  NavigationControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import { Map } from 'maplibre-gl';
import { filter, map, Subject } from 'rxjs';
import { StopListItem } from '../../../models/stop-list-item';
import { LatLon } from '../../models/lat-lon';
import { LatLonZoom } from '../../models/lat-lon-zoom';

@Component({
  selector: 'app-map-view',
  styles: `
    mgl-map {
      width: 100%;
      height: 100%;
    }
    .marker {
      min-width: 3em;
      height: 3em;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #c33;
      color: #fff;
      font-weight: bold;
      border-radius: 50%;
      font-size: 0.8em;
    }
  `,
  template: `
    <mgl-map
      [style]="'https://tiles.openfreemap.org/styles/bright'"
      [zoom]="[17]"
      [center]="[startingLocation().longitude, startingLocation().latitude]"
      [maxBounds]="[-0.7, 51.2, 0.4, 51.8]"
      [attributionControl]="false"
      [canvasContextAttributes]="{ preserveDrawingBuffer: true }"
      (mapLoad)="map = $event; moveSubject.next()"
      (move)="moveSubject.next()"
    >
      <mgl-control mglAttribution position="top-right" [compact]="true" />
      <mgl-control
        mglGeolocate
        position="bottom-right"
        [positionOptions]="{
          enableHighAccuracy: true,
        }"
      />
      <mgl-control mglNavigation position="bottom-right" />

      @if (this.stops()?.length) {
        @for (stop of this.stops(); track stop.id) {
          <mgl-marker [lngLat]="[stop.longitude, stop.latitude]">
            <div (click)="click(stop.id)" class="marker">
              @if (stop.stopLetter) {
                {{ stop.stopLetter }}
              } @else {
                <mat-icon>directions_bus</mat-icon>
              }
            </div>
          </mgl-marker>
        }
      }
    </mgl-map>
  `,
  imports: [
    AttributionControlDirective,
    ControlComponent,
    GeolocateControlDirective,
    MapComponent,
    MarkerComponent,
    MatIcon,
    NavigationControlDirective,
  ],
})
export class MapViewComponent {
  startingLocation = input.required<LatLon>();

  stops = input<StopListItem[] | null>();

  map: Map | null = null;

  moveSubject = new Subject<void>();
  mapCenter = outputFromObservable<LatLonZoom>(
    this.moveSubject.pipe(
      filter((_) => !!this.map),
      map((_) => {
        const center = this.map!.getCenter().wrap();
        return {
          latitude: +center.lat.toFixed(3),
          longitude: +center.lng.toFixed(3),
          zoom: this.map!.getZoom(),
        } as LatLonZoom;
      }),
    ),
  );

  click(stopId: string) {
    console.log('Clicking stop', stopId);
  }
}
