﻿log("load csj_mod_invFocus.js");

/*********************物品记录区*************************/
// 获取物品信息
function getNorItemInfo(){
	var itemList=document.querySelectorAll("#normal_bag>div.realitem");
	debug("背包中的物品数量："+itemList.length);
	for(var i=0;i<itemList.length;i++){
		var item=itemList[i].querySelector("A.item.info");
		var itemData={"itemId":"","itemName":"","norNum:":0,"lootNum:":0}
		var itemId=item.id.replace("item","");
		itemData["itemId"]=itemId;
		itemData["itemName"]=Tool_trim(item.innerText);
		var itemNumStr=itemList[i].querySelector("#item_nownum"+itemId);
		itemData["norNum"]=parseInt(itemNumStr.innerText);

		var objectStore=DB_IF.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
		var request = objectStore.get(itemId);
		request.onsuccess = function(evt) {
			var data=evt.currentTarget.result;
			if(data){
				data.norNum=itemData.norNum;
				objectStore.put(data);
			}else{
				objectStore.add(itemData);
			}
		}
	}
}
function getLootItemInfo(DB){
	var itemList=document.querySelectorAll("#looting_bag>div.realitem");
	debug("待拾取的物品数量："+itemList.length);
	
	for(var i=0;i<itemList.length;i++){
		var item=itemList[i].querySelector("A.item.info");
		var itemData={"itemId":"","itemName":"","norNum:":0,"lootNum:":0}
		var itemId=item.id.replace("item","");
		itemData["itemId"]=itemId;
		itemData["itemName"]=Tool_trim(item.innerText);
		var itemNumStr=itemList[i].querySelector("#looting_item_nownum"+itemId);
		itemData["lootNum"]=parseInt(itemNumStr.innerText);

		var objectStore=DB.transaction([DB_OS_IF], "readonly").objectStore(DB_OS_IF);
		var request = objectStore.get(itemId);
		request.onsuccess = function(evt) {
			var data=evt.currentTarget.result;
			debug(data);
			if(data){
				data.lootNum=itemData.lootNum;
				var os=DB.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
				var requestUpdate=os.put(data);
				requestUpdate.onerror = function(evt) {
					debug("物品更新出错:"+evt.target.error.message);
				};
				requestUpdate.onsuccess = function(evt) {
					debug("物品更新成功:"+evt.target.result);
				};
			}else{
				var os=DB.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
				var requestUpdate=os.put(itemData);
				requestUpdate.onerror = function(evt) {
					debug("物品保存出错:"+evt.target.error.message);
				};
				requestUpdate.onsuccess = function(evt) {
					debug("物品保存成功:"+evt.target.result);
				};		
			}
		}
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
	// DB_IF = evt.currentTarget.result;
	// getNorItemInfo();
	getLootItemInfo(evt.currentTarget.result);
}
/********************** 自动执行区**********************/
function csjLoad_mod_invFocus(){
	Tool_getDB(DB_NAME_IF,[DB_OS_IF],update_DB_IF,success_DB_IF);
}
csjLoad_mod_invFocus();
log("load csj_mod_invFocus.js done");


