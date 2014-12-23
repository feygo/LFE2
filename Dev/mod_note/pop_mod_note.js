/*********************** 后台通讯区 *********************/
var bg = chrome.extension.getBackgroundPage();   

bg.log("popup load pop_mod_note.js");
// 存储记事本数据
function saveRecord(){
	var rec=document.getElementById("records").value;
	port.postMessage({"cmd":"saveRec","data":rec});
}
// 载入记事本数据
function loadRecord(){
	port.postMessage({"cmd":"loadRec"});
	port.onMessage.addListener(function(msg) {
		bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
		if (msg.cmd == "loaded"){
			document.getElementById("records").value=msg.data;
		}	
	});
}
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_note"});
		loadRecord();
	});
}
/**************窗体事件区*********************/
document.querySelector('#records').addEventListener('propertychange', saveRecord);
document.querySelector('#records').addEventListener('input', saveRecord);
document.querySelector('#records').addEventListener('focus', saveRecord);

window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_note.js done");
