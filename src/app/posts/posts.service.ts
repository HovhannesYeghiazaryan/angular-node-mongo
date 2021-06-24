// @ts-ignore
import { PostsInterface } from 'posts.interface';
import { Injectable } from "@angular/core";
import {pipe, Subject} from "rxjs";
import { HttpClient } from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {

  constructor(private httpClient: HttpClient) {}

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
      });
  };

  postDelete(postId: string) {
    this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdate.next([...this.posts]);
      })
  }
}
