log("load csj_mod_lessFiveCard_cc.js");

// 获取少于5张的卡片信息
function loadLessFive(){
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
			var objectStore=DB_LFC.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC);
			var request = objectStore.put(cardData);
			request.onsuccess = function(evt) {
				debug("存储不满5张的卡片信息："+evt.target.result);
			}
		}
	}
}
// 清除满足5张数量的卡片
function clearFive(){
	var objectStore=DB_LFC.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC);
	var request = objectStore.openCursor();
	request.onsuccess = function(evt) {
		var cursor = request.result;
		if (cursor) {
			if(cursor.value.num==5){
				debug("清除满5张的卡片信息："+cursor.value.cardId);
				objectStore.delete(cursor.value.cardId);
			}
			cursor.continue();
		} 
	}
}

/************************ 数据预备区 **********************/
var DB_LFC;
var DB_OS_LFC;
function success_DB_LFC(db){
	DB_OS_LFC = DC[FIVECARD_N][0];
	DB_LFC = db;
	loadLessFive();
	clearFive();
}
/********************** 自动执行区**********************/
var FIVECARD_N="mod_lessFiveCard";
function csjLoad_mod_lessFiveCard_cc(){
	Tool_connUserDB(success_DB_LFC);
}
csjLoad_mod_lessFiveCard_cc();
log("load csj_mod_lessFiveCard_cc.js");