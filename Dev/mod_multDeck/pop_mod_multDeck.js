/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_multDeck.js");
/*********************** 页面通道 通讯区 *********************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_multDeck"});
		loadList();
		
		/**
		页面操作指令 消息结构：{"cmd":"loadDeck","dId":slt.value}
		页面操作反馈 消息结构：{"rs":list};
		*/
		/** 业务功能区 */
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "rs"){
				document.getElementById("rsDiv").innerText=msg.data;
				//刷新卡组列表
				loadList();
			}	
			if (msg.cmd == "loadList.rs"){
				var list=msg.data;
				var slt=document.getElementById("deck_list");
				slt.innerHTML="";
				for(var i=0;i<list.length;i++){
					var tmp=list[i];
					jsAddItemToSelect(slt,tmp,tmp);
				}
			}
		});		
		
	});
}

// 存储页面中的卡组信息
function saveDeck(){
	document.getElementById("rsDiv").innerText="";
	var msg={"cmd":"saveDeck"};
	port.postMessage(msg);
}
// 将选定的卡组装载到页面中
function loadDeck(){
	document.getElementById("rsDiv").innerText="";
	var slt=document.getElementById("deck_list");
	var msg={"cmd":"loadDeck","id":slt.value};
	port.postMessage(msg);
}
// 删除将选定的卡组
function delDeck(){
	document.getElementById("rsDiv").innerText="";
	var slt=document.getElementById("deck_list");
	var msg={"cmd":"delDeck","id":slt.value};
	port.postMessage(msg);
}
// 载入卡组列表
function loadList(){
	var msg={"cmd":"loadList"};
	port.postMessage(msg);
}

/**************窗体事件区*********************/
document.querySelector('#saveBtn').addEventListener('click', saveDeck);
document.querySelector('#loadBtn').addEventListener('click', loadDeck);
document.querySelector('#delBtn').addEventListener('click', delDeck);
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_multDeck.js done");