import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  private subscriptionsUrl = 'http://localhost:3000/subscriptions';
  private allSubtiddersUrl = 'http://localhost:3000/allsubtidders';

  public subscriptions_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getSubscriptions(userId: any) {
    return this.http.get<any>(this.subscriptionsUrl, { params: userId });
  }

  getAllSubtidders() {
    return this.http.get<any>(this.allSubtiddersUrl);
  }

  updateSubscriptions() {
    this.subscriptions_Observable.next();
  }

}
