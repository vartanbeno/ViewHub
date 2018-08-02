import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../../node_modules/rxjs';
import { URLSearchParams } from 'url';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  private subscriptionsUrl = 'http://localhost:3000/subscriptions';
  private allSubtiddersUrl = 'http://localhost:3000/allsubtidders';
  private searchSubtiddersUrl = 'http://localhost:3000/search/';

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

  searchSubtidders(searchTerm: string) {
    return this.http.get<any>(this.searchSubtiddersUrl, { params: { s: searchTerm } });
  }

}
