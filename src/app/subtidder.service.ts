import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  navbar: any;

  private subscriptionsUrl = 'http://localhost:3000/subscriptions';
  private allSubtiddersUrl = 'http://localhost:3000/allsubtidders';

  constructor(private http: HttpClient) { }

  getSubscriptions(userId: any) {
    return this.http.get<any>(this.subscriptionsUrl, { params: userId });
  }

  getAllSubtidders() {
    return this.http.get<any>(this.allSubtiddersUrl);
  }

}
