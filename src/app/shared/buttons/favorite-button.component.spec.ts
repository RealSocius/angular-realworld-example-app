import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { Article, ArticlesService, UserService } from "../../core";
import { FavoriteButtonComponent } from "./favorite-button.component";
import { Router } from "@angular/router";

describe("FavoriteButtonComponent", () => {
  let component: FavoriteButtonComponent;
  let fixture: ComponentFixture<FavoriteButtonComponent>;
  let articlesService: jasmine.SpyObj<ArticlesService>;
  let userService: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    articlesService = jasmine.createSpyObj("ArticlesService", [
      "favorite",
      "unfavorite",
    ]);
    userService = jasmine.createSpyObj("UserService", ["get isAuthenticated"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FavoriteButtonComponent],
      providers: [
        { provide: ArticlesService, useValue: articlesService },
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(FavoriteButtonComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle the favorite status", () => {
    userService.isAuthenticated = of(true);

    const article: Article = {
      slug: "test-article",
      title: "Test Article",
      description: "This is a test article",
      body: "Lorem ipsum dolor sit amet",
      tagList: ["test", "angular"],
      createdAt: new Date("2021-01-01T00:00:00Z").toISOString(),
      updatedAt: new Date("2021-01-02T00:00:00Z").toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "testuser",
        bio: "Test bio",
        image: "https://testuser.com/image.jpg",
        following: false,
      },
    };
    component.article = article;

    articlesService.favorite.and.returnValue(of({} as Article));
    component.toggleFavorite().subscribe(() => {
      expect(component.isSubmitting).toBeFalse();
      expect(articlesService.favorite).toHaveBeenCalledWith(article.slug);
    });

    component.article.favorited = true;
    articlesService.unfavorite.and.returnValue(of({} as Article));
    component.toggleFavorite().subscribe(() => {
      expect(component.isSubmitting).toBeFalse();
      expect(articlesService.unfavorite).toHaveBeenCalledWith(article.slug);
    });
  });

  it("should handle errors when toggling the favorite status", () => {
    userService.isAuthenticated = of(true);

    const article: Article = {
      slug: "test-article",
      title: "Test Article",
      description: "This is a test article",
      body: "Lorem ipsum dolor sit amet",
      tagList: ["test", "angular"],
      createdAt: new Date("2021-01-01T00:00:00Z").toISOString(),
      updatedAt: new Date("2021-01-02T00:00:00Z").toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "testuser",
        bio: "Test bio",
        image: "https://testuser.com/image.jpg",
        following: false,
      },
    };
    component.article = article;

    articlesService.favorite.and.returnValue(throwError(Error("Error")));

    component.toggleFavorite().subscribe(
      () => {},
      (err) => {
        expect(err).toEqual(Error("Error"));
        expect(component.isSubmitting).toBeFalse();
      }
    );

    articlesService.unfavorite.and.returnValue(throwError(Error("Error")));

    component.article.favorited = true;
    component.toggleFavorite().subscribe(
      () => {},
      (err) => {
        expect(err).toEqual(Error("Error"));
        expect(component.isSubmitting).toBeFalse();
      }
    );
  });

  it("should redirect to login if not authenticated", () => {
    userService.isAuthenticated = of(false);

    component.toggleFavorite().subscribe(() => {
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/login");
      expect(articlesService.favorite).not.toHaveBeenCalled();
      expect(articlesService.unfavorite).not.toHaveBeenCalled();
    });
  });

  it("should not toggle the favorite status if submitting", () => {
    userService.isAuthenticated = of(false);

    component.isSubmitting = true;

    articlesService.favorite.and.returnValue(of({} as Article));
    articlesService.unfavorite.and.returnValue(of({} as Article));

    component.toggleFavorite().subscribe(() => {
      expect(component.isSubmitting).toBeTrue();
      expect(articlesService.favorite).not.toHaveBeenCalled();
      expect(articlesService.unfavorite).not.toHaveBeenCalled();
    });
  });
});
