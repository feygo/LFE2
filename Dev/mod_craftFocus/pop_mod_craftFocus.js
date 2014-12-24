/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_craftFocus.js");
/*********************** 页面通道 通讯区 *********************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_craftFocus"});
		loadFocusCardList();
		
		/** 业务功能区 */
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load.rs"){
				showFocusCardList(msg.data);
			}
		});
	});
}

/********************************* 页面载入区 扩展******************/
function loadFocusCardList(){
	// 添加卡片列表头
	var rTable=document.getElementById("focusList");
	addFocusTitle(rTable);
	// 发送load消息
	port.postMessage({"cmd":"load"});
}

// 添加监控卡片列表 表头
function addFocusTitle(rTable){
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>监控卡片名称</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>卡片数量</b>";
	var tdT3=document.createElement("td");
	tdT3.className='name c5';
	tdT3.innerHTML="<b>操作</b>";
	
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	trT.appendChild(tdT3);
	rTable.appendChild(trT);
}
// 添加监控卡片列表
function showFocusCardList(cf){
	var rTable=document.getElementById("focusList");
	
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML=cf.cardName;
	var td2=document.createElement("td");
	td2.innerText=cf.num;
	var td3=document.createElement("td");
	td3.innerHTML="<button name='D' value='"+cf.cardId+"'>del</button>";
	
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	rTable.appendChild(tr1);
	
	td3.querySelector('button').addEventListener('click', delFocusCard);
	// 更新监控卡片数量
	var fcnt=document.getElementById("fcnt");
	var ncnt=parseInt(fcnt.innerText)+1;
	fcnt.innerText=ncnt;
}
// 删除监控卡片
function delFocusCard(){
	var b=event.srcElement;
	port.postMessage({"cmd":"del","id":b.value});
}

// function addCardTitle(sTable){
	// // 组成table 表头
	// var trT=document.createElement("tr");				
	// var tdT1=document.createElement("td");
	// tdT1.className='name c5';
	// tdT1.innerHTML="<b>卡片列表</b>";
	// var tdT2=document.createElement("td");
	// tdT2.className='name c5';
	// tdT2.innerHTML="<b>现有卡片数量</b>";
	// if(isD){
		// var tdT3=document.createElement("td");
		// tdT3.className='name c5';
		// tdT3.innerHTML="<b>是否列为监控目标</b>";
	// }
	// trT.appendChild(tdT1);
	// trT.appendChild(tdT2);
	// if(isD){
		// trT.appendChild(tdT3);
	// }
	// sTable.appendChild(trT);
// }

/*************************** 绑定与自动执行区 *******************/
window.addEventListener('load', loadPort);
// document.querySelector('#clsDiv').addEventListener('click', clsDiv);
// document.querySelector('#focusBtn').addEventListener('click', doFocus);

bg.log("popup load pop_mod_craftFocus.js done");