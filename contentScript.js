class ContentPageManager {	
	request;
	equal;
	engineUri;

	initializeEqual(){
		this.equal=new Array(5);
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

	getResults(j){
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

	createImage(id,file){
		var img=document.createElement("img");
		img.style.width="60px";
		img.style.float="right";
		img.id=id;
		img.src=browser.extension.getURL(file);
		return img;
	}	


	allRequests(requests,array1,array2,array,engine){
		console.log(requests);
		console.log(array);
		this.setRequest(array);
		this.getDivs(engine).then(value =>{
				for (var i = 0; i < 5; i++) {
					var img,img2;
					for (var j = 0; j < 5; j++) {
						if(this.equalUri(array[i],requests[0][j])){
							img=this.createImage("img1",array1[j]);
							break;
						}else{
							if(j===4){
								img=this.createImage("img1",array1[5]);
							}
						}
					}	
					for (var k = 0; k < 5; k++) {
							if(this.equalUri(array[i],requests[1][k])){
								img2=this.createImage("img2",array2[k]);
								break;
							}else{
								if(k===4){
									img2=this.createImage("img2",array2[5]);
								}
							}
					}
				value[i].appendChild(img);
				value[i].appendChild(img2);
		}
		});
	}




	peerRequests(peerReq,files,peer){
		this.getDivs(this.engineUri).then(value =>{
			console.log("entro a la parte de los divs")
			console.log(value);
				for (var i = 0; i < 5; i++) {
					var imgCirculo=this.createImage("circulo",files[11])
					var imgDe=this.createImage("De",files[10]);
					if(this.request[j].match(peerReq[j])){
							this.equalResult(j);
						}
					var imgNum2=this.createImage("num2",files[peer])
					var imgNum1=this.createImage("num1",files[this.getResults()]);
					value[i].appendChild(imgCirculo);
					value[i].appendChild(imgNum1);
					value[i].appendChild(imgNum2);
					value[i].appendChild(img2De);
			   }
		});
	}
	
	setEngineUri(engine){
		this.engineUri=engine;
	}

	getResults(){
		return  new Promise((resolve,reject)=>{
			var searchEngine=document.URL;
			var value="";
			var ind1,ind2;
			var array=new Array(5);
			if(searchEngine.match('https://www.google')){
					value=document.getElementsByClassName("gLFyf gsfi")[0].value;
					ind1=1;
					ind2=2;
					var Res=document.querySelectorAll('div.r');
					for (var i = 0 ; i< Res.length ; i++) {
						array[i]=(Res[i].getElementsByTagName('a')[0].href);
					}
					resolve([array,value,searchEngine,ind1,ind2]);
			}else{
				if(searchEngine.match('https://www.bing')){
					ind1=0;
					ind2=2;
					value=document.getElementById('sb_form_q').value
					var Res=document.querySelectorAll('div.b_attribution');
					for (var i = 0 ; i< Res.length ; i++){
							array[i]=(Res[i].innerText);
					}
					resolve([array,value,searchEngine,ind1,ind2]);
				}
				else{
					ind1=0;
					ind2=1;
    				var Res=document.querySelectorAll("a.result__url");
					value=document.getElementById('search_form_input_homepage').value	
					for (var i = 0 ; i< 5 ; i++) {
							array[i]=(Res[i].href);
					}
					resolve([array,value,searchEngine,ind1,ind2])
				}
			}
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
				console.log(requests);
				pageManager.allRequests(requests,col[requ[3]],col[requ[4]],requ[0],requ[2]);
				array = pageManager.getArrays(requests,requ[0],requ[2]);
				}).catch(()=>{console.log('abc');
				});
		browser.runtime.sendMessage({
				"call": "getResultsFromPeers"
		});
});



browser.runtime.onMessage.addListener((requests,sender)=>{
	if(requests.call==="getUrl"){
		window.location=pageManager.getUrl(requests.args.but,array);
	}
});

browser.runtime.onMessage.addListener( requests => {
	console.log("nahuelllllllll");
	if(requests.call==="peerRequests"){
		console.log("naaaaaaaaaaaaaa");
		peer++;
		console.log(requests);
		pageManager.peerRequests(requests.args,filesP,peer);
		console.log("123465");
	}
});







