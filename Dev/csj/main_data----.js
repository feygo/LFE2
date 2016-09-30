console.log("load main_data.js");
/**********************辅助功能区***************************/
// 检测MOD的配置，如果没有启用的mod会清空相应的数据对象
function checkIdleDB(){
	var msg={"msg":{"type":"bg_conf","cmd":"idleMod"},
			"func":function(msg){
					var idleDBList=msg.res;
					console.log("清空无用的数据对象："+idleDBList.length);
					var dbName=DB_NAME_PRE+USER_NAME;
					for(var i=0;i<idleDBList.length;i++){
						Tool_clsOS(dbName,idleDBList[i]);
					}
				}
			};
	sendRequest(msg);
}

/**** ModDB 缓存 在页面载入的时候初始化
// "mod_gather":{
	// "data":["LFE2#Mod#Gather"]
// },
*****/
var DC={}
function getDataConf(){
	// 如果没有，则向后台发起请求 获取配置
	var msg={"msg":{"type":"bg_conf","cmd":"dataConf"},
	"func":function(msg){
			var data=msg.res;				
			if(data){
				// 写入缓存
				DC=data;
				debug(DC);
				// 检查数据库
				checkIdleDB();
			}else{
				error("未获得数据库配置信息");
			}
		}
	};
	sendRequest(msg);
}
/**********************数据库操作区***************************/
//  获取数据库连接的方法
var DB_NAME_PRE="LFE2#";
function Tool_connUserDB(succFunc) {
	if(USER_NAME==""){
		error("没有获得到用户名称，无法获得数据库连接");
		return null;
	}else{
		var dbName=DB_NAME_PRE+USER_NAME;
		Tool_connDB(dbName,VERSION,succFunc);
	}
}
// 根据db名称、os名称获取数据库连接，正常情况
function Tool_connDB(DB_NAME,version,succFunc) {
	if (!window.indexedDB) {
		alert("你的浏览器不支持IndexedDB，插件数据无法保存，请更新最新的chrome浏览器！");
		return;
	}
	debug("准备连接数据库："+DB_NAME);
	var req = window.indexedDB.open(DB_NAME,version);
	req.onsuccess = function (evt) {
		var DB = this.result;		
		debug("成功连接数据库："+DB_NAME);		
		succFunc(DB);
	};
	req.onerror = function (evt) {
		error("连接数据库出错:"+evt.target.error.message);
	};
	req.onupgradeneeded = function (evt) {		
		upgrade(evt)
	};
}
// 删除数据库
function Tool_delDB(DB_NAME){
	var delReq=window.indexedDB.deleteDatabase(DB_NAME);
	delReq.onsuccess=function(e){
		debug("删除数据库："+DB_NAME);
		debug(e);
		// return e.target.readyState
	}
	delReq.onerror=function(e){
		error("删除数据库出错："+e.target.error.message);
	}	
}
// 删除数据中的数据对象
function Tool_delOS(DB_NAME,DB_OS_NAME){
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
function Tool_clsOS(DB_NAME,DB_OS_NAME){
	var req=window.indexedDB.open(DB_NAME);
	debug("clsOS方法-连接数据库："+DB_NAME);	
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
/**********************数据结构定义区***************************/
var VERSION=2;
function upgrade(evt){
	var db = evt.currentTarget.result;
	// debug(db);
	if(DC["mod_gather"]!=undefined){
		// Version 1 is the first version of the database.
		if (evt.oldVersion < 1) {
			// {"rs":"","wp":"","zd":"","jn":"","note":"陌上开花缓缓归。"},
			db.createObjectStore(DC["mod_gather"][0], { autoIncrement: true });
			debug("更新mod_gather数据结构");		
		}
	}
	if(DC["mod_note"]!=undefined){
		if (evt.oldVersion < 1) {
			// {user:"",note:""}
			db.createObjectStore(DC["mod_note"][0], { keyPath: "user" });
			debug("更新mod_note数据结构");	
		}
	}
	if(DC["mod_multDeck"]!=undefined){
		if (evt.oldVersion < 1) {
			// {"gearName":gn,"userCost":uc,"userSpi":us,"deckInfo":diList};
			db.createObjectStore(DC["mod_multDeck"][0], { keyPath: "gearName" });
			debug("更新mod_multDeck数据结构");	
		}
	}
	if(DC["mod_sortDeck"]!=undefined){
		if (evt.oldVersion < 1) {
			// {"id":gn,"data":uc};
			db.createObjectStore(DC["mod_sortDeck"][0], { keyPath: "id" });
			// {"key":gn,"value":uc};
			db.createObjectStore(DC["mod_sortDeck"][1], { keyPath: "key" });
			debug("更新mod_sortDeck数据结构");	
		}
	}
	if(DC["mod_train"]!=undefined){
		if (evt.oldVersion < 1) {
			// {"rs":"","jq":"","jy":"","jn":"","note":""};
			db.createObjectStore(DC["mod_train"][0], { autoIncrement: true });
			debug("更新mod_train数据结构");		
		}
	}
	if(DC["mod_lessFiveCard"]!=undefined){
		if (evt.oldVersion < 1) {
			// 
			db.createObjectStore(DC["mod_lessFiveCard"][0], { keyPath: "cardId" });
			debug("更新mod_lessFiveCard数据结构");		
		}
	}
	if(DC["mod_craftProcess"]!=undefined){
		if (evt.oldVersion < 1) {
			// {"craftId":"","cardId":"","shopId":"","num":0};
			db.createObjectStore(DC["mod_craftProcess"][0], { keyPath: "craftId" });
			debug("更新mod_craftProcess数据结构");	
		}
		if(evt.oldVersion < 2){
			db.deleteObjectStore(DC["mod_craftProcess"][0]);
			// {"cardId":"","shopId":"","num":0};
			db.createObjectStore(DC["mod_craftProcess"][0], { keyPath: "cardId" });
			debug("更新mod_craftProcess数据结构<2");	
		}			
	}
	if(DC["mod_craftFocus"]!=undefined){
		if (evt.oldVersion < 1) {
			// {"cardId":"","cardName":"","num":0};
			db.createObjectStore(DC["mod_craftFocus"][0], { keyPath: "cardId" });
			debug("更新mod_craftFocus数据结构");		
		}
	}
	if(DC["mod_invFocus"]!=undefined){
		if (evt.oldVersion < 1) {
			// {"itemId":"","itemName":"","norNum:":0,"lootNum:":0}
			db.createObjectStore(DC["mod_invFocus"][0], { keyPath: "itemId" });
			debug("更新mod_invFocus数据结构");		
		}
	}
}
/**********************消息服务区***************************/
function handlePort_main(port){	
	if(port.name == "MAIN_DATA"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "clsData"){
				clsData(msg.id);
			}else if (msg.cmd == "delDB"){
				Tool_delDB(DB_NAME_PRE+USER_NAME);
			}	
		});
	}
}
function clsData(modName){
	var dbName=DB_NAME_PRE+USER_NAME;
	for(var i=0;i<DC[modName].length;i++){
		Tool_clsOS(dbName,DC[modName][i]);
	}	
}

/**********************自动载入区***************************/
function loadMainData(){
	chrome.runtime.onConnect.addListener(handlePort_main);
	log("当前数据库版本为 "+VERSION);
	getDataConf();
	// checkIdleDB();
	// Tool_connModDB("mod_gather",function(){});
	// Tool_connModDB("mod_gather",function(){});
}
// Tool_delDB("LFE2#");
loadMainData();
console.log("load main_data.js done");