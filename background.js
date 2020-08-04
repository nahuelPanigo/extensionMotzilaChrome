class Google{
	makeRequests(value,back){
		return new Promise((resolve,reject)=>{ 
		var string1="https://www.bing.com/search?q=";
		var string2="https://duckduckgo.com/html/?q=";
		var col1,col2;
		var array1 = new Array(5);
		var array2 = new Array(5);
		back.doRequest(string1).then(responseData=>{
				col1=responseData.querySelectorAll('div.b_attribution');
				for (var i = 0; i < 5 ; i++) {
						array1[i]=col1[i].innerText;
				}	
				if(col2 !== undefined){
						resolve([array1,array2]);
					}
			});
			back.doRequest(string2).then(responseData=>{
				col2=responseData.getElementsByClassName('result__extras__url');
				for (var i = 0; i < 5 ; i++) {
						array2[i]=col2[i].getElementsByTagName('a')[0].href;
				}					
				if(col1!==undefined){
					resolve([array1,array2]);
				}
			});
		})
	}

	parseResults(doc){
		var col,array
		var array= new Array(5);
		col=doc.querySelectorAll('div.r');
					for (var i = 0; i < 5 ; i++) {
							array[i]=col[i].getElementsByTagName('a')[0].href;
					}
		return array;
	}

	getString(){
		return "https://www.google.com/search?q=";
	}
}

class Bing{
	makeRequests(value,back){
		return new Promise((resolve,reject)=>{ 
			var string1="https://www.google.com/search?q=";
			var string2="https://duckduckgo.com/html/?q="
			var col1,col2;
			var array1= new Array(5);
			var array2= new Array(5);
			back.doRequest(string1).then(responseData=>{
					col1=responseData.querySelectorAll('div.r');
					for (var i = 0; i < 5 ; i++) {
							array1[i]=col1[i].getElementsByTagName('a')[0].href;
					}	
					if(col2 !== undefined){
							resolve([array1,array2])
						}
			});
			back.doRequest(string2).then(responseData=>{
					col2=responseData.getElementsByClassName('result__extras__url');
					for (var i = 0; i < 5 ; i++) {
							array2[i]=col2[i].getElementsByTagName('a')[0].href;
					}					
					if(col1!==undefined){
						resolve([array1,array2])
					}
			});
		});
	}
	parseResults(doc){
		var col,array
		var array= new Array(5);
		col=doc.querySelectorAll('div.b_attribution');
				for (var i = 0; i < 5 ; i++) {
						array[i]=col[i].innerText;
				}
	return array;
	}

	getString(){
		return "https://www.bing.com/search?q=";
	}
}

class Duck{

	makeRequests(value,back){
		return new Promise((resolve,reject)=>{ 
			var string1="https://www.google.com/search?q=";
			var string2="https://www.bing.com/search?q=";
			var col1,col2;
			var array1= new Array(5);
			var array2= new Array(5);
			//get from google from my navegator
			back.doRequest(string1).then(responseData=>{
					col1=responseData.querySelectorAll('div.r');
					for (var i = 0; i < 5 ; i++) {
							array1[i]=col1[i].getElementsByTagName('a')[0].href;
					}	
					if(col2 !== undefined){
							resolve([array1,array2])
						}
			});
			//get from bing from my navegator
			back.doRequest(string2).then(responseData=>{
				col2=responseData.querySelectorAll('div.b_attribution');
				for (var i = 0; i < 5 ; i++) {
						array2[i]=col2[i].innerText;
				}	
				if(col1 !== undefined){
						resolve([array1,array2]);
					}
			});
		});
	}

	parseResults(doc){
		var col,array
		var array= new Array(5);
		col=doc.getElementsByClassName('result__extras__url');
					for (var i = 0; i < 5 ; i++) {
							array[i]=col[i].getElementsByTagName('a')[0].href;
					}
		return array;
	}


	getString(){
		return "https://duckduckgo.com/html/?q=";
	}
}

								  
class BackgroundExtension extends AbstractP2PExtensionBackground{
peers =[];
engine;
search;
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

	setPeers(event){
		self = extension;
		try {
			let listaUsuarios = extension.getDataCallBack();
			console.log('Usuarios peers');
			console.log(listaUsuarios);
			self.peers = [];
			for (let i in listaUsuarios){
				if (listaUsuarios.hasOwnProperty(i)){
				  self.peers.push(listaUsuarios[i]);
				}
			};
		} catch(e) {
				console.log("Error al cargar lista de usuarios");
				console.log(e);
		}
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
			return new Google();
		}else{
			if(engine.match('https://www.bing')){
				return new Bing();
			}else{
				return new Duck();
			}
		}
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
		console.log('Pedido de: ' + peer);
		console.log(msg);
		var array,eng;
		await this.request(msg.str,msg.value).then(req => {
			eng=this.makeEngine(msg.str);
			array = eng.parseResults(req);
			console.log("reqs obtained :");
			console.log(array);
			this.sendResponse({
				'req':array,
				automatic:true,
				withoutcheck:true
			},peer);
			console.log('Response sent');
		})
	}


		receiveResponse(msg, peer){
		console.log("Response Received " + peer);
		browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
		console.log(tabs[0].id);
		browser.tabs.sendMessage(tabs[0].id,{
    		call: "peerRequests",
			args: {'args': msg.req
				   'engine': }
    	})
  		});
    	}


	searchNewRequest(value){
			return new Promise((resolve,reject)=>{
			this.setSearch(value.req);
			if(value.engine.match('https://www.google')){
				this.engine = new Google();
				this.engine.makeRequests(value,this).then((pr)=>{
					resolve(pr)
			});
			}else{
				if(value.engine.match('https://www.bing')){
					this.engine = new Bing();
					this.engine.makeRequests(value,this).then((pr)=>{
						resolve(pr);
					});
				}
				else{
					this.engine =new Duck();
					this.engine.makeRequests(value,this).then((pr)=>{
						resolve(pr);
					});
				}
			}
		});
	}

	setPeers(event){
		self = extension;
		try {
			let listaUsuarios = extension.getDataCallBack();
			console.log('Usuarios peers');
			console.log(listaUsuarios);
			self.peers = [];
			for (let i in listaUsuarios){
				if (listaUsuarios.hasOwnProperty(i)){
				  self.peers.push(listaUsuarios[i]);
				}
			};
		} catch(e) {
				console.log("Error al cargar lista de usuarios");
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
