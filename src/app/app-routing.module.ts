import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

const routes: Routes = [
  {path: '', component: PostListComponent}, //Main page with the components
  {path: 'create', component: PostCreateComponent}, //This will be site?/create to create new posts
  {path: 'edit/:postId', component: PostCreateComponent} //This will be site?/create to create new posts
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} //Add this to the app.module under imports
