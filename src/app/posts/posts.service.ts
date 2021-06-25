import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { pipe, Subject } from "rxjs";
import {map} from "rxjs/operators";

// @ts-ignore
import { PostsInterface } from 'posts.interface';

@Injectable({providedIn: 'root'})
export class PostsService {

  constructor(private httpClient: HttpClient, private router: Router) {}

  private posts: PostsInterface[] = [];
  private postsUpdate = new Subject<PostsInterface[]>()

  getPost() {
    this.httpClient
      .get<{message: string, posts: PostsInterface[]}>(
        "http://localhost:3000/api/posts"
      )
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(trasformedPost => {
        this.posts = trasformedPost;
        this.postsUpdate.next([...this.posts])
      });
  };

  getPostUpdateListener() {
    return this.postsUpdate.asObservable();
  }

  getPostId(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string}>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string) {
    const post: PostsInterface = {
      id: null,
      title: title,
      content: content,
    }
    this.httpClient
      .post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdate.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  };

  updatePost(id: string | null | undefined, title: string, content: string) {
    const post: PostsInterface = {
      id: id,
      title: title,
      content: content
    };
    this.httpClient.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(res => {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(postId => postId === post.id);
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postsUpdate.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  postDelete(postId: string) {
    this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdate.next([...this.posts]);
      })
  }
}
