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
/********************** 通道消息 处理区**********************/

console.log("load main-msg.js done");