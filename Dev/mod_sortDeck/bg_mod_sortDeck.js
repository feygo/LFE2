log("load bg_mod_sortDeck.js");

// 检查引擎规则的版本
function checkSortVer(userName,sortRuleVer,port){
	Tool_getConn(userName,function(db){
		// 检查引擎版本
		var trans=db.transaction([DB_OS_SortConf,DB_OS_Sort], "readwrite");
		var OS_SortConf=trans.objectStore(DB_OS_SortConf);
		var request = OS_SortConf.get(Key_SortVer);
		request.onsuccess = function(evt) {
			// 检查排序引擎版本
			var sortVer = request.result;
			if(sortVer==undefined||sortVer==null||sortVer["value"]!=sortRuleVer){
				//如果版本不存在，如果版本有更新，则更新版本
				var verUpdate = OS_SortConf.put({"key":Key_SortVer,"value":sortRuleVer});
				OS_SortConf.put({"key":Key_LocalCard,"value":{}});
				verUpdate.onsuccess = function(evt) {
					var msg="排序引擎版本更新:"+sortRuleVer;
					debug(msg);
					//清空排序引擎数据
					var OS_Sort=trans.objectStore(DB_OS_Sort);				
					var requestClear = OS_Sort.clear();
					requestClear.onerror = function(evt) {
						var msg="引擎数据清空出错:"+evt.target.error.message;
						debug(msg);
						port.postMessage({"cmd":"bg.checkSortVer.rs","stat":"error","data":msg});
					};	
					requestClear.onsuccess = function(evt) {
						var msg="引擎版本更新，引擎数据清空成功";
						debug(msg);
						// initSorter();
						// 载入排序引擎数据
						port.postMessage({"cmd":"bg.checkSortVer.rs","stat":"success","data":msg});
					}
				}
				verUpdate.onerror =function(evt){
					var msg="排序引擎版本更新出错:"+evt.target.error.message;
					debug(msg);
					port.postMessage({"cmd":"bg.checkSortVer.rs","stat":"error","data":msg});
				}
			}else{
				// 如果存在版本，则载入引擎数据
				port.postMessage({"cmd":"bg.checkSortVer.rs","stat":"success","data":"checkSortVer done"});
			}		
		}
		request.onerror =function(evt){
			var msg="排序引擎版本读取出错:"+evt.target.error.message;
			debug(msg);
			port.postMessage({"cmd":"bg.checkSortVer.rs","stat":"error","data":msg});
		}	
	});

}
// 将sortConfig中的配置项，写入到db中
function initSorter(){
	// 初始化引擎数据
	var OS_Sort=DB_SortDeck.transaction([DB_OS_Sort], "readwrite").objectStore(DB_OS_Sort);	
	for(var i=0;i<sortConfig.length;i++){	
		var reqInit=OS_Sort.add({"id":sortConfig[i].id,"data":[]});
		reqInit.onsuccess = function(evt) {
			debug("引擎数据初始化:"+evt.target.result);
		}
		reqInit.onerror = function(evt) {
			debug("引擎数据初始化出错:"+evt.target.error.message);
		};	
	}	
}
// 获取引擎数据
function getSortData(userName,dataId,port){
	Tool_getConn(userName,function(db){
		var OS_Sort=db.transaction([DB_OS_Sort], "readonly").objectStore(DB_OS_Sort);	
		var reqData = OS_Sort.get(dataId);
		reqData.onerror = function(evt) {
			var msg="引擎数据读取出错:"+evt.target.error.message;
			debug(msg);
			port.postMessage({"cmd":"bg.getSortData.rs","stat":"error","data":msg});
		};	
		reqData.onsuccess = function(evt) {
			var sortData=evt.target.result;
			if(sortData){
				port.postMessage({"cmd":"bg.getSortData.rs","stat":"success","id":dataId,"data":sortData.data});
			}else{
				port.postMessage({"cmd":"bg.getSortData.rs","stat":"success","id":dataId,"data":[]});					
			}
		}
	});
}
// 写入引起数据
function setSortData(userName,sortData){
	Tool_getConn(userName,function(db){
		var OS_Sort=db.transaction([DB_OS_Sort], "readwrite").objectStore(DB_OS_Sort);	
		var reqData = OS_Sort.put(sortData);
		reqData.onerror = function(evt) {
			var msg="引擎数据保存出错:"+evt.target.error.message;
			debug(msg);
		};
		reqData.onsuccess = function(evt) {
			debug("引擎数据保存:"+JSON.stringify(evt.target.result));
		}		
	});
}
// 获取本地卡片数据
function getLocalCard(userName,port){
	Tool_getConn(userName,function(db){
		var OS_SortConf=db.transaction([DB_OS_SortConf], "readonly").objectStore(DB_OS_SortConf);	
		var reqData = OS_SortConf.get(Key_LocalCard);
		reqData.onerror = function(evt) {
			var msg="本地卡片数据读取出错:"+evt.target.error.message
			debug(msg);
			port.postMessage({"cmd":"bg.getLocalCard.rs","stat":"error","data":msg});
		};	
		reqData.onsuccess = function(evt) {
			var data=evt.target.result;
			if(data){
				port.postMessage({"cmd":"bg.getLocalCard.rs","stat":"success","data":data.value});
			}else{
				port.postMessage({"cmd":"bg.getLocalCard.rs","stat":"success","data":{}});					
			}
		}
	});
}
// 写入本地卡片数据
function setLocalCard(userName,lcData){
	Tool_getConn(userName,function(db){
		var OS_SortConf=db.transaction([DB_OS_SortConf], "readwrite").objectStore(DB_OS_SortConf);
		var data={"key":Key_LocalCard,"value":lcData};
		var reqData = OS_SortConf.put(data);
		reqData.onerror = function(evt) {
			var msg="本地卡片数据保存出错:"+evt.target.error.message
			debug(msg);
		};	
		reqData.onsuccess = function(evt) {
			debug("本地卡片数据保存:"+JSON.stringify(evt.target.result));
		}
	});
}
/********************** 通道消息 处理区**********************/
function handlePort_modSortDeck(port){	
	if(port.name == "BG#"+MN_SDeck){
		port.onMessage.addListener(function(msg) {
			debug("BG收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.getSortData"){
				getSortData(msg.un,msg.id,port);			
			}
			if (msg.cmd == "bg.setSortData"){
				setSortData(msg.un,msg.data);	
			}
			if (msg.cmd == "bg.checkSortVer"){
				checkSortVer(msg.un,msg.data,port);	
			}
			if (msg.cmd == "bg.getLocalCard"){
				getLocalCard(msg.un,port);	
			}
			if (msg.cmd == "bg.setLocalCard"){
				setLocalCard(msg.un,msg.data);	
			}
		});
	}
}
/********************** 自动执行区**********************/
var MN_SDeck="mod_sortDeck";

var DB_OS_Sort=MOD_DEF[MN_SDeck].data[0];
var DB_OS_SortConf=MOD_DEF[MN_SDeck].data[1];
// {"key":DB_OS_SortConf,"value":}
const Key_SortVer="SortVer";
const Key_LocalCard="LocalCard";

chrome.runtime.onConnect.addListener(handlePort_modSortDeck);
log("load bg_mod_sortDeck.js done");