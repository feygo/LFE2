log("load csj_mod_craftProcess.js");

function getCardNum(cardId,shopId,port){			
	var objectStore=DB_CP.transaction([DB_OS_CP], "readwrite").objectStore(DB_OS_CP);
	var request = objectStore.get(cardId);
	request.onsuccess = function(evt) {
		var cpData=evt.currentTarget.result;
		if(cpData){
			if(cpData.shopId==""){
				cpData.shopId=shopId;
				objectStore.put(cpData);
			}
			port.postMessage({"cmd":"getCardNum.rs","data":cpData.num,"shopId":shopId,"id":cpData.cardId});
		}else{
			port.postMessage({"cmd":"getCardNum.rs","data":-1,"shopId":shopId,"id":cardId});
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
				// cardId
				getCardNum(msg.id,msg.shopId,port);
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