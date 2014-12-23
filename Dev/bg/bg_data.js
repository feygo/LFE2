console.log("load bg_data.js");

/**********************数据库区***************************/
// 数据库名称
const DB_NAME = 'LFE2#DB';
/**********************数据对象区***************************/
// 对象结构
const DB_OS_CITY_PVP = "city#pvp";
const DB_OS_SHOP_ALL = "shop#all";
const DB_OS_SHOP_ITEM = "shop#item";
const DB_OS_SHOP_CARD = "shop#card";
const DB_OS_CRAFT_ITEM = "craft#item";

var db_osList=[DB_OS_CITY_PVP,DB_OS_SHOP_ALL,DB_OS_SHOP_ITEM,DB_OS_SHOP_CARD,DB_OS_CRAFT_ITEM];
/************************ 数据预备区 **********************/
function update_DB(evt){
	var udb=evt.currentTarget.result;
	
	if(!udb.objectStoreNames.contains(DB_OS_CITY_PVP)){
		// {city:city,pvp:pvp}
		debug("创建数据对象："+DB_OS_CITY_PVP);
		udb.createObjectStore(DB_OS_CITY_PVP, { keyPath: "city"});
	}
	if(!udb.objectStoreNames.contains(DB_OS_SHOP_ALL)){
		// {"shopType":"","shopId":"","shopName":"","shopLv":"","shopCity":[]};
		debug("创建数据对象："+DB_OS_SHOP_ALL);
		var shopAll=udb.createObjectStore(DB_OS_SHOP_ALL, { keyPath: "shopId"});
		shopAll.createIndex("name","shopName");
		shopAll.createIndex("type","shopType");
	}
	if(!udb.objectStoreNames.contains(DB_OS_SHOP_ITEM)){
		// {"itemId":itemId,"itemName":itemName,"shopId":[],"itemCity":[]};
		debug("创建数据对象："+DB_OS_SHOP_ITEM);
		udb.createObjectStore(DB_OS_SHOP_ITEM, { keyPath: "itemId"});
	}
	if(!udb.objectStoreNames.contains(DB_OS_SHOP_CARD)){
		// {"cardId":"","cardName":"","str":"","dex":"","ent":"","con":"","lv":"","shopId":"","cardCity":[]};
		debug("创建数据对象："+DB_OS_SHOP_CARD);
		var shopCard=udb.createObjectStore(DB_OS_SHOP_CARD, { keyPath: "cardId"});
		shopCard.createIndex("shopId","shopId");
	}
	if(!udb.objectStoreNames.contains(DB_OS_CRAFT_ITEM)){
		// {"craftId":"","itemId":"","itemName":"","reqNum":"","cardId":""}
		debug("创建数据对象："+DB_OS_CRAFT_ITEM);
		var craftItem=udb.createObjectStore(DB_OS_CRAFT_ITEM, { keyPath: "craftId"});
		craftItem.createIndex("cardId","cardId");
		craftItem.createIndex("itemId","itemId");
	}
}

function Tool_getDB(osList,success_DB){
	// 检测osList对象是否合法
	var cnt=0;
	for(var i=0;i<osList.length;i++){
		var os=osList[i];
		for(var j=0;j<db_osList.length;j++){
			if(db_osList[j]==os){
				cnt++;
			}
		}
	}
	// 如果合法，就获取数据库连接
	if(cnt==osList.length){
		Tool_getDB_ext(DB_NAME,osList,update_DB,success_DB);
	}else{
		debug(osList);
		alert("MOD模块数据操作非法！");
	}	
}

/**********************indexedb 功能区***************************/
function Tool_getDB_ext(DB_NAME,OS_List,updateFunc,succFunc) {
	if (!window.indexedDB) {
		alert("你的浏览器不支持IndexedDB，插件数据无法保存，请更新最新的chrome浏览器！")
	}
	debug("initDb "+DB_NAME+"...");
	var req = window.indexedDB.open(DB_NAME);
	req.onsuccess = function (evt) {
		var DB = this.result;
		// log(DB);
		// log(OS);
		var isUpdate=false;
		for(var i=0;i<OS_List.length;i++){
			if(!DB.objectStoreNames.contains(OS_List[i])){
				debug("核查OS对象："+OS_List[i]);
				isUpdate=true;
			}			
		}
		if(isUpdate){
			var newVer=DB.version+1;
			DB.close();
			var newreq=window.indexedDB.open(DB_NAME,newVer);
			debug("initDb "+DB_NAME+" update version:"+newVer);	
			newreq.onupgradeneeded = function (evt) {		
				updateFunc(evt);
				debug("initDb.onupgradeneeded");
			};
			newreq.onsuccess = function (evt) {
				DB = this.result;
				debug("initDb new "+DB_NAME+" DONE");
				succFunc(evt);
			}
			newreq.onerror = function (evt) {
				debug("initDb new error:"+evt.target.error.message);
			};
		}else{
			debug("initDb "+DB_NAME+" DONE");
			succFunc(evt);
		}
	};
	req.onerror = function (evt) {
		debug("initDb:"+evt.target.error.message);
	};

}
function Tool_delDB(DB_NAME){
	window.indexedDB.deleteDatabase(DB_NAME);
	debug("删除数据库"+DB_NAME);
}
function Tool_delOS(DB_OS_NAME){
	var verReq=window.indexedDB.open(DB_NAME);
	debug("initDb "+DB_NAME);	
	verReq.onsuccess = function (evt) {
		var vdb = this.result;
		if(vdb.objectStoreNames.contains(DB_OS_NAME)){
			var newVer=vdb.version+1;
			vdb.close();
			var delReq=window.indexedDB.open(DB_NAME,newVer);
			delReq.onupgradeneeded = function (evt) {		
				evt.currentTarget.result.deleteObjectStore(DB_OS_NAME);
				debug("删除数据对象："+DB_OS_NAME);
			};
			delReq.onsuccess = function (evt) {
				evt.currentTarget.result.close();
			}
		}else{
			debug("不存在该对象："+DB_OS_NAME);
			vdb.close();
		}		
	}
}
function Tool_clsOS(DB_OS_NAME){
	var req=window.indexedDB.open(DB_NAME);
	debug("initDb "+DB_NAME);	
	req.onsuccess = function (evt) {
		var db = this.result;
		var objectStore=db.transaction([DB_OS_NAME], "readwrite").objectStore(DB_OS_NAME);
		var clsReq=objectStore.clear();
		clsReq.onsuccess = function (evt) {
			debug("清空数据对象："+DB_OS_NAME);
			db.close();
		}	
	}
}
// Tool_delDB(DB_NAME);

console.log("load bg_data.js done");