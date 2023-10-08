import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Article } from "../../core";
import { ArticlePreviewComponent } from "./article-preview.component";
import { emit } from "process";

describe("ArticlePreviewComponent", () => {
  let component: ArticlePreviewComponent;
  let fixture: ComponentFixture<ArticlePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlePreviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePreviewComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle the favorite status and count", () => {
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
    fixture.detectChanges();

    component.onToggleFavorite(true);

    expect(component.article.favorited).toBeTrue();
    expect(component.article.favoritesCount).toEqual(1);

    component.onToggleFavorite(false);

    expect(component.article.favorited).toBeFalse();
    expect(component.article.favoritesCount).toEqual(0);
  });
});
