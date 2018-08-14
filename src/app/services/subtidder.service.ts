import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subtidder } from '../models/subtidder';

@Injectable({
  providedIn: 'root'
})
export class SubtidderService {

  private allSubtiddersUrl = 'http://localhost:3000/t';
  private searchSubtiddersUrl = 'http://localhost:3000/search/subtidders';
  private createSubtidderUrl = 'http://localhost:3000/t/subtidders/create';

  constructor(private http: HttpClient) { }

  getAllSubtidders() {
    return this.http.get<any>(this.allSubtiddersUrl);
  }

  searchSubtidders(searchTerm: string) {
    return this.http.get<any>(this.searchSubtiddersUrl, { params: { s: searchTerm } });
  }

  createSubtidder(subtidder: Subtidder) {
    return this.http.post<any>(this.createSubtidderUrl, subtidder);
  }

}
