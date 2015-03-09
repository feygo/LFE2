/** 后台通讯区 */
var modName="mod_gather";
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_gather.js");
/*********************** 页面通道 通讯区 *********************/
var userName=bg.Tool_getUserName(location.search);
var port;
var port_bg;
function loadPort(){
	port_bg=chrome.runtime.connect({name: "BG#"+modName});
	port_bg.onMessage.addListener(function(msg) {
		bg.debug("pop_"+modName+"收到"+port_bg.name+"通道消息："+JSON.stringify(msg));	
		if (msg.cmd == "bg.loadGA.rs"){
			if(msg.stat=="success"){
				doLoadGA(msg.data);				
			}
		}	
	});	

	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: modName});
		port.onMessage.addListener(function(msg) {
			bg.debug("pop_"+modName+"收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load.rs"){
				doLoad(msg.data);
			}
			if (msg.cmd == "ga.rs"){
				port_bg.postMessage({"cmd":"bg.loadGA","un":userName});
			}
		});	
		// 载入采集信息
		loadGA();
	});
}


/** 页面载入区 */
// 当页面载入的时候，获取可采集项、行动点AP、上一次的采集结果    
/**
页面操作指令 消息结构：{"cmd":"load","data":{}};
						{"cmd":"ga","data":{"gaType":gaType,"gaNum":gaNum}};
						
						{"gaList":[],"ap":"","gaRS":[]}
						var R={"rs":"","wp":"","zd":"","jn":"","note":""};
						{"id":id,"name":name}			

*/
// 载入采集信息和上次数据
function loadGA(){
	port.postMessage({"cmd":"load"});
	port_bg.postMessage({"cmd":"bg.loadGA","un":userName});
}
// 执行采集动作
function ga(){
	var ap=document.getElementById("apNum").innerText;
	if(10>parseInt(ap)){
		alert("没有足够的AP，无法采集！");
		return;
	}	
	var dl=document.getElementById("ga_list");
	var gaType=dl.value;
	var gaName=dl.options[dl.selectedIndex].text;
	
	var fList=document.getElementById("fail_list");
	var fNum=parseInt(fList.value);
	
	var isAll=document.getElementById("isAll");
	var gaNum=0;		
	if(isAll.checked){
		gaNum=-1;
	}else{
		var rs=document.getElementById("cjNum");
		if(rs.value==""){
			gaNum=0;
		}else{
			gaNum=parseInt(rs.value);
			var cap=document.getElementById("capNum").innerText;
			if(gaNum>parseInt(cap)){
				alert("输入的采集次数大于可采集的最大次数，请重新输入！");
				document.getElementById("cjNum").value="";
				return;
			}
		}
	}	
	
	
	var r=confirm("'"+gaName+"'采集项 "+"\n\n 是否开始自动采集？");
	if (r==true){
		var msg={"cmd":"ga","data":{"gaType":gaType,"gaNum":gaNum,"failNum":fNum}};
		port.postMessage(msg);	
	}
}
// 展示采集信息
function doLoad(rec){	
	//载入可采集项目
	var dl=document.getElementById("ga_list");
	var gaList=rec["gaList"];
	for(var i=0;i<gaList.length;i++){
		jsAddItemToSelect(dl,gaList[i].name,gaList[i].id);
	}
	//载入行动点数
	var ap=document.getElementById("apNum");
	var apV=rec["ap"];
	ap.innerText=apV;
	//计算可采集次数
	var ap=document.getElementById("capNum");
	var apC=Math.floor(parseInt(apV)/10);
	ap.innerText=apC;
	
	//载入失败次数列表
	var fL=document.getElementById("fail_list");
	var fList=[{"value":1,"key":1},{"value":0,"key":0},{"value":5,"key":5},{"value":10,"key":10}];
	for(var i=0;i<fList.length;i++){
		jsAddItemToSelect(fL,fList[i].value,fList[i].key);
	}
}
// 展示战斗结果
function doLoadGA(gaRS){
	//载入战斗结果
	var rs=document.getElementById("rs");
	var tmpStr="";
	if(gaRS.length!=0){
		tmpStr+="<tr><td class='name c5'><b>结果</b></td><td class='name c5'><b>获得物品</b></td><td class='name c5'><b>遭遇战斗</b></td><td class='name c5'><b>技能提升</b></td></tr>";					
	}
	if(gaRS.length>15){
		 document.getElementById("rsDiv").style.height="400px";
		 document.getElementById("rsDiv").style.overflowY='scroll';
	}
	for(var i=0;i<gaRS.length;i++){
		var r=gaRS[i];
		if(r.rs!=""){
			tmpStr+="<tr><td>"+r.rs+"</td><td>"+r.wp+"</td><td>"+r.zd+"</td><td>"+r.jn+"</td></tr>";
		}
		if(r.note!=""){
			tmpStr+="<tr><td colspan='4'>"+r.note+"</td></tr>";
		}		
	}
	document.getElementById("rs").innerHTML=tmpStr;
}

/*******************************绑定事件***********/
document.querySelector('#ga_Btn').addEventListener('click', ga);
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_gather.js done");