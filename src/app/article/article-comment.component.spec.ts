import { TestBed, ComponentFixture } from "@angular/core/testing";
import { of } from "rxjs";

import { UserService, User } from "../core";
import { ArticleCommentComponent } from "./article-comment.component";

describe("ArticleCommentComponent", () => {
  let component: ArticleCommentComponent;
  let fixture: ComponentFixture<ArticleCommentComponent>;
  let userService: jasmine.SpyObj<UserService>;
  const currentUser: User = {
    username: "test-user",
    bio: "test bio",
    image: "test image",
    token: "test token",
    email: "test email",
  };

  beforeEach(() => {
    userService = jasmine.createSpyObj("UserService", ["currentUser"]);
    userService.currentUser = of(currentUser);

    TestBed.configureTestingModule({
      declarations: [ArticleCommentComponent],
      providers: [{ provide: UserService, useValue: userService }],
    });

    fixture = TestBed.createComponent(ArticleCommentComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should init and be able to edit if own comment", () => {
    component.comment = {
      id: 1,
      createdAt: new Date().toISOString(),
      body: "test body",
      author: {
        username: "test-user",
        bio: "test",
        image: "test",
        following: false,
      },
    };

    component.ngOnInit();

    expect(component.canModify).toBeTrue();
  });

  it("should init and not be able to edit if own comment", () => {
    component.comment = {
      id: 1,
      createdAt: new Date().toISOString(),
      body: "test body",
      author: {
        username: "other-user",
        bio: "test",
        image: "test",
        following: false,
      },
    };

    component.ngOnInit();

    expect(component.canModify).toBeFalse();
  });

  it("should emit deleteComment when deleteClicked is called", () => {
    component.comment = {
      id: 1,
      createdAt: new Date().toISOString(),
      body: "test body",
      author: {
        username: "other-user",
        bio: "test",
        image: "test",
        following: false,
      },
    };

    component.ngOnInit();

    spyOn(component.deleteComment, "emit");

    component.deleteClicked();

    expect(component.deleteComment.emit).toHaveBeenCalledWith(true);
  });
});
