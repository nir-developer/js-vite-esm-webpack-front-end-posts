import { describe, it, expect, vi } from "vitest";

import { sendDataRequest } from "../../src/util/http";
import { HttpError } from "../../src/util/errors";

/*Test 1-IMPORTANT - TEST GLOBAL VALUES/FUNCTION(the fetch function)Summary
1.Create a global mock function for the global fetch API - using vi.fn(()=>{})
    1.will have the spy functionality
    2.it will be a replacement to fetch in my implementation

2.input and return value : same as the original fetch (post) 
    vi.fn((url, options) => return new Promise(resolve, reject) =>{})

3.Tweak the testFetch to return a dummy response object(the resolved promise
    The dummy resolved response object - testResponse -  contains:  
        1. Response Data(body): the fake response data the sendRequestData will return
        2. the json method - which is used in sendResponseData by invoking the response.json() 
            => in this case - this method should return a promise!(nested)
               that is resolve to the dummy object testResponseData 
        3.the ok property: "" as a condition for throwing the HttpError 
             => in this case set the ok=true - since I focus on success case!
        

NOTE:
    1.WHERE TO DEFINE THE MOCK DATA FOR RETUR/RESOLVE and INPUT ??
        Mock Data for return/resolve values -is defined globally  - since will be used in test and in the global mock!
        but input data I dont have to define globally ! since it is not part of the function!

    2. The data parameter of sendRequestData is not part of the first test 
       I don't care if it was converted to string right or not - since I mocked it with my testResponseData! 

    IMPORTANT!!!!!
    3.How to define the  test function that calls the async function -sendRequestData??
         3.1 I dont need to define it as async code 
            I can call pass the expect function the PENDING promise : 
            expect(sendRequestData()).resolves....  
            => Then the resolves AWAIT THE PROMISE TO BE RESOLVED!!!

        3.2 The testData OBJECT CAN BE ANYTHING IN THIS TEST !
            The sendRequestData function - converts it into a string 
            and pass it to the testFetch function as part of the request 
            Unlike the real fetch  function - in my testFetch - it does not 
            check if it was converted to string or not!! 
            I DONT WANT TO TEST IT NOW ! 
            THIS WILL BE THE NEST TEST!
    
        => THIS TEST WILL PASS - EVEN IF SOMEONE WILL ADD A BREAKING CHANGE 
           TO the sendRequestData by passing the data object without converting
            it to a JSON string before sending it to my testFetch - TRY THIS!

            

/**TEST 2 - IMPORTANT - TEST  SPECIFIC MOCKING LOGIC (the JSON.stringify(data))
 *
 * OVERVIEW:
 *      - Now I know how I can test code that uses the fetch function (using vi.stubGlobal)
 *         I want to write more tests for the sendResponseData :
 *      
 *      - THE FIRST TEST WILL PASS - EVEN IF SOMEONE WILL ADD A BREAKING CHANGE 
           TO the sendRequestData by passing the data object without converting
            it to a JSON string before sending it to my testFetch - TRY THIS!
 *      
        - I want to prevent this breaking change! I want to catch any bug in my code 
         that pass a non string value to the fetch function - to be more close the real fetch 
         which would fail in this case! 
         
         - Live the breaking change for now - and create a test that will catch it - by failing!
        
 * HOW TO TEST?

    1.ADD THE BREAKING CHANGE in the sendRequestData:

            const response = await fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            //body: JSON.stringify(data),
            //IMPORTANT!!! TEST 1 PASS EVEN IF SOME ONE ADDING THIS BREAKING CHANGE TO NOT STRINGIFY!!Or even null!)
            body: data,
        });

            2. RUN THE TESTS - GREAT! MY TEST 1 FAILS!!!! THE CHANGE CAUSED TEST 1 TO FAIL! 
     => THIS IS A BREAKING CHANGE!! 
      GREAT!


        OUTPUT:: 
        ❯ sendDataRequest (2)
        × should return any available response data
        ✓ should convert the provided data to JSON before sending the request
        
        *AssertionError: promise rejected "'not a string!'" instead of resolving

        This error originated in "test/util/http.spec.js" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.


     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     IMPORTANT - WHE HE ADDED THE RETURN BEFORE THE REJECT('not a string!')
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    
    3. Update the Mock function - testFetch :
         Add logic to check if the options.body has is of type sting
        - If not string - reject('Invalid input - not a string)! 
    
    - FIX THE BREAKING CHANGE - PUT BACK THE JSON.stringify(data) to convert to string

 *
 *
 *
 *

 
 *
 */
//resolved data - defined globally - since is  part of the mocking implementation and the the test expectations
const testResponseData = { testKey: "testData" };

const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (typeof options.body !== "string") {
      return reject("Not a string.");
    }
    const testResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});

vi.stubGlobal("fetch", testFetch);

it("should return any available response data", () => {
  const testData = { key: "test" };

  return expect(sendDataRequest(testData)).resolves.toEqual(testResponseData);
});

it("should convert the provided data to JSON before sending the request", async () => {
  const testData = { key: "test" };

  let errorMessage;

  try {
    await sendDataRequest(testData);
  } catch (error) {
    errorMessage = error;
  }

  expect(errorMessage).not.toBe("Not a string.");
});

it("should throw HttpError when response.ok is false", () => {
  testFetch.mockImplementationOnce((url, options) => {
    return new Promise((resolve, reject) => {
      //NOT RELEVANT FOR THIS TEST
      //   if (typeof options.body !== "string") {
      //     return reject("Not a string.");
      //   }
      const testResponse = {
        ok: false,
        json() {
          return new Promise((resolve, reject) => {
            resolve(testResponseData);
          });
        },
      };
      resolve(testResponse);
    });
  });
  const testData = { key: "test" };

  //OK GREAT! NOW IF SOMEONE ADD BREAKDING CHANGE TO THE CODE BY REPLACING THE
  //THE TYPE OF THE THROWN ERROR - THIS TEST WILL FAIL!
  return expect(sendDataRequest(testData)).rejects.toBeInstanceOf(HttpError);
});
