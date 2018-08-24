import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subtidder } from '../models/subtidder';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  private allSubtiddersUrl = 'http://localhost:3000/t';
  private searchSubtiddersUrl = 'http://localhost:3000/search/subtidders';
  private createSubtidderUrl = 'http://localhost:3000/t/subtidders/create';

  public subtidderInfo_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getAllSubtidders() {
    return this.http.get<any>(this.allSubtiddersUrl);
  }

  searchSubtidders(q: string) {
    return this.http.get<any>(this.searchSubtiddersUrl, { params: { q } });
  }

  createSubtidder(subtidder: Subtidder) {
    return this.http.post<any>(this.createSubtidderUrl, subtidder);
  }

  getSubtidderInfo(subtidderName: string) {
    return this.http.get<any>(`${this.allSubtiddersUrl}/${subtidderName}/info`);
  }

  notifySubtidderInfo() {
    this.subtidderInfo_Observable.next();
  }

}
