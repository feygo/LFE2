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
    var request =objectStore.get(USER_NAME);
	request.onsuccess = function(evt) {		
		var rs = request.result;
		if(rs){
			rs.note=rec;
			var requestUpdate = objectStore.put(rs);
			requestUpdate.onerror = function(event) {
				debug("updateRec:"+evt.target.error.message);
			};	
			requestUpdate.onsuccess = function(evt) {
				debug("updateRec:"+JSON.stringify(rs));
			}
		}else{
			var requestUpdate = objectStore.add(note);
			requestUpdate.onerror = function(event) {
				debug("addRec:"+evt.target.error.message);
			};	
			requestUpdate.onsuccess = function(evt) {
				debug("addRec:"+JSON.stringify(note));
			}
		}
	};
	request.onerror = function (evt) {
		debug("getRec:"+evt.target.error.message);
	};
}
/************************ 数据预备区 **********************/
// {user:"",note:""}
const DB_OS_Note = USER_NAME+"#note";
const DB_NAME_Note = 'LFE2#Mod#Note';

var DB_Note;

function update_DB_Note(evt){
	evt.currentTarget.result.createObjectStore(DB_OS_Note, { keyPath: "user" });
}

function success_DB_Note(evt){
	DB_Note = evt.currentTarget.result;
}
/********************** 通道消息 处理区**********************/
function handlePort_modNote(port){	
	if(port.name == "mod_note"){
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
function csjLoad_mod_note(){
	chrome.runtime.onConnect.addListener(handlePort_modNote);
	Tool_getDB(DB_NAME_Note,[DB_OS_Note],update_DB_Note,success_DB_Note);
}
csjLoad_mod_note();
// Tool_delDB(DB_NAME_Note);

log("load csj_mod_note.js done");
