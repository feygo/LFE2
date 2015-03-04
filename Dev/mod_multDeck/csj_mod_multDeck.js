log("load csj_mod_multDeck.js");

/***********************************多卡组  功能区  开始******************************************/
// 存储卡组
function saveDeck(port_pop){
	// 获取页面数据	
	var gn=getGearName();
	var uc=getUserCost();
	var us=getUserSpi();
	var diList=getDeckInfo();	
	// 组装成数据对象
	var gearData={"gearName":gn,"userCost":uc,"userSpi":us,"deckInfo":diList};
	// 存储卡组到db
	var port_bg=getBgPort(MDECK_N);
	port_bg.postMessage({"cmd":"bg.saveDeck","un":USER_NAME,"data":gearData});
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.saveDeck.rs"){	
			if(msg.stat=="success"){
				var info="卡组保存成功:"+msg.data;
				port_pop.postMessage({"cmd":"rs","data":info});				
			}else{
				var info="卡组保存出错:"+msg.data;
				port_pop.postMessage({"cmd":"rs","data":info});				
			}
		}			
	});
}
// 载入卡组
function loadDeck(gn,port_pop){
	var port_bg=getBgPort(MDECK_N);
	port_bg.postMessage({"cmd":"bg.loadDeck","un":USER_NAME,"id":gn});
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.loadDeck.rs"){	
			if(msg.stat=="success"){
				var gearData=msg.data;
				// 更新界面
				setGearName(gearData.gearName);
				setUserCost(gearData.userCost);
				setUserSpi(gearData.userSpi);
				setDeckInfo(gearData.deckInfo);
				var info="卡组载入成功:"+gearData.gearName;
				port_pop.postMessage({"cmd":"rs","data":info});				
			}else{
				var info="卡组载入出错:"+msg.data;
				port_pop.postMessage({"cmd":"rs","data":info});				
			}
		}			
	});
	
}
// 删除卡组信息
function delDeck(gn,port_pop){
	var port_bg=getBgPort(MDECK_N);
	port_bg.postMessage({"cmd":"bg.delDeck","un":USER_NAME,"id":gn});
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.delDeck.rs"){	
			if(msg.stat=="success"){
				var info="卡组删除成功:"+msg.data;
				port_pop.postMessage({"cmd":"rs","data":info});				
			}else{
				var info="卡组删除出错:"+msg.data;
				port_pop.postMessage({"cmd":"rs","data":info});				
			}
		}			
	});
}
// 卡组列表载入
function loadList(port_pop){
	var port_bg=getBgPort(MDECK_N);
	port_bg.postMessage({"cmd":"bg.loadList","un":USER_NAME});
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.loadList.rs"){	
			if(msg.stat=="success"){
				var info="卡组列表读取11:"+msg.data;
				// debug(info);
				// port_pop.postMessage({"cmd":"loadList.rs","data":msg.data});				
			}else{
				var info="卡组列表读取出错:"+msg.data;
				port_pop.postMessage({"cmd":"loadList.rs","data":info});				
			}
		}
	});
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

/********************** 通道消息 处理区**********************/
/**
"cmd":"loadDeck","data":slt.value
**/
function handlePort_modMultDeck(port){	
	if(port.name == MDECK_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "saveDeck"){
				saveDeck(port);				
			}
			if (msg.cmd == "loadDeck"){
				loadDeck(msg.id,port);
			}
			if (msg.cmd == "delDeck"){
				delDeck(msg.id,port);
			}
			if (msg.cmd == "loadList"){
				loadList(port);
			}			
		});
		port.onDisconnect.addListener(function(msg) {debug(msg)});
	}
}
/********************** 自动执行区**********************/
var MDECK_N="mod_multDeck";

chrome.runtime.onConnect.addListener(handlePort_modMultDeck);

log("load csj_mod_multDeck.js done");