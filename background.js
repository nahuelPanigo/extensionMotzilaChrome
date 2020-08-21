class Google{
	makeRequests(value,back){
		return new Promise((resolve,reject)=>{ 
		var strBing="https://www.bing.com/search?q=";
		var strDuck="https://duckduckgo.com/html/?q=";
		var divsBing,divsDuck;
		var divUrlBing = new Array(5);
		var divUrlDuck = new Array(5);
		back.doRequest(strBing).then(responseData=>{
				divsBing=responseData.querySelectorAll('div.b_attribution');
				for (var i = 0; i < 5 ; i++) {
						divUrlBing[i]=divsBing[i].innerText;
				}	
				if(divsDuck !== undefined){
						resolve([divUrlBing,divUrlDuck]);
					}
			});
			back.doRequest(strDuck).then(responseData=>{
				divsDuck=responseData.getElementsByClassName('result__extras__url');
				for (var i = 0; i < 5 ; i++) {
						divUrlDuck[i]=divsDuck[i].getElementsByTagName('a')[0].href;
				}					
				if(divsBing!==undefined){
					resolve([divUrlBing,divUrlDuck]);
				}
			});
		})
	}

	parseResults(doc){
		var divs,urls
		var urls= new Array(5);
		divs=doc.querySelectorAll('div.r');
					for (var i = 0; i < 5 ; i++) {
							urls[i]=divs[i].getElementsByTagName('a')[0].href;
					}
		return urls;
	}

	getString(){
		return "https://www.google.com/search?q=";
	}
}
class Bing{
	makeRequests(value,back){
		return new Promise((resolve,reject)=>{ 
			var strGoogle="https://www.google.com/search?q=";
			var strDuck="https://duckduckgo.com/html/?q="
			var divsGoogle,divsDuck;
			var divUrlGoogle= new Array(5);
			var divUrlDuck= new Array(5);
			back.doRequest(strGoogle).then(responseData=>{
					divsGoogle=responseData.querySelectorAll('div.r');
					for (var i = 0; i < 5 ; i++) {
							divUrlGoogle[i]=divsGoogle[i].getElementsByTagName('a')[0].href;
					}	
					if(divsDuck !== undefined){
							resolve([divUrlGoogle,divUrlDuck])
						}
			});
			back.doRequest(strDuck).then(responseData=>{
					divsDuck=responseData.getElementsByClassName('result__extras__url');
					for (var i = 0; i < 5 ; i++) {
							divUrlDuck[i]=divsDuck[i].getElementsByTagName('a')[0].href;
					}					
					if(divsGoogle!==undefined){
						resolve([divUrlGoogle,divUrlDuck])
					}
			});
		});
	}
	parseResults(doc){
		var divs,urls
		var urls= new Array(5);
		divs=doc.querySelectorAll('div.b_attribution');
				for (var i = 0; i < 5 ; i++) {
						urls[i]=(divs[i].innerText);
				}
	return urls;
	}

	getString(){
		return "https://www.bing.com/search?q=";
	}
}

class Duck{

	makeRequests(value,back){
		return new Promise((resolve,reject)=>{ 
			var strGoogle="https://www.google.com/search?q=";
			var strBing="https://www.bing.com/search?q=";
			var divsGoogle,divsBing;
			var divUrlGoogle= new Array(5);
			var divUrlBing= new Array(5);
			//get  request from google from my navegator
			back.doRequest(strGoogle).then(responseData=>{
					divsGoogle = responseData.querySelectorAll('div.r');
					divUrlGoogle = back.parseGoogleDivs(divsGoogle,divUrlGoogle);	
					if(divsBing !== undefined){
							resolve([divUrlGoogle,divUrlBing])
						}
			});
			//get request from bing from my navegator
			back.doRequest(strBing).then(responseData=>{
				divsBing=responseData.querySelectorAll('div.b_attribution');
				for (var i = 0; i < 5 ; i++) {
						divUrlBing[i]=divsBing[i].innerText;
				}	
				if(divsGoogle !== undefined){
						resolve([divUrlGoogle,divUrlBing]);
					}
			});
		});
	}

	parseResults(doc){
		var divs,urls
		var urls= new Array(5);
		divs=doc.getElementsByClassName('result__extras__url');
					for (var i = 0; i < 5 ; i++) {
							urls[i]=divs[i].getElementsByTagName('a')[0].href;
					}
		return urls;
	}


