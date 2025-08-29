import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private httpClient = inject(HttpClient);

  public sha = (): Observable<string | undefined> =>
    this.httpClient.get('sha.txt', { responseType: 'text' }).pipe(
      map((x) => x.substring(0, 6)),
      catchError((err) => {
        console.error('Error retrieving sha.txt', err);
        return of(undefined);
      }),
    );
}
