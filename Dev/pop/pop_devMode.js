/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   

bg.log("load pop_devMode.js");
/*************************** 自动执行区 *******************/
// 读取启动的mod列表
function loadModList(){
	var rTable=document.getElementById("modList");
	addModListTitle(rTable);
	for(var modId in bg.MOD_NOW){
		var conf=bg.MOD_NOW[modId];
		bg.debug(conf["data"]);
		if(conf["data"]){
			addModListTD(rTable,modId,conf["mod"],conf["data"]);
		}
	}
}
function addModListTitle(rTable){
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>Mod名称</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>DB名称</b>";
	var tdT3=document.createElement("td");
	tdT3.className='name c5';
	tdT3.innerHTML="<b>操作</b>";
	var tdT4=document.createElement("td");
	tdT4.className='name c5';
	tdT4.innerHTML="<b>结果</b>";
	
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	trT.appendChild(tdT3);
	trT.appendChild(tdT4);
	rTable.appendChild(trT);
}
function addModListTD(rTable,modId,modName,data){
	// mod名称
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML=modName;
	// DB名称
	var td2=document.createElement("td");
	td2.innerHTML=data;
	// 操作
	var td3=document.createElement("td");
	var delBtn=document.createElement("button");
	delBtn.id=modId;
	delBtn.value=data;
	delBtn.innerText="清空数据";
	delBtn.addEventListener('click', del);	
	td3.appendChild(delBtn);
	var td4=document.createElement("td");
	td4.id="stat_"+modId;
	td4.innerHTML="";
	
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	rTable.appendChild(tr1);
}
function del(){
	//检测是否应用至所以用户
	var isAll=document.getElementById("isAllUser").checked;
	var b=event.srcElement;	
	port.postMessage({"cmd":"delData","id":b.value,"data":isAll});
}
function delStat(id,data){
	var stat=document.getElementById("stat_"+id);
	stat.innerText=data;
}
/*************************** 自动执行区 *******************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "MAIN_DATA"});
		// 载入所有mod模块
		loadModList();
		
		// 接收监控卡片列表
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "delData.rs"){
				delStat(msg.id,msg.data);
			}
		});
	});
}
/*************************** 绑定与自动执行区 *******************/
window.addEventListener('load', loadPort);

bg.log("load pop_devMode.js done");