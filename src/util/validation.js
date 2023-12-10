import { ValidationError } from "./errors";

export function validateNotEmpty(text, message) {
  if (!text || text.trim().length === 0) throw new ValidationError(message);
}
