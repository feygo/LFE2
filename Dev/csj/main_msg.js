console.log("load main-msg.js");
// var port = chrome.extension.connect({name: "knockknock1"});
// port.postMessage({joke: "Knock knock"});
// console.log(port);
// port.onMessage.addListener(function(msg) {
	// console.log(msg);
  // if (msg.question == "Who's there?")
    // port.postMessage({answer: "Madame"});
  // else if (msg.question == "Madame who?")
    // port.postMessage({answer: "Madame... Bovary"});
// });



/**************************消息发送模块******************/
// 消息规范：{"msg":{"type":"","info":info},"func":}
function sendRequest(m){
	if(debug!=undefined){
		debug("sendRequest:"+JSON.stringify(m));
	}else{
		console.debug("sendRequest:"+JSON.stringify(m));
	}	
	chrome.extension.sendMessage(m.msg, function(res) {		
		if(debug!=undefined){
			debug("getResponse#"+JSON.stringify(res));
		}else{
			console.debug("getResponse#"+JSON.stringify(res));
		}	
		if(m.func){
			m.func(res);
		}
	});
}

console.log("load main-msg.js done");