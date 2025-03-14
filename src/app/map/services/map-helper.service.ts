import { Injectable } from '@angular/core';
import { LatLon } from '../models/lat-lon';
import { LatLonRadius } from '../models/lat-lon-radius';

@Injectable({
  providedIn: 'root',
})
export class MapHelperService {
  private _location: LatLon = {
    latitude: 51.501069694992935,
    longitude: -0.12410468234293585,
  };

  constructor() {
    try {
      const stringValue = localStorage.getItem('mapLocation');
      this._location = JSON.parse(stringValue ?? '');
    } catch {}
  }

  set location(location: LatLon) {
    localStorage.setItem('mapLocation', JSON.stringify(location));
    this._location = location;
  }

  get location(): LatLon {
    return this._location;
  }

  // z14 => r500
  // z18 => r100
  static zoomToRadius(zoom: number): number {
    let validZoom = Math.min(18, Math.floor(zoom));
    validZoom = Math.max(14, validZoom);
    const zoomDelta = validZoom - 14;
    const radius = 500 - zoomDelta * 100;
    return radius;
  }

  static latLonRadiusComparer = (prev: LatLonRadius, curr: LatLonRadius) =>
    Math.abs(prev.latitude - curr.latitude) < 0.001 &&
    Math.abs(prev.longitude - curr.longitude) < 0.001 &&
    prev.radius >= curr.radius;
}
