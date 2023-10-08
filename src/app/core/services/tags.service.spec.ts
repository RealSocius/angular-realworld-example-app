import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";
import { TagsService } from "./tags.service";
import { ApiService } from "./api.service";

describe("ProfilesService", () => {
  let service: TagsService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj("ApiService", ["get"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagsService, { provide: ApiService, useValue: apiService }],
    });

    service = TestBed.inject(TagsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get all tags", () => {
    const tags = ["test1", "test2"];
    apiService.get.and.returnValue(of({ tags }));

    service.getAll().subscribe((data) => {
      expect(data).toEqual(tags);
    });
  });
});
