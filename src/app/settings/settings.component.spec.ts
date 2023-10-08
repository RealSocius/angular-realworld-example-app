import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { User, UserService } from "../core";
import { SettingsComponent } from "./settings.component";

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let router: jasmine.SpyObj<Router>;
  let userService: jasmine.SpyObj<UserService>;
  let fb: FormBuilder;

  beforeEach(async () => {
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    userService = jasmine.createSpyObj("UserService", [
      "getCurrentUser",
      "update",
      "purgeAuth",
    ]);
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: UserService, useValue: userService },
        { provide: FormBuilder, useValue: fb },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the user property from the UserService", () => {
    const currentUser = { username: "testuser" } as User;
    userService.getCurrentUser.and.returnValue(currentUser);

    component.ngOnInit();

    expect(component.user).toEqual(currentUser);
  });

  it("should log the user out", () => {
    component.logout();

    expect(userService.purgeAuth).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith("/");
  });

  it("should update the user settings", () => {
    component.settingsForm = fb.group({
      image: ["test"],
      username: ["testuser"],
      bio: ["test"],
      email: ["test"],
    });

    userService.update.and.returnValue(of(component.settingsForm.value));

    component.submitForm();

    expect(userService.update).toHaveBeenCalledWith(
      component.settingsForm.value
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith("/profile/testuser");
  });

  it("should handle errors when updating the user settings fails", () => {
    userService.update.and.returnValue(
      throwError(new Error("updating user failed"))
    );

    component.submitForm();

    expect(component.errors).toEqual(new Error("updating user failed"));
    expect(component.isSubmitting).toBeFalse();
  });
});
