console.log("load bg_conf.js");
/**************************全局变量区*******************************/
/* 
	"test":{
		"mod":"测试模块",
		"modconf":{
			"conf1":"11",
			"conf2":"0"
		},
		"dept":["mod_xxx",""],
		"bg":["",""],
		"urlist":[
				{	url:"/sss/ss/"
					js:["",""]
					pop:""
				},
				{	url:"/sss/ss/"
					js:["",""]
					pop:""
				}
		]
	}
 */
// 默认扩展配置
 var MOD_DEF={
	"mod_ad":{
		"mod":"隐藏广告栏",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/*",
					"js":["/mod_ad/csj_mod_ad.js"],
					"pop":""
				}
		]
	},
	"mod_note":{
		"mod":"记事本",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/*",
					"js":["/mod_note/csj_mod_note.js"],
					"pop":"记事本:/mod_note/pop_mod_note.html"
				}
		],
		"data":"LFE2#Mod#Note",
		"preOS":"#note",
		"version":1
	},
	"mod_multDeck":{
		"mod":"多卡组",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/character/deck",
					"js":["/mod_multDeck/csj_mod_multDeck.js"],
					"pop":"多卡组:/mod_multDeck/pop_mod_multDeck.html"
				},
				{	"url":"#/character/deck/*",
					"js":["/mod_multDeck/csj_mod_multDeck.js"],
					"pop":"多卡组:/mod_multDeck/pop_mod_multDeck.html"
				}
		],
		"data":"LFE2#Mod#MultDeck",
		"preOS":"#mdeck",
		"version":1
	},
	"mod_sortDeck":{
		"mod":"卡组排序",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/character/deck",
					"js":["/mod_sortDeck/csj_mod_sortDeck.js"],
					"pop":"排序卡组:/mod_sortDeck/pop_mod_sortDeck.html"
				},
				{	"url":"#/character/deck/*",
					"js":["/mod_sortDeck/csj_mod_sortDeck.js"],
					"pop":"排序卡组:/mod_sortDeck/pop_mod_sortDeck.html"
				}
		],
		"data":"LFE2#Mod#SortDeck",
		"preOSList":["#sort","#sortConf"],
		"version":1
	},
	"mod_gather":{
		"mod":"自动采集",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/city/gathering",
					"js":["/mod_gather/csj_mod_gather.js"],
					"pop":"采集:/mod_gather/pop_mod_gather.html"
				}
		],
		"data":"LFE2#Mod#Gather",
		"preOS":"#gatherRS",
		"version":1
	},
	"mod_train":{
		"mod":"自动训练",
		"modconf":{"lvLow":3,
					"lvUp":3
				},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/city/training",
					"js":["/mod_train/csj_mod_train.js"],
					"pop":"训练:/mod_train/pop_mod_train.html"
				}
		],
		"data":"LFE2#Mod#Train",
		"preOS":"#trainRS",
		"version":1
	},
	"mod_cityInfoGet":{
		"mod":"城市信息获取",
		"modconf":{},
		"dept":[],
		"bg":["/mod_cityInfoGet/bg_mod_cityInfoGet.js"],
		"urlist":[
				{	"url":"#/city",
					"js":["/mod_cityInfoGet/csj_mod_cityInfoGet.js"],
					"pop":""
				}
		]
	},
	"mod_mktInfoGet":{
		"mod":"商店信息获取",
		"modconf":{},
		"dept":[],
		"bg":["/mod_mktInfoGet/bg_mod_mktInfoGet.js"],
		"urlist":[
				{	"url":"#/market/shop/id/*",
					"js":["/mod_mktInfoGet/csj_mod_mktInfoGet_s.js"],
					"pop":""
				},
				{	"url":"#/market",
					"js":["/mod_mktInfoGet/csj_mod_mktInfoGet_m.js"],
					"pop":""
				},
				{	"url":"#/city/classhall/id/*",
					"js":["/mod_mktInfoGet/csj_mod_mktInfoGet_m.js"],
					"pop":""
				}
				
		]
	},
	"mod_invSort":{
		"mod":"背包物品排序",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/character/inventory",
					"js":["/mod_invSort/csj_mod_invSort.js"],
					"pop":""
				}
		]
	},
	"mod_lessFiveCard":{
		"mod":"未满5张卡片统计",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/character/card",
					"js":["/mod_lessFiveCard/csj_mod_lessFiveCard_cc.js","/mod_lessFiveCard/csj_mod_lessFiveCard_g.js"],
					"pop":"不满5张:/mod_lessFiveCard/pop_mod_lessFiveCard.html"
				},
				{	"url":"#/*",
					"js":["/mod_lessFiveCard/csj_mod_lessFiveCard_g.js"],
					"pop":"不满5张:/mod_lessFiveCard/pop_mod_lessFiveCard.html"
				},
				{	"url":"#/market/shop/id/*",
					"js":["/mod_lessFiveCard/csj_mod_lessFiveCard_s.js"],
					"pop":""
				},
				{	"url":"#/city/classhall/id/*",
					"js":["/mod_lessFiveCard/csj_mod_lessFiveCard_s.js"],
					"pop":""
				}
				
		],
		"data":"LFE2#Mod#lessFiveCard",
		"preOS":"#fiveCard",
		"version":1
	},
	"mod_craftProcess":{
		"mod":"合成卡片收集度",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/*",
					"js":["/mod_craftProcess/csj_mod_craftProcess.js"],
					"pop":"合成卡片:/mod_craftProcess/pop_mod_craftProcess.html"
				},
				{	"url":"#/market/shop/id/*",
					"js":["/mod_craftProcess/csj_mod_craftProcess_s.js"],
					"pop":""
				},
				{	"url":"#/city/classhall/id/*",
					"js":["/mod_craftProcess/csj_mod_craftProcess_s.js"],
					"pop":""
				}
		],
		"data":"LFE2#Mod#craftProcess"
	},
	"mod_craftFocus":{
		"mod":"合成卡片监控",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/*",
					"js":["/mod_craftFocus/csj_mod_craftFocus.js"],
					"pop":"监控卡片:/mod_craftFocus/pop_mod_craftFocus.html"
				},
				{	"url":"#/market/shop/id/*",
					"js":["/mod_craftFocus/csj_mod_craftFocus_s.js"],
					"pop":""
				},
				{	"url":"#/city/classhall/id/*",
					"js":["/mod_craftFocus/csj_mod_craftFocus_s.js"],
					"pop":""
				},
				{	"url":"#/character/card",
					"js":["/mod_craftFocus/csj_mod_craftFocus_c.js"],
					"pop":""
				}
		],
		"data":"LFE2#Mod#craftFocus"
	},
	"mod_invFocus":{
		"mod":"背景材料监控",
		"modconf":{},
		"dept":[],
		"bg":[],
		"urlist":[
				{	"url":"#/character/inventory",
					"js":["/mod_invFocus/csj_mod_invFocus.js"],
					"pop":""
				}
		],
		"data":"LFE2#Mod#invFocus"
	},
	"mod_craftFocusItem":{
		"mod":"合成材料监控",
		"modconf":{},
		"dept":["mod_craftFocus","mod_invFocus"],
		"bg":[],
		"urlist":[
				{	"url":"#/*",
					"js":["/mod_craftFocusItem/csj_mod_craftFocusItem.js"],
					"pop":"监控材料:/mod_craftFocusItem/pop_mod_craftFocusItem.html"
				}
		],
		"data":"LFE2#Mod#invFocus"
	}
}
	// "mod_mapShow":{
		// "mod":"地图信息增强",
		// "modconf":{},
		// "dept":[],
		// "bg":["/mod_mapShow/bg_mod_mapShow.js"],
		// "urlist":[
				// {	"url":"#/world/map",
					// "js":["/mod_mapShow/csj_mod_mapShow.js"],
					// "pop":""
				// }
		// ]
	// },
// 扩展配置
var EXT_CONF={};
// mod配置
var MOD_NOW={};
// 关闭mod配置
var MOD_IDLE={};
// url与mod的映射关系
var URL_ROUTER={};

/**************************消息对象定义区*******************************/
// 消息通讯对象 	"type":"func"	
var RequestListener={};
// 通道通讯对象 	"portName":"func"	
var PortListener={};

/**************************载入配置 并进行相应计算***********************/
function bgConfLoad(){

	console.log("载入插件配置...");
	// 读取插件配置
	var confStr=localStorage.getItem("LFE#Conf");
	if(confStr!=null){
		EXT_CONF=JSON.parse(confStr);	
	}
	console.log("插件配置："+JSON.stringify(EXT_CONF));
	
	console.log("载入MOD配置...");
	// 读取功能
	var modStr=localStorage.getItem("LFE#Mod");
	if(modStr!=null){
		var mod=JSON.parse(modStr);
		for( var mn in mod){
			if(mod[mn]=="1"&&MOD_DEF[mn]!=null){
				MOD_NOW[mn]=MOD_DEF[mn];
			}else if(mod[mn]=="0"&&MOD_DEF[mn]!=null){
				MOD_IDLE[mn]=MOD_DEF[mn];
			}			
		}		
	}
	// 读取插件配置
	var modConfStr=localStorage.getItem("LFE#ModConf");
	if(modConfStr!=null){
		var modConf=JSON.parse(modConfStr);
		for( var mc in modConf){
			var mci=mc.indexOf("#");
			var mn=mc.substring(0,mci);
			var cn=mc.substring(mci+1);
			if(MOD_NOW[mn]!=null){
				MOD_NOW[mn].modconf[cn]=modConf[mc];
			}			
		}		
	}
	console.log("----插件配置----");
	console.log(JSON.stringify(MOD_NOW));
	console.log(MOD_NOW);
	console.log("----插件配置----");

	// 载入不同的bg文件
	console.log("载入各模块的bg文件...");
	for(var mn in MOD_NOW){
		for(var i in MOD_NOW[mn].bg){
			load_BGjs(MOD_NOW[mn].bg[i]);
			console.log("载入"+MOD_NOW[mn].bg[i]+"模块的bg文件");
		}
	}
	
	// 计算URLtoMOD值
	console.log("辅助数据计算...");
	load_UtoM();
	
	// 
	
}
/**************************计算与功能：url映射mod***********************/
// 按照url 对应mod模块
// {"url":["mod_xxx","mod_xxx"]}
function load_UtoM(){
	for(var m in MOD_NOW){
		var tmpUL=MOD_NOW[m].urlist;
		for(var i=0;i<tmpUL.length;i++){
			var list=tmpUL[i].url.split("/");
			handleUrl(URL_ROUTER,0,list,tmpUL[i].js,tmpUL[i].pop);			
		}
	}	
	console.log("----URL_ROUTER的配置----");
	console.log(JSON.stringify(URL_ROUTER));
	console.log(URL_ROUTER);
	console.log("----URL_ROUTER的配置----");
}
// 算法：建立url树
// *直接附加，/如果url还有后续的就不附加
// var tmp={"url":{"url1":{},"*":[js-add],"js":js}};
function handleUrl(obj,i,list,js,pop){	
	var u=list[i];	
	if(i<list.length-1){				
		if(obj[u]==null){
			obj[u]=handleUrl({},i+1,list,js,pop);
		}else{
			obj[u]=handleUrl(obj[u],i+1,list,js,pop);
		}				
		// console.debug("handleUrl<:"+i+"="+JSON.stringify(obj));
		return obj;
	}else if(i==list.length-1){	
		// 关键项 u uobj obj;
		var uObj={};		
		if(obj[u]!=null){
			uObj=obj[u];
		}
		if(uObj.js==null){
			uObj.js=js;
			uObj.pop=[];
			if(pop!=""){
				uObj.pop.push(pop);
			}			
		}else{
			uObj.js=Tool_arrayQC(uObj.js.concat(js));
			if(pop!=""){
				uObj.pop.push(pop);
				uObj.pop=Tool_arrayQC(uObj.pop);
			}
		}
		obj[u]=uObj;
		return obj;
	}else{
		console.log(" handleUrl error!");
	}	
}
// 根据给定的url 获取载入脚本
function getModConfByUrl(cp,type){
	var scriptList=[];
	var popList=[];
	var url="#"+cp;
	var list=url.split("/");
	var obj=URL_ROUTER;
	for(var i=0;i<list.length;i++){		
		// console.log(list[i]);
		// console.log(JSON.stringify(obj));
		// 匹配具体的url
		if(i==list.length-1){
			if(obj[list[i]]!=null){
				// 收集js
				var tmpJS=obj[list[i]]["js"];
				if(tmpJS!=null&&tmpJS!=[]&&tmpJS!=[""]){					
					scriptList=scriptList.concat(tmpJS);
				}
				// 收集popup
				var tmpPop=obj[list[i]]["pop"];
				if(tmpPop!=null&&tmpPop!=[]&&tmpPop!=[""]){
					popList=popList.concat(tmpPop);
				}
			}			
		}
		// 加入本级*的配置项
		if(obj["*"]!=null){
			if(obj["*"]["js"]!=null&&obj["*"]["js"]!=[]&&obj["*"]["js"]!=[""]){
				scriptList=scriptList.concat(obj["*"].js);
			}
			if(obj["*"]["pop"]!=null&&obj["*"]["pop"]!=[]&&obj["*"]["pop"]!=[""]){
				popList=popList.concat(obj["*"].pop);
			}
		}
		if(obj[list[i]]==null){
			break;
		}else{
			obj=obj[list[i]];
		}
		
	}	
	var scriptList=Tool_arrayQC(scriptList);
	var popList=Tool_arrayQC(popList);	
	if(type=="js"){
		return scriptList;
	}
	if(type=="pop"){
		return popList;
	}
}
function getScriptByURL(cp){
	return getModConfByUrl(cp,"js");
}
function getPopByURL(cp){
	return getModConfByUrl(cp,"pop");
}
/**************************刷新 bg 载入脚本***********************/
// 向bg.html页面动态载入js文件
function load_BGjs(js){
	if(js==""){
		return;
	}
	var win=chrome.extension.getBackgroundPage();
    var head = win.document.getElementsByTagName('head')[0]; 
    var script= win.document.createElement("script"); 
    script.type = "text/javascript"; 
	script.charset="utf-8";
    script.src=js; 
    head.appendChild(script); 
}

/********************** 消息通讯区**********************/
function bg_conf_RequestListener(msg, sender, sendResponse) {		
	var lsMsg="";
	// 根据url载入指定的content脚本，设置popup页面
	if (msg.cmd == "loadModByUrl"){
		var scriptList=getScriptByURL(msg.data);	
		debug("获取载入脚本信息："+scriptList);
		for(var i=0;i<scriptList.length;i++){
			chrome.tabs.executeScript(sender.tab.id, {file: scriptList[i]});
			lsMsg+=scriptList[i]+", ";
		}
		if(lsMsg==""){
			lsMsg="None of scripts"
		}
		var resp=lsMsg+" is ready!";
		sendResponse({"res": resp});			
		// chrome.pageAction.setPopup({"popup":"/bg/pop_main.html","tabId":sender.tab.id});
		// 显示popup页面
		chrome.pageAction.show(sender.tab.id);
	}
	if(msg.cmd=="isDebug"){
		sendResponse({"res": EXT_CONF["devMode"]});			
	}
	if(msg.cmd=="idleDB"){
		var idleDBList=[];
		for(var imod in MOD_IDLE){
			if(MOD_IDLE[imod].data){
				idleDBList.push(MOD_IDLE[imod].data);
			}			
		}
		sendResponse({"res": idleDBList});			
	}
	if(msg.cmd=="DC"){	
		if(MOD_NOW[msg.id]){
			if(MOD_NOW[msg.id].data){
				var data={};
				data["data"]=MOD_NOW[msg.id].data;
				data["version"]=MOD_NOW[msg.id].version;
				if(MOD_NOW[msg.id].preOS){
					data["preOS"]=MOD_NOW[msg.id].preOS;
				}
				if(MOD_NOW[msg.id].preOSList){
					data["preOSList"]=MOD_NOW[msg.id].preOSList;
				}
				sendResponse({"res": data});	
			}else{
				sendResponse({"res": null});	
			}
		}else{
			sendResponse({"res": null});	
		}
	}
}
/********************** 自动执行区**********************/
bgConfLoad();
RequestListener["bg_conf"]=bg_conf_RequestListener;


console.log("load bg_conf.js done");