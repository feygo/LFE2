/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_lessFiveCard.js");
/*********************** 页面通道 通讯区 *********************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_lessFiveCard"});
		loadLessFive();
		
		/**
		页面操作指令 消息结构：{"cmd":"loadDeck","dId":slt.value}
		页面操作反馈 消息结构：{"rs":list};
		*/
		/** 业务功能区 */
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load.rs"){
				var card=msg.data;
				bg.debug(card);
				if(card.lv<10){
					var msg="Lv."+card.lv+"   "+card.cardName+" "+card.num+"张\n";
				}else{
					var msg="Lv."+card.lv+" "+card.cardName+" "+card.num+"张\n";
				}
				document.querySelector("#lessFiveBoard").value+=msg;
			}
		});	
		
	});
}


// 载入卡组列表
function loadLessFive(){
	var msg={"cmd":"load"};
	document.querySelector("#lessFiveBoard").value="";
	port.postMessage(msg);
}

/**************窗体事件区*********************/
// document.querySelector('#saveBtn').addEventListener('click', saveDeck);
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_lessFiveCard.js done");