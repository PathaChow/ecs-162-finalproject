
var set=0;
var save=[];
var photos = [
/*{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/A%20Torre%20Manuelina.jpg", width: 574, height: 381 },
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Uluru%20sunset1141.jpg", width: 500 , height: 334 },
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Sejong tomb 1.jpg", width: 574, height: 430},
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Serra%20da%20Capivara%20-%20Painting%207.JPG", width: 574, height: 430},
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Royal%20Palace%2c%20Rabat.jpg", width: 574, height: 410},
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Red%20pencil%20urchin%20-%20Papahnaumokukea.jpg", width: 574 , height: 382 }
*/];
//button = tagbutton; button.parentNode=suggestion; 

function deletesavedtags(name,tag){
	console.log(name);
	console.log(tag);
	var x=document.getElementById(tag);
	var y=document.getElementById(name);
	y.style.display="block";
	//console.log(x.parentNode);
	x.parentNode.removeChild(x);

}

function TagsforSearch(name,updatetag,button){
	//console.log(updatetag);
	var cube=document.getElementById("select_tags");
	var saved_tag=document.createElement('div');
	var tag_cotent = document.createElement('div');
	var deletebutt=document.createElement('button');

	saved_tag.className='saved_tag';
	saved_tag.id=updatetag;

	tag_cotent.className="saved_tag_cotent";
	deletebutt.className="deletedsavedtags";
	
	tag_cotent.textContent=updatetag;
	deletebutt.textContent='X';
	deletebutt.onclick=function(){deletesavedtags(saved_tag.id,saved_tag.id)};

	cube.appendChild(saved_tag);
	saved_tag.appendChild(tag_cotent);
	saved_tag.appendChild(deletebutt);
	//console.log("name. "+name);
	var u=document.getElementById(name);
	u.style.display="none";
	
};


function complete(){
		if(document.getElementById("press")!=null){
  if(document.getElementById("press").style.display=='none'){
   document.getElementById("press").style.display="block";
  };
 }
 if(document.getElementById("suggest")!=null){
  if(document.getElementById("suggest").style.display=='none'){
   document.getElementById("suggest").style.display="flex";
  };
 }
 if(document.getElementById("select_tags")!=null){
  if(document.getElementById("select_tags").style.display=='none'){
   document.getElementById("select_tags").style.display="flex";
  };
 }

	//count_display=count_display+1;
	//if(count_display==2){
		if(set==0){
		removeSearchTags();}
		var xhr2 = new XMLHttpRequest();
		xhr2.open("GET", "/query?hint");
		xhr2.addEventListener("load",(evt)=>{

			var data_jsontags=xhr2.responseText;
			var hint_tags;
			var hint=document.getElementById("req-text").value;
			if(hint==''){
				while(save.length!=0){save.pop();
					}
					set=0;
			}

			var jsonobj=JSON.parse(data_jsontags);

			var names=Object.getOwnPropertyNames(jsonobj)

			console.log("hint is" + hint+".    "+hint.length);
			console.log("names.   " + names);
			if(hint.length>=2&&set==0){
				set=1;
			for(let i =0; i < names.length; i++){
				hint=hint.substring(0,2);
				//console.log(names[i]);
				if(names[i]==hint){
					hint_tags=Object.getOwnPropertyNames(jsonobj[hint].tags);
					display_hint(hint_tags);
					return;
				}
			}}
			else if(hint.length<2){removeSearchTags(); set=0;}


		});
		xhr2.send();
	//}
	return;
};

