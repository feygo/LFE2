log("load bg_mod_cityInfoGet.js");
/********************** 通道消息 处理区**********************/
/********************** 消息通讯区**********************/
function bg_mod_cityInfoGet_RequestListener(msg, sender, sendResponse) {		
	var lsMsg="";
	// 根据url载入指定的content脚本，设置popup页面
	if (msg.cmd == "updatePVP"){
		var obj={"city":msg.id,"pvp":msg.data};
		saveCityPVP(obj);		
	}
}

function saveCityPVP(obj){	
	Tool_getDB([DB_OS_CITY_PVP],function(evt){
		var db = evt.currentTarget.result;
		var objectStore=db.transaction([DB_OS_CITY_PVP], "readwrite").objectStore(DB_OS_CITY_PVP);
		var request = objectStore.get(obj.city);
		request.onsuccess = function(evt) {
			var rs = request.result;
			if(rs){
				rs.pvp=obj.pvp;
				var requestUpdate = objectStore.put(rs);
				requestUpdate.onerror = function(event) {
					debug("城市信息更新出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("城市信息更新成功:"+JSON.stringify(obj));
					db.close();
				}
			}else{
				var requestUpdate = objectStore.add(obj);
				requestUpdate.onerror = function(event) {
					debug("城市信息保存出错:"+evt.target.error.message);
					db.close();
				};	
				requestUpdate.onsuccess = function(evt) {
					debug("城市信息保持成功:"+JSON.stringify(obj));
					db.close();
				}
			}
			
		};
	});
}

/********************** 自动执行区**********************/
RequestListener["bg_mod_cityInfoGet"]=bg_mod_cityInfoGet_RequestListener;

log("load bg_mod_cityInfoGet.js done");