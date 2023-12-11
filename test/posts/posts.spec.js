import { describe, it, expect, vi } from "vitest";
import { extractPostData } from "../../src/posts/posts.js";

describe("extractPostData", () => {
  it("should extract correct values", () => {
    const testTitle = "Test title";
    const testContent = "Test content";
    //Create a mock FormData
    const testFormData = {
      title: testTitle,
      content: testContent,
      get(identifier) {
        return this[identifier];
      },
    };

    //ACT
    const actual = extractPostData(testFormData);

    //ASSERT
    expect(actual.title).toBe(testTitle);
    expect(actual.content).toBe(testContent);
  });
});
