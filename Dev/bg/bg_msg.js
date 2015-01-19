console.log("load bg_msg.js");
/********************** 请求应答 处理区**********************/
// 请求分发器，调用已经注册的各个mod的请求处理器
function handleRequest(msg, sender, sendResponse){
	debug("收到请求："+JSON.stringify(msg)+" from:"+sender.tab.id);
	if(msg.type in RequestListener){
		debug("选定请求处理器："+RequestListener[msg.type].name);
		return RequestListener[msg.type](msg, sender, sendResponse);		
	}
}
/********************** 自动执行区**********************/
chrome.runtime.onMessage.addListener(handleRequest);
console.log("已经注册的请求监听器：");
console.log(RequestListener);

console.log("load bg_msg.js done");