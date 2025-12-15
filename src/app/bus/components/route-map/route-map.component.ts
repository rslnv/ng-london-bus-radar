import { Component, computed, effect, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  AttributionControlDirective,
  ControlComponent,
  GeolocateControlDirective,
  MapComponent,
  MarkerComponent,
  NavigationControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
import { StopListItem } from '../../../models/stop-list-item';

@Component({
  selector: 'app-route-map',
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
      [maxBounds]="[-0.7, 51.2, 0.4, 51.8]"
      [fitBounds]="bounds()"
      [fitBoundsOptions]="{
        padding: 40,
      }"
      [attributionControl]="false"
      [canvasContextAttributes]="{ preserveDrawingBuffer: true }"
      (mapLoad)="map = $event"
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
export class RouteMapComponent {
  stops = input.required<StopListItem[]>();

  bounds = computed(() => {
    const boundsAsArray = this.stops()
      .map((x) => [x.longitude, x.latitude, x.longitude, x.latitude])
      .reduce(RouteMapComponent.getBounds);

    return new LngLatBounds(
      new LngLat(boundsAsArray[0], boundsAsArray[1]),
      new LngLat(boundsAsArray[2], boundsAsArray[3]),
    );
  });

  map: Map | null = null;

  click(stopId: string) {
    console.log('Clicking stop', stopId);
  }

  private static getBounds(prev: number[], curr: number[]): number[] {
    return [
      Math.min(prev[0], curr[0]),
      Math.min(prev[1], curr[1]),
      Math.max(prev[2], curr[2]),
      Math.max(prev[3], curr[3]),
    ];
  }
}
