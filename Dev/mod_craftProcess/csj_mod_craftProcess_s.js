log("load csj_mod_craftProcess_s.js");

// 记录合成卡片的信息
function saveCraftCardNum(card){		
	// 判断数量
	var cardnum=0;
	var num=document.querySelector("#inner_card_num"+card.cardId);
	if(num){
		cardnum=parseInt(num.innerText);
	}
	// 组装对象
	var cardData={"cardId":"","shopId":"","num":0};
	cardData.cardId=card.cardId;
	cardData.shopId=card.shopId;
	cardData.num=cardnum;
	
	var port_bg=getBgPort(CP_N);
	port_bg.postMessage({"cmd":"bg.saveCraftCard","un":USER_NAME,"data":cardData});
}
/********************** 自动执行区**********************/
var CP_N="mod_craftProcess";

log("load csj_mod_craftProcess_s.js done");