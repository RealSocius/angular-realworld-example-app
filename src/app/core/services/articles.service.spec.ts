import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ArticlesService } from "./articles.service";
import { ApiService } from "./api.service";
import { ArticleListConfig } from "../models";
import { of } from "rxjs";
import { Article } from "../models/article.model";

describe("ArticlesService", () => {
  let service: ArticlesService;
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
        ArticlesService,
        { provide: ApiService, useValue: apiService },
      ],
    });

    service = TestBed.inject(ArticlesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should test query", () => {
    const config: ArticleListConfig = {
      type: "all",
      filters: {
        author: "test",
      },
    };

    apiService.get.and.returnValue(of({ articles: [], articlesCount: 0 }));

    service
      .query(config)
      .subscribe((data) =>
        expect(data).toEqual({ articles: [], articlesCount: 0 })
      );

    expect(apiService.get).toHaveBeenCalledWith(
      "/articles",
      jasmine.any(Object)
    );
  });

  it("should test query with feed", () => {
    const config: ArticleListConfig = {
      type: "feed",
      filters: {},
    };

    apiService.get.and.returnValue(of({ articles: [], articlesCount: 0 }));

    service
      .query(config)
      .subscribe((data) =>
        expect(data).toEqual({ articles: [], articlesCount: 0 })
      );

    expect(apiService.get).toHaveBeenCalledWith(
      "/articles/feed",
      jasmine.any(Object)
    );
  });

  it("should test get", () => {
    const mockArticleResponse: { [article: string]: Article } = {
      article: {
        author: {
          username: "",
          bio: "",
          image: "",
          following: false,
        },
        slug: "test",
        title: "test",
        description: "test",
        body: "test",
        tagList: [],
        createdAt: "",
        updatedAt: "",
        favorited: false,
        favoritesCount: 0,
      },
    };

    apiService.get.and.returnValue(of(mockArticleResponse));

    service
      .get("test")
      .subscribe((data) => expect(data).toEqual(mockArticleResponse.article));

    expect(apiService.get).toHaveBeenCalledWith("/articles/test");
  });

  it("should test destroy", () => {
    apiService.delete.and.returnValue(of({}));

    service.destroy("test").subscribe((data) => expect(data).toEqual({}));

    expect(apiService.delete).toHaveBeenCalledWith("/articles/test");
  });

  it("should test create new via save method", () => {
    let mockArticle: Article = {
      author: {
        username: "",
        bio: "",
        image: "",
        following: false,
      },
      slug: "",
      title: "test",
      description: "test",
      body: "test",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited: false,
      favoritesCount: 0,
    };

    apiService.post.and.returnValue(of({ article: mockArticle }));

    service
      .save(mockArticle)
      .subscribe((data) => expect(data).toEqual(mockArticle));

    expect(apiService.post).toHaveBeenCalledWith(
      "/articles/" + mockArticle.slug,
      {
        article: mockArticle,
      }
    );
  });

  it("should test update existing via save method", () => {
    let mockArticle: Article = {
      author: {
        username: "",
        bio: "",
        image: "",
        following: false,
      },
      slug: "test",
      title: "test",
      description: "test",
      body: "test",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited: false,
      favoritesCount: 0,
    };
    apiService.put.and.returnValue(of({ article: mockArticle }));

    service
      .save(mockArticle)
      .subscribe((data) => expect(data).toEqual(mockArticle));

    expect(apiService.put).toHaveBeenCalledWith(
      "/articles/" + mockArticle.slug,
      {
        article: mockArticle,
      }
    );
  });

  it("should test favorite", () => {
    let mockArticle: Article = {
      author: {
        username: "",
        bio: "",
        image: "",
        following: false,
      },
      slug: "test",
      title: "test",
      description: "test",
      body: "test",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited: false,
      favoritesCount: 0,
    };

    apiService.post.and.returnValue(of(mockArticle));

    service
      .favorite(mockArticle.slug)
      .subscribe((data) => expect(data).toEqual(mockArticle));

    expect(apiService.post).toHaveBeenCalledWith(
      "/articles/" + mockArticle.slug + "/favorite"
    );
  });

  it("should test unfavorite", () => {
    let mockArticle: Article = {
      author: {
        username: "",
        bio: "",
        image: "",
        following: false,
      },
      slug: "test",
      title: "test",
      description: "test",
      body: "test",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited: false,
      favoritesCount: 0,
    };

    apiService.delete.and.returnValue(of(mockArticle));

    service
      .unfavorite(mockArticle.slug)
      .subscribe((data) => expect(data).toEqual(mockArticle));

    expect(apiService.delete).toHaveBeenCalledWith(
      "/articles/" + mockArticle.slug + "/favorite"
    );
  });
});
