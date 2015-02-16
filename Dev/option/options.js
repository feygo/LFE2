// Saves options to localStorage.
/*******************************************/
var bg = chrome.extension.getBackgroundPage();  

/**
Object {mod_ad: "0", mod_multDeck: "0", mod_sortDeck: "1", mod_gather: "0", mod_train: "1"} 
Object {training_lvLow: "5", training_lvUp: "4"} 
*/
function save_options() {	
	// 获取插件配置
	var lfe={};
	var lfeRL=document.querySelectorAll(".LFE");
	for(var i=0;i<lfeRL.length;i++){
		if(lfeRL[i].checked){
			lfe[lfeRL[i].name]=lfeRL[i].value;
		}
	}
	//存储mod配置
	localStorage.setItem("LFE#Conf",JSON.stringify(lfe));
	console.log("存储插件配置：LFE#Conf "+JSON.stringify(lfe));
	
	// 获取mod模块配置
	var mod={};
	var modRL=document.querySelectorAll(".mod");
	for(var i=0;i<modRL.length;i++){
		if(modRL[i].checked){
			mod[modRL[i].name]=modRL[i].value;
		}
	}
	//存储mod配置
	localStorage.setItem("LFE#Mod",JSON.stringify(mod));
	console.log("存储功能：LFE#Mod "+JSON.stringify(mod));
		
	// 读取modconf配置信息
	var modConf={};
	var modCFRL=document.querySelectorAll(".mod_conf");
	for(var i=0;i<modCFRL.length;i++){
		if(modCFRL[i].nodeName=="INPUT"){
			modConf[modCFRL[i].id]=modCFRL[i].value;
		}else if(modCFRL[i].nodeName=="RADIO"&&modCFRL[i].checked){
			// 待完善
			modConf[modCFRL[i].id]=modCFRL[i].value;
		}
	}
	//存储modConf配置
	localStorage.setItem("LFE#ModConf",JSON.stringify(modConf));
	console.log("存储功能配置：LFE#ModConf "+JSON.stringify(modConf));	
	
	// 保持更新值
	localStorage.setItem("LFE#ModUpdate",true);
	extionReload();
}

function restore_options() {	

	// 恢复插件配置	
	var lfeStr=localStorage.getItem("LFE#Conf");
	console.log("恢复插件配置：LFE#Conf "+lfeStr);	
	if(lfeStr!=null){
		var lfe=JSON.parse(lfeStr);
		for(var lfeName in lfe){
			rChecked(lfeName,lfe[lfeName]);		
		}	
	}
	// 恢复数据对象操作 显示
	showDataDiv(lfe["devMode"]);
	// 恢复mod配置	
	var modStr=localStorage.getItem("LFE#Mod");
	console.log("恢复功能：LFE#Mod "+modStr);	
	if(modStr!=null){
		var mod=JSON.parse(modStr);
		for(var modName in mod){
			rChecked(modName,mod[modName]);		
		}	
	}

	// 恢复modConf配置
	var modConfStr=localStorage.getItem("LFE#ModConf");
	console.log("恢复功能配置：LFE#ModConf "+modConfStr);	
	if(modConfStr!=null){
		var modConf=JSON.parse(modConfStr);
		for(var confName in modConf){
			var confValue=modConf[confName];
			var conf=document.getElementById(confName);
			if(conf.nodeName=="INPUT"){
				conf.value=confValue;	
			}else if(conf.nodeName=="RADIO"){
				// 待完善
				rChecked(confName,confValue);	
			}	
		}	
	}	
}
// 跟具有值，来选定单选框
function rChecked(r,v){
	var rl=document.getElementsByName(r);	
    for(i=0;i<rl.length;i++){
		if(rl[i].value==v){
			rl[i].checked=true;
		}
    }
} 
// 刷新bg.html页面，更新配置信息
function extionReload(){
	var win=chrome.extension.getBackgroundPage();
	win.location.reload();
}
// 删除后台数据对象
function del_dataObj(e){
	var osName=window.event.srcElement.value;	
	bg.Tool_delOS(bg[osName]);
}
// 清空后台数据对象
function cls_dataObj(e){
	var osName=window.event.srcElement.value;
	bg.Tool_clsOS(bg[osName]);
}
// 设置全部mod选项的状态
function setAllModStat(value){
	var modList=document.querySelectorAll("input.mod");
	for(var i=0;i<modList.length;i++){
		rChecked(modList[i].name,value);	
	}
}
function setAllModChecked(){
	setAllModStat("1");
}
function setAllModUnChecked(){
	setAllModStat("0");
}
// 设置数据对象操作div 显示
function setDataDiv(){
	var d=event.srcElement;
	showDataDiv(d.value);
}
function showDataDiv(value){
	if(value=="1"){
		document.getElementById("dataDiv").style.display="";
	}else{
		document.getElementById("dataDiv").style.display="none";
	}	
}

/*******************页面载入区**************************/
document.addEventListener("DOMContentLoaded",loadOption);
// 页面载入入口
function loadOption(){
	// 恢复所有选项值
	restore_options();
	// 绑定save按钮事件
	document.querySelector('#savebtn').addEventListener('click', save_options);
	// 绑定bg存储对象按钮事件
	var delList=document.getElementsByName("delObj");
	for(var i=0;i<delList.length;i++){
		delList[i].addEventListener('click', del_dataObj);
	}
	var clsList=document.getElementsByName("clsObj");
	for(var i=0;i<clsList.length;i++){
		clsList[i].addEventListener('click', cls_dataObj);
	}
	// 绑定全部mod启用停用事件
	document.getElementById("setChecked").addEventListener('click', setAllModChecked);
	document.getElementById("setUnChecked").addEventListener('click', setAllModUnChecked);
	// 绑定开发模式的按钮
	var devBtnList=document.getElementsByName("devMode");
	for(var i=0;i<devBtnList.length;i++){
		devBtnList[i].addEventListener('click', setDataDiv);
	}
	
}