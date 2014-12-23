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
// {"rs":"","wp":"","zd":"","jn":"","note":"陌上开花缓缓归。"},
var DB_OS_LFC = USER_NAME+"#lessFiveCard";
var DB_NAME_LFC = 'LFE2#Mod#lessFiveCard';

var DB_LFC;

function update_DB_LFC(evt){
	evt.currentTarget.result.createObjectStore(DB_OS_LFC, { keyPath: "cardId" });
}

function success_DB_LFC(evt){
	DB_LFC = evt.currentTarget.result;
	loadLessFive();
	clearFive();
}
/********************** 自动执行区**********************/
function csjLoad_mod_lessFiveCard_cc(){
	Tool_getDB(DB_NAME_LFC,[DB_OS_LFC],update_DB_LFC,success_DB_LFC);
}
csjLoad_mod_lessFiveCard_cc();
log("load csj_mod_lessFiveCard_cc.js");