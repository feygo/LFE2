log("load csj_mod_invFocus.js");

/*********************物品记录区*************************/
function getInvFocusItem(itemId,port){
	var os=DB_IF.transaction([DB_OS_IF], "readonly").objectStore(DB_OS_IF);
	var requestUpdate=os.get(itemId);
	requestUpdate.onerror = function(evt) {
		error("获得背包物品信息出错:"+evt.target.error.message);
	};
	requestUpdate.onsuccess = function(evt) {
		var item=evt.target.result;
		if(item){
			port.postMessage({"cmd":"get.rs","id":itemId,"data":item});
			debug("获得背包物品信息:"+JSON.stringify(item));
		}else{
			port.postMessage({"cmd":"get.rs","id":itemId,"data":null});
		}
	};
}
function getUserInvAction(port){
	port.postMessage({"cmd":"getUserInv.rs","data":USER_INV});
}
/********************** 通道消息 处理区**********************/
function handlePort_modInvFocus(port){	
	if(port.name == INVFOCUS_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "get"){
				getInvFocusItem(msg.id,port);
			}else if (msg.cmd == "getUserInv"){
				getUserInvAction(port);
			}	
		});
	}
}
/************************ 数据预备区 **********************/
var DB_OS_IF;
var DB_IF;
function success_DB_IF(db){
	DB_OS_IF = DC[INVFOCUS_N][0];
	DB_IF = db;
}
/********************** 自动执行区**********************/
var INVFOCUS_N="mod_invFocus";
function csjLoad_mod_invFocus(){
	chrome.runtime.onConnect.addListener(handlePort_modInvFocus);
	//Tool_connUserDB(success_DB_IF);
}
csjLoad_mod_invFocus();
log("load csj_mod_invFocus.js done");


