import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
  currentPostition = new Observable<GeolocationPosition>((subscriber) => {
    if (!('geolocation' in navigator)) {
      subscriber.error({ message: 'Geolocation not available' });
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = (position: GeolocationPosition) => {
      subscriber.next(position);
      subscriber.complete();
    };

    const error = (err: GeolocationPositionError) => subscriber.error(err);

    navigator.geolocation.getCurrentPosition(success, error, options);
  });
}
