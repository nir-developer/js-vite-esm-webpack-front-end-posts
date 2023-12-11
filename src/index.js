import { extractPostData, savePost } from "./posts/posts";

const formElement = document.querySelector("form");

async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(formElement);
  try {
    //Extract form inputs(may throw ValidationError)
    const post = extractPostData(new FormData(formElement));
    //Save the post -  may throw HttpError
    const newPost = await savePost(post);

    alert("post created");
  } catch (error) {
    console.error(error.message);
  }

  console.log("Form submitted");
}

formElement.addEventListener("submit", handleSubmit);
