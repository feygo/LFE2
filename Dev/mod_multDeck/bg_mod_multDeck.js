log("load bg_mod_multDeck.js");

/***********************************多卡组  功能区  开始******************************************/
// 存储卡组
function saveDeck(userName,gearData,port){
	Tool_getConn(userName,function(db){
		var objectStore=db.transaction([DB_OS_Gear], "readwrite").objectStore(DB_OS_Gear);
		var requestUpdate = objectStore.put(gearData);
		requestUpdate.onsuccess = function(evt) {
			port.postMessage({"cmd":"bg.saveDeck.rs","stat":"success","data":gearData.gearName});
		}
		requestUpdate.onerror = function(evt) {
			error(evt);
			port.postMessage({"cmd":"bg.saveDeck.rs","stat":"error","data":evt.target.error.message});
		};			
	});	
}
// 载入卡组
function loadDeck(userName,gn,port){
	Tool_getConn(userName,function(db){
			// 从db中读取卡组信息
		var request = db.transaction([DB_OS_Gear], "readonly").objectStore(DB_OS_Gear).get(gn);
		request.onsuccess = function(evt) {	
			var gearData=evt.currentTarget.result;
			if(gearData){
				port.postMessage({"cmd":"bg.loadDeck.rs","stat":"success","data":gearData});				
			}else{
				port.postMessage({"cmd":"bg.loadDeck.rs","stat":"error","data":gearData});
			}
		};
		request.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.loadDeck.rs","stat":"error","data":evt.target.error.message});
		}	
	});
}
// 删除卡组信息
function delDeck(userName,gn,port){
	Tool_getConn(userName,function(db){
		// 从db中读取卡组信息
		var request = db.transaction([DB_OS_Gear], "readwrite").objectStore(DB_OS_Gear).delete(gn);
		request.onsuccess = function(evt) {	
			port.postMessage({"cmd":"bg.delDeck.rs","stat":"success","data":gn});
		};
		request.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.delDeck.rs","stat":"error","data":evt.target.error.message});
		}		
	});
}
// 卡组列表载入
function loadList(userName,port){
	Tool_getConn(userName,function(db){
		var gnList=[];
		var objectStore = db.transaction(DB_OS_Gear).objectStore(DB_OS_Gear);
		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				gnList.push(cursor.key);
				cursor.continue();
			}else {
				debug("卡组列表读取："+gnList);
				port.postMessage({"cmd":"bg.loadList.rs","stat":"success","data":gnList});
			}
		};
		objectStore.openCursor().onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.loadList.rs","stat":"error","data":evt.target.error.message});
		}		
	});
}

/***********************************多卡组  功能区  结束******************************************/
/************************ 数据预备区 **********************/

var DB_MultDeck;
function success_DB_MultDeck(db){
	DB_OS_Gear = DC[MDECK_N][0];
	DB_MultDeck = db;
}
/********************** 通道消息 处理区**********************/
/**
"cmd":"loadDeck","data":slt.value
**/
function handlePort_modMultDeck(port){	
	if(port.name == "BG#"+MDECK_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.saveDeck"){
				saveDeck(msg.un,msg.data,port);			
			}
			if (msg.cmd == "bg.loadDeck"){
				loadDeck(msg.un,msg.id,port);
			}
			if (msg.cmd == "bg.delDeck"){
				delDeck(msg.un,msg.id,port);
			}
			if (msg.cmd == "bg.loadList"){
				loadList(msg.un,port);
			}		
		});
	}
}
/********************** 自动执行区**********************/
var MDECK_N="mod_multDeck";
var DB_OS_Gear= MOD_DEF[MDECK_N].data[0];

chrome.runtime.onConnect.addListener(handlePort_modMultDeck);

log("load bg_mod_multDeck.js done");