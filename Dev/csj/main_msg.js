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
function handlePort_main(port){	
	if(port.name == "LEF_MAIN"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "clsData"){
				clsData(msg.id,msg.data);
			}	
		});
	}
}
function clsData(name,isAll){
	if(isAll){
		Tool_delDB(name);
	}else{
	////////////////////////////////////////////////////////////////////
		Tool_delOS(name,"");
	}
}

chrome.runtime.onConnect.addListener(handlePort_main);
console.log("load main-msg.js done");