function display_hint(hint_tags){
	var frame=document.getElementById("auto");
	if(document.getElementById("select_tags")==null){
	var select_tags= document.createElement("DIV");
	frame.appendChild(select_tags);
	select_tags.id='select_tags';}
	if(document.getElementById("press")==null){
	var presstab =document.createElement('DIV');
	frame.appendChild(presstab);
	presstab.textContent="Press tab to create a tag & enter to search";
	presstab.id='press';}
	
	if(document.getElementById("suggest")==null){
	var suggested_tags=document.createElement('DIV');
	frame.appendChild(suggested_tags);
	suggested_tags.textContent='Suggested Tags';
	suggested_tags.id="suggest";
}
	var actual_tags= document.createElement('DIV');
	frame.appendChild(actual_tags);
	actual_tags.id='actual_tags';
	for(let k=0;k<hint_tags.length;k++){
		let child=document.createElement("div");//every tag line
		child.className='suggestion';
		child.id=hint_tags[k]+'1';

		actual_tags.appendChild(child);}

	var x= document.getElementsByClassName("suggestion");//get childs
	for(let r=0;r<x.length;r++){

		var text=document.createElement("div");
		var button=document.createElement("button");
		button.textContent="<-";
		button.className="tagbutton";
	
		text.textContent=hint_tags[r];
		text.className='tag_text';
		x[r].appendChild(text);
		x[r].appendChild(button);

		save.push(x[r].firstChild.textContent);
		//console.log("before setting onclick"+save[r]);
		
		button.onclick=function(){TagsforSearch(x[r].id,save[r],button);};
	}


	return;
}

function removeSearchTags(){
	count_display=0;
	var bar=document.getElementById("req-text");
	bar.textContent='';
	var auto_rm=document.getElementById("actual_tags");
	if(auto_rm!=null){
	//while(auto_rm.hasChildNodes()!=false){
		auto_rm.parentNode.removeChild(auto_rm);
	//};
}
	return;
}

class AddTag extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		//console.log("in addTag render");
		var inputbox=React.createElement('input',{className:'tagInput',
												  onChange:(e)=>{//alert("onchange of inputbox!");
																 this.state={inputfield:e.target.value};
																 e.stopPropagation();}});
		var submitbutton= React.createElement('button',
											{className:'tagButton',
											onClick:(e)=>{//alert("onclick of addTag!");
														  alert("you're adding tag "+ this.state.inputfield);
														  this.props.addFun(this.state.inputfield);
														  e.stopPropagation();}},
											'submit');
		//return classname addtag, onclick esto propagation
		return React.createElement('div',//type
									{className:'addTag',
									onClick: (e) => {e.stopPropagation();}
									},//props
									inputbox,//first Child, the input box
								    submitbutton//second Child
			);
		}
	}

// A react component for a tag
class Tag extends React.Component {
	constructor(props){
		super(props);
	}
	render () {
		//console.log("in Tag render");
		var tagText = React.createElement('p', // type
            							  {className: 'inTagText',
              							  onClick: (e) => {//alert("Tag [" + this.props.text + "] from image ["+ this.props.parentImage + "] was clicked!");
              				  			  					e.stopPropagation();}
              				  			  }, // properties
										  this.props.text); 
		var deleteButton = React.createElement('button',
												{className:'tagButton',
												onClick:(e)=>{alert("you're deleting tag "+ this.props.text);
															  this.props.deleteFun(this.props.text);
															  e.stopPropagation();}},
												'x');
		return React.createElement('p',
									{className:'tagText',
									onClick:(e)=>{e.stopPropagation();}},
									tagText,
									deleteButton
									);
	/*return React.createElement('p', // type
            { className: 'tagText',
              onClick: (e) => {alert("Tag [" + this.props.text + "] from image ["+ this.props.parentImage + "] was clicked!");
              				  e.stopPropagation();} }, // properties
			this.props.text); // contents */
}
};


