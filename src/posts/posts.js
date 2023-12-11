import { sendDataRequest } from "../util/http.js";
import { validateNotEmpty } from "../util/validation.js";

export function savePost(post) {
  post.created = new Date();
  return sendDataRequest(post);
}

export function extractPostData(form) {
  //Extract form inputs by using the FormData
  const title = form.get("title");
  const content = form.get("content");

  //Validate  - may throw
  validateNotEmpty(title);
  validateNotEmpty(content);
  return { title, content };
}
