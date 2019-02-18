const sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var imgList = [];
var url=require('url');
var http = require('http');
http.globalAgent.maxSockets=1;
var sizeOf = require('image-size');
http.globalAgent.maxSockets=1;
let db = new sqlite3.Database('./PhotoQ.db');
var count=0
var photolist=loadImageList();
var i;
for(i=0;i<photolist.length;i++){
	var nameURL="http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + encodeURIComponent(photolist[i]);
	//.split("%20").join(" ");
	//console.log(nameURL);
	//var nameURL = encodeURIComponent(photolist[i]);
	getSize(i,nameURL,cbFun);
}
if(count==(photolist.length-1)){
db.close();
}

dumpDB();

function dumpDB(){
	db.all ( 'SELECT * FROM photoTags', dataCallback);
      function dataCallback( err, data ) {
		//console.log(data); 
      }
}

function cbFun(ind, name, width, height){
	count=count+1;
	//console.log(typeof(ind));
	//console.log(typeof(name));
	//console.log(typeof(width));
	//console.log(typeof(height));
	//let placeholders = [];
	//placeholders.push(ind);
	//placeholders.push(name);
	//placeholders.push(width);
	//placeholders.push(height);
	//placeholders.push('');
	//placeholders.push('');
	//let result= placeholder.join(',');
	let sql = "INSERT INTO photoTags(idNum, filename, width, height, locationTag, ListOfTags) VALUES ("+ ind +",\'" + name+"\',"+width+","+height+","+"\'N/A\'"+","+"\'N/A\'"+")";
	db.run(sql,function(err){
		if(err){
			return console.error(err.message);
		}
	});
	
}


function getSize(ind, name, cbFun) {
    var imgURL = name;
	//console.log(typeof(imgURL));
    var options = url.parse(imgURL);

    // call http get 
    http.get(options, function (response) {
	var chunks = [];
	response.on('data', function (chunk) {
	    chunks.push(chunk);
	}).on('end', function() {
	    var buffer = Buffer.concat(chunks);
	//console.log(name);
	//console.log(buffer.length);
	    dimensions = sizeOf(buffer);
	    cbFun(ind, name, dimensions.width, dimensions.height);
	})
    })
	return;
}

function loadImageList(){
	var data = fs.readFileSync('./public/photoList.json');
	if(!data){
		//console.log("cannot read photoList.json");
		}
	else{
		listobj=JSON.parse(data);
		imgList = listobj.photoURLs;
	}
	return imgList;
}