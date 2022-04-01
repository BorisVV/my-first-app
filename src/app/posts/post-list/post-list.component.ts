import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

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
  isLoading = false; //Loading circle
  length = 10; //paginator
  pageSize = 2; //paginator
  currentPage = 1; //Query to show what page is displaying
  pageSizeOptions = [1, 2, 5, 10]; //paginator

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.pageSize = pageData.pageSize;
    this.currentPage = pageData.pageIndex +1;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    console.log(pageData);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}

