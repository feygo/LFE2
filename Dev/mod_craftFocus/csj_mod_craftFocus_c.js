log("load csj_mod_craftFocus_c.js");

/************************ 核查监控卡片 区 **********************/
function checkFocusCard(){
	var objectStore=DB_CF_C.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
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

/************************ 数据预备区 **********************/
var DB_OS_CF;
var DB_CF_C;
function success_DB_CF_C(db){
	DB_OS_CF = DC[FOCUSCARD_N].userOS;
	DB_CF_C = db;
	checkFocusCard();
}
/********************** 自动执行区**********************/
var FOCUSCARD_N="mod_craftFocus";
function csjLoad_mod_cf_c(){
	Tool_connModDB(FOCUSCARD_N,success_DB_CF_C);
}
csjLoad_mod_cf_c();
log("load csj_mod_craftFocus_c.js done");