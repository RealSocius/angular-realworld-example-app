import { TestBed } from "@angular/core/testing";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { of, throwError } from "rxjs";
import { Profile, ProfilesService } from "../core";
import { ProfileResolver } from "./profile-resolver.service";

describe("ProfileResolver", () => {
  let resolver: ProfileResolver;
  let profilesService: jasmine.SpyObj<ProfilesService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    profilesService = jasmine.createSpyObj("ProfilesService", ["get"]);
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    activatedRoute = {
      params: {
        username: "test-user",
      },
    } as unknown as ActivatedRouteSnapshot;

    TestBed.configureTestingModule({
      providers: [
        ProfileResolver,
        { provide: ProfilesService, useValue: profilesService },
        { provide: Router, useValue: router },
        { provide: ActivatedRouteSnapshot, useValue: activatedRoute },
      ],
    });

    resolver = TestBed.inject(ProfileResolver);
    state = {} as RouterStateSnapshot;
  });

  it("should be created", () => {
    expect(resolver).toBeTruthy();
  });

  it("should resolve with the profile from the ProfilesService", () => {
    const profile = { username: "test-user" } as Profile;
    profilesService.get.and.returnValue(of(profile));

    resolver.resolve(activatedRoute, state).subscribe((result) => {
      expect(result).toEqual(profile);
    });
  });

  it("should navigate to / on error", () => {
    const error = { message: "Error getting profile" };
    profilesService.get.and.returnValue(throwError(error));

    resolver.resolve(activatedRoute, state).subscribe(
      () => {},
      () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith("/");
      }
    );
  });
});
