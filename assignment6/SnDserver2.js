const sqlite3 = require('sqlite3').verbose();
var http = require("http");
var auto = require("./makeTagTable.js");
var  staticServer  =  require('node-static');
var file = new staticServer.Server('./public');
var finder=http.createServer(sendFiles);
var fs = require("fs");
var imgList = [];
var db = new sqlite3.Database('./PhotoQ.db');
var list=[];
var tagTable = {}; 
var jsonf;
var i;
http.globalAgent.maxSockets=1;
function loadImageList(photoNumber){
	var data = fs.readFileSync('./public/photoList.json');
	if(!data){
		console.log("cannot read photoList.json");
		}
	else{
		listobj=JSON.parse(data);
		imgList = listobj.photoURLs;
	}
	return imgList[photoNumber];
}


function singleimg(singleImg_info){

	list.push(singleImg_info);
	return;
}


function staticserve(request,response,url_s){
	if (url_s==='testWHS.html'){
	file.serveFile('/testWHS.html',200,{},request,response);
         return;

	}
	if (url_s==='testWHS.css'){
	file.serveFile('/testWHS.css',200,{},request,response);
                return;

	}
	if(url_s==="testWHS.js")
	{
	file.serveFile('/testWHS.js',200,{},request,response);
                return;
 
	}
}


function sendFiles (request, response) {
        var url = request.url;
        console.log(url);
	var url_2= url.split("/");
	var url_3=url_2[1].split("=");// /query?num or query?numList
	var url_test=url_2[1].split(".");
	
	if(url_2[1]=='query?hint'){
		auto.makeTagTable(tagTableCallback);
		function tagTableCallback(data) {
   				tagTable = JSON.stringify(data);
   				response.writeHead(200,{"Content-Type":"text/plain"});
   				response.write(tagTable);
   				response.end();
   				//file.serveFile(tagTable,200,{},request,response);
		}
		//return;
	}
	if(url_test[0]==='testWHS'){
		staticserve(request,response,url_2[1]);
		return;
	}
	if(url_2[1]=='prop-types.js'){
	file.serveFile('/prop-types.js',200,{},request,response);
         return;
	}
	if(url_2[1]=='react-photo-gallery.js'){
	file.serveFile('/react-photo-gallery.js',200,{},request,response);
         return;
	}
	if(url_2[1]==='badquery'){
		response.writeHead(404,{"Content-Type":"text/plain"});
                response.write("Bad Request\n");
                response.end();
		return;
		}
	if(url_3[0]==='query?changekey'){
		var tagdelete=decodeURIComponent(url_3[1]).split("+");

		console.log("this is tag delete "+ tagdelete);
		//var name='http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/'+tagdelete[0];
		var name= encodeURIComponent(tagdelete[0]);
		console.log("this is name "+ name);
		var tagString = tagdelete.slice(1).join(",");
		console.log("this is tagstring "+ tagString);
		//let deletesql = 'DELETE ListOfTags FROM photoTags WHERE filename = '+name;
		let updatesql = 'UPDATE photoTags SET ListOfTags = ? WHERE filename LIKE "%'+ name +'%"';
			db.run(updatesql,[tagString],function(err){
				if(err){
					return console.error(err.message);
				}
				console.log("in second callback");
			});
		
	}
	if(url_3[0]==='query?num'){
		var photoNumber = url_3[1];
		var link=loadImageList(photoNumber);
    		response.writeHead(200,{"Content-Type":"text/plain"});
		response.write(link);
    		response.end();
		return;	
			
	}
	if(url_3[0]==='query?keyList'){
		if(list.length!==0){
		list=[];
		}
		var num_list = url_3[1].split("+");
		for (let i=0; i < num_list.length; i++){
				num_list[i]=num_list[i].replace(/%20/g," ");

		};
		console.log(num_list);
		response.writeHead(200,{"Content-Type":"text/plain"});

		let sql='SELECT filename src, width width, height height, locationTag landmark, ListOfTags Tags FROM photoTags WHERE ';// WHERE idNum = ?';
		
		for(let j=0; j<num_list.length;j++){
			if(j>0){
				sql=sql+' AND ';
			}
			let location='"'+num_list[j]+'"';
			let tags_like='"%'+num_list[j]+'%"';
			sql=sql+'(locationTag ='+location+'OR ListOfTags LIKE'+tags_like+')';
		}
		console.log(sql);
			db.all(sql,[],(err,rows) =>{
				if(err){console.error(err.message);}	
				
				rows.forEach((row)=>{
					console.log(list.length);
					singleimg(row);
					if(list.length==rows.length){
					jsonf=JSON.stringify(list);
					response.write(jsonf);
				
					response.end();
					};
				});		
				}
			)

		//return;
	}}
/*	file.serve(request, response, function (e, res) {
            if (e && (e.status === 404)) { 
                file.serveFile('/not-found.html', 404, {}, request, response);
            }
		})
	}*/

    
finder.listen("54220");