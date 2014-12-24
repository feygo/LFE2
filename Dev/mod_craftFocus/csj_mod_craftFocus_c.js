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
var DB_OS_CF = USER_NAME+"#craftFocus";
var DB_NAME_CF = 'LFE2#Mod#craftFocus';

var DB_CF_C;

function update_DB_CF_C(evt){
	// {"cardId":"","cardName":"","num":0};
	evt.currentTarget.result.createObjectStore(DB_OS_CF, { keyPath: "cardId" });
}

function success_DB_CF_C(evt){
	DB_CF_C = evt.currentTarget.result;
}
/********************** 自动执行区**********************/
function csjLoad_mod_cf_c(){
	Tool_getDB(DB_NAME_CF,[DB_OS_CF],update_DB_CF_C,function(evt){
			success_DB_CF_C(evt);
			checkFocusCard();
		});
}
csjLoad_mod_cf_c();
log("load csj_mod_craftFocus_c.js done");