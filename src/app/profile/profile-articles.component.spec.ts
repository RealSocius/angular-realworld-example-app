import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { ArticleListConfig, Profile } from "../core";
import { ProfileArticlesComponent } from "./profile-articles.component";

describe("ProfileArticlesComponent", () => {
  let component: ProfileArticlesComponent;
  let fixture: ComponentFixture<ProfileArticlesComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    activatedRoute = {
      parent: {
        data: of({ profile: { username: "test-user" } as Profile }),
      },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [ProfileArticlesComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the article list config filters to the profile username", () => {
    const expectedListConfig: ArticleListConfig = {
      type: "all",
      filters: {
        author: "test-user",
      },
    };

    expect(component.articlesConfig).toEqual(expectedListConfig);
  });
});
