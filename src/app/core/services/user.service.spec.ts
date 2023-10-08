import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApiService } from "./api.service";
import { of, throwError } from "rxjs";
import { UserService } from "./user.service";
import { JwtService } from "./jwt.service";
import { User } from "../models";

describe("UserService", () => {
  let service: UserService;
  let apiService: jasmine.SpyObj<ApiService>;
  let jwtService: jasmine.SpyObj<JwtService>;
  const user: User = {
    username: "test",
    bio: "test",
    image: "test",
    email: "test",
    token: "test-token",
  };

  beforeEach(() => {
    apiService = jasmine.createSpyObj("ApiService", [
      "get",
      "put",
      "post",
      "delete",
    ]);

    jwtService = jasmine.createSpyObj("ApiService", [
      "getToken",
      "saveToken",
      "destroyToken",
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: ApiService, useValue: apiService },
        { provide: JwtService, useValue: jwtService },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should populate the user if jwt exists", () => {
    jwtService.getToken.and.returnValue("testToken");
    apiService.get.and.returnValue(of({ user }));

    spyOn(service, "setAuth");

    service.populate();

    expect(service.setAuth).toHaveBeenCalledWith(user);
  });

  it("should purge auth if getting user failed", () => {
    jwtService.getToken.and.returnValue("testToken");
    apiService.get.and.returnValue(throwError("Error getting user"));

    spyOn(service, "purgeAuth");

    service.populate();

    expect(service.purgeAuth).toHaveBeenCalled();
  });

  it("should purge auth if getToken returns empty", () => {
    jwtService.getToken.and.returnValue("");

    spyOn(service, "purgeAuth");

    service.populate();

    expect(service.purgeAuth).toHaveBeenCalled();
  });

  it("should setAuth", () => {
    service.setAuth(user);

    expect(jwtService.saveToken).toHaveBeenCalledWith(user.token);
    expect(service.getCurrentUser()).toEqual(user);
    service.isAuthenticated.subscribe((data) => expect(data).toBeTrue());
  });

  it("should purgeAuth", () => {
    service.purgeAuth();

    expect(jwtService.destroyToken).toHaveBeenCalled();
    expect(service.getCurrentUser()).toEqual({} as User);
    service.isAuthenticated.subscribe((data) => expect(data).toBeFalse());
  });

  it("should attemptAuth", () => {
    apiService.post.and.returnValue(of({ user }));

    service.attemptAuth("test", "test").subscribe((data) => {
      expect(data).toEqual(user);
    });
  });

  it("should attemptAuth via login", () => {
    apiService.post.and.returnValue(of({ user }));

    service.attemptAuth("login", "test").subscribe((data) => {
      expect(data).toEqual(user);
    });
  });

  it("should update the user on the server", () => {
    apiService.put.and.returnValue(of({ user }));

    service.update(user).subscribe((data) => {
      expect(data).toEqual(user);
    });
  });
});
