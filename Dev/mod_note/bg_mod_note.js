log("load bg_mod_note.js");
// 存储记事本数据
function saveRecord(userName,note){
	//存储数据
	Tool_getConn(userName,function(db){
		var objectStore = db.transaction([DB_OS_Note], "readwrite").objectStore(DB_OS_Note);
		var requestUpdate = objectStore.put(note);
		requestUpdate.onerror = function(event) {
			error("更新记事本数据出错:"+evt.target.error.message);
		};			
	});
}
// 载入记事本数据
function loadRecord(userName,id,port){
	Tool_getConn(userName,function(db){
		var request = db.transaction([DB_OS_Note], "readonly").objectStore(DB_OS_Note).get(id);
		request.onsuccess = function(evt){
			var data=evt.target.result;
			if(data){
				debug(data);
				port.postMessage({"cmd":"bg.loadRecord.rs","stat":"success","data":data.note});
			}else{
				port.postMessage({"cmd":"bg.loadRecord.rs","stat":"success","data":""});
			}
		}		
	});
}

/********************** 通道消息 处理区**********************/
/**
"cmd":"loadDeck","data":slt.value
**/
function handlePort_modNote(port){	
	if(port.name == "BG#"+MN_Note){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.saveRecord"){
				saveRecord(msg.un,msg.data);			
			}
			if (msg.cmd == "bg.loadRecord"){
				loadRecord(msg.un,msg.id,port);
			}	
		});
	}
}
/**************自动执行区*********************/
var MN_Note="mod_note";
var DB_OS_Note = MOD_DEF[MN_Note].data[0];

chrome.runtime.onConnect.addListener(handlePort_modNote);
log("load bg_mod_note.js done");
