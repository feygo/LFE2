console.log("load bg_data.js");
/*********************************************************************/
/**                         bg框架操作区                            **/
/*********************************************************************/
/********************数据库区***************************/
// 数据库名称
const DB_NAME = 'LFE2#DB';
/******************数据对象区***************************/
// 对象结构
const DB_OS_CITY_PVP = "city#pvp";
const DB_OS_SHOP_ALL = "shop#all";
const DB_OS_SHOP_ITEM = "shop#item";
const DB_OS_SHOP_CARD = "shop#card";
const DB_OS_CRAFT_ITEM = "craft#item";

var db_osList=[DB_OS_CITY_PVP,DB_OS_SHOP_ALL,DB_OS_SHOP_ITEM,DB_OS_SHOP_CARD,DB_OS_CRAFT_ITEM];
/*******************数据库 链接区 **********************/
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

/*********************************************************************/
/**                         Mod模块操作区                           **/
/*********************************************************************/
/**********************Mod 数据库链接区***************************/
//  获取数据库连接的方法
var DB_NAME_PRE="LFE2#";
function Tool_connUserDB(userName,succFunc) {
	if(userName==""){
		error("没有获得到用户名称，无法获得数据库连接");
		return null;
	}else{
		var dbName=DB_NAME_PRE+userName;
		Tool_connDB(dbName,VERSION,modUpdate,succFunc);
	}
}
// 根据db名称、os名称获取数据库连接，正常情况
function Tool_connDB(dbName,version,updateFunc,succFunc) {
	if (!window.indexedDB) {
		alert("你的浏览器不支持IndexedDB，插件数据无法保存，请更新最新的chrome浏览器！");
		return;
	}
	debug("准备连接数据库："+dbName);
	var req = window.indexedDB.open(dbName,version);
	req.onsuccess = function (evt) {
		var DB = this.result;		
		debug("成功连接数据库："+dbName);		
		succFunc(DB);
	};
	req.onerror = function (evt) {
		error("连接数据库出错:"+evt.target.error.message);
	};
	req.onupgradeneeded = function (evt) {		
		updateFunc(evt)
	};
}
/**********************Mod 连接池区***************************/
var DB_POOL={}
function Tool_getConn(userName,succFunc){
	if(DB_POOL[userName]!=undefined){
		succFunc(DB_POOL[userName]);
	}else{
		Tool_connUserDB(userName,function(db){
			DB_POOL[userName]=db;
			succFunc(db);
			debug(DB_POOL);
		})
	}
}
/**********************Mod 数据结构 定义区***************************/
var VERSION=1;
function modUpdate(evt){
	var db = evt.currentTarget.result;
	// debug(db);
	if(MOD_DEF["mod_gather"].data!=undefined){
		// Version 1 is the first version of the database.
		if (evt.oldVersion < 1) {
			// {"rs":"","wp":"","zd":"","jn":"","note":"陌上开花缓缓归。"},
			db.createObjectStore(MOD_DEF["mod_gather"].data[0], { autoIncrement: true });
			debug("更新mod_gather数据结构");		
		}
	}
	if(MOD_DEF["mod_note"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {user:"",note:""}
			db.createObjectStore(MOD_DEF["mod_note"].data[0], { keyPath: "user" });
			debug("更新mod_note数据结构");	
		}
	}
	if(MOD_DEF["mod_multDeck"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {"gearName":gn,"userCost":uc,"userSpi":us,"deckInfo":diList};
			db.createObjectStore(MOD_DEF["mod_multDeck"].data[0], { keyPath: "gearName" });
			debug("更新mod_multDeck数据结构");	
		}
	}
	if(MOD_DEF["mod_sortDeck"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {"id":gn,"data":uc};
			db.createObjectStore(MOD_DEF["mod_sortDeck"].data[0], { keyPath: "id" });
			// {"key":gn,"value":uc};
			db.createObjectStore(MOD_DEF["mod_sortDeck"].data[1], { keyPath: "key" });
			debug("更新mod_sortDeck数据结构");	
		}
	}
	if(MOD_DEF["mod_train"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {"rs":"","jq":"","jy":"","jn":"","note":""};
			db.createObjectStore(MOD_DEF["mod_train"].data[0], { autoIncrement: true });
			debug("更新mod_train数据结构");		
		}
	}
	if(MOD_DEF["mod_lessFiveCard"].data!=undefined){
		if (evt.oldVersion < 1) {
			// 
			db.createObjectStore(MOD_DEF["mod_lessFiveCard"].data[0], { keyPath: "cardId" });
			debug("更新mod_lessFiveCard数据结构");		
		}
	}
	if(MOD_DEF["mod_craftProcess"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {"craftId":"","cardId":"","shopId":"","num":0};
			db.createObjectStore(MOD_DEF["mod_craftProcess"].data[0], { keyPath: "craftId" });
			debug("更新mod_craftProcess数据结构");	
		}
		if(evt.oldVersion < 2){
			db.deleteObjectStore(MOD_DEF["mod_craftProcess"].data[0]);
			// {"cardId":"","shopId":"","num":0};
			db.createObjectStore(MOD_DEF["mod_craftProcess"].data[0], { keyPath: "cardId" });
			debug("更新mod_craftProcess数据结构<2");	
		}			
	}
	if(MOD_DEF["mod_craftFocus"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {"cardId":"","cardName":"","num":0};
			db.createObjectStore(MOD_DEF["mod_craftFocus"].data[0], { keyPath: "cardId" });
			debug("更新mod_craftFocus数据结构");		
		}
	}
	if(MOD_DEF["mod_invFocus"].data!=undefined){
		if (evt.oldVersion < 1) {
			// {"itemId":"","itemName":"","norNum:":0,"lootNum:":0}
			db.createObjectStore(MOD_DEF["mod_invFocus"].data[0], { keyPath: "itemId" });
			debug("更新mod_invFocus数据结构");		
		}
	}
}

