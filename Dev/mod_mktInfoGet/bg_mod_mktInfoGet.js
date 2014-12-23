log("load bg_mod_mktInfoGet.js");
/********************** 通道消息 处理区**********************/
/********************** 消息通讯区**********************/
function bg_mod_mktInfoGet_RequestListener(msg, sender, sendResponse) {		
	var lsMsg="";
	// 根据url载入指定的content脚本，设置popup页面
	if (msg.cmd == "updateShop"){
		saveShopAll(msg.data);		
	}else if(msg.cmd == "updateShopItem"){
		saveShopItem(msg.data);	
	}else if(msg.cmd == "updateShopCard"){
		saveShopCard(msg.data);	
	}else if(msg.cmd == "updateCraftItem"){
		saveCraftItem(msg.data);	
		// return true;
	}
}
// 保存商店销售的合成卡片物品
function saveCraftItem(obj){
	Tool_getDB([DB_OS_CRAFT_ITEM],function(evt){
		var db = evt.currentTarget.result;
		var objectStore=db.transaction([DB_OS_CRAFT_ITEM], "readwrite").objectStore(DB_OS_CRAFT_ITEM);
		var id=obj.cardId+"-"+obj.itemId;
		obj["craftId"]=id;
		var request = objectStore.get(id);
		request.onsuccess = function(evt) {
			var rs = request.result;
			if(rs){
				// {"craftId":"","itemId":"","itemName":"","reqNum":"","cardId":""}
				if(rs.itemName!=obj.itemName){alert(obj.itemName+"与"+rs.itemName+"不一致，itemId:"+obj.itemId);rs.itemName=obj.itemName;}
				if(rs.reqNum!=obj.reqNum){alert(obj.reqNum+"与"+rs.reqNum+"不一致，itemId:"+obj.itemId);rs.reqNum=obj.reqNum;}
				var requestUpdate = objectStore.put(rs);
				requestUpdate.onerror = function(event) {
					debug("合成物品商店信息更新出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("合成物品商店信息更新成功:"+JSON.stringify(obj));
					db.close();
				}
			}else{
				var requestUpdate = objectStore.add(obj);
				requestUpdate.onerror = function(event) {
					debug("合成物品商店信息保存出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("合成物品商店信息保持成功:"+JSON.stringify(obj));
					db.close();
				}
			}
			
		};
	});	
}
// 保存商店销售的卡片
function saveShopCard(obj){
	Tool_getDB([DB_OS_SHOP_CARD],function(evt){
		var db = evt.currentTarget.result;
		var objectStore=db.transaction([DB_OS_SHOP_CARD], "readwrite").objectStore(DB_OS_SHOP_CARD);
		var request = objectStore.get(obj.cardId);
		request.onsuccess = function(evt) {
			var rs = request.result;
			if(rs){
				// {"cardId":"","cardName":"","str":"","dex":"","ent":"","con":"","lv":"","shopId":"","cardCity":[]};
				if(rs.cardName!=obj.cardName){alert(obj.cardName+"与"+rs.cardName+"不一致，cardId:"+obj.cardId);rs.cardName=obj.cardName;}
				if(rs.str!=obj.str){alert(obj.str+"与"+rs.str+"不一致，cardId:"+obj.cardId);rs.str=obj.str;}
				if(rs.dex!=obj.dex){alert(obj.dex+"与"+rs.dex+"不一致，cardId:"+obj.cardId);rs.dex=obj.dex;}
				if(rs.ent!=obj.ent){alert(obj.ent+"与"+rs.ent+"不一致，cardId:"+obj.cardId);rs.ent=obj.ent;}
				if(rs.con!=obj.con){alert(obj.con+"与"+rs.con+"不一致，cardId:"+obj.cardId);rs.con=obj.con;}
				if(rs.lv!=obj.lv){alert(obj.lv+"与"+rs.lv+"不一致，cardId:"+obj.cardId);rs.lv=obj.lv;}
				if(rs.shopId!=obj.shopId){alert(obj.shopId+"与"+rs.shopId+"不一致，cardId:"+obj.cardId);rs.shopId=obj.shopId;}
				rs.cardCity=Tool_arrayQC(rs.cardCity.concat(obj.cardCity));
				var requestUpdate = objectStore.put(rs);
				requestUpdate.onerror = function(event) {
					debug("卡片商店信息更新出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("卡片商店信息更新成功:"+JSON.stringify(obj));
					db.close();
				}
			}else{
				var requestUpdate = objectStore.add(obj);
				requestUpdate.onerror = function(event) {
					debug("卡片商店信息保存出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("卡片商店信息保持成功:"+JSON.stringify(obj));
					db.close();
				}
			}
			
		};
	});	
}
// 保存商店销售的物品
function saveShopItem(obj){
	Tool_getDB([DB_OS_SHOP_ITEM],function(evt){
		var db = evt.currentTarget.result;
		var objectStore=db.transaction([DB_OS_SHOP_ITEM], "readwrite").objectStore(DB_OS_SHOP_ITEM);
		var request = objectStore.get(obj.itemId);
		request.onsuccess = function(evt) {
			var rs = request.result;
			if(rs){
				// {"itemId":itemId,"itemName":itemName,"shopId":[],"itemCity":[]};
				if(rs.itemName!=obj.itemName){alert(obj.itemName+"与"+rs.itemName+"不一致，itemId:"+obj.itemId);rs.itemName=obj.itemName;}
				rs.shopId=Tool_arrayQC(rs.shopId.concat(obj.shopId));
				rs.itemCity=Tool_arrayQC(rs.itemCity.concat(obj.itemCity));
				var requestUpdate = objectStore.put(rs);
				requestUpdate.onerror = function(event) {
					debug("物品商店信息更新出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("物品商店信息更新成功:"+JSON.stringify(obj));
					db.close();
				}
			}else{
				var requestUpdate = objectStore.add(obj);
				requestUpdate.onerror = function(event) {
					debug("物品商店信息保存出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("物品商店信息保持成功:"+JSON.stringify(obj));
					db.close();
				}
			}
			
		};
	});	
}
// 保存在市场界面的 商店信息
function saveShopAll(obj){	
	Tool_getDB([DB_OS_SHOP_ALL],function(evt){
		var db = evt.currentTarget.result;
		var objectStore=db.transaction([DB_OS_SHOP_ALL], "readwrite").objectStore(DB_OS_SHOP_ALL);
		var request = objectStore.get(obj.shopId);
		request.onsuccess = function(evt) {
			var rs = request.result;
			if(rs){
				if(rs.shopName!=obj.shopName){alert(obj.shopName+"与"+rs.shopName+"不一致，shopId:"+obj.shopId);rs.shopName=obj.shopName;}
				if(rs.shopType!=obj.shopType){alert(obj.shopType+"与"+rs.shopType+"不一致，shopId:"+obj.shopId);rs.shopType=obj.shopType;}
				if(rs.shopLv!=obj.shopLv){alert(obj.shopLv+"与"+rs.shopLv+"不一致，shopId:"+obj.shopId);rs.shopLv=obj.shopLv;}
				rs.shopCity=Tool_arrayQC(rs.shopCity.concat(obj.shopCity));
				var requestUpdate = objectStore.put(rs);
				requestUpdate.onerror = function(event) {
					debug("市场商店信息更新出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("市场商店信息更新成功:"+JSON.stringify(obj));
					db.close();
				}
			}else{
				var requestUpdate = objectStore.add(obj);
				requestUpdate.onerror = function(event) {
					debug("市场商店信息保存出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("市场商店信息保持成功:"+JSON.stringify(obj));
					db.close();
				}
			}
			
		};
	});
}

/********************** 自动执行区**********************/
RequestListener["bg_mod_mktInfoGet"]=bg_mod_mktInfoGet_RequestListener;

log("load bg_mod_mktInfoGet.js done");