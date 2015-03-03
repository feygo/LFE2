log("load csj_mod_multDeck.js");

/***********************************多卡组  功能区  开始******************************************/
// 存储卡组
function saveDeck(userName,gearData,port){
	// // 获取页面数据	
	// var gn=getGearName();
	// var uc=getUserCost();
	// var us=getUserSpi();
	// var diList=getDeckInfo();	
	// // 组装成数据对象
	// var gearData={"gearName":gn,"userCost":uc,"userSpi":us,"deckInfo":diList};
	// 存储卡组到db
	Tool_connUserDB(userName,success_DB_MultDeck);
	var objectStore=DB_MultDeck.transaction([DB_OS_Gear], "readwrite").objectStore(DB_OS_Gear);
	var requestUpdate = objectStore.put(gearData);
	requestUpdate.onerror = function(evt) {
		error("卡组保存出错:"+evt.target.error.message);
	};	
	requestUpdate.onsuccess = function(evt) {
		var msg="卡组保存成功:"+gearData.gearName;
		debug(msg);
		port.postMessage({"cmd":"rs","data":msg});
	}
}
// 载入卡组
function loadDeck(gn,port){
	// 从db中读取卡组信息
	var request = DB_MultDeck.transaction([DB_OS_Gear], "readonly")
                .objectStore(DB_OS_Gear)
                .get(gn);
	request.onsuccess = function(evt) {	
		var gearData=evt.currentTarget.result;
		// 更新界面
		setGearName(gearData.gearName);
		setUserCost(gearData.userCost);
		setUserSpi(gearData.userSpi);
		setDeckInfo(gearData.deckInfo);
	
		var msg="卡组载入成功:"+gearData.gearName;
		debug(msg);
		port.postMessage({"cmd":"rs","data":msg});
	};
	request.onerror =function(evt){
		var msg="卡组载入出错:"+evt.target.error.message;
		error(msg);
		port.postMessage({"cmd":"rs","data":msg});
	}
}
// 删除卡组信息
function delDeck(gn,port){
	// 从db中读取卡组信息
	var request = DB_MultDeck.transaction([DB_OS_Gear], "readwrite")
                .objectStore(DB_OS_Gear)
                .delete(gn);
	request.onsuccess = function(evt) {	
		var msg="卡组删除成功:"+gn;
		debug(msg);
		port.postMessage({"cmd":"rs","data":msg});
	};
	request.onerror =function(evt){
		var msg="卡组删除出错:"+evt.target.error.message;
		error(msg);
		port.postMessage({"cmd":"rs","data":msg});
	}
}
// 卡组列表载入
function loadList(port){
	var gnList=[];
	var objectStore = DB_MultDeck.transaction(DB_OS_Gear).objectStore(DB_OS_Gear);
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			gnList.push(cursor.key);
			cursor.continue();
		}else {
			debug("卡组列表读取："+gnList);
			port.postMessage({"cmd":"loadList.rs","data":gnList});
		}
	};
	objectStore.openCursor().onerror =function(evt){
		var msg="卡组列表读取出错:"+evt.target.error.message;
		error(msg);
		port.postMessage({"cmd":"loadList.rs","data":msg});
	}
}

/************************ 界面操作功能区 **********************/
function getGearName(){
	var gr=document.getElementsByName("gear_rename");
	return gr[0].value;
}
function setGearName(name){
	var gr=document.getElementsByName("gear_rename");
	gr[0].value=name;
	var nn=document.getElementById("nowdeck_name");
	nn.innerText=name;
}
function getGearId(){
	var gid=document.getElementsByName("gear_rename_id");
	return gid[0].value;
}
function setGearId(id){
	var gid=document.getElementsByName("gear_rename_id");
	gid[0].value=id;
	var sgid=document.getElementsByName("sel_gearid");
	sgid[0].value=id;
}
function getUserCost(){
	var tmp=document.getElementById("deck_used_cost");
	return tmp.innerText;
}
function setUserCost(cnt){
	var tmp=document.getElementById("deck_used_cost");
	tmp.innerText=cnt;
}
function getUserSpi(){
	var tmp=document.getElementById("deck_used_spi");
	return tmp.innerText;
}
function setUserSpi(cnt){
	var tmp=document.getElementById("deck_used_spi");
	tmp.innerText=cnt;
}
// {"gearName":"","gearId":"","deckInfo":"",userCost:"",userSpi:""}
function getDeckInfo(){ 
	var di=document.getElementById("nowdeck");
	var ln=di.childNodes.length;
	var cList=[];
	var j=0;
	for(var i=0;i<ln;i++){
		var cn=di.childNodes[i];
		if(cn.nodeType==1&&cn.className=="cardlist"){
			cList[j]=(new XMLSerializer()).serializeToString(cn);
			j++;
		}		
	}
	return cList;
}

function parseDom(arg) {
　　 var objE = document.createElement("div");
　　 objE.innerHTML = arg;
　　 return objE.childNodes[0];
}

function setDeckInfo(cList){
	var di=document.getElementById("nowdeck").childNodes;
	// 移除所有cardlist样式元素	
	var rcList=[];
	for(var i=0;i<di.length;i++){
		var cn=di[i];		
		if(cn.nodeType==1&&cn.className=="cardlist"){			
			rcList[rcList.length]=cn;
		}
	}	
	for(var i=0;i<rcList.length;i++){
		document.getElementById("nowdeck").removeChild(rcList[i]);	
	}
	
	// 填入新的cardlist样式元素
	for(var i=0;i<cList.length;i++){
		var tmp=parseDom(cList[i]);
		document.getElementById("nowdeck").appendChild(tmp);
	}
	
}
/***********************************多卡组  功能区  结束******************************************/
/************************ 数据预备区 **********************/

var DB_MultDeck;
function success_DB_MultDeck(db){
	DB_OS_Gear = DC[MDECK_N][0];
	DB_MultDeck = db;
}
/********************** 通道消息 处理区**********************/
/**
"cmd":"loadDeck","data":slt.value
**/
function handlePort_modMultDeck(port){	
	if(port.name == "BG#"+MDECK_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.saveDeck"){
				saveDeck(msg.un,msg.data,port);
			}else if (msg.cmd == "bg.loadDeck"){
				loadDeck(msg.id,port);
			}else if (msg.cmd == "bg.delDeck"){
				delDeck(msg.id,port);
			}else if (msg.cmd == "bg.loadList"){
				loadList(port);
			}		
		});
	}
}
/********************** 自动执行区**********************/
var MDECK_N="mod_multDeck";
var DB_OS_Gear= bg.MOD_DEF[MDECK_N].data[0];

	Tool_connUserDB(success_DB_MultDeck);

chrome.runtime.onConnect.addListener(handlePort_modMultDeck);
log("load csj_mod_multDeck.js done");