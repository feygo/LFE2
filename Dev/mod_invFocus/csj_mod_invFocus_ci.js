log("load csj_mod_invFocus.js");

/*********************物品记录区*************************/
function loadItemList(){
	var itemList=[];
	var list=document.querySelectorAll("div.realitem A.item.info");
	for(var i=0;i<list.length;i++){
		var itemId=list[i].id.replace("item","");
		var itemName=Tool_trim(list[i].innerText);
		itemList.push({"itemId":itemId,"itemName":itemName});
	}	
	return itemList;
}
function storeItem(){
	var itemList=loadItemList();
	var os=DB_IF_CI.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
	// 清空现有数据
	var clsReq=os.clear();
	clsReq.onsuccess=function (evt){
		debug("物品清空成功:"+evt.target.readyState);
	}
	clsReq.onerror=function(evt){
		error("物品清空出错:"+evt.target.error.message);
	}
	for(var i=0;i<itemList.length;i++){
		var itemData={};
		var itemId=itemList[i].itemId;
		itemData["itemId"]=itemId;
		itemData["itemName"]=itemList[i].itemName;
		var lootNumStr=document.querySelector("#looting_item_nownum"+itemId);
		if(lootNumStr){
			itemData["lootNum"]=parseInt(lootNumStr.innerText);		
		}
		var norNumStr=document.querySelector("#item_nownum"+itemId);
		if(norNumStr){
			itemData["norNum"]=parseInt(norNumStr.innerText);		
		}
		// debug(itemData);
		var requestUpdate=os.put(itemData);
		requestUpdate.onerror = function(evt) {
			error("物品更新出错:"+evt.target.error.message);
		};
		requestUpdate.onsuccess = function(evt) {
			debug("物品更新成功:"+evt.target.result);
		};
	}
}
/************************ 数据预备区 **********************/
var DB_OS_IF;
var DB_IF_CI;
function success_DB_IF_CI(db){
	DB_OS_IF = DC[INVFOCUS_N][0];
	DB_IF_CI = db;
	storeItem();
}
/********************** 自动执行区**********************/
var INVFOCUS_N="mod_invFocus";
function csjLoad_mod_invFocus_ci(){
	Tool_connUserDB(success_DB_IF_CI);
}
csjLoad_mod_invFocus_ci();
log("load csj_mod_invFocus_ci.js done");


