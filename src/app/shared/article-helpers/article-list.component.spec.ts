import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Article, ArticleListConfig, ArticlesService } from "../../core";
import { ArticleListComponent } from "./article-list.component";

describe("ArticleListComponent", () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let articlesService: jasmine.SpyObj<ArticlesService>;

  beforeEach(() => {
    articlesService = jasmine.createSpyObj("ArticlesService", ["query"]);

    TestBed.configureTestingModule({
      declarations: [ArticleListComponent],
      providers: [{ provide: ArticlesService, useValue: articlesService }],
    });

    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set config correctly", () => {
    articlesService.query.and.returnValue(
      of({ articles: [], articlesCount: 0 })
    );
    component.limit = 10;

    const config: ArticleListConfig = {
      type: "all",
      filters: {},
    };
    component.config = config;

    expect(component.query).toEqual(config);
    expect(component.currentPage).toEqual(1);
  });

  it("should set page correctly", () => {
    articlesService.query.and.returnValue(
      of({ articles: [], articlesCount: 0 })
    );
    component.limit = 10;

    const config: ArticleListConfig = {
      type: "all",
      filters: {},
    };
    component.config = config;

    component.setPageTo(2);

    expect(component.currentPage).toEqual(2);
  });

  it("should run query correctly", () => {
    articlesService.query.and.returnValue(
      of({
        articles: [
          {
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
        ],
        articlesCount: 1,
      })
    );
    component.limit = 10;

    const config: ArticleListConfig = {
      type: "all",
      filters: {},
    };
    component.config = config;

    expect(component.query).toEqual(config);
    expect(component.currentPage).toEqual(1);
  });
});
