import { Component, EventEmitter, OnInit, Output} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private postId: string;


  @Output() postCreated = new EventEmitter();

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators:[Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {
        validators:[Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost() {
    //this.newPost = this.enteredContent;
    if (this.form.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content);
    }else {
      this.postsService.updatedPost(
        this.postId,
        this.form.value.title,
        this.form.value.content);
    }
    this.form.reset(); //reset the inputs and text on the form
  }

}
