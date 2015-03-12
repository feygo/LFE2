log("load csj_mod_lessFiveCard_cc.js");

// 存储少于5张的卡片信息
function saveLFive(userName,cardData,port){
	Tool_getConn(userName,function(db){			
		var objectStore=db.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC);
		var request = objectStore.put(cardData);
		request.onsuccess = function(evt) {
			debug("存储不满5张的卡片信息："+evt.target.result);
		}
	});
}
// 获取少于5张的卡片信息，超越5张的卡片将被删除
function loadLFive(userName,port){
	Tool_getConn(userName,function(db){
		var objectStore=db.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC);
		var request = objectStore.openCursor();
		request.onsuccess = function(evt) {
			var cursor = request.result;
			if (cursor) {
				if(cursor.value.num<5&&cursor.value.stat=="已激活"){
					port.postMessage({"cmd":"bg.loadLFive.rs","stat":"success","data":cursor.value});
				}
				if(cursor.value.num>=5){
					debug("清除满5张的卡片信息："+cursor.value.cardId);
					objectStore.delete(cursor.value.cardId);
				}
				cursor.continue();
			} 
		}		
	});
}
// 清空
function clsLFive(userName,port){
	Tool_getConn(userName,function(db){
		var request = db.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC).clear();
		request.onsuccess = function(evt) {	
			port.postMessage({"cmd":"bg.clsLFive.rs","stat":"success"});
		};
		request.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.clsLFive.rs","stat":"error","data":evt.target.error.message});
		}		
	});
}
/********************** 通道消息 处理区**********************/
/**
"cmd":"loadDeck","data":slt.value
**/
function handlePort_modMultDeck(port){	
	if(port.name == "BG#"+MN_LFive){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.loadLFive"){
				loadLFive(msg.un,port);			
			}
			if (msg.cmd == "bg.clsLFive"){
				clsLFive(msg.un,port);			
			}
			if (msg.cmd == "bg.saveLFive"){
				saveLFive(msg.un,msg.data,port);
			}		
		});
	}
}

/********************** 自动执行区**********************/
var MN_LFive="mod_lessFiveCard";
var DB_OS_LFC=MOD_DEF[MN_LFive].data[0];

chrome.runtime.onConnect.addListener(handlePort_modMultDeck);

log("load csj_mod_lessFiveCard_cc.js done");