import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router, ActivatedRouteSnapshot } from "@angular/router";

import { EditableArticleResolver } from "./editable-article-resolver.service";
import { ArticlesService, User, UserService } from "../core";
import { of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
describe("EditableArticleResolver", () => {
  let resolver: EditableArticleResolver;
  let articlesService: jasmine.SpyObj<ArticlesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;
  let userService: jasmine.SpyObj<UserService>;
  const currentUser: User = {
    username: "test-user",
    bio: "test bio",
    image: "test image",
    token: "test token",
    email: "test email",
  };

  beforeEach(() => {
    userService = jasmine.createSpyObj("UserService", ["getCurrentUser"]);
    userService.currentUser = of(currentUser);
    articlesService = jasmine.createSpyObj("ArticlesService", ["get"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    activatedRouteSnapshot = new ActivatedRouteSnapshot();

    TestBed.configureTestingModule({
      providers: [
        EditableArticleResolver,
        { provide: ArticlesService, useValue: articlesService },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshot },
        { provide: UserService, useValue: userService },
      ],
    });

    resolver = TestBed.inject(EditableArticleResolver);
  });

  it("should be created", () => {
    expect(resolver).toBeTruthy();
  });

  it("should resolve with article", () => {
    let testArticle = {
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
    };
    userService.getCurrentUser.and.returnValue(currentUser);

    articlesService.get.and.returnValue(of(testArticle));
    activatedRouteSnapshot.params = { slug: "test" };

    resolver.resolve(activatedRouteSnapshot, null).subscribe((article) => {
      expect(article).toEqual(testArticle);
    });

    expect(articlesService.get).toHaveBeenCalledWith("test");
  });

  it("should navigate home if user is not author", () => {
    let testArticle = {
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
        username: "other-user",
        bio: "test",
        image: "test",
        following: false,
      },
    };

    userService.getCurrentUser.and.returnValue(currentUser);

    articlesService.get.and.returnValue(of(testArticle));
    activatedRouteSnapshot.params = { slug: "test" };

    resolver.resolve(activatedRouteSnapshot, null).subscribe((article) => {
      expect(article).toBeUndefined();
    });

    expect(articlesService.get).toHaveBeenCalledWith("test");
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
  });

  it("should navigate home if user is not author", () => {
    userService.getCurrentUser.and.returnValue(currentUser);

    articlesService.get.and.returnValue(throwError(() => new Error("error")));
    activatedRouteSnapshot.params = { slug: "test" };

    resolver.resolve(activatedRouteSnapshot, null).subscribe(
      () => {},
      () => {
        expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      }
    );
  });
});
