import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
// @ts-ignore
import { PostInterface } from '../posts.interface';
import {PostsService} from "../posts.service";


@Component({
    selector: "app-post-create",
    templateUrl: "post-create.component.html",
    styleUrls: ["post-create.component.css",]
})

export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";

  constructor(public postService: PostsService) {}

  onAddPost(postForm: NgForm) {
    if(postForm.invalid) {
      return;
    };
    this.postService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  };

}
