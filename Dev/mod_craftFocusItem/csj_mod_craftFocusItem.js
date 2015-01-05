log("load csj_mod_craftFocusItem.js");

/*********************物品记录区*************************/
function getInvFocusItem(itemId,port){
	var os=DB_IF.transaction([DB_OS_IF], "readonly").objectStore(DB_OS_IF);
	var requestUpdate=os.get(itemId);
	requestUpdate.onerror = function(evt) {
		debug("获得背包物品信息出错:"+evt.target.error.message);
	};
	requestUpdate.onsuccess = function(evt) {
		var item=evt.target.result;
		if(item){
			var str="";
			if(item.norNum){
				str+=item.norNum+"+";
			}
			if(item.lootNum){
				str+=item.lootNum;
			}
			port.postMessage({"cmd":"get.rs","id":itemId,"data":str});
			debug("获得背包物品信息:"+JSON.stringify(item));
		}		
	};
}
/********************** 通道消息 处理区**********************/
function handlePort_modCraftFocusItem(port){	
	if(port.name == "mod_craftFocusItem"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "get"){
				getInvFocusItem(msg.id,port);
			}		
		});
	}
}
/************************ 数据预备区 **********************/
var DB_OS_IF = USER_NAME+"#invFocus";
var DB_NAME_IF = 'LFE2#Mod#invFocus';

var DB_IF;

function update_DB_IF(evt){
	// {"itemId":"","itemName":"","norNum:":0,"lootNum:":0}
	evt.currentTarget.result.createObjectStore(DB_OS_IF, { keyPath: "itemId" });
}
function success_DB_IF(evt){
	DB_IF = evt.currentTarget.result;
}
/********************** 自动执行区**********************/
function csjLoad_mod_craftFocusItem(){
	chrome.runtime.onConnect.addListener(handlePort_modCraftFocusItem);
	Tool_getDB(DB_NAME_IF,[DB_OS_IF],update_DB_IF,success_DB_IF);
}
csjLoad_mod_craftFocusItem();
log("load csj_mod_craftFocusItem.js done");


