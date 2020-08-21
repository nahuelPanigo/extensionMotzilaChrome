class SolveResults{

		prom;	//an array with the promedy of the peer results
		cantFind;	//an array that count the times that a result is find

		//initialize arrays and set array prom with the pos of the first results
		init(){
			this.prom = new Array(15);
			this.cantFind = new Array(15);
			for (var j=0;j<5;j++){
				for (var i=0;i<3;i++){
					this.prom[i+j*3]=j+1;
					this.cantFind[i+j*3]=1;
				}
			}
		}


		getResArrays(array1y2,array,engine){
		var arrayg,arrayb,arrayd;
		var res=new Array(15);
		var j=0;
		if(engine.match("https://www.google")){
			arrayg=array;
			arrayb=array1y2[0];
			arrayd=array1y2[1];
		}else{
				if(engine.match("https://www.bing")){
						arrayg=array1y2[0];
						arrayb=array;
						arrayd=array1y2[1];
				}else{
						arrayg=array1y2[0];
						arrayb=array1y2[1];
						arrayd=array;
				}
		}
		for (var i =0; i <5 ; i++) {
			res[i+j]=arrayg[i];
			j++;
			res[i+j]=arrayb[i];
			j++;
			res[i+j]=arrayd[i];
		}
		return res;
	}

	getProm(){
		return this.prom;
	}

	getCantFind(){
		return this.cantFind;
	}

	setProm(result,array){
			for (var i = 0; i<15 ; i++) {
				for (var j = 0; j<5 ; j++) {
					if(result[j].match(array[i])){
						this.prom[i]+=(j+1);
						this.CantFind[i]++;
						break;
					}else{
						if(j==4){
							this.prom[i]+=6;

						}
					}
				}	
		}
	}

	googleUris(){
		var urls = new Array(5)
		var divs=document.querySelectorAll('div.r');
		for (var i = 0 ; i< divs.length ; i++) {
			urls[i]=(divs[i].getElementsByTagName('a')[0].href);//get only the urls GOOGLE
		}
		return urls;
	}
	bingUris(){
		var urls = new Array(5)
		var divs=document.querySelectorAll('div.b_attribution');
		for (var i = 0 ; i< divs.length ; i++){
			urls[i]=(divs[i].innerText);//get only the urls BING
		}
		return urls;
	}
	duckUris(){
		var urls = new Array(5)
		var divs=document.querySelectorAll("a.result__url");
		for (var i = 0 ; i< divs.length ; i++){
			urls[i]=(divs[i].innerText);//get only the urls BING
		}
		return urls;
	}
}



class ContentPageManager {	
	request;	//save the request from first search
	equal;
	engineUri;	//save the uri of the enfine
	solveRes;	//class for parse the results 

	//initialize array equal and create class for parse result
	init(){
		this.equal=new Array(5);
		this.solveRes=new SolveResults();
		this.solveRes.init();
		for (var i=0;i<5;i++){
			this.equal[i]=0;
		}
	}
	
	equalResult(j){
		this.equal[j]++;
	}

	getUrl(id,array){
		return array[id];
	}

	getEqualResults(j){
		return this.equal[j];
	}

	setRequest(array){
		this.request=array;
	}

	//return an array with form [1google 1bing 1duck... 5google 5bing 5duck](len 15)
	getArrays(array1y2,array,engine){
		return this.solveRes.getResArrays(array1y2,array,engine);
	}

	//get a promise with the divs of the engine where the user search
	getDivs(engine){
		return new Promise((resolve,reject)=>{
			if(engine.match("https://www.google")){
				 resolve(document.querySelectorAll('div.r'));
			}else{
				if(engine.match('https://www.bing')){
					resolve(document.querySelectorAll('div.b_attribution'));
				}else{
					resolve(document.getElementsByClassName("result__a"));
				}
			}
		});
	}

	//compare 2 urls passed somes urls need to add a "/" at the end
	equalUri(str1,str2){
		if(str1.length>str2.length){
					var string1=str1;
					var string2=str2.concat('/');
		}else{
				if(str2.length>str1.length){ 
								var string1=str1.concat('/'); 
								var string2=str2;
							}
							else{
								var string1=str1;
								var string2=str2;
							}
		}
		return string1.match(string2)
	}

	//create an image with a name,file path and pixels given 
	createImage(id,file,px){
		var img=document.createElement("img");
		img.style.width=px;
		img.style.float="right";
		img.id=id;
		img.src=browser.extension.getURL(file);
		return img;
	}	

	//create and image to add to the div
	iterateAndAddImages(actUrl,reqUrl,array,id){
		var img
		for (var j = 0; j < 5; j++) {
				if(this.equalUri(actUrl,reqUrl[j])){
					img=this.createImage(id,array[j],"45px");
					break;
				}else{
					if(j===4){
						img=this.createImage(id,array[5],"45px");
					}
				}
		}
		return img;	
	}


	//itearate for the first 5 divs creating 2 images of the others search engine for each div
	allRequests(requests,array1,array2,array,engine){
		this.setRequest(array);
		this.getDivs(engine).then(value =>{
				for (var i = 0; i < 5; i++) {
					var img,img2;
					img = this.iterateAndAddImages(array[i],requests[0],array1,"img1")	
					img2= this.iterateAndAddImages(array[i],requests[1],array2,"img2")
				value[i].appendChild(img);
				value[i].appendChild(img2);
		}
		});
	}

