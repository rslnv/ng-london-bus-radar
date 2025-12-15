import { Component, computed, input } from '@angular/core';
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
import { MapBounds } from '../../models/map-bounds';

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
    const result = this.stops()
      .map(RouteMapComponent.toMapBounds)
      .reduce(RouteMapComponent.getBounds);

    return RouteMapComponent.toLngLatBounds(result);
  });

  map: Map | null = null;

  click(stopId: string) {
    console.log('Clicking stop', stopId);
  }

  private static toMapBounds = (model: StopListItem) => ({
    swLng: model.longitude,
    swLat: model.latitude,
    neLng: model.longitude,
    neLat: model.latitude,
  });

  private static toLngLatBounds = (model: MapBounds) =>
    new LngLatBounds(
      new LngLat(model.swLng, model.swLat),
      new LngLat(model.neLng, model.neLat),
    );

  private static getBounds = (prev: MapBounds, curr: MapBounds): MapBounds => ({
    swLng: Math.min(prev.swLng, curr.swLng),
    swLat: Math.min(prev.swLat, curr.swLat),
    neLng: Math.max(prev.neLng, curr.neLng),
    neLat: Math.max(prev.neLat, curr.neLat),
  });
}
