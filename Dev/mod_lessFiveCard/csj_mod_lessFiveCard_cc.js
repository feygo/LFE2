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
function clsLFive(){
	var port_bg=getBgPort(LFIVE_N);
	port_bg.postMessage({"cmd":"bg.clsLFive","un":USER_NAME});
}
/************************ 数据预备区 **********************/
// 用于处理bg的port
function listener_modLFive(msg){
	if (msg.cmd == "bg.clsLFive.rs"){
		if(msg.stat=="success"){
			loadLessFive();
		}else{
			debug("清空少于5张的卡片出错："+msg.data);
		}
	}
}
/********************** 自动执行区**********************/
var LFIVE_N="mod_lessFiveCard";

getBgPort(LFIVE_N).onMessage.addListener(listener_modLFive);
clsLFive();

log("load csj_mod_lessFiveCard_cc.js done");