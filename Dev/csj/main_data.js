console.log("load main_data.js");
/**********************辅助功能区***************************/
// 检测MOD的配置，如果没有启用的mod会删除相应的数据库
function checkIdleDB(){
	var msg={"msg":{"type":"bg_conf","cmd":"idleDB"},
			"func":function(msg){
					var idleDBList=msg.res;
					console.log("清除无用的数据库："+idleDBList.length);
					for(var i=0;i<idleDBList.length;i++){
						Tool_delDB(idleDBList[i]);
					}
				}
			};
	sendRequest(msg);
}

/**** ModDB 缓存
// "mod_gather":{
	// "data":"LFE2#Mod#Gather",
	// "preOS":"#gatherRS",
	// "userOS":""
	// "version":1
// },
*****/
var DC={}
/**********************数据库操作区***************************/
// 根据ModName获取数据库连接，正常情况
function Tool_connModDB(modName,succFunc){
	// 检测本地缓存获取配置
	if(DC[modName]){
		Tool_connDB(DC[modName].data,DC[modName].version,succFunc)
	}else{
		// 如果没有，则向后台发起请求 获取配置
		var msg={"msg":{"type":"bg_conf","cmd":"DC","id":modName},
		"func":function(msg){
				var data=msg.res;				
				if(data){
					// 写入缓存
					if(data["preOS"]){
						data["userOS"]=USER_NAME+data["preOS"];
					}
					if(data["preOSList"]){
						var list=[];
						for(var i=0;i<data["preOSList"].length;i++){
							debug(data["preOSList"][i]);
							list.push(USER_NAME+data["preOSList"][i]);
						}
						data["userOS"]=list;
					}
					DC[modName]=data;
					debug(DC);
					// 连接数据库
					Tool_connDB(DC[modName].data,DC[modName].version,succFunc)
				}else{
					error("没有关于此mod的配置："+modName);
				}
			}
		};
		sendRequest(msg);
	}
	
}
// 根据db名称、os名称获取数据库连接，正常情况
function Tool_connDB(DB_NAME,version,succFunc) {
	if (!window.indexedDB) {
		alert("你的浏览器不支持IndexedDB，插件数据无法保存，请更新最新的chrome浏览器！")
	}
	debug("准备连接数据库"+DB_NAME);
	var req = window.indexedDB.open(DB_NAME,version);
	req.onsuccess = function (evt) {
		var DB = this.result;		
		debug("连接数据库 "+DB_NAME+" DONE");		
		succFunc(DB);
	};
	req.onerror = function (evt) {
		error("连接数据库出错:"+evt.target.error.message);
	};
	req.onupgradeneeded = function (evt) {		
		upgrade(evt)
	};
}

// 根据db名称、os名称获取数据库连接
function Tool_getDB(DB_NAME,OS_List,updateFunc,succFunc) {
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
				debug(OS_List[i]);
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
		}
		debug("initDb "+DB_NAME+" DONE");		
		succFunc(evt);
	};
	req.onerror = function (evt) {
		debug("initDb:"+evt.target.error.message);
	};

}
// 删除数据库
function Tool_delDB(DB_NAME){
	var delReq=window.indexedDB.deleteDatabase(DB_NAME);
	delReq.onsuccess=function(e){
		debug("删除数据库："+DB_NAME);
	}
	delReq.onerror=function(e){
		debug("删除数据库出错："+e.target.error.message);
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

/**********************数据结构定义区***************************/
function upgrade(evt){
	var db = evt.currentTarget.result;
	// debug(db);
	var dbName=db.name;
	if((DC["mod_gather"]!=undefined)&&(dbName==DC["mod_gather"].data)){
		// Version 1 is the first version of the database.
		if (evt.oldVersion < 1) {
			// {"rs":"","wp":"","zd":"","jn":"","note":"陌上开花缓缓归。"},
			db.createObjectStore(DC["mod_gather"].userOS, { autoIncrement: true });
		}
		debug("更新"+dbName+" DONE");		
	}else if((DC["mod_note"]!=undefined)&&(dbName==DC["mod_note"].data)){
		if (evt.oldVersion < 1) {
			// {user:"",note:""}
			db.createObjectStore(DC["mod_note"].userOS, { keyPath: "user" });
		}
		debug("更新"+dbName+" DONE");		
	}else if((DC["mod_multDeck"]!=undefined)&&(dbName==DC["mod_multDeck"].data)){
		if (evt.oldVersion < 1) {
			// {"gearName":gn,"userCost":uc,"userSpi":us,"deckInfo":diList};
			db.createObjectStore(DC["mod_multDeck"].userOS, { keyPath: "gearName" });
		}
		debug("更新"+dbName+" DONE");		
	}else if((DC["mod_sortDeck"]!=undefined)&&(dbName==DC["mod_sortDeck"].data)){
		if (evt.oldVersion < 1) {
			// {"id":gn,"data":uc};
			db.createObjectStore(DC["mod_sortDeck"].userOS[0], { keyPath: "id" });
			// {"key":gn,"value":uc};
			db.createObjectStore(DC["mod_sortDeck"].userOS[1], { keyPath: "key" });
		}
		debug("更新"+dbName+" DONE");		
	}else if((DC["mod_train"]!=undefined)&&(dbName==DC["mod_train"].data)){
		if (evt.oldVersion < 1) {
			// {"rs":"","jq":"","jy":"","jn":"","note":""};
			db.createObjectStore(DC["mod_train"].userOS, { autoIncrement: true });
		}
		debug("更新"+dbName+" DONE");		
	}else if((DC["mod_lessFiveCard"]!=undefined)&&(dbName==DC["mod_lessFiveCard"].data)){
		if (evt.oldVersion < 1) {
			// 
			db.createObjectStore(DC["mod_lessFiveCard"].userOS, { keyPath: "cardId" });
		}
		debug("更新"+dbName+" DONE");		
	}
	
	
}
/**********************自动载入区***************************/
function loadMainData(){
	checkIdleDB();
	// Tool_connModDB("mod_gather",function(){});
	// Tool_connModDB("mod_gather",function(){});
}
loadMainData();
console.log("load main_data.js done");