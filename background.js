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
							console.log("array1",array1);
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
							console.log(array1[i])
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

	getResultsFromPeers(){
		console.log('results from peers');
		//let username = this.peers[0].username;
		try {
			this.sendRequest({
				'str': this.getEngine().getString(),
				'value':this.getSearch(),
				automatic:true,
				withoutcheck:true
			  },"All");
		  }catch(error){
			console.log("Error al utilizar sendurl");
			console.log(error);
	  }
	}


		async automaticProcessing(msg , peer){
		console.log('Automatic procesing request...');
		console.log('Pedido de: ' + peer);
		await this.request(engine.getString,search).then(jsonNews => {
			console.log("News obtained, preparing to send response");
			console.log(jsonNews);
			this.sendResponse({
				'news':jsonNews,
				automatic:true,
				withoutcheck:true
			},peer);
			console.log('Response sent');
		})
	}


		receiveResponse(msg, peer){
		console.log("Response receivd from: " + peer);
		console.log(msg);
		this.getCurrentTab().then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				call: "presentRelatedNews",
				args: {'news': msg.news, 'topics': msg.keywords, 'peer': peer }
			});
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
			console.log(request.call);
			promise=extension[request.call](request.args);
			return promise;
		}
			console.log(request.args);
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
