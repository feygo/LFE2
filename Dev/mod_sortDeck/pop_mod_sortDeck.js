/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_sortDeck.js");
/*********************** 页面通道 通讯区 *********************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_sortDeck"});
	});
}
/**
页面操作指令 消息结构：{"msgType":"c-deck","opnType":"loadDeck","dId":slt.value}
页面操作反馈 消息结构：{"rs":list};
						[{"dId":"1","dName":"t1"},{"dId":"2","dName":"sha2"},{"dId":"3","dName":"杀3"}];
						{"dId":"4","dName":"tr1","opn":"done"};

*/
/** 业务功能区 卡片排序*/
function sortDeck(){
	var msg={"cmd":"sortDeck","id":this.value};
	port.postMessage(msg);	
}

/** 绑定事件区 */
document.addEventListener('DOMContentLoaded', function() {	
	var sortList=document.getElementsByName('sortBtn');
	// bg.log(sortList);
	for(var i=0;i<sortList.length;i++){
		sortList[i].addEventListener('click', sortDeck);
	}	
});
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_sortDeck.js done");