import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { take } from "rxjs/operators";

import { HomeAuthResolver } from "./home-auth-resolver.service";
import { UserService } from "../core";

describe("AuthGuard", () => {
  let authGuard: HomeAuthResolver;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj("UserService", [
      "isAuthenticated",
    ]);

    TestBed.configureTestingModule({
      providers: [
        HomeAuthResolver,
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    authGuard = TestBed.inject(HomeAuthResolver);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it("should be created", () => {
    expect(authGuard).toBeTruthy();
  });

  it("should return true if user is authenticated", (done) => {
    userService.isAuthenticated = of(true);

    authGuard
      .resolve({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toBeTrue();
        done();
      });
  });

  it("should return false if user is not authenticated", (done) => {
    userService.isAuthenticated = of(false);

    authGuard
      .resolve({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toBeFalse();
        done();
      });
  });
});
