import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component } from "@angular/core";

import { UserService } from "./core";
import { AppComponent } from "./app.component";

@Component({ selector: "router-outlet", template: "" })
class RouterOutletStubComponent {}

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj("UserService", ["populate"]);

    TestBed.configureTestingModule({
      declarations: [AppComponent, RouterOutletStubComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should call UserService.populate on initialization", () => {
    fixture.detectChanges();

    expect(userService.populate).toHaveBeenCalled();
  });
});
