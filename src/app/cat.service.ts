import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Cat } from './cat';

@Injectable()
export class CatService {
  private cats: Cat[] = [];

  cat: Cat;
  uri = 'https://localhost:8000/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.uri + 'api/cats', this.httpOptions)
      .map(res => { return res });
  }

  getOneCat(id) {
    return this.http.get<any>(this.uri + 'api/' + id, this.httpOptions).map(res => { return res });
  }

  searchCat(key: string) {
    key = key.trim();
    const options = key ? 'some works' : {};
    this.http.get<Cat[]>(this.uri + 'api/search');

  }

  addCat(data: Cat): Observable<Cat> {
    return this.http.post<Cat>(this.uri + 'api/upload', data, this.httpOptions);
  }

  updateCat(id, data): Observable<Cat> {
    return this.http.patch<Cat>(this.uri + 'api/' + id, data, this.httpOptions);
  }

  deleteCat(id): Observable<{}> {
    return this.http.delete<Cat>(this.uri + 'api/' + id, this.httpOptions).map(res => { return res });
  }

}
