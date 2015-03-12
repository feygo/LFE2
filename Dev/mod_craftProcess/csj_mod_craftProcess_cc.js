log("load csj_mod_craftProcess_cc.js");

// 获取合成卡片信息
function loadCraftCard(){
	var acList=document.querySelectorAll("#active_cards>div[data-rank=CRAFT]");
	// 获取卡片的数量信息
	var port_bg=getBgPort(CP_N);
	debug("已经收集的合成类卡片数量："+acList.length);
	for(var i=0;i<acList.length;i++){
		// 记录卡片id card1613_div
		var cardId=acList[i].id.replace("card","").replace("_div","");	
		// 获得卡片数量 inner_card_num1613
		var tmpNum=document.getElementById("inner_card_num"+cardId);
		var num=parseInt(tmpNum.innerText);			
		var cardData={"cardId":"","num":""};
		cardData.cardId=cardId;
		cardData.num=num;
		port_bg.postMessage({"cmd":"bg.saveCraftCard","un":USER_NAME,"data":cardData});
	}
}
/********************** 自动执行区**********************/
var CP_N="mod_craftProcess";
loadCraftCard();
log("load csj_mod_craftProcess_cc.js done");