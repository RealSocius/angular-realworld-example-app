import { TestBed } from "@angular/core/testing";

import { JwtService } from "./jwt.service";

describe("JwtService", () => {
  let jwtService: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService],
    });

    jwtService = TestBed.inject(JwtService);
  });

  it("should be created", () => {
    expect(jwtService).toBeTruthy();
  });

  describe("getToken", () => {
    it("should return the token from local storage", () => {
      const token = "test-token";
      localStorage.setItem("jwtToken", token);

      const result = jwtService.getToken();

      expect(result).toEqual(token);
    });
  });

  describe("saveToken", () => {
    it("should save the token to local storage", () => {
      const token = "test-token";

      jwtService.saveToken(token);

      expect(localStorage.getItem("jwtToken")).toEqual(token);
    });
  });

  describe("destroyToken", () => {
    it("should remove the token from local storage", () => {
      spyOn(localStorage, "removeItem");

      jwtService.destroyToken();

      expect(localStorage.removeItem).toHaveBeenCalledWith("jwtToken");
    });
  });
});
