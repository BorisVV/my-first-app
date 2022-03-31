import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {};

  getPosts() {
    this.http
    .get<{message: string, posts: any}>("http://localhost:3000/api/posts")
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        console.log(postData.message); //This message is given in the browser's console from ./backend/app.js
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
    // This was the original set up, that was doing work before changing adding the app.js.app.get...
    //return this.posts.find(p => p.id === id); //This will get the id of the post that needs to be edited.
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{message: string, post: Post}>("http://localhost:3000/api/posts", postData)
      .subscribe((respondData) => {
        const post: Post = {
          id: respondData.post.id,
          title: title,
          content: content,
          imagePath: ""
        };
        //const newId = respondData.postId; //This puts the id in a var and then it can be added to the post.id which is null at the moment.
        //post.id = respondData.postId; // This works too. The line above, it is set to a var first.
        //console.log(respondData.message); //This displays a message on the browser's console from the ./backend/app.js
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    });
  }

  updatedPost(id: string, title: string, content: string, image: string | File) {
    // const post: Post = {id: id, title: title, content: content, imagePath: null }; //Leave as reference
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      const postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image
      };
    }
    this.http
    .put<{message: string}>("http://localhost:3000/api/posts/" + id, postData)
    .subscribe(response => {
      //Uptates the post locally, is good pratice
      const updatedPost = [...this.posts];
      const oldpostId = updatedPost.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      };
      updatedPost[oldpostId] = post;
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
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
