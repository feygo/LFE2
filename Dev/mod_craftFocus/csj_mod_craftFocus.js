log("load csj_mod_craftFocus.js");
/**
	1、为pop页面提供交互操作
	2、查询卡片并删除满5张的卡片
*/
// 载入监控卡片信息
function loadFocusCard(port){			
	var objectStore=DB_CF.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.openCursor();
	request.onsuccess = function(evt) {
		var cursor=request.result;
		if(cursor){
			var cf=cursor.value;
			if(cf.num<5){
				port.postMessage({"cmd":"load.rs","data":cf,"id":cf.cardId});
			}else{
				if(cf.num==5){
					var dReq=objectStore.delete(cf.cardId);
					dReq.onsuccess = function(evt) {
						debug("删除监控卡片信息："+JSON.stringify(evt.target.result));
					}
				}
			}
			cursor.continue();		
		}
	}
}
function addFocusCard(cf,port){
	var objectStore=DB_CF.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.put(cf);
	request.onsuccess = function(evt) {
		debug("添加监控卡片信息："+JSON.stringify(evt.target.result));
	}
}
function delFocusCard(cardId,port){
	var objectStore=DB_CF.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.delete(cardId);
	request.onsuccess = function(evt) {
		debug("删除监控卡片信息："+cardId);
	}
}
/************************ 数据预备区 **********************/
var DB_OS_CF = USER_NAME+"#craftFocus";
var DB_NAME_CF = 'LFE2#Mod#craftFocus';

var DB_CF;

function update_DB_CF(evt){
	// {"craftId":"","cardId":"","shopId":"","num":0};
	evt.currentTarget.result.createObjectStore(DB_OS_CF, { keyPath: "cardId" });
}
function success_DB_CF(evt){
	DB_CF = evt.currentTarget.result;
}
/********************** 通道消息 处理区**********************/
function handlePort_modCraftFocus(port){	
	if(port.name == "mod_craftFocus"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load"){
				loadFocusCard(port);
			}else if(msg.cmd == "add"){
				addFocusCard(msg.data,port);
			}else if(msg.cmd == "del"){
				delFocusCard(msg.id,port);
			}
		});
	}
}
/********************** 自动执行区**********************/
function csjLoad_mod_craftFocus(){
	chrome.runtime.onConnect.addListener(handlePort_modCraftFocus);
	Tool_getDB(DB_NAME_CF,[DB_OS_CF],update_DB_CF,success_DB_CF);
}
csjLoad_mod_craftFocus();
log("load csj_mod_craftFocus.js done");