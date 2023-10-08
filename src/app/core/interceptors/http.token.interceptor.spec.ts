import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";

import { HttpTokenInterceptor } from "./http.token.interceptor";
import { JwtService } from "../services/jwt.service";

describe("HttpTokenInterceptor", () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let jwtService: jasmine.SpyObj<JwtService>;

  beforeEach(() => {
    const jwtServiceSpy = jasmine.createSpyObj("JwtService", ["getToken"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpTokenInterceptor,
          multi: true,
        },
        { provide: JwtService, useValue: jwtServiceSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
  });

  it("should add an Authorization header with the token", () => {
    const token = "test-token";
    jwtService.getToken.and.returnValue(token);

    http.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.get("Authorization")).toEqual(`Token ${token}`);
  });

  it("should not add an Authorization header if no token is present", () => {
    jwtService.getToken.and.returnValue(null);

    http.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.has("Authorization")).toBeFalse();
  });
});
