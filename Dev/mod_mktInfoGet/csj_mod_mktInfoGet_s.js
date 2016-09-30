log("load csj_mod_mktInfoGet_s.js");

// 获取物品商店信息
function getShopItem(shopId,frm){
	var drList=frm.querySelectorAll("nobr");
	for(var i=0;i<drList.length;i++){
		var itemName=Tool_trim(drList[i].innerText);
		var tmpId=drList[i].parentElement.id;
		var itemId=tmpId.replace("itemname","");
		var itemData={"itemId":itemId,"itemName":itemName,"shopId":[],"itemCity":[]};
		itemData.shopId.push(shopId);
		itemData.itemCity.push(USER_CITY);
		// debug(itemData);
		sendRequest({"msg":{"type":"bg_mod_mktInfoGet","cmd":"updateShopItem","data":itemData,"id":itemData.itemId}});	
	}	
}
// 获取卡片商店信息
function getShopCard(shopId,frm){
	var drList=frm.querySelectorAll("div.card_outframe");
	for(var i=0;i<drList.length;i++){
		var cardData=Tool_getCardByOutframe(Tool_getCardData(),drList[i]);
		cardData["shopId"]=shopId;	
		cardData["cardCity"]=[];
		cardData["cardCity"].push(USER_CITY);
		// debug(cardData);
		sendRequest({"msg":{"type":"bg_mod_mktInfoGet","cmd":"updateShopCard","data":cardData,"id":cardData.cardId}});	
		
		// 调用csj_mod_lessFiveCard_s.js文件中的不满5张的核查函数
		if(typeof(saveLessFiveByShop)=="function"){
			saveLessFiveByShop(cardData);
		}		
	}	
}

// 获取合成商店信息
function getShopCraft(shopId,frm){
	var drList=frm.querySelectorAll("div.content");
	for(var i=0;i<drList.length;i++){
		// 获取合成卡片信息
		var ofrm=drList[i].querySelector("center");
		if(ofrm!=null){
			var cardData=Tool_getCardByOutframe(Tool_getCardData(),ofrm);
			cardData["shopId"]=shopId;	
			cardData["cardCity"]=[];
			cardData["cardCity"].push(USER_CITY);
			sendRequest({"msg":{"type":"bg_mod_mktInfoGet","cmd":"updateShopCard","data":cardData,"id":cardData.cardId}});	
			
			// 调用csj_mod_lessFiveCard_s.js文件中的不满5张的核查函数
			if(typeof(saveLessFiveByShop)=="function"){
				saveLessFiveByShop(cardData);
			}
			
			// csj_mod_craftProcess_s.js文件中的卡片信息的记录函数
			if(typeof(saveCraftCardNum)=="function"){
				saveCraftCardNum(cardData);
			}
			
			// csj_mod_craftFocus_s.js文件中的卡片信息的记录函数
			// console.assert(setFocusCardAction==undefined);
			if(typeof(setFocusCardAction)=="function"){
				setFocusCardAction(cardData);
			}
			
			// 获取合成材料的信息
			var itemList=drList[i].querySelectorAll(".reqlist a");
			for(var j=0;j<itemList.length;j++){
				var itemCraft={"itemId":"","itemName":"","reqNum":"","cardId":""}
				itemCraft.cardId=cardData.cardId;
				itemCraft.itemId=itemList[j].id.replace("item","");
				// 因为发现存在卡片合成卡片的情况，所以做了特殊判断，但观察规则
				if(itemList[j].querySelector("nobr")){
					itemCraft.itemName=Tool_trim(itemList[j].querySelector("nobr").innerText);
				}else{
					itemCraft.itemName=Tool_trim(itemList[j].querySelector("span").innerText);
				}

				var tmpNum=itemList[j].nextSibling.nodeValue;
				itemCraft.reqNum=tmpNum.match(/\d+/gi)[0];
				// debug(itemCraft);
				sendRequest({"msg":{"type":"bg_mod_mktInfoGet","cmd":"updateCraftItem","data":itemCraft,"id":itemCraft.itemId}});	
			}
		}
	}
}

// 根据商店类型 来决定读取信息的方式
function getShopInfo(){
	var shopId=getShopIdByCP();
	var cf=document.querySelector("#craft_frame");
	if(cf){
		getShopCraft(shopId,cf);
	};
	var ibf=document.querySelector("#item_buying_frame");
	if(ibf){
		getShopItem(shopId,ibf);
	};
	var cbf=document.querySelector("#card_buying_frame");
	if(cbf){
		getShopCard(shopId,cbf);
	};
}
// 根据url获取shopId
function getShopIdByCP(){
	var cp=document.location.pathname;
	return cp.replace("/market/shop/id/","");
}
/********************** 自动执行区**********************/
function csjLoad_mod_mig_s(){
	getShopInfo();
}
csjLoad_mod_mig_s();

log("load csj_mod_mktInfoGet_s.js done");