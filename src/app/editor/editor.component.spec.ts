import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { Article, ArticlesService } from "../core";
import { EditorComponent } from "./editor.component";

describe("EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let articlesService: jasmine.SpyObj<ArticlesService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    articlesService = jasmine.createSpyObj("ArticlesService", ["save"]);
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    activatedRoute = {
      data: of({
        article: {
          slug: "test",
          title: "test",
          description: "test",
          body: "test",
          tagList: ["test"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: "test-user",
            bio: "test",
            image: "test",
            following: false,
          },
        },
      }),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ArticlesService, useValue: articlesService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add tag", () => {
    component.tagField.setValue("test");
    component.addTag();

    expect(component.article.tagList).toEqual(["test"]);
  });

  it("should push tag to tagArray", () => {
    component.article.tagList = ["test1"];

    component.tagField.setValue("test2");
    component.addTag();

    expect(component.article.tagList).toEqual(["test1", "test2"]);
  });

  it("should remove tag", () => {
    component.article.tagList = ["test"];
    component.removeTag("test");

    expect(component.article.tagList).toEqual([]);
  });

  /**
   * submitForm() {
    this.isSubmitting = true;

    // update the model
    this.updateArticle(this.articleForm.value);

    // update any single tag
    this.addTag();

    // post the changes
    this.articlesService.save(this.article).subscribe(
      article => this.router.navigateByUrl('/article/' + article.slug),
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }
   */

  it("should submit form", () => {
    component.tagField.setValue("test");

    component.articleForm.setValue({
      title: "test",
      description: "test",
      body: "test",
    });

    component.article = {
      slug: "test",
      title: "test",
      description: "test",
      body: "test",
      tagList: ["test"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "test-user",
        bio: "test",
        image: "test",
        following: false,
      },
    };
    articlesService.save.and.returnValue(of(component.article));

    component.submitForm();

    expect(component.isSubmitting).toBeTrue();
    expect(articlesService.save).toHaveBeenCalledWith(component.article);
    expect(router.navigateByUrl).toHaveBeenCalledWith("/article/test");
  });

  it("should handle submit form errors", () => {
    component.tagField.setValue("test");

    component.articleForm.setValue({
      title: "test",
      description: "test",
      body: "test",
    });

    articlesService.save.and.returnValue(
      throwError(new Error("error submitting form"))
    );

    component.submitForm();

    expect(component.isSubmitting).toBeFalse();
    expect(articlesService.save).toHaveBeenCalledWith(component.article);
    expect(component.errors).toEqual(new Error("error submitting form"));
  });
});
