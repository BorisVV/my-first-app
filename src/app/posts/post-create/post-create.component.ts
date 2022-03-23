import { Component, EventEmitter, OnInit, Output} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  private postId: string;

  @Output() postCreated = new EventEmitter();

  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    //this.newPost = this.enteredContent;
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm(); //rest the inputs and text on the form
  }

}
