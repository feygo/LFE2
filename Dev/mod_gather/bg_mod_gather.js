log("load bg_mod_gather.js");

function loadGA(userName,port){
	Tool_getConn(userName,function(db){
		var garsList=[];
		var objectStore = db.transaction([DB_OS_GARS], "readonly").objectStore(DB_OS_GARS);
		objectStore.openCursor().onsuccess = function(evt) {
			var cursor = evt.target.result;
			if (cursor) {
				// debug(cursor);
				garsList.push(cursor.value);
				cursor.continue();
			}else {
				if(garsList.length==0){
					var nullR={"rs":"","wp":"","zd":"","jn":"","note":"无上次采集的数据"}
					garsList.push(nullR);					
				}
				debug("读取采集信息成功！");
				port.postMessage({"cmd":"bg.loadGA.rs","stat":"success","data":garsList});
			}
		};		
	});
}
function clsGA(userName,port){
	Tool_getConn(userName,function(db){
		var reqClear = db.transaction([DB_OS_GARS], "readwrite").objectStore(DB_OS_GARS).clear();
		reqClear.onsuccess=function(evt){
			port.postMessage({"cmd":"bg.clsGA.rs","stat":"success"});
		};
		reqClear.onerror =function(evt){
			error(evt);
			port.postMessage({"cmd":"bg.clsGA.rs","stat":"error","data":evt.target.error.message});
		}			
	});
	
}
function saveGA(userName,gaData){
	Tool_getConn(userName,function(db){
		var reqAdd = db.transaction([DB_OS_GARS], "readwrite").objectStore(DB_OS_GARS).add(gaData);
		reqAdd.onerror =function(evt){
			error(evt);
		}			
	});
	
}
/********************** 通道消息 处理区**********************/
function handlePort_modGA(port){	
	if(port.name == "BG#"+MN_GA){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.loadGA"){
				loadGA(msg.un,port);
			}
			if (msg.cmd == "bg.saveGA"){
				saveGA(msg.un,msg.data);
			}
			if (msg.cmd == "bg.clsGA"){
				clsGA(msg.un,port);
			}
		});
	}
}
/********************** 自动执行区**********************/
var MN_GA="mod_gather";
var DB_OS_GARS=MOD_DEF[MN_GA].data[0];

chrome.runtime.onConnect.addListener(handlePort_modGA);

log("load bg_mod_gather.js done");
