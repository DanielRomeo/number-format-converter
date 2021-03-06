import * as functions from 'firebase-functions';
import {converter} from "./controllers/corrospondingFunctions";

// // Backend code must be called like this to respond to requests
// // Firebase Functions Docs:
// // https://firebase.google.com/docs/functions/typescript
//

export const convert = functions.https.onRequest((request, response) => {
  functions.logger.info("Convert number function called with " + request.method, {structuredData: true});
  response.setHeader("Access-Control-Allow-Origin", "*")
  if (request.method.toLowerCase() !== "post") response.status(405).send("Only POST method allowed")
  else if (!request.is("json")) {
    try {
      response.status(400).send("Request body must be JSON not " + JSON.stringify(JSON.parse(request.body)))
    } catch (e) {
      response.status(400).send("Could not interpret JSON: " + request.body.keys().toString())
    }
  } else { // valid request format POST JSON
    //calculate answer
    const answer: string = converter(request.body.inputNumber, request.body.inputFormat, request.body.outputFormat)
    // Send response
    response.send(JSON.stringify({answer: answer}))
  }
});
