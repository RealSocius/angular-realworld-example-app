import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BehaviorSubject, of } from "rxjs";
import { User, UserService } from "../core";
import { ShowAuthedDirective } from "./show-authed.directive";

@Component({
  template: `
    <div *appShowAuthed="true">
      <div class="authenticated-true">Authenticated</div>
    </div>
    <div *appShowAuthed="false">
      <div class="authenticated-false">Authenticated</div>
    </div>
  `,
})
class TestComponent {
  @ViewChild(ShowAuthedDirective, { static: true })
  directive: ShowAuthedDirective;
}

describe("ShowAuthedDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj("UserService", ["isAuthenticated"]);

    TestBed.configureTestingModule({
      declarations: [ShowAuthedDirective, TestComponent],
      providers: [{ provide: UserService, useValue: userService }],
    });
  });

  function createComponent() {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it("should show auth content when authenticated", () => {
    userService.isAuthenticated = of(true);
    createComponent();
    fixture.detectChanges();

    const divTrue = fixture.debugElement.query(By.css(".authenticated-true"));
    expect(divTrue).toBeTruthy();
    const divFalse = fixture.debugElement.query(By.css(".authenticated-false"));
    expect(divFalse).toBeFalsy();
  });

  it("should show unauth content when unauthenticated", () => {
    userService.isAuthenticated = of(false);
    createComponent();
    fixture.detectChanges();

    const divTrue = fixture.debugElement.query(By.css(".authenticated-true"));
    expect(divTrue).toBeFalsy();
    const divFalse = fixture.debugElement.query(By.css(".authenticated-false"));
    expect(divFalse).toBeTruthy();
  });
});
