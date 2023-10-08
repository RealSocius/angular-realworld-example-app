import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { Profile, ProfilesService, UserService } from "../../core";
import { FollowButtonComponent } from "./follow-button.component";
import { Router } from "@angular/router";

describe("FollowButtonComponent", () => {
  let component: FollowButtonComponent;
  let fixture: ComponentFixture<FollowButtonComponent>;
  let profilesService: jasmine.SpyObj<ProfilesService>;
  let router: jasmine.SpyObj<Router>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    profilesService = jasmine.createSpyObj("ProfilesService", [
      "follow",
      "unfollow",
    ]);
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    userService = jasmine.createSpyObj("UserService", ["isAuthenticated"]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FollowButtonComponent],
      providers: [
        { provide: ProfilesService, useValue: profilesService },
        { provide: Router, useValue: router },
        { provide: UserService, useValue: userService },
      ],
    });

    fixture = TestBed.createComponent(FollowButtonComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle following", () => {
    const profile: Profile = {
      username: "testuser",
      following: false,
      bio: "",
      image: "",
    };
    component.profile = profile;
    profilesService.follow.and.returnValue(of(profile));
    profilesService.unfollow.and.returnValue(of(profile));
    userService.isAuthenticated = of(true);
    spyOn(component.toggle, "emit");

    component.toggleFollowing().subscribe(() => {
      component.profile.following = true;
      expect(component.isSubmitting).toBeFalse();
      expect(component.profile.following).toBeTrue();
      expect(component.toggle.emit).toHaveBeenCalledWith(true);
      expect(profilesService.follow).toHaveBeenCalledWith(profile.username);
    });

    component.toggleFollowing().subscribe(() => {
      component.profile.following = false;
      expect(component.isSubmitting).toBeFalse();
      expect(component.profile.following).toBeFalse();
      expect(component.toggle.emit).toHaveBeenCalledWith(false);
      expect(profilesService.unfollow).toHaveBeenCalledWith(profile.username);
    });
  });

  it("should handle errors", () => {
    const profile: Profile = {
      username: "testuser",
      following: false,
      bio: "",
      image: "",
    };
    component.profile = profile;
    profilesService.follow.and.returnValue(throwError(Error("error")));
    profilesService.unfollow.and.returnValue(throwError(Error("error")));
    userService.isAuthenticated = of(true);
    spyOn(component.toggle, "emit");

    component.toggleFollowing().subscribe(
      () => {},
      () => {
        component.profile.following = true;
        expect(component.isSubmitting).toBeFalse();
        expect(component.toggle.emit).not.toHaveBeenCalled();
      }
    );

    component.toggleFollowing().subscribe(
      () => {},
      () => {
        expect(component.isSubmitting).toBeFalse();
        expect(component.toggle.emit).not.toHaveBeenCalled();
      }
    );
  });

  it("should redirect to login if not authenticated", () => {
    userService.isAuthenticated = of(false);

    component.toggleFollowing().subscribe(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith("/login");
      expect(profilesService.follow).not.toHaveBeenCalled();
      expect(profilesService.unfollow).not.toHaveBeenCalled();
    });
  });
});
