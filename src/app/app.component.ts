import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  // title = 'my-first-app';
  // storedPosts = [];

  // onPostAdded(post) {
  //   this.storedPosts.push(post);
  // }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
