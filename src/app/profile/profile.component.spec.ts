import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { User, UserService, Profile } from "../core";
import { ProfileComponent } from "./profile.component";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let activatedRoute: ActivatedRoute;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj("UserService", ["get"]);
    activatedRoute = {
      data: of({ profile: { username: "testuser" } as Profile }),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the profile property from the route data", () => {
    expect(component.profile).toEqual({ username: "testuser" } as Profile);
  });

  it("should set the currentUser and isUser properties from the UserService", () => {
    const currentUser = { username: "testuser" } as User;
    userService.currentUser = of(currentUser);

    component.ngOnInit();

    expect(component.currentUser).toEqual(currentUser);
    expect(component.isUser).toBeTrue();
  });

  it("should toggle following on", () => {
    component.onToggleFollowing(true);
    expect(component.profile.following).toBeTrue();
  });

  it("should toggle following off", () => {
    component.onToggleFollowing(false);
    expect(component.profile.following).toBeFalse();
  });
});
