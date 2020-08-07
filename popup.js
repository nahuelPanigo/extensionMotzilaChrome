
function cambiar(but){
	let params={
		active:true,
		currentWindow: true,
	}
	let message={
		"call": "getUrl",
		"args":  {but: but}
	}
	browser.tabs.query(params,function(tabs){
		chrome.tabs.sendMessage(tabs[0].id,message);
	})

}

browser.runtime.onMessage.addListener(function (message, sender,sendResponse) {
    console.log("boca");
    var p=document.createElement("p");
    console.log("jime");
    p.innerText="resultado 1";
    console.log("fea");
    console.log(document.getElementsByClassName("resultados").children())
    document.appendChild(p);
    console.log("cara de culo");
    sendResponse({
        data: "I am fine, thank you. How is life in the background?"
    });
})



document.addEventListener('DOMContentLoaded',function(){
	var buttons=document.getElementsByTagName('button');
		buttons[0].addEventListener('click',function(){
			cambiar(0);
		});
		buttons[1].addEventListener('click',function(){
			cambiar(1);
		});
		buttons[2].addEventListener('click',function(){
			cambiar(2);
		});
		buttons[3].addEventListener('click',function(){
			cambiar(3);
		});
		buttons[4].addEventListener('click',function(){
			cambiar(4);
		});
		buttons[4].addEventListener('click',function(){
			cambiar(4);
		});
		buttons[5].addEventListener('click',function(){
			cambiar(5);
		});
		buttons[6].addEventListener('click',function(){
			cambiar(6);
		});
		buttons[7].addEventListener('click',function(){
			cambiar(7);
		});
		buttons[8].addEventListener('click',function(){
			cambiar(8);
		});
		buttons[9].addEventListener('click',function(){
			cambiar(9);
		});
		buttons[10].addEventListener('click',function(){
			cambiar(10);
		});
		buttons[11].addEventListener('click',function(){
			cambiar(11);
		});
		buttons[12].addEventListener('click',function(){
			cambiar(12);
		});
		buttons[13].addEventListener('click',function(){
			cambiar(13);
		});
		buttons[14].addEventListener('click',function(){
			cambiar(14);
		});

});