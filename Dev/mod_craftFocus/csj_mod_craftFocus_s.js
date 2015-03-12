log("load csj_mod_craftFocus_s.js");
/**
	1、提供页面功能，可设置合成卡片信息
	2、根据合成卡片信息，获取指定卡片的数量，并且更新卡片数量
*/
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
/************************ 页面操作区 **********************/
// 如果有不满5张的卡片，可以设置为监控卡片,被商店信息获取模块调用
function setFocusCardAction(card){
	console.log("=================",card);
	//判断卡片数量是否满足5张
	var cardnum=0;
	var num=document.querySelector("#inner_card_num"+card.cardId);
	if(num){
		cardnum=parseInt(num.innerText);
	}
	// 如果不满足，就设置单击事件
	if(cardnum<5){
		var c=document.querySelector("#card_outer_frame"+card.cardId);
		var outline=c.parentElement.parentElement;
		var d=outline.querySelector("div.title.outline");
		d.addEventListener('click', focusCardAction);		
	}
}
// 设置监控卡片，并把卡片保持至db中
function focusCardAction(){
	var s=event.srcElement;
	var ofrm=s.parentElement.querySelector("center");
	var cardData={"cardId":"","cardName":"","num":0};
	if(ofrm!=null){
		cardData=Tool_getCardByOutframe(cardData,ofrm);
	}
	var num=document.querySelector("#inner_card_num"+cardData.cardId);
	if(num){
		cardData["num"]=parseInt(num.innerText);
	}
	// debug(cardData);
	var r=confirm("是否将 '"+cardData.cardName+"' 设为监控卡，以便监控其的合成材料");
	if (r==true){
		var port_bg=getBgPort(FC_N);
		port_bg.postMessage({"cmd":"bg.saveFocusCard","un":USER_NAME,"data":cardData});
	}
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

log("load csj_mod_craftFocus_s.js done");