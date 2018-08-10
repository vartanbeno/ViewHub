import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  private subscriptionsUrl = 'http://localhost:3000/subscriptions/';
  private allSubtiddersUrl = 'http://localhost:3000/t/';
  private searchSubtiddersUrl = 'http://localhost:3000/search/subtidders';

  constructor(private http: HttpClient) { }

  getSubscriptions(id: string) {
    return this.http.get<any>(this.subscriptionsUrl, { params: { id: id } });
  }

  getAllSubtidders() {
    return this.http.get<any>(this.allSubtiddersUrl);
  }

  searchSubtidders(searchTerm: string) {
    return this.http.get<any>(this.searchSubtiddersUrl, { params: { s: searchTerm } });
  }

}
