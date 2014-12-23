/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_train.js");
/*********************** 页面通道 通讯区 *********************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_train"});
		
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load.rs"){
				doLoad(msg.data);
			}
		});
		
		loadTrn();
	});
}


/** 页面载入区 */
// 当页面载入的时候，获取可选卡组项、怪物列表、行动点AP、上一次的训练结果    
/**
页面操作指令 消息结构：{"cmd":"load","data":{}};
						{"cmd":"trn","data":{"gId":gid,"mId":mid,"trnNum":trnNum}};
						
						// {"mobList":[],"ap":"","gSel":"","trnRS":[]}
						var R={"rs":"","jq":"","jy":"","jn":"","note":""};
						{"key":id,"value":name}			

*/

function loadTrn(){

	var lowKey="lvLow";
	var upKey="lvUp";	
	
	var cf=bg.MOD_NOW["mod_train"].modconf;
	var lvLow,lvUp;
	if(cf==null){
		bg.log("配置信息读取异常，获得null值，并使用默认值！！");
		lvLow=null;lvUp=null;
	}else{
		lvLow=cf[lowKey];
		lvUp=cf[upKey];
	}	
	bg.log("lvLow|"+lvLow+"|");
	if(lvLow!=null){lvLow=parseInt(lvLow);}
	if(lvLow==null){lvLow=3;}	
	bg.log("lvUp|"+lvUp+"|");
	if(lvUp!=null){lvUp=parseInt(lvUp);}
	if(lvUp==null){lvUp=5;}
	
	var msg={"cmd":"load","data":{"lvLow":lvLow,"lvUp":lvUp}};
	port.postMessage(msg);
}
function trn(){
	var ap=document.getElementById("apNum").innerText;
	if(12>parseInt(ap)){
		alert("没有足够的AP，无法训练！");
		return;
	}	
	var trnList=document.getElementById("trn_list");
	var gId=trnList.value;
	var gName=trnList.options[trnList.selectedIndex].text;
	
	var mobList=document.getElementById("mob_list");
	var mId=mobList.value;
	var fList=document.getElementById("fail_list");
	var fNum=parseInt(fList.value);
	var mName=mobList.options[mobList.selectedIndex].text;
	var isAll=document.getElementById("isAll");
	var trnNum=0;	
	if(isAll.checked){
		trnNum=-1;
	}else{
		var rs=document.getElementById("trnNum");
		if(rs.value==""){
			trnNum=0;
		}else{
			trnNum=parseInt(rs.value);
			var cap=document.getElementById("capNum").innerText;
			if(trnNum>parseInt(cap)){
				alert("输入的训练次数大于可训练的最大次数，请重新输入！");
				document.getElementById("trnNum").value="";
				return;
			}
		}
	}	
	

	var r=confirm("使用 '"+gName+"'卡组 攻击 '"+mName+"'"+"\n\n 是否开始自动训练？");
	if (r==true){
		var msg={"cmd":"trn","data":{"gId":gId,"mId":mId,"trnNum":trnNum,"failNum":fNum}};
		port.postMessage(msg);		
	}
}

function doLoad(rec){	
	//载入怪物目标列表
	var mL=document.getElementById("mob_list");
	var mobList=rec["mobList"];
	for(var i=0;i<mobList.length;i++){
		jsAddItemToSelect(mL,mobList[i].value,mobList[i].key);
	}
	//载入可选卡组
	document.getElementById("trn_list").innerHTML=rec["gSelHTML"];
	//载入行动点数
	var ap=document.getElementById("apNum");
	var apV=rec["ap"];
	ap.innerText=apV;
	//计算可采集次数
	var ap=document.getElementById("capNum");
	var apC=Math.floor(parseInt(apV)/12);
	ap.innerText=apC;
	
	//载入失败次数列表
	var fL=document.getElementById("fail_list");
	var fList=[{"value":1,"key":1},{"value":0,"key":0},{"value":5,"key":5},{"value":10,"key":10}];
	for(var i=0;i<fList.length;i++){
		jsAddItemToSelect(fL,fList[i].value,fList[i].key);
	}
	
	//载入战斗结果
	var rs=document.getElementById("rs");
	var trnRS=rec["trnRS"];
	var tmpStr="";
	if(trnRS.length!=0){
		tmpStr+="<tr><td class='name c5'><b>战果</b></td><td class='name c5'><b>金币</b></td><td class='name c5'><b>经验值</b></td><td class='name c5'><b>技能提升</b></td></tr>";					
	}
	if(trnRS.length>9){
		 document.getElementById("rsDiv").style.height="370px";
		 document.getElementById("rsDiv").style.overflowY='scroll';
	}
	for(var i=0;i<trnRS.length;i++){
		var r=trnRS[i];
		if(r.rs!=""){
			tmpStr+="<tr><td>"+r.rs+"</td><td>"+r.jq+"</td><td>"+r.jy+"</td><td>"+r.jn+"</td></tr>";
		}		
		if(r.note!=""){
			tmpStr+="<tr><td colspan='4'>"+r.note+"</td></tr>";
		}
	}
	document.getElementById("rs").innerHTML=tmpStr;
}

/*******************************绑定事件***********/
document.querySelector('#trn_Btn').addEventListener('click', trn);
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_gather.js done");