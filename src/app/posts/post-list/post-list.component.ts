import {Component, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";

// @ts-ignore
import { PostInterface } from '../posts.interface';
import {PostsService} from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['post-list.component.css',],
})

export class PostListComponent implements OnInit, OnDestroy {

    posts: PostInterface[] = [];
    // @ts-ignore
    private postSub: Subscription;
    constructor(public postService: PostsService) {}

    onDelete(postId: string) {
      this.postService.postDelete(postId);
    }


    ngOnDestroy(): void {
        this.postSub.unsubscribe();
    }

    ngOnInit(): void {
      this.postService.getPost();
      this.postSub = this.postService.getPostUpdateListener().subscribe((posts: PostInterface[]) => {
        this.posts = posts;
      });
    }
}
