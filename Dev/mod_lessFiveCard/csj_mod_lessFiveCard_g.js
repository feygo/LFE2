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
	if(port.name == "mod_lessFiveCard"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load"){
				getLessFive(port);
			}
		});
	}
}
/************************ 数据预备区 **********************/
// {"rs":"","wp":"","zd":"","jn":"","note":"陌上开花缓缓归。"},
var DB_OS_LFC = USER_NAME+"#lessFiveCard";
var DB_NAME_LFC = 'LFE2#Mod#lessFiveCard';

var DB_LFC_G;

function update_DB_LFC_G(evt){
	evt.currentTarget.result.createObjectStore(DB_OS_LFC, { keyPath: "cardId" });
}

function success_DB_LFC_G(evt){
	DB_LFC_G = evt.currentTarget.result;
}
/********************** 自动执行区**********************/
function csjLoad_mod_lessFiveCard_g(){
	Tool_getDB(DB_NAME_LFC,[DB_OS_LFC],update_DB_LFC_G,success_DB_LFC_G);
	chrome.runtime.onConnect.addListener(handlePort_modLessFiveCard);
}
csjLoad_mod_lessFiveCard_g();
log("load csj_mod_lessFiveCard_g.js");