	getString(){
		return "https://duckduckgo.com/html/?q=";
	}
}

								  
class BackgroundExtension extends AbstractP2PExtensionBackground{
peers =[];
engine;
search;

	parseGoogleDivs(divsGoogle,divUrlGoogle){
					for (var i = 0; i < 5 ; i++) {
							divUrlGoogle[i]=divsGoogle[i].getElementsByTagName('a')[0].href;
					}
					return divUrlGoogle
	}



	setEngine(eng){
		this.engine=eng;
	}

	getEngine(){
		return this.engine;
	}

	setSearch(Asearch){
		this.search=Asearch;
	}

	getSearch(){
		return this.search;
	}


	constructor(){
		super();
	}

	getExtensionName(){
		return "my_first_extensions";
	}

	getExtensionId(){
		return "my_first_extensions@nahuel"
	}


	getCurrentTab(callback) {
		return browser.tabs.query({
			active: true,
			currentWindow: true
		});
	}



	async request(string,req){
		return new Promise((resolve,reject)=>{ 
		var oReq = new XMLHttpRequest();
		oReq.onload = function(data){
			resolve(oReq.responseXML); 
		}
		oReq.open("get",string+req,true);
		oReq.responseType="document";
		oReq.send(document);
		});
	}

	makeEngine(engine){
		if(engine.match('https://www.google')){

			 this.engine = new Google();
		}else{
			if(engine.match('https://www.bing')){
				this.engine = new Bing();
			}else{
				this.engine =new Duck();
			}
		}
		return this.engine
	}

	doRequest(string){
		return new Promise((resolve,reject)=>{ 
		var oReq = new XMLHttpRequest();
		oReq.onload = function(data){
			resolve(oReq.responseXML); 
		}
		oReq.open("get",string+this.getSearch(),true);
		oReq.responseType="document";
		oReq.send(document);
		});
	}

//desde el content llama al metodo para que busque los resultados de los peers
	getResultsFromPeers(){
		try {
			this.sendRequest({
				'str': this.getEngine().getString(),
				'value':this.getSearch(),
				automatic:true,
				withoutcheck:true
			  },"All");
		  }catch(error){
			console.log("Error al utilizar sendurl");
	  }
	}


		async automaticProcessing(msg , peer){
		console.log(msg);
		var array,eng;
		await this.request(msg.str,msg.value).then(req => {
			eng=this.makeEngine(msg.str);
			array = eng.parseResults(req);
			this.sendResponse({
				'req':array,
				automatic:true,
				withoutcheck:true
			},peer);
		})
	}


		receiveResponse(msg, peer){
		browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
		browser.tabs.sendMessage(tabs[0].id,{
    		call: "peerRequests",
			args: {'args': msg.req}
    	})
  		});
    	}


//first method callesd by contetn create engine and call method make request to get the results
	searchNewRequest(value){
			return new Promise((resolve,reject)=>{
			this.setSearch(value.req);
			this.makeEngine(value.engine)
			this.engine.makeRequests(value,this).then((pr)=>{
						resolve(pr);
			});
			});
	}

	setPeers(event){
		self = extension;
		try {
			let listaUsuarios = extension.getDataCallBack();
			console.log(listaUsuarios);
			self.peers = [];
			for (let i in listaUsuarios){
				if (listaUsuarios.hasOwnProperty(i)){
				  self.peers.push(listaUsuarios[i]);
				}
			};
		} catch(e) {
				console.log(e);
		}
    }
}
var extension;

var startBackground = async function(config) { 
	 extension = new BackgroundExtension();
	  extension.connect();
	  var promise;
	  await extension.getPeers(extension.setPeers);
	  browser.runtime.onMessage.addListener((request, sender) => {
		if(extension[request.call]){
			if(request.call==="getResultsFromPeers"){
				extension.getResultsFromPeers();
			}else{
			promise=extension[request.call](request.args);
			return promise;
			}
		}
	});
	  //browser.browserAction.onClicked.addListener()
}

function checkExpectedParameters(config){

	if (config == undefined)
		return false;

    var foundParams = ["apiUrl"].filter(param => (param && config.hasOwnProperty(param)));
    return (config.length == foundParams.length);
}


browser.storage.local.get("config").then(data => {
    if (!checkExpectedParameters(data.config)) {
        data.config = {
        	"apiUrl": ""
        };
        //Si no se setea, se puede perder consistencia con lo que se lee en la pagina de config
        browser.storage.local.set({"config": data.config }).then(() => startBackground(data.config));
    }else{ 
    	startBackground(data.config);
       }
});
