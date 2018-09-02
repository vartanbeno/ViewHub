import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { View } from '../models/view';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private allViewsUrl = 'http://localhost:3000/v';
  private searchViewsUrl = 'http://localhost:3000/search/views';
  private createViewUrl = 'http://localhost:3000/v/views/create';

  public viewInfo_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getAllViews() {
    return this.http.get<any>(this.allViewsUrl);
  }

  searchViews(q: string) {
    return this.http.get<any>(this.searchViewsUrl, { params: { q } });
  }

  createView(view: View) {
    return this.http.post<any>(this.createViewUrl, view);
  }

  getViewInfo(viewName: string) {
    return this.http.get<any>(`${this.allViewsUrl}/${viewName}/info`);
  }

  notifyViewInfo() {
    this.viewInfo_Observable.next();
  }

}