	//move images for agroup in circle image
	moveImage(img,left,top,pos){
		img.style.position=pos;
		img.style.top=top;
		img.style.left=left;
	}

	//call create and move
	createAndMove(name,path,px,left,top,pos){
		var img=this.createImage(name,path,px);
		this.moveImage(img,left,top,pos);
		return img;
	}
//put de result of the peer in dom
	peerRequests(peerReq,files,peer){
		this.getDivs(this.engineUri).then(value =>{
				for (var i = 0; i < 5; i++) {//iterate in te first 5 divs for paste image
					var imgCirculo=this.createImage("circulo",files[10],"50px");
					var imgDe=this.createAndMove("De",files[11],"15px","60px","5px","relative");
					for(var j=0; j<5 ;j++){//iterate in results and check match
						if(this.request[j].match(peerReq[i])){
								this.equalResult(i);
								break;
							}
					}
					var imgNum2=this.createAndMove("num2",files[peer],"10px","45px","25px","relative");
					var imgNum1=this.createAndMove("num1",files[this.getEqualResults(i)],"10px","20px","5px","relative");
					if(peer!=1){//remove older img peer
						this.removeImg(value[i]);
					}//put the new images in div
					value[i].appendChild(imgCirculo);
					value[i].appendChild(imgNum1);
					value[i].appendChild(imgNum2);
					value[i].appendChild(imgDe);
			   }
		});
	}
	
	//get a div and delete circle, de, num1 and num2 img
	removeImg(div){
		var childs= div.getElementsByTagName("img");
		div.removeChild(childs.circulo);
		div.removeChild(childs.num1);
		div.removeChild(childs.num2);
		div.removeChild(childs.De);
	}

	setEngineUri(engine){
		this.engineUri=engine;
	}

	//get the results of the search and set index for imgs
	getResults(){
		return  new Promise((resolve,reject)=>{
			var searchEngine=document.URL;
			var value="";
			var ind1,ind2;//index to know wich img put
			var urls;
			if(searchEngine.match('https://www.google')){
					value=document.getElementsByClassName("gLFyf gsfi")[0].value;
					ind1=1;ind2=2;
					console.log(this.solveRes)
					urls = this.solveRes.googleUris();
			}else{
				if(searchEngine.match('https://www.bing')){
					ind1=0;ind2=2;
					value=document.getElementById('sb_form_q').value
					urls = this.solveRes.bingUris();
				}
				else{
					ind1=0;ind2=1;
    				value=document.getElementById('search_form_input').value
					urls = this.solveRes.duckUris();
				}
			}
			resolve([urls,value,searchEngine,ind1,ind2]);//urls, what user searhc,engine, index for img
		});
	}

	//send the results from peers to the popUp
	sendMessageToPop(peer){
		browser.runtime.sendMessage({
				data: "popUp",
				"args": {peer: peer+1,
						 prom: solveRes.getProm(),
						 find: solveRes.getCantFind()}
		}, function (response) {
                    console.log(response);
         });
	}

//charge results of the results from peer and call method to send message to the PopUp
	callPopUpAndGiveResult(result,peer,array){
		console.log(array);
		solveRes.setProm(result,array);
		this.sendMessageToPop(peer);
	}

}



let filesG=[
"logos/google1.png",
"logos/google2.png",
"logos/google3.png",
"logos/google4.png",
"logos/google5.png",
"logos/googleMenos.png"
]
let filesB=[
"logos/bing1.png",
"logos/bing2.png",
"logos/bing3.png",
"logos/bing4.png",
"logos/bing5.png",
"logos/bingMenos.png"
]
let filesD=[
"logos/duck1.png",
"logos/duck2.png",
"logos/duck3.png",
"logos/duck4.png",
"logos/duck5.png",
"logos/duckMenos.png"
]
let filesP=[
"logos/cero.png",
"logos/uno.png",
"logos/dos.png",
"logos/tres.png",
"logos/cuatro.png",
"logos/cinco.png",
"logos/seis.png",
"logos/siete.png",
"logos/ocho.png",
"logos/nueve.png",
"logos/circulo.png",
"logos/De.png"
]
let col=[filesG,filesB,filesD]
console.log("anda")
var pageManager = new ContentPageManager();
pageManager.init();
var peer=0;
var resultGoogBingDuck; 
pageManager.getResults(col).then(requ=>{  //get the results from the users search 
		pageManager.setEngineUri(requ[2]); //set engine url 
		browser.runtime.sendMessage({	//call background for results in the other 2 engines
				"call": "searchNewRequest",
				"args": {req: requ[1],	// search value
						engine: requ[2]}  //engine
		}).then( requests=>{
					pageManager.allRequests(requests,col[requ[3]],col[requ[4]],requ[0],requ[2]);
					resultGoogBingDuck = pageManager.getArrays(requests,requ[0],requ[2]);
					browser.runtime.sendMessage({
						"call": "getResultsFromPeers"
					});
		}).catch(()=>{
			console.log('abc')});
});



browser.runtime.onMessage.addListener((requests,sender)=>{
	if(requests.call==="getUrl"){
		window.location=pageManager.getUrl(requests.args.but,resultGoogBingDuck);
	}
	if(requests.call==="getProm"){
		pageManager.sendMessageToPop(peer);
	}
});

browser.runtime.onMessage.addListener( requests => {
	if(requests.call==="peerRequests"){
		peer++;
		pageManager.peerRequests(requests.args.args,filesP,peer);
		pageManager.callPopUpAndGiveResult(requests.args.args,peer,resultGoogBingDuck);
	}
});







