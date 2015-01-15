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
	var os=DB_IF.transaction([DB_OS_IF], "readwrite").objectStore(DB_OS_IF);
	// 清空现有数据
	var clsReq=os.clear();
	clsReq.onsuccess=function (evt){
		debug("物品清空成功:"+evt);
	}
	clsReq.onerror=function(evt){
		debug("物品清空出错:"+evt);
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
			debug("物品更新出错:"+evt.target.error.message);
		};
		requestUpdate.onsuccess = function(evt) {
			debug("物品更新成功:"+evt.target.result);
		};
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
	storeItem();
}
/********************** 自动执行区**********************/
function csjLoad_mod_invFocus(){
	Tool_getDB(DB_NAME_IF,[DB_OS_IF],update_DB_IF,success_DB_IF);
}
csjLoad_mod_invFocus();
log("load csj_mod_invFocus.js done");


