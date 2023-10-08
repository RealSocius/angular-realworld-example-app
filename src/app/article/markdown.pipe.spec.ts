import { MarkdownPipe } from "./markdown.pipe";

describe("MarkdownPipe", () => {
  let pipe: MarkdownPipe;

  beforeEach(() => {
    pipe = new MarkdownPipe();
  });

  it("should transform markdown to HTML", async () => {
    const markdown = "# Test Heading\n\nThis is a **test** paragraph.";
    const expectedHtml =
      '<h1 id="test-heading">Test Heading</h1>\n<p>This is a <strong>test</strong> paragraph.</p>\n';

    const result = await pipe.transform(markdown);

    expect(result).toEqual(expectedHtml);
  });
});