/*********************************************************************/
/**                      数据库 维护功能区                          **/
/*********************************************************************/
// 删除数据库
function Tool_delDB(dbName){
	var delReq=window.indexedDB.deleteDatabase(dbName);
	delReq.onsuccess=function(e){
		debug("删除数据库："+dbName);
	}
	delReq.onerror=function(e){
		error("删除数据库出错："+e.target.error.message);
		error(e);
	}	
}
// 删除数据中的数据对象
function Tool_delOS(dbName,osName){
	var verReq=window.indexedDB.open(dbName);
	debug("准备删除数据对象，连接："+dbName);	
	verReq.onsuccess = function (evt) {
		var vdb = this.result;
		if(vdb.objectStoreNames.contains(osName)){
			var newVer=vdb.version+1;
			vdb.close();
			var delReq=window.indexedDB.open(dbName,newVer);
			delReq.onupgradeneeded = function (evt) {		
				evt.currentTarget.result.deleteObjectStore(osName);
				debug("删除数据对象："+osName);
			};
			delReq.onsuccess = function (evt) {
				evt.currentTarget.result.close();
			}
		}else{
			debug("不存在该对象："+osName);
			vdb.close();
		}		
	}
}
// 清空数据对象中的数据
function Tool_clsOS(dbName,osName){
	var req=window.indexedDB.open(dbName);
	debug("clsOS方法-连接数据库："+dbName);	
	req.onsuccess = function (evt) {
		var db = this.result;
		var objectStore=db.transaction([osName], "readwrite").objectStore(osName);
		var clsReq=objectStore.clear();
		clsReq.onsuccess = function (evt) {
			debug("清空数据对象："+osName);
			db.close();
		}	
	}
}
/*******************数据库 维护功能区*******************/

// Tool_delDB(DB_NAME);

console.log("load bg_data.js done");