/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   

bg.log("load pop_main.js");
/**************获得当前tab页面的url*********************/
chrome.tabs.getSelected(function(tab){
	// 获得当前的CP
	var url=tab.url;
	document.getElementById("tabId").value=tab.id;
	var cp=url.replace("http://www.linodas.com","");
	bg.debug(cp);
	// 获得cp对应的popup页面设置
	var popList=bg.getPopByURL(cp);
	bg.debug(popList);
	// 根据popList生产main内容
	if(popList.length==0){
		document.querySelector("#modDiv tr").innerHTML="本页无插件功能";
	}else{
		for(var i=0;i<popList.length;i++){
			var popStr=popList[i].split(":");
			addTabButton(popStr[2],popStr[1]);
		}
	}
	if(checkDevMode()=="1"){
		showDevBtn();
	}
	
});
// 向导航框添加按钮
function addTabButton(value,name){
	var tr=document.querySelector("#modDiv tr");
	var btn=document.createElement("button");				
	btn.value=value ;
	btn.innerText=name;
	btn.addEventListener('click', loadModPop);
	tr.appendChild(btn);
}
// 按钮响应事件
function loadModPop(e){
	top.location=e.srcElement.value;
}
// 维护页面显示控制
function checkDevMode(){
	return bg.EXT_CONF["devMode"];
}
function showDevBtn(){
	document.getElementById("lfeDiv").style.display="";
	document.getElementById("devBtn").addEventListener('click', loadModPop);
}
bg.log("load pop_main.js done");