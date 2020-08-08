class ContentPageManager {	
	request;
	equal;
	engineUri;
	prom;

	initializeEqual(){
		this.equal=new Array(5);
		this.prom=new Array(3);
		for (var j=0;j<3;j++){
				var array=new Array(5);
			for (var i=0;i<5;i++){
				array[i]=i+1;
			}
			this.prom[j]=array;
		}
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

	getArrays(array1y2,array,engine){
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

	createImage(id,file,px){
		var img=document.createElement("img");
		img.style.width=px;
		img.style.float="right";
		img.id=id;
		img.src=browser.extension.getURL(file);
		return img;
	}	


	allRequests(requests,array1,array2,array,engine){
		this.setRequest(array);
		this.getDivs(engine).then(value =>{
				for (var i = 0; i < 5; i++) {
					var img,img2;
					for (var j = 0; j < 5; j++) {
						if(this.equalUri(array[i],requests[0][j])){
							img=this.createImage("img1",array1[j],"45px");
							break;
						}else{
							if(j===4){
								img=this.createImage("img1",array1[5],"45px");
							}
						}
					}	
					for (var k = 0; k < 5; k++) {
							if(this.equalUri(array[i],requests[1][k])){
								img2=this.createImage("img2",array2[k],"45px");
								break;
							}else{
								if(k===4){
									img2=this.createImage("img2",array2[5],"45px");
								}
							}
					}
				value[i].appendChild(img);
				value[i].appendChild(img2);
		}
		});
	}

	moveImage(img,left,top,pos){
		img.style.position=pos;
		img.style.top=top;
		img.style.left=left;
	}

	createAndMove(name,path,px,left,top,pos){
		var img=this.createImage(name,path,px);
		this.moveImage(img,left,top,pos);
		return img;
	}
//put de result of the peer in dom
	peerRequests(peerReq,files,peer){
		this.getDivs(this.engineUri).then(value =>{
				for (var i = 0; i < 5; i++) {//iterate in te first 5 divs for paste image
					var imgCirculo=this.createImage("circulo",files[10],"50px")//not need to move this img
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
			var array=new Array(5);
			if(searchEngine.match('https://www.google')){
					value=document.getElementsByClassName("gLFyf gsfi")[0].value;
					ind1=1;ind2=2;
					var Res=document.querySelectorAll('div.r');
					for (var i = 0 ; i< Res.length ; i++) {
						array[i]=(Res[i].getElementsByTagName('a')[0].href);//get only the urls GOOGLE
					}
					resolve([array,value,searchEngine,ind1,ind2]); //urls, what user searhc,engine, index for img
			}else{
				if(searchEngine.match('https://www.bing')){
					ind1=0;ind2=2;
					value=document.getElementById('sb_form_q').value
					var Res=document.querySelectorAll('div.b_attribution');
					for (var i = 0 ; i< Res.length ; i++){
							array[i]=(Res[i].innerText);//get only the urls BING
					}
					resolve([array,value,searchEngine,ind1,ind2]);//urls, what user searhc,engine, index for img
				}
				else{
					ind1=0;ind2=1;
    				var Res=document.querySelectorAll("a.result__url");
					value=document.getElementById('search_form_input_homepage').value	
					for (var i = 0 ; i< 5 ; i++) {
							array[i]=(Res[i].href);//get only the urls DUCK
					}
					resolve([array,value,searchEngine,ind1,ind2])//urls, what user searhc,engine, index for img
				}
			}
		});
	}

	callPopUpAndGiveResult(result,peer,array){
		for (var i = 0; i<3 ; i++) {
			for (var j = 0; j<5 ; j++) {
				for (var k = 0; k<5 ; k++) {
					if(result[k].match(array[i][j])){
						this.prom[i][j]+=(k+1);
						break;
					}else{
						if(k==4){
							this.prom[i][j]+=6;
						}
					}
				}	
			}
		}
		console.log(this.prom);
		browser.runtime.sendMessage({
				data: "hello popup",
				"args": {req: "mensaje desde el content para el popup"}
		}, function (response) {
                    console.log(response);
         });
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
var pageManager = new ContentPageManager();
pageManager.initializeEqual();
var peer=0;
var array;
pageManager.getResults(col).then(requ=>{
		pageManager.setEngineUri(requ[2]);
		browser.runtime.sendMessage({
				"call": "searchNewRequest",
				"args": {req: requ[1],
						engine: requ[2]}
		}).then( requests=>{
					pageManager.allRequests(requests,col[requ[3]],col[requ[4]],requ[0],requ[2]);
					array = pageManager.getArrays(requests,requ[0],requ[2]);
					browser.runtime.sendMessage({
						"call": "getResultsFromPeers"
					});
		}).catch(()=>{console.log('abc')});
});



browser.runtime.onMessage.addListener((requests,sender)=>{
	if(requests.call==="getUrl"){
		window.location=pageManager.getUrl(requests.args.but,array);
	}
});

browser.runtime.onMessage.addListener( requests => {
	if(requests.call==="peerRequests"){
		peer++;
		pageManager.peerRequests(requests.args.args,filesP,peer);
		pageManager.callPopUpAndGiveResult(requests.args.args,peer,array);
	}
});







