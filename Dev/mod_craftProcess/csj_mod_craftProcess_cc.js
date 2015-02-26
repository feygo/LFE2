log("load csj_mod_craftProcess_cc.js");

// 获取少于5张的卡片信息
function loadCraftCard(){
	var acList=document.querySelectorAll("#active_cards>div[data-rank=CRAFT]");
	// 获取卡片的数量信息
	var txn=DB_CP_CC.transaction([DB_OS_CP_CC], "readwrite");
	var objectStore=txn.objectStore(DB_OS_CP_CC);	
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
		var request = objectStore.put(cardData);
		request.onerror=function(evt){
			debug(evt);
			error("更新合成卡片信息出错:"+evt.target.error.message);
		}
	}
}
/************************ 数据预备区 **********************/
var DB_OS_CP_CC;
var DB_CP_CC;
function success_DB_CP_CC(db){
	DB_OS_CP_CC = DC[CP_N][0];
	DB_CP_CC = db;
	loadCraftCard();
}
/********************** 自动执行区**********************/
var CP_N="mod_craftProcess";
function csjLoad_mod_craftProcess_cc(){
	Tool_connUserDB(success_DB_CP_CC);
}
csjLoad_mod_craftProcess_cc();
log("load csj_mod_craftProcess_cc.js done");