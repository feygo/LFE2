/** 后台通讯区 */
var modName="mod_lessFiveCard";
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_lessFiveCard.js");
/*********************** 页面通道 通讯区 *********************/
var userName=bg.Tool_getUserName(location.search);
var port_bg;
function loadPort(){
	port_bg=chrome.runtime.connect({name: "BG#"+modName});
	port_bg.onMessage.addListener(function(msg) {
		bg.debug("pop_"+modName+"收到"+port_bg.name+"通道消息："+JSON.stringify(msg));	
	});
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.loadLFive.rs"){
			if(msg.stat=="success"){
				addCardTr(msg.data);
			}
		}
	});
	// 载入不满5张卡片列表
	loadLessFive();
}

// 载入卡片列表
function loadLessFive(){
	document.querySelector("#fiveShow").innerHTML="";
	port_bg.postMessage({"cmd":"bg.loadLFive","un":userName});
	addCardTitle();
}
function addCardTitle(){
	var tr=document.createElement("tr");
	var td1=document.createElement("td");				
	td1.className='name c5';
	td1.innerHTML="等级";
	var td2=document.createElement("td");				
	td2.className='name c5';
	td2.innerHTML="卡片名称";
	var td3=document.createElement("td");				
	td3.className='name c5';
	td3.innerHTML="现有数量";
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	document.querySelector("#fiveShow").appendChild(tr);	
}
function addCardTr(card){
	var tr=document.createElement("tr");
	var td1=document.createElement("td");				
	td1.className=card.cardType+" boldtitle";
	td1.innerHTML="Lv."+card.lv;
	var td2=document.createElement("td");				
	td2.className=card.cardType+" boldtitle";
	td2.innerHTML=card.cardName;
	var td3=document.createElement("td");				
	td3.className=card.cardType+" boldtitle";
	td3.innerHTML=card.num+"张";
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	document.querySelector("#fiveShow").appendChild(tr);
}

/**************窗体事件区*********************/
// document.querySelector('#saveBtn').addEventListener('click', saveDeck);
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_lessFiveCard.js done");