import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {};

  getPosts() {
    this.http
    .get<{message: string, posts: any}>("http://localhost:3000/api/posts")
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        console.log(postData.message); //This message is given in the browser's console from ./backend/app.js
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id) {
    return this.posts.find(p => p.id === id); //This will get the id of the post that needs to be edited.
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http
      .post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
      .subscribe((respondData) => {
        //const newId = respondData.postId; //This puts the id in a var and then it can be added to the post.id which is null at the moment.
        post.id = respondData.postId; // This works too. The line above, it is set to a var first.
        //console.log(respondData.message); //This displays a message on the browser's console from the ./backend/app.js
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    });
  }

  updatedPost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.http
    .put<{message: string}>("http://localhost:3000/api/posts/" + id, post)
    .subscribe((response) => {
      console.log(response.message);
    });
  }

  deletePost(postId: string){
    this.http
      .delete<{message: string}>("http://localhost:3000/api/posts/" + postId)
      .subscribe((respondData) => {
        console.log(respondData.message); //This displays a message on the browser's console from the ./backend/app.js
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
       });
  }

}
