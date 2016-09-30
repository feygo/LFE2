log("load csj_mod_invFocus_ci.js");

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
		var port_bg=getBgPort(INVFOCUS_N);
		port_bg.postMessage({"cmd":"bg.storeItem","un":USER_NAME,"data":itemData});
	}
}
/********************** 自动执行区**********************/
var INVFOCUS_N="mod_invFocus";
function csjLoad_mod_invFocus_ci(){
	//清空原有数据
	var port_bg=getBgPort(INVFOCUS_N);
	port_bg.postMessage({"cmd":"bg.clsItem","un":USER_NAME});
	//写入新数据
	storeItem();
}
csjLoad_mod_invFocus_ci();

log("load csj_mod_invFocus_ci.js done");


