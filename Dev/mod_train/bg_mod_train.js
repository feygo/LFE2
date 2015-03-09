log("load bg_mod_train.js");

function loadTrn(userName,port){
	Tool_getConn(userName,function(db){
		var trnrsList=[];
		var objectStore = db.transaction([DB_OS_TRNRS], "readonly").objectStore(DB_OS_TRNRS);
		objectStore.openCursor().onsuccess = function(evt) {
			var cursor = evt.target.result;
			if (cursor) {
				trnrsList.push(cursor.value);
				cursor.continue();
			}else {
				if(trnrsList.length==0){
					var nullR={"rs":"","jq":"","jy":"","jn":"","note":"无上次训练的数据"};
					trnrsList.push(nullR);
				}
				debug("读取训练信息成功！");
				port.postMessage({"cmd":"bg.loadTrn.rs","stat":"success","data":trnrsList});
			}
		};		
	});
}
function clsTrn(userName,port){
	Tool_getConn(userName,function(db){
		var reqClear = db.transaction([DB_OS_TRNRS], "readwrite").objectStore(DB_OS_TRNRS).clear();
		reqClear.onsuccess=function(evt){
			port.postMessage({"cmd":"bg.clsTrn.rs","stat":"success"});
		};
		reqClear.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.clsTrn.rs","stat":"error","data":evt.target.error.message});
		}			
	});
}
function saveTrn(userName,trnData){
	Tool_getConn(userName,function(db){
		var reqAdd = db.transaction([DB_OS_TRNRS], "readwrite").objectStore(DB_OS_TRNRS).add(trnData);
		reqAdd.onerror =function(evt){
			error(evt);
		}			
	});
}
/********************** 通道消息 处理区**********************/
function handlePort_modTrn(port){	
	if(port.name == "BG#"+MN_TRN){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.loadTrn"){
				loadTrn(msg.un,port);
			}
			if (msg.cmd == "bg.saveTrn"){
				saveTrn(msg.un,msg.data);
			}
			if (msg.cmd == "bg.clsTrn"){
				clsTrn(msg.un,port);
			}
		});
	}
}
/********************** 自动执行区**********************/
var MN_TRN="mod_train";
var DB_OS_TRNRS=MOD_DEF[MN_TRN].data[0];

chrome.runtime.onConnect.addListener(handlePort_modTrn);

log("load bg_mod_train.js done");