import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { of, throwError } from "rxjs";

import { ArticleResolver } from "./article-resolver.service";
import { ArticlesService } from "../core";
import { Article } from "../core/models/article.model";
import { catchError } from "rxjs/operators";

describe("ArticleResolver", () => {
  let resolver: ArticleResolver;
  let articlesService: jasmine.SpyObj<ArticlesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    articlesService = jasmine.createSpyObj("ArticlesService", ["get"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    activatedRouteSnapshot = new ActivatedRouteSnapshot();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ArticleResolver,
        { provide: ArticlesService, useValue: articlesService },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshot },
      ],
    });

    resolver = TestBed.inject(ArticleResolver);
  });

  it("should be created", () => {
    expect(resolver).toBeTruthy();
  });

  it("should resolve an article", () => {
    const article: Article = {
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
    };

    articlesService.get.and.returnValue(of(article));

    activatedRouteSnapshot.params = { slug: "test" };

    resolver
      .resolve(activatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe((data) => {
        expect(data).toEqual(article);
      });
  });

  it("should navigate to / if it catches an error", () => {
    articlesService.get.and.returnValue(
      throwError(() => new Error("Error getting article"))
    );

    activatedRouteSnapshot.params = { slug: "test" };

    resolver
      .resolve(activatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(
        () => {},
        () => {
          expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/");
        }
      );
  });
});
