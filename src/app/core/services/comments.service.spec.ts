import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommentsService } from "./comments.service";
import { ApiService } from "./api.service";
import { of } from "rxjs";
import { Comment } from "../models";

describe("CommentsService", () => {
  let service: CommentsService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj("ApiService", [
      "get",
      "put",
      "post",
      "delete",
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentsService,
        { provide: ApiService, useValue: apiService },
      ],
    });

    service = TestBed.inject(CommentsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should add comment", () => {
    const slug = "test";
    const payload = "test";
    const comment = {
      id: 1,
      body: "test",
      createdAt: "test",
      author: {
        username: "test",
        bio: "test",
        image: "test",
        following: false,
      },
    };

    apiService.post.and.returnValue(of({ comment }));

    service
      .add(slug, payload)
      .subscribe((data) => expect(data).toEqual(comment));

    expect(apiService.post).toHaveBeenCalledWith(`/articles/${slug}/comments`, {
      comment: { body: payload },
    });
  });

  it("should get all comments", () => {
    const slug = "test";
    const comments = [
      {
        id: 1,
        body: "test",
        createdAt: "test",
        author: {
          username: "test",
          bio: "test",
          image: "test",
          following: false,
        },
      },
    ];

    apiService.get.and.returnValue(of({ comments }));

    service.getAll(slug).subscribe((data) => expect(data).toEqual(comments));

    expect(apiService.get).toHaveBeenCalledWith(`/articles/${slug}/comments`);
  });

  it("should delete comment", () => {
    const commentId = 1;
    const articleSlug = "test";

    apiService.delete.and.returnValue(of({}));

    service.destroy(commentId, articleSlug).subscribe();

    expect(apiService.delete).toHaveBeenCalledWith(
      `/articles/${articleSlug}/comments/${commentId}`
    );
  });
});
