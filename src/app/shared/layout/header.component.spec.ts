import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { User, UserService } from "../../core";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj("UserService", ["get currentUser"]);

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: UserService, useValue: userService }],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display the current user", () => {
    const user: User = {
      username: "testuser",
      email: "testuser@example.com",
      token: "token",
      bio: "",
      image: "",
    };
    userService.currentUser = of(user);
    fixture.detectChanges();

    expect(component.currentUser).toEqual(user);
  });
});
