log("load csj_mod_note.js");

/********************** common记录功能操作区**********************/
function loadRec(port){
	var request = DB_Note.transaction([DB_OS_Note], "readonly")
                .objectStore(DB_OS_Note)
                .get(USER_NAME);
	request.onsuccess = function(evt){
		if(evt.target.result){
			port.postMessage({"cmd":"loaded","data":evt.target.result.note});
		}else{
			port.postMessage({"cmd":"loaded","data":""});
		}
		
	}
}
function saveRec(rec){
	//存储数据
	var note={"user":USER_NAME,"note":rec};
	var objectStore = DB_Note.transaction([DB_OS_Note], "readwrite").objectStore(DB_OS_Note);
	var requestUpdate = objectStore.put(note);
	requestUpdate.onerror = function(event) {
		error("更新记事本数据出错:"+evt.target.error.message);
	};	
}
/************************ 数据预备区 **********************/
var DB_OS_Note;
var DB_Note;
function success_DB_Note(db){
	DB_OS_Note = DC[NOTE_N].userOS;
	DB_Note = db;
}
/********************** 通道消息 处理区**********************/
function handlePort_modNote(port){	
	if(port.name == NOTE_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "loadRec"){
				loadRec(port);
			}else if (msg.cmd == "saveRec"){
				saveRec(msg.data);
			}
		});
	}
}
/********************** 自动执行区**********************/
var NOTE_N="mod_note";
function csjLoad_mod_note(){
	chrome.runtime.onConnect.addListener(handlePort_modNote);
	Tool_connModDB(NOTE_N,success_DB_Note);
}
csjLoad_mod_note();

log("load csj_mod_note.js done");
