import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PostcodeSearchResponse } from '../models/api/postcode-search-response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostcodeService {
  private baseUrl = 'https://api.postcodes.io';
  private httpClient = inject(HttpClient);

  find(postcode: string): Observable<PostcodeSearchResponse> {
    return this.httpClient.get<PostcodeSearchResponse>(
      `${this.baseUrl}/postcodes/${postcode}`,
    );
  }
}
