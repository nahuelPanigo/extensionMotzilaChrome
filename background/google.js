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