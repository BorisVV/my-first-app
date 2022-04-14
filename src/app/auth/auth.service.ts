import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false; // used in login and for the list of posts
  private token: string;
  private tokenTimer: NodeJS.Timer; // Added "types":["node"] node to the tsconfig.app.json file.
  // Another option to the above line is to change the NodeJS.Timer to any.
  private authStatusListener = new Subject<boolean>();

  // Router is to redirect to main page after login or logout
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        // If setTimeout throws an error use window.setTimeout(...)
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresInDuration * 1000);
        this.isAuthenticated = true; // This will allow to show the 'edit' and 'delete' buttons for the user in the posts list.
        this.authStatusListener.next(true); // Validate user and give access to its page.
        this.router.navigate(['/']); // Send user to the main page
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }
}
