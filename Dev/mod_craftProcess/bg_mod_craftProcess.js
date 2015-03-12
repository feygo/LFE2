log("load bg_mod_craftProcess.js");

// 根据cardId获取卡片数量，并且补充写入shopId
function getCardNum(userName,cardId,shopId,port){
	Tool_getConn(userName,function(db){			
		var objectStore=db.transaction([DB_OS_CP], "readwrite").objectStore(DB_OS_CP);
		var request = objectStore.get(cardId);
		request.onsuccess = function(evt) {
			var cpData=evt.currentTarget.result;
			if(cpData){
				if(cpData.shopId==undefined||cpData.shopId==""){
					cpData.shopId=shopId;
					var putReq=objectStore.put(cpData);
					putReq.onsuccess=function(evt){
						debug("合成卡片更新商店信息");
					}
				}
				port.postMessage({"cmd":"bg.getCardNum.rs","data":cpData.num,"shopId":shopId,"id":cpData.cardId});
			}else{
				port.postMessage({"cmd":"bg.getCardNum.rs","data":-1,"shopId":shopId,"id":cardId});
			}
		}
	});
}
// 保存合成卡片数据，如果存在并且有shopId，则只更新数量，否则全面更新
function saveCraftCard(userName,cardData,port){
	Tool_getConn(userName,function(db){			
		var objectStore=db.transaction([DB_OS_CP], "readwrite").objectStore(DB_OS_CP);
		var getReq = objectStore.get(cardData.cardId);
		getReq.onsuccess = function(evt) {
			var card=evt.currentTarget.result;
			// debug(card);
			if(card!=undefined&&card.shopId!=undefined){
				card.num=cardData.num;
				var putReq = objectStore.put(card);
				putReq.onsuccess = function(evt) {
					debug("更新合成卡片数量："+evt.target.result);
				}
			}else{
				var putReq = objectStore.put(cardData);
				putReq.onsuccess = function(evt) {
					debug("存储合成卡片信息："+evt.target.result);
				}
			}
		}
	});
}

/********************** 通道消息 处理区**********************/
function handlePort_modCraftProcess(port){	
	if(port.name == "BG#"+MN_CP){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.getCardNum"){
				getCardNum(msg.un,msg.id,msg.shopId,port);			
			}
			if (msg.cmd == "bg.saveCraftCard"){
				saveCraftCard(msg.un,msg.data,port);
			}		
		});
	}
}
/********************** 自动执行区**********************/
var MN_CP="mod_craftProcess";
var DB_OS_CP=MOD_DEF[MN_CP].data[0];

chrome.runtime.onConnect.addListener(handlePort_modCraftProcess);
log("load bg_mod_craftProcess.js done");