// A react component for controls on an image tile
class TileControl extends React.Component {
	constructor(props){
		super(props);
		//console.log("this props"+this.props);
		var _tags = this.props.Tags;
		//console.log(this.props.Tags[0]);
		// parse image src for photo name
		var tagArr = _tags.split(",");
		//console.log("tarArr is "+tagArr);
		this.state = { tagarr: tagArr};
		//console.log("tagarr is "+this.tagarr);
		this.deleteTag = this.deleteTag.bind(this);
		this.addTag = this.addTag.bind(this);
	}
	deleteTag(tagname){
		//this.setState("");
		//alert("indeletefun!");
		var newTags=[];
		for(let i=0; i<this.state.tagarr.length; i++){
			if(this.state.tagarr[i]!=tagname){
				newTags.push(this.state.tagarr[i]);
			}
		}
		this.setState({tagarr: newTags});
		var tagsToDB = newTags.join("+");
		//console.log("this is tags to DB!!"+tagsToDB);
		var oReq = new XMLHttpRequest();
		var processedSrc = this.props.src.substr(51);
		//console.log("this is the processed src!"+processedSrc);
		oReq.open("GET","/query?changekey="+processedSrc+"+"+tagsToDB);
		oReq.send();
		//changedb
	}
	addTag(tagname){
		//console.log("inAddTag");
		var newTagArr = this.state.tagarr;
		if(newTagArr.length>6){alert("There are already 7 tags. Delete an old tag before adding a new one!");return;}
		newTagArr.push(tagname);
		this.setState({tagarr: newTagArr});
		//changedb
		var tagsToDB = encodeURIComponent(newTagArr.join("+"));
		//console.log("this is tags to DB in add!!"+tagsToDB);
		var oReq = new XMLHttpRequest();
		var processedSrc = this.props.src.substr(51);
		//console.log("this is the processed src!"+processedSrc);
		oReq.open("GET","/query?changekey="+processedSrc+"+"+tagsToDB);
		oReq.send();
	}
	render () {
        // remember input vars in closure
		//var _selected = this.props.selected;
		//var _tags = this.props.Tags;
		//console.log(this.props.Tags);
		//console.log(this.props.Tags[0]);
		// parse image src for photo name
		//var tagarr = _tags.split(",");
		//photoNames = photoNames.split('%20'); //.join(' ');
		var _selected = this.props.selected;
		//this.setState(prevState=>({tagarr:prevState.tagarr}));
        var args = [];
        args.push( 'div' );
        args.push( { className: _selected ? 'selectedControls' : 'normalControls'} )
        for (var idx = 0; idx < this.state.tagarr.length; idx++)
            args.push( React.createElement(Tag, {deleteFun:this.deleteTag, text: decodeURIComponent(this.state.tagarr[idx]), key:this.state.tagarr[idx]+idx, parentImage: this.props.src} ) );
        if(this.state.tagarr.length<7){
        	args.push(React.createElement(AddTag,{addFun:this.addTag, parentImage: this.props.src}));
        }
        return ( React.createElement.apply(null, args) );
    }

};


// A react component for an image tile
class ImageTile extends React.Component {
    render() {
	// onClick function needs to remember these as a closure
	var _onClick = this.props.onClick;
	var _index = this.props.index;
	var _photo = this.props.photo;
	//console.log(_photo);
	var _selected = _photo.selected; // this one is just for readability

	return (
	    React.createElement('div', 
	        {style: {margin: this.props.margin, width: _photo.width},
			 className: 'tile',
                         onClick: function onClick(e) {
			    console.log("tile onclick");
			    // call Gallery's onclick
			    return _onClick (e, 
					     { index: _index, photo: _photo }) 
				}
		 }, // end of props of div
		 // contents of div - the Controls and an Image
		React.createElement(TileControl,
		    {selected: _selected, 
		     src: _photo.src,
		     width: _photo.width,
		     height: _photo.height,
		     landmark: _photo.landmark,
		     Tags:_photo.Tags
		 }),
		React.createElement('img',
		    {className: _selected ? 'selected' : 'normal', 
             src: _photo.src, 
		     width: _photo.width, 
             height: _photo.height,
             //landmark: _photo.landmark,
		     //Tags:_photo.Tags
			    })
				)//createElement div
	); // return
    } // render
} // class


