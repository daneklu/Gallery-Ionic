import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = ' https://api.thecatapi.com/v1/images/search?limit=12';
  private apiKey = 'live_MDRqwsZLzSc6z7s08Oe3UP1EOvwiadE5zAA5GUdARrFLjzRV5hH46oOFGQizWDip';

  constructor(private http: HttpClient) { }

  getImages(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.apiKey}` };
    return this.http.get(this.apiUrl, { headers });
  }
}