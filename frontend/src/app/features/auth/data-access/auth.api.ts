// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthApi {
//   private baseUrl = 'http://localhost:3000/v1/auth'; // Backend base URL

//   constructor(private http: HttpClient) {}

//   login(data: { usernameOrEmail: string; password: string }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/login`, data);
//   }

//   register(data: { first_name: string; username: string; email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/register`, data);
//   }
// }
