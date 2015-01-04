log("load csj_mod_invFocus.js");

/*********************物品记录区*************************/
function getItemInfo(){
	getNorItemInfo();
	getLootItemInfo();
	debug(ItemData);
	for(itemId in ItemData){
		var os=DB_IF.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
		var requestUpdate=os.put(ItemData[itemId]);
		requestUpdate.onerror = function(evt) {
			debug("物品更新出错:"+evt.target.error.message);
		};
		requestUpdate.onsuccess = function(evt) {
			debug("物品更新成功:"+evt.target.result);
		};
	}
}
var ItemData={};
function setInfo(data,numStr){
	if(ItemData[data.itemId]){
		ItemData[data.itemId][numStr]=data[numStr];
	}else{
		ItemData[data.itemId]=data;
	}
}
// 获取物品信息
function getNorItemInfo(){
	var itemList=document.querySelectorAll("#normal_bag>div.realitem");
	debug("背包中的物品数量："+itemList.length);
	for(var i=0;i<itemList.length;i++){
		var item=itemList[i].querySelector("A.item.info");		
		var itemId=item.id.replace("item","");
		var itemData={}
		itemData.itemId=itemId;
		itemData.itemName=Tool_trim(item.innerText);
		var itemNumStr=itemList[i].querySelector("#item_nownum"+itemId);
		itemData.norNum=parseInt(itemNumStr.innerText);
		// 保存数据
		setInfo(itemData,"norNum");
	}
}
function getLootItemInfo(){
	var itemList=document.querySelectorAll("#looting_bag>div.realitem");
	debug("待拾取的物品数量："+itemList.length);
	
	for(var i=0;i<itemList.length;i++){
		var item=itemList[i].querySelector("A.item.info");
		var itemId=item.id.replace("item","");
		
		var itemData={}
		itemData["itemId"]=itemId;
		itemData["itemName"]=Tool_trim(item.innerText);
		var itemNumStr=itemList[i].querySelector("#looting_item_nownum"+itemId);
		itemData["lootNum"]=parseInt(itemNumStr.innerText);
		// 保存数据
		setInfo(itemData,"lootNum");
	}
}
// function getLootItemInfo(DB){
	// var itemList=document.querySelectorAll("#looting_bag>div.realitem");
	// debug("待拾取的物品数量："+itemList.length);
	
	// for(var i=0;i<itemList.length;i++){
		// var item=itemList[i].querySelector("A.item.info");
		// var itemId=item.id.replace("item","");
		// debug(itemId);
		// var objectStore=DB.transaction([DB_OS_IF], "readonly").objectStore(DB_OS_IF);
		// var request = objectStore.get(itemId);
		// request.onsuccess = function(evt) {
			// var data=evt.currentTarget.result;
			// debug(evt);
			// debug(data);
			// if(data){
				// data.lootNum=itemData.lootNum;
				// var os=DB.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
				// var requestUpdate=os.put(data);
				// requestUpdate.onerror = function(evt) {
					// debug("物品更新出错:"+evt.target.error.message);
				// };
				// requestUpdate.onsuccess = function(evt) {
					// debug("物品更新成功:"+evt.target.result);
				// };
			// }else{
				// var itemData={"itemId":"","itemName":"","norNum:":0,"lootNum:":0}
				// itemData["itemId"]=itemId;
				// itemData["itemName"]=Tool_trim(item.innerText);
				// var itemNumStr=document.querySelector("#looting_item_nownum"+itemId);
				// itemData["lootNum"]=parseInt(itemNumStr.innerText);
				
				// var os=DB.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
				// var requestUpdate=os.put(itemData);
				// requestUpdate.onerror = function(evt) {
					// debug("物品保存出错:"+evt.target.error.message);
				// };
				// requestUpdate.onsuccess = function(evt) {
					// debug("物品保存成功:"+evt.target.result);
				// };		
			// }
		// }
	// }
// }
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
	getItemInfo();
}
/********************** 自动执行区**********************/
function csjLoad_mod_invFocus(){
	Tool_getDB(DB_NAME_IF,[DB_OS_IF],update_DB_IF,success_DB_IF);
}
csjLoad_mod_invFocus();
log("load csj_mod_invFocus.js done");


