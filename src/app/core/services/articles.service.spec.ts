import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/environment";
import { HttpParams } from "@angular/common/http";
import { throwError } from "rxjs";
import { error } from "console";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("on error should return an Observable with the error message", () => {
    const mockErrorResponse = { status: 400, statusText: "Bad Request" };
    const data = "Invalid request parameters";
    let errResponse: any;
    service.get("/test").subscribe(
      () => {},
      (err) => (errResponse = err)
    );
    httpMock
      .expectOne(`${environment.api_url}/test`)
      .flush(data, mockErrorResponse);
    expect(errResponse).toBe(data);
  });

  describe("test get", () => {});
});
