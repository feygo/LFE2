log("load bg_mod_mapShow.js");
/********************** 通道消息 处理区**********************/
/********************** 消息通讯区**********************/
function bg_mod_mapShow_RequestListener(msg, sender, sendResponse) {		
	var lsMsg="";
	if (msg.cmd == "getCityPVP"){
		getCityPVP(msg.id,sendResponse);	
		return true;
	}
}
// 获取城市的pvp信息
function getCityPVP(cityName,sendResponse){
	Tool_getDB([DB_OS_CITY_PVP],function(evt){
		var db = evt.currentTarget.result;
		var objectStore=db.transaction([DB_OS_CITY_PVP], "readonly").objectStore(DB_OS_CITY_PVP);
		var request = objectStore.get(cityName);
		request.onsuccess = function(evt) {
			var rs = request.result;
			if(rs){
				sendResponse({"res": rs.pvp});	
			}else{
				sendResponse({"res": "未知"});
			}			
		};
	});	
}

/********************** 自动执行区**********************/
RequestListener["bg_mod_mapShow"]=bg_mod_mapShow_RequestListener;

log("load bg_mod_mapShow.js done");