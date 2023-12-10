import { ValidationError, HttpError } from "../../src/util/errors";
import { describe, it, expect } from "vitest";

describe("ValidationError Class ", () => {
  it("should have all properties when all properties are passed", () => {
    const testErrorMessage = "abc";
    const sut = new ValidationError(testErrorMessage);
    expect(sut.message).toBeDefined();
  });

  it("should have all properties with correct values when all properties are passed", () => {
    const expected = "abc";
    const sut = new ValidationError(expected);
    expect(sut.message).toBe(expected);
  });

  it("should have message undefined when no provided", () => {
    const sut = new ValidationError();
    expect(sut.message).toBeUndefined();
  });
});

describe("HttpError Class ", () => {
  it("should have all properties defined when all properties are passed", () => {
    const testErrorMessage = "abc";
    const testStatusCode = 400;
    const testData = { key: "100" };
    const sut = new HttpError(testStatusCode, testErrorMessage, testData);
    expect(sut.statusCode).toBeDefined();
    expect(sut.message).toBeDefined();
    expect(sut.data).toBeDefined();
  });

  it("should have all properties with correct values when all properties are passed", () => {
    const testErrorMessage = "abc";
    const testStatusCode = 400;
    const testData = { key: "100" };
    const sut = new HttpError(testStatusCode, testErrorMessage, testData);
    expect(sut.statusCode).toBe(testStatusCode);
    expect(sut.message).toBe(testErrorMessage);
    expect(sut.data).toEqual(testData);
  });

  it("should have statusCode undefined when no provided", () => {
    let testStatusCode;
    const testErrorMessage = "abc";
    const testData = { key: "100" };

    const sut = new HttpError(testStatusCode, testErrorMessage, testData);
    expect(sut.statusCode).toBeUndefined();
  });
});
