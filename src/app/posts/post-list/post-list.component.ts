import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription; // Store information about user.

  userIsAuthenticated = false;
  isLoading = false; // Loading circle

  // This is for the paginator selector
  length = 0; // Number of items
  pageSize = 1; // Number of items displayed per page, 1 means default to 1.
  currentPage = 1; //Query to show what page is displaying, e.g. 1 of 2.
  pageSizeOptions = [1, 2, 5, 10]; // Drop down option, how many items to display per page.

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.length = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuthenticated(); // User is validated and able to edit and delete.
    this. authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.pageSize = pageData.pageSize;
    this.currentPage = pageData.pageIndex +1;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}

