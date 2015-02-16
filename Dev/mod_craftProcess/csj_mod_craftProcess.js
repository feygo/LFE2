log("load csj_mod_craftProcess.js");

function getCardNum(craftId,port){			
	var objectStore=DB_CP.transaction([DB_OS_CP], "readonly").objectStore(DB_OS_CP);
	var request = objectStore.get(craftId);
	request.onsuccess = function(evt) {
		var cpData=evt.currentTarget.result;
		if(cpData){
			port.postMessage({"cmd":"getCardNum.rs","data":cpData.num,"id":cpData.craftId});
		}else{
			port.postMessage({"cmd":"getCardNum.rs","data":-1,"id":craftId});
		}
	}
}
/************************ 数据预备区 **********************/
var DB_OS_CP;
var DB_CP;
function success_DB_CP(db){
	DB_OS_CP = DC[CP_N][0];
	DB_CP = db;
}
/********************** 通道消息 处理区**********************/
function handlePort_modCraftProcess(port){	
	if(port.name == CP_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "getCardNum"){
				// craftId
				getCardNum(msg.id,port);
			}		
		});
	}
}
/********************** 自动执行区**********************/
var CP_N="mod_craftProcess";
function csjLoad_mod_craftProcess(){
	chrome.runtime.onConnect.addListener(handlePort_modCraftProcess);
	Tool_connUserDB(success_DB_CP);
}
csjLoad_mod_craftProcess();
log("load csj_mod_craftProcess.js done");