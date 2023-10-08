import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { ArticleComponent } from "./article.component";
import { Article, ArticlesService, User, UserService } from "../core/index";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { CommentsService } from "../core/services/comments.service";
import { RouterTestingModule } from "@angular/router/testing";
import { ArticleCommentComponent } from "./article-comment.component";
import { MarkdownPipe } from "./markdown.pipe";

describe("ArticleComponent", () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let articlesService: jasmine.SpyObj<ArticlesService>;
  let activatedRoute: ActivatedRoute;
  let commentsService: jasmine.SpyObj<CommentsService>;
  let userService: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const currentUser: User = {
    username: "test-user",
    bio: "test bio",
    image: "test image",
    token: "test token",
    email: "test email",
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    articlesService = jasmine.createSpyObj("ArticlesService", [
      "get",
      "destroy",
    ]);
    activatedRoute = {
      snapshot: {
        params: {
          slug: "test-article",
        },
      },
      data: of({
        article: {
          slug: "test",
          title: "test",
          description: "test",
          body: "test",
          tagList: ["test"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: "test-user",
            bio: "test",
            image: "test",
            following: false,
          },
        },
      }),
    } as unknown as ActivatedRoute;
    commentsService = jasmine.createSpyObj("CommentsService", [
      "getAll",
      "add",
      "destroy",
    ]);
    userService = jasmine.createSpyObj("UserService", ["currentUser"]);
    userService.currentUser = of(currentUser);

    await TestBed.configureTestingModule({
      declarations: [ArticleComponent, ArticleCommentComponent, MarkdownPipe],
      providers: [
        { provide: ArticlesService, useValue: articlesService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: CommentsService, useValue: commentsService },
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: routerSpy },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should init and be able to edit if own article", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.canModify).toBeTrue();
  });

  it("should init and not be able to edit if other article", () => {
    commentsService.getAll.and.returnValue(of([]));
    activatedRoute.data = of({
      article: {
        slug: "test",
        title: "test",
        description: "test",
        body: "test",
        tagList: ["test"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: "test",
          bio: "test",
          image: "test",
          following: false,
        },
      },
    });

    component.ngOnInit();

    expect(component.canModify).toBeFalse();
  });

  it("should toggle favorite", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    component.onToggleFavorite(true);

    expect(component.article.favorited).toBeTrue();

    expect(component.article.favoritesCount).toBe(1);

    component.onToggleFavorite(false);

    expect(component.article.favorited).toBeFalse();

    expect(component.article.favoritesCount).toBe(0);
  });

  it("should toggle following", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    component.onToggleFollowing(true);

    expect(component.article.author.following).toBeTrue();

    component.onToggleFollowing(false);

    expect(component.article.author.following).toBeFalse();
  });

  it("should delete article", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    articlesService.destroy.and.returnValue(of({}));

    component.deleteArticle();

    expect(articlesService.destroy).toHaveBeenCalledWith("test");

    expect(component.isDeleting).toBeTrue();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/");
  });

  it("should add comments", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    commentsService.add.and.returnValue(
      of({
        id: 1,
        createdAt: new Date().toISOString(),
        body: "test body",
        author: {
          username: "test-user",
          bio: "test",
          image: "test",
          following: false,
        },
      })
    );

    component.commentControl.setValue("test");
    component.addComment();

    expect(commentsService.add).toHaveBeenCalledWith("test", "test");
    expect(component.isSubmitting).toBeFalse();
  });

  it("should catch errors while in addComment", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    commentsService.add.and.returnValue(
      throwError(new Error("error adding comment"))
    );

    component.commentControl.setValue("test");
    component.addComment();

    expect(commentsService.add).toHaveBeenCalledWith("test", "test");
    expect(component.isSubmitting).toBeFalse();
    console.log(component.commentFormErrors);

    expect(component.commentFormErrors).toEqual(
      new Error("error adding comment")
    );
  });

  it("should exit onDeleteComment", () => {
    commentsService.getAll.and.returnValue(of([]));

    component.ngOnInit();

    commentsService.destroy.and.returnValue(of({}));

    component.comments = [
      {
        id: 1,
        createdAt: new Date().toISOString(),
        body: "test body",
        author: {
          username: "test-user",
          bio: "test",
          image: "test",
          following: false,
        },
      },
      {
        id: 2,
        createdAt: new Date().toISOString(),
        body: "test body",
        author: {
          username: "test-user2",
          bio: "test2",
          image: "test2",
          following: false,
        },
      },
    ];

    component.onDeleteComment(component.comments[0]);

    expect(component.comments.length).toBe(1);
  });
});
