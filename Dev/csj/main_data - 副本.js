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