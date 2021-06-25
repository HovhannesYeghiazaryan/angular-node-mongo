import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import { NgForm } from "@angular/forms";

// @ts-ignore
import { PostInterface } from '../posts.interface';
import { PostsService } from "../posts.service";


@Component({
    selector: "app-post-create",
    templateUrl: "post-create.component.html",
    styleUrls: ["post-create.component.css",]
})

export class PostCreateComponent implements OnInit {
  enteredTitle: string = "";
  enteredContent: string = "";
  post: PostInterface;
  isLoading: boolean = false;
  private mode = "create";
  // @ts-ignore
  private postId: string;

  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        // @ts-ignore
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPostId(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
            };
          });
      } else {
        this.mode = "create";
        // @ts-ignore
        this.postId = null;
      };
    })
  };

  onSavePost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    };
    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(postForm.value.title, postForm.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      )
    };
    postForm.resetForm();
  };


}
