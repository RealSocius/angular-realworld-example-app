import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Article } from "../../core";
import { ArticleMetaComponent } from "./article-meta.component";

describe("ArticleMetaComponent", () => {
  let component: ArticleMetaComponent;
  let fixture: ComponentFixture<ArticleMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleMetaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleMetaComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
