import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { of, throwError } from "rxjs";
import { AuthGuard, Errors, User, UserService } from "../core";
import { AuthComponent } from "./auth.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("AuthComponent", () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: jasmine.SpyObj<AuthGuard>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let userService: jasmine.SpyObj<UserService>;
  const currentUser: User = {
    username: "test-user",
    bio: "test bio",
    image: "test image",
    token: "test token",
    email: "test email",
  };

  beforeEach(async () => {
    authService = jasmine.createSpyObj("AuthService", ["login"]);
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    userService = jasmine.createSpyObj("UserService", [
      "currentUser",
      "attemptAuth",
    ]);
    userService.currentUser = of(currentUser);

    activatedRoute = {
      url: of([new UrlSegment("login", {})]),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthGuard, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  it("should create with login", () => {
    activatedRoute.url = of([new UrlSegment("login", {})]);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create with register", () => {
    activatedRoute.url = of([new UrlSegment("register", {})]);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle submit form on login", () => {
    activatedRoute.url = of([new UrlSegment("login", {})]);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userService.attemptAuth.and.returnValue(of(currentUser));

    component.authForm.controls["email"].setValue("test@test.de");
    component.authForm.controls["password"].setValue("test");
    component.submitForm();

    expect(userService.attemptAuth).toHaveBeenCalled();

    expect(router.navigateByUrl).toHaveBeenCalledWith("/");
  });

  it("should handle submit form on register", () => {
    activatedRoute.url = of([new UrlSegment("register", {})]);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userService.attemptAuth.and.returnValue(of(currentUser));

    component.authForm.controls["email"].setValue("test@test.de");
    component.authForm.controls["password"].setValue("test");
    component.submitForm();

    expect(userService.attemptAuth).toHaveBeenCalled();

    expect(router.navigateByUrl).toHaveBeenCalledWith("/");
  });

  it("should handle submit form error on login", () => {
    activatedRoute.url = of([new UrlSegment("login", {})]);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errors: Errors = { errors: { error: "error" } };
    userService.attemptAuth.and.returnValue(throwError(errors));

    component.authForm.controls["email"].setValue("test@test.de");
    component.authForm.controls["password"].setValue("test");
    component.submitForm();

    expect(userService.attemptAuth).toHaveBeenCalled();
    expect(component.errors).toEqual(errors);
  });

  it("should handle submit form error on register", () => {
    activatedRoute.url = of([new UrlSegment("register", {})]);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errors: Errors = { errors: { error: "error" } };
    userService.attemptAuth.and.returnValue(throwError(errors));

    component.authForm.controls["email"].setValue("test@test.de");
    component.authForm.controls["password"].setValue("test");
    component.submitForm();

    expect(userService.attemptAuth).toHaveBeenCalled();
    expect(component.errors).toEqual(errors);
  });
});
