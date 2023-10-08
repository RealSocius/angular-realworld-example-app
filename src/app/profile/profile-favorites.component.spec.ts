import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { ArticleListConfig, Profile } from "../core";
import { ProfileFavoritesComponent } from "./profile-favorites.component";

describe("ProfileFavoritesComponent", () => {
  let component: ProfileFavoritesComponent;
  let fixture: ComponentFixture<ProfileFavoritesComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    activatedRoute = {
      parent: {
        data: of({ profile: { username: "testuser" } as Profile }),
      },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [ProfileFavoritesComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the favorites list config filters to the profile username", () => {
    const expectedListConfig: ArticleListConfig = {
      type: "all",
      filters: {
        favorited: "testuser",
      },
    };

    expect(component.favoritesConfig).toEqual(expectedListConfig);
  });
});
