import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  private subscriptionsUrl = 'http://localhost:3000/subscriptions';

  constructor(private http: HttpClient) { }

  getSubscriptions(userId: any) {
    return this.http.get<any>(this.subscriptionsUrl, { params: userId });
  }

}
