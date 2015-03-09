log("load bg_mod_multDeck.js");

/***********************************存储服务 功能区******************************************/
// 存储
function save(userName,osName,data,port){
	Tool_getConn(userName,function(db){
		var objectStore=db.transaction([osName], "readwrite").objectStore(osName);
		var requestUpdate = objectStore.put(data);
		requestUpdate.onsuccess = function(evt) {
			port.postMessage({"cmd":"ds.save.rs","stat":"success"});
		}
		requestUpdate.onerror = function(evt) {
			error(evt);
			port.postMessage({"cmd":"ds.save.rs","stat":"error","data":evt.target.error.message});
		};			
	});	
}
// 读取
function get(userName,osName,id,port){
	Tool_getConn(userName,function(db){
		var request = db.transaction([osName], "readonly").objectStore(osName).get(id);
		request.onsuccess = function(evt) {	
			var data=evt.currentTarget.result;
			if(data){
				port.postMessage({"cmd":"ds.get.rs","stat":"success","data":data});				
			}else{
				port.postMessage({"cmd":"ds.get.rs","stat":"error","data":null});
			}
		};
		request.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"ds.get.rs","stat":"error","data":evt.target.error.message});
		}	
	});
}
// 删除
function del(userName,osName,id,port){
	Tool_getConn(userName,function(db){
		// 从db中读取卡组信息
		var request = db.transaction([osName], "readwrite").objectStore(osName).delete(id);
		request.onsuccess = function(evt) {	
			port.postMessage({"cmd":"ds.del.rs","stat":"success","data":id});
		};
		request.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"ds.del.rs","stat":"error","data":evt.target.error.message});
		}		
	});
}
// 查询
function list(userName,osName,port){
	Tool_getConn(userName,function(db){
		var tmpList=[];
		var objectStore = db.transaction(osName).objectStore(osName);
		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				tmpList.push(cursor.key);
				cursor.continue();
			}else {
				port.postMessage({"cmd":"bg.loadList.rs","stat":"success","data":tmpList});
			}
		};
		objectStore.openCursor().onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.loadList.rs","stat":"error","data":evt.target.error.message});
		}		
	});
}

/***********************************多卡组  功能区  结束******************************************/

/********************** 通道消息 处理区**********************/
/**
"cmd":"loadDeck","data":slt.value
**/
function handlePort_modMultDeck(port){	
	if(port.name == "BG#"+MN_MDeck){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
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
var MN_MDeck="mod_multDeck";
var DB_OS_Gear= MOD_DEF[MN_MDeck].data[0];

chrome.runtime.onConnect.addListener(handlePort_modMultDeck);

log("load bg_mod_multDeck.js done");