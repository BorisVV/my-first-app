import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {};

  getPosts(pageSize: number, currentPage: number) {
    const pages = `?pagesize=${pageSize}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + "/posts" + pages)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts};
    }))
    .subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostsData.maxPosts});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + "/posts/" + id);
    // This was the original set up, that was doing work before changing adding the app.js.app.get...
    //return this.posts.find(p => p.id === id); //This will get the id of the post that needs to be edited.
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{message: string, post: Post}>(BACKEND_URL + "/posts", postData)
      .subscribe((respondData) => {
        this.router.navigate(['/']);
    });
  }

  updatedPost(id: string, title: string, content: string, image: string | File) {
    // const post: Post = {id: id, title: title, content: content, imagePath: null }; //Leave as reference
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image,
          creator: null
      };
    }
    this.http
    .put<{message: string}>(BACKEND_URL + "/posts/" + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string){
    return this.http
      .delete<{message: string}>(BACKEND_URL + "/posts/" + postId);
  }

}
