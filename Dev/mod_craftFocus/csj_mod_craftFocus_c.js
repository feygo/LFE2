log("load csj_mod_craftFocus_c.js");

/************************ 核查监控卡片 区 **********************/
function checkFocusCard(cfData){
	var num=document.querySelector("#inner_card_num"+cfData.cardId);
	if(num){
		var cardnum=parseInt(num.innerText);
		if(cardnum!=cfData.num){
			cfData.num=cardnum;
			var port_bg=getBgPort(FC_N);
			port_bg.postMessage({"cmd":"bg.saveFocusCard","un":USER_NAME,"data":cfData});
		}
	}
}
function loadFocusCard(){
	var port_bg=getBgPort(FC_N);
	port_bg.postMessage({"cmd":"bg.loadFocusCard","un":USER_NAME});
}
/********************** 通道消息 处理区**********************/
// 用于处理bg的port
function listener_modCraftFocus(msg){
	if (msg.cmd == "bg.loadFocusCard.rs"){	
		checkFocusCard(msg.data);
	}
}
/********************** 自动执行区**********************/
var FC_N="mod_craftFocus";

getBgPort(FC_N).onMessage.addListener(listener_modCraftFocus);
loadFocusCard();
log("load csj_mod_craftFocus_c.js done");