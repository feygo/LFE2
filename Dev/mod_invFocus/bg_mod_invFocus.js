log("load bg_mod_invFocus.js");

/*********************物品记录区*************************/
// 清空现有数据
function clsItem(userName,port){
	Tool_getConn(userName,function(db){		
		var objectStore=db.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
		// 清空现有数据
		var clsReq=objectStore.clear();
		clsReq.onsuccess=function (evt){
			debug("物品清空成功:"+evt.target.readyState);
		}
		clsReq.onerror=function(evt){
			error("物品清空出错:"+evt.target.error.message);
		}
	});
}
// 读取物品信息
function getItem(userName,itemId,port){
	Tool_getConn(userName,function(db){		
		var objectStore=db.transaction([DB_OS_IF], "readonly").objectStore(DB_OS_IF);
		var requestGet=objectStore.get(itemId);
		requestGet.onerror = function(evt) {
			error("获得背包物品信息出错:"+evt.target.error.message);
		};
		requestGet.onsuccess = function(evt) {
			var item=evt.target.result;
			if(item){
				port.postMessage({"cmd":"bg.getItem.rs","stat":"success","id":itemId,"data":item});
				debug("获得背包物品信息:"+JSON.stringify(item));
			}else{
				port.postMessage({"cmd":"bg.getItem.rs","stat":"success","id":itemId,"data":null});
			}
		};
	});
}
// 存储物品信息
function storeItem(userName,itemData,port){
	Tool_getConn(userName,function(db){		
		var objectStore=db.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
		// debug(itemData);
		// debug("保存监控卡片信息："+JSON.stringify(evt.target.result));
		var requestUpdate=objectStore.put(itemData);
		requestUpdate.onerror = function(evt) {
			error("物品更新出错:"+evt.target.error.message);
		};
		requestUpdate.onsuccess = function(evt) {
			debug("物品更新成功:"+evt.target.result);
		};
	});
}
/********************** 通道消息 处理区**********************/
function handlePort_modInvFocus(port){	
	if(port.name == "BG#"+MN_IF){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.storeItem"){
				storeItem(msg.un,msg.data,port);			
			}	
			if (msg.cmd == "bg.clsItem"){
				clsItem(msg.un,port);			
			}	
			if (msg.cmd == "bg.getItem"){
				getItem(msg.un,msg.id,port);			
			}			
		});
	}
}
/********************** 自动执行区**********************/
var MN_IF="mod_invFocus";
var DB_OS_IF=MOD_DEF[MN_IF].data[0];

chrome.runtime.onConnect.addListener(handlePort_modInvFocus);
log("load bg_mod_invFocus.js done");


