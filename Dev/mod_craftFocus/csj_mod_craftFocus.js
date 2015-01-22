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
function addFocusCard(cf){
	var objectStore=DB_CF.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.put(cf);
	request.onsuccess = function(evt) {
		debug("添加监控卡片信息："+JSON.stringify(evt.target.result));
	}
}
function delFocusCard(cardId){
	var objectStore=DB_CF.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.delete(cardId);
	request.onsuccess = function(evt) {
		debug("删除监控卡片信息："+cardId);
	}
}
function checkFocusCard(cardId,port){
	var objectStore=DB_CF.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
	var request = objectStore.get(cardId);
	request.onsuccess = function(evt) {
		debug("查找监控卡片信息："+cardId);
		if(evt.target.result){			
			port.postMessage({"cmd":"check.rs","data":true,"id":cardId});
		}else{
			port.postMessage({"cmd":"check.rs","data":false,"id":cardId});
		}
	}
}
/************************ 数据预备区 **********************/
var DB_OS_CF;
var DB_CF;
function success_DB_CF(db){
	DB_OS_CF = DC[FOCUSCARD_N].userOS;
	DB_CF = db;
}
/********************** 通道消息 处理区**********************/
function handlePort_modCraftFocus(port){	
	if(port.name == FOCUSCARD_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load"){
				loadFocusCard(port);
			}else if(msg.cmd == "add"){
				addFocusCard(msg.data);
			}else if(msg.cmd == "del"){
				delFocusCard(msg.id);
			}else if(msg.cmd == "check"){
				checkFocusCard(msg.id,port);
			}
		});
	}
}
/********************** 自动执行区**********************/
var FOCUSCARD_N="mod_craftFocus";
function csjLoad_mod_craftFocus(){
	chrome.runtime.onConnect.addListener(handlePort_modCraftFocus);
	Tool_connModDB(FOCUSCARD_N,success_DB_CF);
}
csjLoad_mod_craftFocus();
log("load csj_mod_craftFocus.js done");