// The react component for the whole image gallery
// Most of the code for this is in the included library
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { photos: photos };
    this.selectTile = this.selectTile.bind(this);
  }

  selectTile(event, obj) {
    console.log("in onclick!", obj);
    let photos = this.state.photos;
    console.log(obj.index);
    photos[obj.index].selected = !photos[obj.index].selected;
    this.setState({ photos: photos });
  }

  render() {
  	if(window.innerWidth>=450){
    return (
       React.createElement( Gallery, {photos: this.state.photos,
       onClick: this.selectTile, 
       ImageComponent: ImageTile} )
      );
}else{
	return (
       React.createElement( Gallery, {photos: this.state.photos,
       onClick: this.selectTile, 
       columns:1,
       ImageComponent: ImageTile} )
      );
  }
}
}


/* Finally, we actually run some code */

const reactContainer = document.getElementById("react");
var reactApp = ReactDOM.render(React.createElement(App),reactContainer);

/* Workaround for bug in gallery where it isn't properly arranged at init */
window.dispatchEvent(new Event('resize'));

function updateImages()
{
	var pre=document.getElementById("press");
 if((pre!=null)&&(pre.style.display!='none')){
  pre.style.display="none";
 }
 var suggest=document.getElementById("suggest");
 if((suggest!=null)&&(suggest.style.display!='none')){
  suggest.style.display="none";
 }

 var sel_t=document.getElementById("select_tags");
 if((sel_t!=null)&&(sel_t.style.display!='none')){
  sel_t.style.display="none";
 }
	

 	var group=[];
	var GroupofSearchTag= document.getElementsByClassName("saved_tag_cotent");
	for(let q=0;q<GroupofSearchTag.length;q++){
		group.push(GroupofSearchTag[q].textContent);
		console.log("group   "+ GroupofSearchTag[q].textContent);
	}
 	var reqIndices=group.join(',');
 	console.log("wrapped up     "+reqIndices);

 	removeSearchTags();
 	
  if (!reqIndices) return; // No query? Do nothing!

  var xhr = new XMLHttpRequest();
  reqIndices=reqIndices.replace(/ /g,"%20");
  reqIndices=reqIndices.replace(/,/g,"+");
  xhr.open("GET", "/query?keyList=" + reqIndices); // We want more input sanitization than this!
  console.log(xhr);
  xhr.addEventListener("load", (evt) => {
    if (xhr.status == 200) {
        reactApp.setState({photos:JSON.parse(xhr.responseText)});
        window.dispatchEvent(new Event('resize')); /* The world is held together with duct tape */
    } else {
        console.log("XHR Error!", xhr.responseText);
    }
  } );
  xhr.send();
}



 
function photoByNumber() {

	var num = document.getElementById("num").value;
	num = num.trim();
	var photoNum = Number(num);
	var oReq = new XMLHttpRequest();
	var oReq2 = new XMLHttpRequest();


	if (photoNum != NaN && photoNum >=0 && photoNum<=989) {
		
		var url = "http://server162.site:53393/query?num="+ photoNum;
		oReq.open("GET",url);
		oReq.addEventListener("load",reqListener);
		oReq.send();
	    }
	else{
		var url2="http://server162.site:53393/badquery";
		oReq.open("GET",url2);
		oReq.addEventListener("load",badquery);
		oReq.send();
		}
}

function badquery(){
	var b = document.getElementById("Try");
	var c = document.getElementById("photoImg");
        c.src="";
	if(b==null){
		var error =document.createElement('P');
		error.id="Try";
		var dis = document.getElementById("photoDisplay");
		error.textContent="Try again";
		dis.appendChild(error);
		return;	
	}
	else{
		b.style.display="block";
		return;	
	}
 }

function reqListener(){
	var a = document.getElementById("Try"); 
	if(a!=null){
		a.style.display="none";
	}
	var photoURL = this.responseText;
	var display = document.getElementById("photoImg");
	display.src = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + photoURL;
	display.style.display="block";
	return;
}


