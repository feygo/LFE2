log("load csj_mod_lessFiveCard_cc.js");

// 获取少于5张的卡片信息
function loadLessFive(){
	var port_bg=getBgPort(LFIVE_N);
	var acList=document.querySelectorAll("#active_cards>div");
	// 获取卡片的数量信息
	for(var i=0;i<acList.length;i++){
		var tmpNum=acList[i].querySelector("div.cardnum");
		var num=parseInt(tmpNum.innerText);
		if(num<5){
			// 记录卡片信息
			var ofrm=acList[i].querySelector("div.card_outframe");
			var cardData={"cardId":"","cardName":"","lv":"","cardType":""};
			cardData=Tool_getCardByOutframe(cardData,ofrm);
			cardData["num"]=num;
			cardData["stat"]=acList[i].querySelector("div.cardfunc").firstChild.innerText;
			// debug(cardData);		
			port_bg.postMessage({"cmd":"bg.saveLFive","un":USER_NAME,"data":cardData});
		}
	}
}
// 清除满足5张数量的卡片
function checkLFive(){
	var port_bg=getBgPort(LFIVE_N);
	port_bg.postMessage({"cmd":"bg.loadLFive","un":USER_NAME});
}
function handlePort_checkLFive(msg){
	// inner_card_num1199
	// msg.data.num
	// msg.data.cardId
}
/************************ 数据预备区 **********************/
// 用于处理bg的port
function listener_modLFive(msg){
	if (msg.cmd == "bg.loadLFive.rs"){	
		handlePort_checkLFive(msg);
	}
}
/********************** 自动执行区**********************/
var LFIVE_N="mod_lessFiveCard";

getBgPort(LFIVE_N).onMessage.addListener(listener_modLFive);
log("load csj_mod_lessFiveCard_cc.js done");