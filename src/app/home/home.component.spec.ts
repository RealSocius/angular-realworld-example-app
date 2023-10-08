import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { ArticleListConfig, TagsService } from "../core";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: jasmine.SpyObj<Router>;
  let tagsService: jasmine.SpyObj<TagsService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    tagsService = jasmine.createSpyObj("TagsService", ["getAll"]);
    tagsService.getAll.and.returnValue(of(["test"]));
    activatedRoute = {
      data: of({
        isAuthenticated: true,
      }),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: TagsService, useValue: tagsService },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();
  });

  it("should create", () => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.listConfig.type).toEqual("feed");
  });

  it("should create when unauthenticated", () => {
    activatedRoute.data = of({ isAuthenticated: false });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.listConfig.type).toEqual("all");
  });

  it("should navigate to login if type feed is requested and user is unauthenticated", () => {
    activatedRoute.data = of({ isAuthenticated: false });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.listConfig.type).toEqual("all");

    component.setListTo("feed", component.listConfig.filters);

    expect(router.navigateByUrl).toHaveBeenCalledWith("/login");
  });

  it("should use default args in setListTo", () => {
    activatedRoute.data = of({ isAuthenticated: false });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.setListTo();

    expect(component.listConfig.type).toEqual("");
    expect(component.listConfig.filters).toEqual({});
  });
});
