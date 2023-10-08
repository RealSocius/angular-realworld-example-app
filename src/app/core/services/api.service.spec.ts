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

  describe("test get", () => {
    it("get should return an Observable", () => {
      const mockParams = {
        testParam: "test",
      };
      service
        .get("/test", new HttpParams({ fromObject: mockParams }))
        .subscribe((data) => expect(data).toEqual(mockParams));
      const req = httpMock.expectOne(
        `${environment.api_url}/test?testParam=test`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockParams);
    });

    it("put should return an Observable", () => {
      const mockBody = {
        test: "test",
      };
      service
        .put("/test", mockBody)
        .subscribe((data) => expect(data).toEqual(mockBody));
      const req = httpMock.expectOne(`${environment.api_url}/test`);
      expect(req.request.method).toBe("PUT");
      req.flush(mockBody);

      service
        .put("/test")
        .subscribe((data) => expect(data).toEqual({}));
      const reqDefault = httpMock.expectOne(`${environment.api_url}/test`);
      expect(reqDefault.request.method).toBe("PUT");
      reqDefault.flush({});
    });

    it("post should return an Observable", () => {
      const mockBody = {
        test: "test",
      };
      service
        .post("/test", mockBody)
        .subscribe((data) => expect(data).toEqual(mockBody));
      const req = httpMock.expectOne(`${environment.api_url}/test`);
      expect(req.request.method).toBe("POST");
      req.flush(mockBody);

      service
        .post("/test")
        .subscribe((data) => expect(data).toEqual({}));
      const reqDefault = httpMock.expectOne(`${environment.api_url}/test`);
      expect(reqDefault.request.method).toBe("POST");
      reqDefault.flush({});
    });

    it("delete should return an Observable", () => {
      service.delete("/test/1").subscribe((data) => expect(data).toBeDefined());
      const req = httpMock.expectOne(`${environment.api_url}/test/1`);
      expect(req.request.method).toBe("DELETE");
    });
  });
});
