log("load csj_mod_lessFiveCard_s.js");

// 更新不满足5张数量的卡片
function saveLessFiveByShop(card){		
	// 判断数量
	var cardnum=0;
	var num=document.querySelector("#inner_card_num"+card.cardId);
	if(num){
		cardnum=parseInt(num.innerText);
	}
	// 判断卡片数量
	if(0<cardnum&&cardnum<5){
		// 如果不存在则保存，状态设置为已激活
		var cardData={"cardId":"","cardName":"","lv":"","cardType":""};
		cardData.cardId=card.cardId;
		cardData.cardName=card.cardName;
		cardData.lv=card.lv;
		cardData.cardType=card.cardType;
		cardData["stat"]="已激活";	
		cardData["num"]=cardnum;	
		debug("获取未满足5张的卡片数量："+JSON.stringify(cardData));
		var port_bg=getBgPort(LFIVE_N);		
		port_bg.postMessage({"cmd":"bg.saveLFive","un":USER_NAME,"data":cardData});
	}		

}
/************************ 数据预备区 **********************/
var LFIVE_N="mod_lessFiveCard";
log("load csj_mod_lessFiveCard_s.js done");