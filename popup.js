
function change(but){
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


	calls=0;

	let params={
		active:true,
		currentWindow: true,
	}
	let message={
		"call": "getProm"
	}
	browser.tabs.query(params,function(tabs){
		chrome.tabs.sendMessage(tabs[0].id,message);
	})



function CreateParagraph(peer,cantRess){
	p=document.createElement("p");
	prom=((cantRess/peer)>>0);
	p.innerText("el promedio es: "+prom+" de "+peer+" resultados");
	p.id="prom";
	return p;
}

function removeParagraph(li){
	if(calls>0){
		li.removeChildren(li.prom)
	}
}

function chargeResult(array,peer){
	li=document.getElementById("res").children
	 console.log("aca tambien")
	for(i=0;i<15;i++){
		removeParagraph(li[i])
		console.log("paso el remove")
		p=CreateParagraph(peer,array[i]);
		console.log("paso el create")
		li[i].appendChild(p);
		console.log("lo puso como hijo de fruta")
	}
	 console.log("aca no se rompe")
}


browser.runtime.onMessage.addListener(function (message, sender,sendResponse) {
	if(message.data==="popUp"){
		    console.log(message);
		    calls++;
		    console.log("aca llega")
		    chargeResult(message.args.prom,message.args.peer);
		     console.log("aca si")
		    sendResponse({
		        data: "I am fine, thank you. How is life in the background?"
		    });
	}
})



document.addEventListener('DOMContentLoaded',function(){
	var buttons=document.getElementsByTagName('button');
		buttons[0].addEventListener('click',function(){
			change(0);
		});
		buttons[1].addEventListener('click',function(){
			change(1);
		});
		buttons[2].addEventListener('click',function(){
			change(2);
		});
		buttons[3].addEventListener('click',function(){
			change(3);
		});
		buttons[4].addEventListener('click',function(){
			change(4);
		});
		buttons[4].addEventListener('click',function(){
			change(4);
		});
		buttons[5].addEventListener('click',function(){
			change(5);
		});
		buttons[6].addEventListener('click',function(){
			change(6);
		});
		buttons[7].addEventListener('click',function(){
			change(7);
		});
		buttons[8].addEventListener('click',function(){
			change(8);
		});
		buttons[9].addEventListener('click',function(){
			change(9);
		});
		buttons[10].addEventListener('click',function(){
			change(10);
		});
		buttons[11].addEventListener('click',function(){
			change(11);
		});
		buttons[12].addEventListener('click',function(){
			change(12);
		});
		buttons[13].addEventListener('click',function(){
			change(13);
		});
		buttons[14].addEventListener('click',function(){
			change(14);
		});

});