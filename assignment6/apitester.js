// Node module for working with a request to an API or other fellow-server
var APIrequest = require('request');


// An object containing the data the CCV API wants
// Will get stringified and put into the body of an HTTP request, below
APIrequestObject = {
  "requests": [
    {
      "image": {
        "source": {"imageUri": "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Royal%20Palace%2c%20Rabat.jpg"}
        },
      "features": [{ "type": "LABEL_DETECTION" },{ "type": "LANDMARK_DETECTION"} ]
    }
  ]
}


// URL containing the API key 
// You'll have to fill in the one you got from Google
url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDh5IthxMfYr271LF3IFXVcaHXdjixIzI4';


// function to send off request to the API
function annotateImage() {
	// The code that makes a request to the API
	// Uses the Node request module, which packs up and sends off 
	// an HTTP message containing the request to the API server
	APIrequest(
	    { // HTTP header stuff
		url: url,
		method: "POST",
		headers: {"content-type": "application/json"},
		// will turn the given object into JSON
		json: APIrequestObject
	    },
	    // callback function for API request
	    APIcallback
	);


	// callback function, called when data is received from API
	function APIcallback(err, APIresponse, body) {
    	    if ((err) || (APIresponse.statusCode != 200)) {
		console.log("Got API error");
		console.log(body);
    	    } else {
		APIresponseJSON = body.responses[0];
		console.log(APIresponseJSON);
		console.log(APIresponseJSON.landmarkAnnotations[0].locations);
	    }		
    	} // end callback function

} // end annotateImage


// Do it! 
annotateImage();