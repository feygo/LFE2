/** 后台通讯区 */
var modName="mod_multDeck";
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_multDeck.js");
/*********************** 页面通道 通讯区 *********************/
var userName=bg.Tool_getUserName(location.search);
var port;
var port_bg;
function loadPort(){
	port_bg=chrome.runtime.connect({name: "BG#"+modName});
	port_bg.onMessage.addListener(function(msg) {
		bg.debug("pop_"+modName+"收到"+port_bg.name+"通道消息："+JSON.stringify(msg));	
	});		
	loadList();
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: modName});
		port.onMessage.addListener(function(msg) {
			bg.debug("pop_"+modName+"收到"+port.name+"通道消息："+JSON.stringify(msg));
		});		
		
	});
}

// 存储页面中的卡组信息
function saveDeck(){
	document.getElementById("rsDiv").innerText="";
	var msg={"cmd":"saveDeck"};
	port.postMessage(msg);
	port.onMessage.addListener(function(msg) {
		if (msg.cmd == "saveDeck.rs"){
			document.getElementById("rsDiv").innerText=msg.data;
			//刷新卡组列表
			loadList();
		}
	});	
}
// 将选定的卡组装载到页面中
function loadDeck(){
	document.getElementById("rsDiv").innerText="";
	var slt=document.getElementById("deck_list");
	var msg={"cmd":"loadDeck","id":slt.value};
	port.postMessage(msg);
	port.onMessage.addListener(function(msg) {
		if (msg.cmd == "loadDeck.rs"){
			document.getElementById("rsDiv").innerText=msg.data;
		}
	});	
}
// 删除将选定的卡组
function delDeck(){
	document.getElementById("rsDiv").innerText="";
	var slt=document.getElementById("deck_list");
	var msg={"cmd":"bg.delDeck","un":userName,"id":slt.value};
	port_bg.postMessage(msg);
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.delDeck.rs"){
			if(msg.stat=="success"){
				var info="卡组删除成功:"+msg.data;
				document.getElementById("rsDiv").innerText=info;				
			}else{
				var info="卡组删除出错:"+msg.data;
				document.getElementById("rsDiv").innerText=info;
			}
			//刷新卡组列表
			loadList();
		}	
	});		
}
// 载入卡组列表
function loadList(){
	var msg={"cmd":"bg.loadList","un":userName};
	port_bg.postMessage(msg);
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.loadList.rs"){
			var list=msg.data;
			var slt=document.getElementById("deck_list");
			slt.innerHTML="";
			for(var i=0;i<list.length;i++){
				var tmp=list[i];
				jsAddItemToSelect(slt,tmp,tmp);
			}
		}
	});	
}

/**************窗体事件区*********************/
document.querySelector('#saveBtn').addEventListener('click', saveDeck);
document.querySelector('#loadBtn').addEventListener('click', loadDeck);
document.querySelector('#delBtn').addEventListener('click', delDeck);
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_multDeck.js done");