import { sendDataRequest } from "./util/http";

//I DID NOT ADD THE userId(check - ok I got nothing for this value) and id(this one is auto generated)
//OK I RECIEVED: { title: 'Nir Title', content: 'Nir Content', id: 101 }

const post = {
  title: "Niron Title",
  content: "Niron Content",
};

//OK!!
sendDataRequest(post).then((post) => console.log(post));
