import { ValidationError } from "../../src/util/errors";
import { validateNotEmpty } from "../../src/util/validation";
import { describe, it, expect } from "vitest";

describe("validateNotEmpty", () => {
  it("should throw an error when empty string is provided", () => {
    const testText = "";
    const validationFn = () => validateNotEmpty(testText);

    expect(validationFn).toThrow();
  });

  it("should throw an error when string with only spaces is provided", () => {
    const testText = "    ";
    const validationFn = () => validateNotEmpty(testText);

    expect(validationFn).toThrow();
  });

  it("should not throw an error when a non empty string is provided is provided", () => {
    const testText = "abc";
    const validationFn = () => validateNotEmpty(testText);

    expect(validationFn).not.toThrow();
  });
});
