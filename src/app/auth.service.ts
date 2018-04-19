import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router, Route } from '@angular/router';

@Injectable()
export class AuthService {
    private token: string;

    constructor(private http: HttpClient, private router: Router) {

    }

    // private saveToken(token: string) {
    //     localStorage.setItem('cat-token', token);
    //     this.token = token;
    // }

    // private getToken(): string {
    //     if (!this.token) {
    //         this.token = localStorage.getItem('cat-token');
    //     }
    //     return this.token;
    // }

    // public logout() {
    //     this.token = '';
    //     window.localStorage.removeItem('cat-token');
    //     this.router.navigateByUrl('/login');
    // }

    // public getUserDetails(): UserDetails {
    //     const token = this.getToken();
    //     let payload;
    //     if (token) {
    //         payload = token.split('.')[1];
    //         payload = window.atob(payload);
    //         return JSON.parse(payload);
    //     } else {
    //         return null;
    //     }
    // }

    signup(data): Observable<any> {
        return this.http.post('/api/signup', data);
    }

    login(user): Observable<any> {
        return this.http.post('/api/login', user);
    }

    logout() {
        localStorage.removeItem('jwtToken');
        this.router.navigateByUrl('/login');
        window.location.reload();
    }

    isLoggedIn(): boolean {
        const user = localStorage.getItem('jwtToken');
        if (user) {
            return true;
        } else {
            return false;
        }
    }

}