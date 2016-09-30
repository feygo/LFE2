console.log("load main-msg.js");
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
/**********************与bg通道消息 处理区**********************/
var PORT_BG={}
function getBgPort(modName){
	if(PORT_BG[modName]!=undefined){
		return PORT_BG[modName];
	}else{
		var port=chrome.runtime.connect({name: "BG#"+modName});
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
		});
		PORT_BG[modName]=port;
		return PORT_BG[modName];
	}
}
/**********************对外 通道消息 处理区**********************/
function handlePort_main(port){	
	if(port.name == "MAIN"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "getUserName"){
				port.postMessage({"cmd":"getUserName.rs","data":USER_NAME});
			}
			if (msg.cmd == "getUserInv"){
				port.postMessage({"cmd":"getUserInv.rs","data":getUserInv()});
			}			
		});
	}
}
/********************** 自动执行区**********************/
chrome.runtime.onConnect.addListener(handlePort_main);
console.log("load main-msg.js done");