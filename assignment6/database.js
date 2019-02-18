// Node module for working with a request to an API or other fellow-server

const sqlite3 = require('sqlite3').verbose();
var APIrequest = require('request');
var db = new sqlite3.Database('./PhotoQ.db');
var count=0;
url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDh5IthxMfYr271LF3IFXVcaHXdjixIzI4';

/*var test={ "photoURLs" :
  [
     "A%20Torre%20Manuelina.jpg",
     "Uluru%20sunset1141.jpg",
     "Sejong tomb 1.jpg",
     "Serra%20da%20Capivara%20-%20Painting%207.JPG",
     "Royal%20Palace%2c%20Rabat.jpg",
     "Adult%20Komodo.jpg"
   ]
};*/

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



/*for (let i=0; i<test.photoURLs.length; i++){
	APIrequestObject.requests[0].image.source.imageUri='http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/'+test.photoURLs[i];
	annotateImage(APIrequestObject);
}*/
var sql_fetch='SELECT idNum id, filename name FROM photoTags WHERE id = ?';
db.get(sql_fetch,[count],(err,row)=>{
	if(err){
		throw err;
	};
		APIrequestObject.requests[0].image.source.imageUri=row.name;
    console.log(APIrequestObject.requests[0].image.source.imageUri);
		annotateImage(APIrequestObject,row.id);

});
// An object containing the data the CCV API wants
// Will get stringified and put into the body of an HTTP request, below



// URL containing the API key 
// You'll have to fill in the one you got from Google



// function to send off request to the API
//id
function annotateImage(APIrequestObject,id) {
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
    	    	let APIresponseJSON=body.responses[0];
    	    	//console.log(APIresponseJSON);
    	    	let label_num = APIresponseJSON.labelAnnotations.length;
    	    	let tags_label=[] 
    	    	let tags_landmark=[];

				//labels
    	    	if(label_num<=6){
    	    		for(let j=0;j<APIresponseJSON.labelAnnotations.length;j++){
    	    			tags_label.push(APIresponseJSON.labelAnnotations[j].description);
    	    		}
    	    	}
    	    	else{
    	    		for(let j=0;j<6;j++){
    	    			tags_label.push(APIresponseJSON.labelAnnotations[j].description);
    	    		}
    	    	}


    	    	//landmarks
    	    	if(APIresponseJSON.landmarkAnnotations!= null){
    	    		let landmark_num=APIresponseJSON.landmarkAnnotations.length;
    	    		tags_landmark.push(APIresponseJSON.landmarkAnnotations[0].description);
    	   
    	    	}
    	    	//pushing to database
    	    	//console.log(APIresponseJSON);
    	    	let label_string=tags_label.toString();
    	    	let landmark_string = tags_landmark.toString();
    	    	//console.log(bel+'+'+mark);*/
    	    	
    	    	let data=[landmark_string,label_string];
    	    	let sql_update='UPDATE photoTags SET LocationTag = ?, ListOfTags= ? WHERE idNum =' + id;

    	    	db.run(sql_update,data,function(err){
    	    		count=count+1;
    	    		//console.log(count);
    	    		if(err){
    	    			return console.error(err.message);
    	    		}
    	    		console.log('Row(s) updated: ${this.changes}',count);


    	    		if(count<=988){
    	    		db.get(sql_fetch,[count],(err,row)=>{
					if(err){
						throw err;
					}
					APIrequestObject.requests[0].image.source.imageUri=row.name;
					//console.log(APIrequestObject.requests[0].image.source.imageUri);
					annotateImage(APIrequestObject,row.id);
						});
    	    		};

    	    	});
		//APIresponseJSON = body.responses[0];
		//console.log(APIresponseJSON);
		//console.log(APIresponseJSON.landmarkAnnotations[0].description);
	    }		
    	} // end callback function

} // end annotateImage
