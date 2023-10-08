import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProfilesService } from "./profiles.service";
import { ApiService } from "./api.service";
import { of } from "rxjs";

describe("ProfilesService", () => {
  let service: ProfilesService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj("ApiService", ["get", "post", "delete"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProfilesService,
        { provide: ApiService, useValue: apiService },
      ],
    });

    service = TestBed.inject(ProfilesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get profile by username", () => {
    const profile = {
      username: "test",
      bio: "test",
      image: "test",
      following: false,
    };
    apiService.get.and.returnValue(of({ profile }));

    service.get("test").subscribe((data) => {
      expect(data).toEqual(profile);
    });
  });

  it("should follow profile by username", () => {
    const profile = {
      username: "test",
      bio: "test",
      image: "test",
      following: true,
    };

    service.follow(profile.username);

    expect(apiService.post).toHaveBeenCalledWith("/profiles/test/follow");
  });

  it("should unfollow profile by username", () => {
    const profile = {
      username: "test",
      bio: "test",
      image: "test",
      following: false,
    };

    service.unfollow(profile.username);

    expect(apiService.delete).toHaveBeenCalledWith("/profiles/test/follow");
  });
});
