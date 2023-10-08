import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";
import { UserService } from "../core";
import { NoAuthGuard } from "./no-auth-guard.service";

describe("NoAuthGuard", () => {
  let service: NoAuthGuard;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj("UserService", ["isAuthenticated"]);

    TestBed.configureTestingModule({
      providers: [NoAuthGuard, { provide: UserService, useValue: userService }],
    });

    service = TestBed.inject(NoAuthGuard);
  });

  it("should return true if the user is not authenticated", () => {
    userService.isAuthenticated = of(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    service.canActivate(route, state).subscribe((result) => {
      expect(result).toBeTrue();
    });
  });

  it("should return false if the user is authenticated", () => {
    userService.isAuthenticated = of(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    service.canActivate(route, state).subscribe((result) => {
      expect(result).toBeFalse();
    });
  });
});
