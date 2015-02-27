log("load csj_mod_lessFiveCard_g.js");

// 获取不满足5张数量的卡片
function getLessFive(port){
	var objectStore=DB_LFC_G.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC);
	var request = objectStore.openCursor();
	request.onsuccess = function(evt) {
		var cursor = request.result;
		if (cursor) {
			if(cursor.value.num<5&&cursor.value.stat=="已激活"){
				port.postMessage({"cmd":"load.rs","data":cursor.value});
			}
			cursor.continue();
		} 
	}
}
/********************** 通道消息 处理区**********************/
function handlePort_modLessFiveCard(port){	
	if(port.name == FIVECARD_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load"){
				getLessFive(port);
			}
		});
	}
}
/************************ 数据预备区 **********************/
var DB_OS_LFC;
var DB_LFC_G;
function success_DB_LFC_G(db){
	DB_OS_LFC = DC[FIVECARD_N][0];
	DB_LFC_G = db;
}
/********************** 自动执行区**********************/
var FIVECARD_N="mod_lessFiveCard";
function csjLoad_mod_lessFiveCard_g(){
	Tool_connUserDB(success_DB_LFC_G);
	chrome.runtime.onConnect.addListener(handlePort_modLessFiveCard);
}
csjLoad_mod_lessFiveCard_g();
log("load csj_mod_lessFiveCard_g.js done");