log("load csj_mod_craftFocus_s.js");
/**
	1、提供页面功能，可设置合成卡片信息
	2、根据合成卡片信息，获取指定卡片的数量，并且更新卡片数量
*/
/************************ 核查监控卡片 区 **********************/
function checkFocusCard(){
	var objectStore=DB_CF_S.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.openCursor();
	request.onsuccess = function(evt) {
		var cursor=request.result;
		if(cursor){
			var cf=cursor.value;
			var num=document.querySelector("#inner_card_num"+cf.cardId);
			if(num){
				var cardnum=parseInt(num.innerText);
				if(cardnum!=cf.num){
					cf.num=cardnum;
					var pReq=objectStore.put(cf);
					pReq.onsuccess = function(evt) {
						debug("更新监控卡片信息："+JSON.stringify(evt.target.result));
					}
				}
			}
			cursor.continue();		
		}
	}
}

/************************ 页面操作区 **********************/
// 如果有不满5张的卡片，可以设置为监控卡片
function setFocusCardAction(card){
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
		var objectStore=DB_CF_S.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
		var request = objectStore.put(cardData);
		request.onsuccess = function(evt) {
			debug("保持监控卡片信息："+JSON.stringify(evt.target.result));
		}
	}
}

/************************ 数据预备区 **********************/
var DB_OS_CF;
var DB_CF_S;
function success_DB_CF_S(db){
	DB_OS_CF = DC[FOCUSCARD_N].userOS;
	DB_CF_S = db;
	checkFocusCard();
}
/********************** 自动执行区**********************/
var FOCUSCARD_N="mod_craftFocus";
function csjLoad_mod_cf_s(){
	Tool_connModDB(FOCUSCARD_N,success_DB_CF_S);
}
csjLoad_mod_cf_s();
log("load csj_mod_craftFocus_s.js done");