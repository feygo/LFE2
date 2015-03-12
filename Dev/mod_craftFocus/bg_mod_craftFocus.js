log("load bg_mod_craftFocus.js");

/************************ 核查监控卡片 区 **********************/
// 读取卡片信息，超出5张的卡片将被删除
function loadFocusCard(userName,port){
	Tool_getConn(userName,function(db){	
		var objectStore=db.transaction([DB_OS_CF], "readonly").objectStore(DB_OS_CF);
		var request = objectStore.openCursor();
		request.onsuccess = function(evt) {
			var cursor=request.result;
			if(cursor){
				var cf=cursor.value;
				if(cf.num<5){
					port.postMessage({"cmd":"bg.loadFocusCard.rs","stat":"success","id":cf.cardId,"data":cf});
				}else{
					if(cf.num>=5){
						var dReq=objectStore.delete(cf.cardId);
						dReq.onsuccess = function(evt) {
							debug("删除监控卡片信息："+JSON.stringify(evt.target.result));
						}
					}
				}
				cursor.continue();		
			}
		}
	});
}
// 保存监控卡片信息
function saveFocusCard(userName,cfData,port){
	Tool_getConn(userName,function(db){		
		var objectStore=db.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
		var pReq=objectStore.put(cfData);
		pReq.onsuccess = function(evt) {
			debug("保存监控卡片信息："+JSON.stringify(evt.target.result));
		}
	});
}
// 删除监控卡片信息
function delFocusCard(userName,cardId,port){
	Tool_getConn(userName,function(db){	
		var objectStore=db.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
		var request = objectStore.delete(cardId);
		request.onsuccess = function(evt) {
			debug("删除监控卡片信息："+cardId);
		}
	});
}
function checkFocusCard(userName,cardId,port){
	Tool_getConn(userName,function(db){	
		var objectStore=db.transaction([DB_OS_CF], "readwrite").objectStore(DB_OS_CF);
		var request = objectStore.get(cardId);
		request.onsuccess = function(evt) {
			debug("查找监控卡片信息："+cardId);
			if(evt.target.result){			
				port.postMessage({"cmd":"bg.checkFocusCard.rs","data":true,"id":cardId});
			}else{
				port.postMessage({"cmd":"bg.checkFocusCard.rs","data":false,"id":cardId});
			}
		}
	});
}
/********************** 通道消息 处理区**********************/
function handlePort_modCraftProcess(port){	
	if(port.name == "BG#"+MN_CF){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.loadFocusCard"){
				loadFocusCard(msg.un,port);			
			}
			if (msg.cmd == "bg.saveFocusCard"){
				saveFocusCard(msg.un,msg.data,port);
			}	
			if (msg.cmd == "bg.delFocusCard"){
				delFocusCard(msg.un,msg.id,port);
			}
			if (msg.cmd == "bg.checkFocusCard"){
				checkFocusCard(msg.un,msg.id,port);
			}			
		});
	}
}
/********************** 自动执行区**********************/
var MN_CF="mod_craftFocus";
var DB_OS_CF=MOD_DEF[MN_CF].data[0];

chrome.runtime.onConnect.addListener(handlePort_modCraftProcess);
log("load bg_mod_craftFocus.js done");