import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Errors } from "../core";
import { ListErrorsComponent } from "./list-errors.component";

describe("ListErrorsComponent", () => {
  let component: ListErrorsComponent;
  let fixture: ComponentFixture<ListErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListErrorsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should format the errors correctly", () => {
    const errors: Errors = {
      errors: { email: "is already taken", password: "is too short" },
    };
    component.errors = errors;

    fixture.detectChanges();

    const errorList = fixture.debugElement.query(
      By.css(".error-messages")
    ).nativeElement;
    expect(errorList.textContent).toContain("email is already taken");
    expect(errorList.textContent).toContain("password is too short");
  });

  it("should not show the error list when there are no errors", () => {
    component.errors = { errors: {} };
    fixture.detectChanges();

    const errorListLength = fixture.debugElement.query(
      By.css(".error-messages")
    ).children.length;
    expect(errorListLength).toBe(0);
  });
});
