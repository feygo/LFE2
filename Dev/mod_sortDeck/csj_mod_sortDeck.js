log("load csj_mod_sortDeck.js");

/***********************************卡组排序  功能区  开始******************************************/
/*************************页面数据 读取区******************************/
// 解析卡片内容
function fxCard(idDiv){
	// card373_div
	var id=idDiv.replace("_div","");
	var info=document.getElementById(id).querySelector("span.info");
	
	var rList=[];
	var tmpStr="";
	
	getStr(info);
	if(ffStr!=""){
		ff.push(ffStr);
		ffStr="";
	}	
	// log(ff);
	rList=ff;
	ff=[];

	log(rList);
	return rList;
}
// 暂存list
var ff=[];
// 暂存str
var ffStr="";
// 按照br的分割，来将卡片信息放到list中
function getStr(e){
	var tmpStr="";
	if(e.nodeType==3){
		tmpStr+=e.nodeValue;
		tmpStr=tmpStr.replace(/(\n)|(\r)|(\s)/gi,"");
		if(tmpStr!=""){
			ffStr+=tmpStr;
		}	
	}else if(e.nodeType==1){
		var en=e.nodeName.toUpperCase();
		if(en=="BR"){	
			if(ffStr!=""){
				ff.push(ffStr);
				ffStr="";
			}			
		}else{
			for(var i=0;i<e.childNodes.length;i++){
				getStr(e.childNodes[i]);
			}
		}
	}else{
		log(e);
	}
}

// 轮询各种排序机制
function controller(idDiv,infoL){	
	for(var i=0;i<sortList.length;i++){
		var s=sortList[i];
		var c=0;
		if(s.check==null){
			c=s.checkCommon(infoL)
		}else{
			c=s.check(infoL);
		}		
		if(c>0){
			s.push(idDiv,c);
			s.doSort();
		};
	}
}
/*************************排序规则 更新控制区******************************/
// 基本版本：1
var sortRuleVer=1;
/*************************排序 对象区******************************/
// {"id":"sortByType","check":sortByTypeCheck},

// {"id":"sortByDelayAtt","check":sortByDelayAttCheck},
// {"id":"sortByDelayTalAtt","check":sortByDelayTalAttCheck},

var sortList=[];
var sortConfig=[	
	/*************直接攻击 排序算法区**************/
	//### 直接攻击  物理  排序 :最大值排序
	{"id":"sExByDmg_PD",  "regStrList":["^\\d+物理伤害$","^\\d+物理伤害\\(\\d+%穿透\\)$","^\\d+物理伤害\\(\\d+%穿透\\)吸取生命$","^\\d+物理伤害吸取生命$"],"getValue":getMax,"check":null},
	//### 直接攻击  魔法  排序 :最大值排序
	{"id":"sExByDmg_MD",  "regStrList":["^\\d+法术伤害$","^\\d+法术伤害\\(\\d+%穿透\\)$","^\\d+法术伤害\\(\\d+%穿透\\)吸取生命$","^\\d+法术伤害吸取生命$"],"getValue":getMax,"check":null},
	//### 直接攻击  混乱  排序 :最大值排序
	{"id":"sExByDmg_HD", "regStrList":["^\\d+混乱伤害$","^\\d+混乱伤害\\(\\d+%穿透\\)$"],"getValue":getMax,"check":null},
	//### 直接攻击  精神  排序 :最大值排序
	{"id":"sExByDmg_SD",  "regStrList":["^\\d+精神伤害$"],"getValue":getMax,"check":null},
	//### 直接攻击  真实  排序 :最大值排序
	{"id":"sExByDmg_ZD",  "regStrList":["^\\d+真实伤害$"],"getValue":getMax,"check":null},
	//### 直接攻击  物理魔法双攻  排序 :相加值最大值排序
	{"id":"sExByDmg_PMD",  "regStrList":["^\\d+(法术|物理)伤害$","^\\d+(法术|物理)伤害\\(\\d+%穿透\\)$","^\\d+(法术|物理)伤害\\(\\d+%穿透\\)吸取生命$","^\\d+(法术|物理)伤害吸取生命$"],"getValue":getSum,"check":null},

	/*************直接防御 排序算法区**************/
	//### 直接防御  护甲  排序 :最大值排序
	{"id":"sExByDef_AM",   "regStrList":["^\\d+护甲$","^\\d+护甲\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  护甲可叠加  排序 :最大值排序
	{"id":"sExByDef_AMex", "regStrList":["^\\d+护甲\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  魔甲  排序 :最大值排序
	{"id":"sExByDef_WD",   "regStrList":["^\\d+魔甲$","^\\d+魔甲\\(可叠加\\)$"],"getValue":getMax,"check":null},	
	//### 直接防御  魔甲可叠加  排序 :最大值排序
	{"id":"sExByDef_WDex", "regStrList":["^\\d+魔甲\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  韧性  排序 :最大值排序
	{"id":"sExByDef_WP",   "regStrList":["^\\d+韧性$","^\\d+韧性\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  韧性可叠加  排序 :最大值排序
	{"id":"sExByDef_WPex", "regStrList":["^\\d+韧性\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  自适应防御  排序 :最大值排序
	{"id":"sExByDef_AU",   "regStrList":["^\\d+自适应防御$","^\\d+自适应防御\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  自适应防御可叠加  排序 :最大值排序
	{"id":"sExByDef_AUex", "regStrList":["^\\d+自适应防御\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 直接防御  护甲魔甲双防  排序 :相加值最大值排序
	{"id":"sExByDef_AMWD", "regStrList":["^\\d+(护甲|魔甲)$","^\\d+(护甲|魔甲)\\(可叠加\\)$"],"getValue":getSum,"check":null},

	/*************破甲穿透： 排序算法区**************/
	//### 破甲穿透：  护甲  排序 :最大值排序
	{"id":"sExByDes_AM",  "regStrList":["^破坏\\d+护甲$","^破坏\\d+护甲并造成等同于破甲数值的真实伤害$"],"getValue":getMax,"check":null},
	//### 破甲穿透：  魔甲  排序 :最大值排序
	{"id":"sExByDes_WD",  "regStrList":["^破坏\\d+魔甲$","^破坏\\d+魔甲并造成等同于破甲数值的真实伤害$"],"getValue":getMax,"check":null},
	//### 破甲穿透：  魔法  排序 :乘积最大值排序
	{"id":"sExByPene_MD", "regStrList":["^\\d+法术伤害\\(\\d+%穿透\\)$","^\\d+法术伤害\\(\\d+%穿透\\)吸取生命$"],"getValue":getPdt,"check":null},
	//### 破甲穿透：  物理  排序 :乘积最大值排序
	{"id":"sExByPene_PD", "regStrList":["^\\d+物理伤害\\(\\d+%穿透\\)$","^\\d+物理伤害\\(\\d+%穿透\\)吸取生命$"],"getValue":getPdt,"check":null},
	//### 破甲穿透：  穿透比  排序 :第二个数字 最大值排序
	{"id":"sExByPene_Pre","regStrList":["^\\d+(法术|物理)伤害\\(\\d+%穿透\\)$","^\\d+(法术|物理)伤害\\(\\d+%穿透\\)吸取生命$"],"getValue":getSecMax,"check":null},

	/*************锁定保护： 排序算法区**************/
	//### 锁定保护：  锁定  排序 :最大值排序
	{"id":"sExByFP_FS",  "regStrList":["^锁定目标:\\d+轮$","^锁定目标:\\d+轮\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 锁定保护：  锁叠  排序 :最大值排序
	{"id":"sExByFP_FSex",  "regStrList":["^锁定目标:\\d+轮\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 锁定保护：  防护  排序 :最大值排序
	{"id":"sExByFP_PT",  "regStrList":["^保护友方:\\d+轮$","^保护友方:\\d+轮\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 锁定保护：  防叠  排序 :最大值排序
	{"id":"sExByFP_PTex",  "regStrList":["^保护友方:\\d+轮\\(可叠加\\)$"],"getValue":getMax,"check":null},
	//### 锁定保护：  消除  排序 :最大值排序
	{"id":"sExByFP_CC",  "regStrList":["^消除所有锁定/保护效果$"],"getValue":getCons,"check":null},
	
	/*************其他： 排序算法区**************/
	//### 其他：  治疗  排序 :最大值排序
	{"id":"sExByHeal",  "regStrList":["治疗\\d+生命值","治疗自身\\d+生命值"],"getValue":getMax,"check":null},
	//### 其他：  净化  排序 :最大值排序
	{"id":"sExByPurge",  "regStrList":["^自身净化$","净化"],"getValue":getCons,"check":null},
	//### 其他：  多动  排序 :最大值排序
	{"id":"sExByAP",  "regStrList":["^目标获得\\d+轮额外行动机会$","^获得\\d+轮额外行动机会$","^每轮最大行动次数\\+\\d+$"],"getValue":getMax,"check":null},
	//### 其他：  驱散  排序 :最大值排序
	{"id":"sExByDispel",  "regStrList":["^驱散$"],"getValue":getCons,"check":null},
	//### 其他：  等级  排序 :最大值排序
	{"id":"sExByLV",  "regStrList":["^等级:\\d+$"],"getValue":getMax,"check":null},
	//### 其他：  品质  排序 :最大值排序（独特的排序方法）
	{"id":"sortByType","check":sortByTypeCheck},
	

	/*************目标对象： 排序算法区**************/
	//### 目标对象：  自身  排序 :最大值排序
	{"id":"sExByAim_SF",  "regStrList":["^\\(选择自身为目标\\)$"],"getValue":getCons,"check":null},
	//### 目标对象：  友方  排序 :最大值排序
	{"id":"sExByAim_YF",  "regStrList":["^\\(选择所有友方目标\\)$","^\\(选择友方"],"getValue":getCons,"check":null},
	//### 目标对象：  敌方  排序 :最大值排序
	{"id":"sExByAim_DF",  "regStrList":["^\\(选择所有敌方目标\\)$","^\\(选择敌方"],"getValue":getCons,"check":null},
	//### 目标对象：  所有  排序 :最大值排序
	{"id":"sExByAim_ALL",  "regStrList":["^\\(选择所有场上目标\\)$"],"getValue":getCons,"check":null},
	
	/*************自身改变： 排序算法区**************/
	//### 自身改变：  下一次法术  排序 :最大值排序
	{"id":"sExByDmgSF_addMDnx",  "regStrList":["\\+\\d+下一次法术攻击伤害"],"getValue":getMax,"check":null},
	//### 自身改变：  下一次物理  排序 :最大值排序
	{"id":"sExByDmgSF_addPDnx",  "regStrList":["\\+\\d+下一次物理攻击伤害"],"getValue":getMax,"check":null},
	//### 自身改变：  法术 永久  排序 :最大值排序
	{"id":"sExByDmgSF_addMDfe",  "regStrList":["\\+\\d+法术攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	//### 自身改变：  物理 永久  排序 :最大值排序
	{"id":"sExByDmgSF_addPDfe",  "regStrList":["\\+\\d+物理攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	
	//### 自身改变：  下一次法术  排序 :最大值排序
	{"id":"sExByDmgSF_decMDnx",  "regStrList":["\\-\\d+下一次法术攻击伤害"],"getValue":getMax,"check":null},
	//### 自身改变：  下一次物理  排序 :最大值排序
	{"id":"sExByDmgSF_decPDnx",  "regStrList":["\\-\\d+下一次物理攻击伤害"],"getValue":getMax,"check":null},
	//### 自身改变：  法术 永久  排序 :最大值排序
	{"id":"sExByDmgSF_decMDfe",  "regStrList":["\\-\\d+法术攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	//### 自身改变：  物理 永久  排序 :最大值排序
	{"id":"sExByDmgSF_decPDfe",  "regStrList":["\\-\\d+物理攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	
	/*************对象改变： 排序算法区**************/
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_addMDnx",  "regStrList":["使目标\\+\\d+下一次法术攻击伤害"],"getValue":getMax,"check":null},
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_addPDnx",  "regStrList":["使目标\\+\\d+下一次物理攻击伤害"],"getValue":getMax,"check":null},
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_addMDfe",  "regStrList":["使目标\\+\\d+法术攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_addPDfe",  "regStrList":["使目标\\+\\d+物理攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_decMDnx",  "regStrList":["使目标\\-\\d+下一次法术攻击伤害"],"getValue":getMax,"check":null},
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_decPDnx",  "regStrList":["使目标\\-\\d+下一次物理攻击伤害"],"getValue":getMax,"check":null},
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_decMDfe",  "regStrList":["使目标\\-\\d+法术攻击伤害\\(永久\\)"],"getValue":getMax,"check":null},
	//### 对象改变：  目标  排序 :最大值排序
	{"id":"sExByDmgMB_decPDfe",  "regStrList":["使目标\\-\\d+物理攻击伤害\\(永久\\)"],"getValue":getMax,"check":null}
	
	];

// 父对象
function sorter(sId){
	this.id=sId;
	this.data=[];
	// 外部赋值
	this.check=function(cInfo){
		return false;
	}
	// 外部赋值
	this.regStrList=[];
	this.regLog=function(){
		for(var j=0;j<this.regStrList.length;j++){
			var tr=new RegExp(this.regStrList[j], "gi");
			debug(tr);
		}	
	}
	// 外部赋值
	this.getValue=function(str,r){
		return r;
	}
	this.checkCommon=function (cInfo){
		var r=0;
		for(var i=0;i<cInfo.length;i++){
			var tmp=cInfo[i];
			var isMatch=false;
			var rStr=null;
			for(var j=0;j<this.regStrList.length;j++){
				var tr=new RegExp(this.regStrList[j], "gi");
				if(tr.test(tmp)){
					isMatch=true;
					rStr=tmp.match(tr);
				}
			}		
			if(isMatch&&rStr!=null){
				for(var j=0;j<rStr.length;j++){
					r=this.getValue(rStr[j],r);
				}				
			}		
		}
		return r;
	}
	this.push=function(idDiv,info){
		this.data.push({"cid":idDiv,"info":info});
	};
	this.sort=function(a,b){		
		return b.info-a.info;
	}
	this.doSort=function(){
		return this.data.sort(this.sort);
	}
	
} 
// 父对象 工具对象
// 获取最大值
function getMax(tmp,r){
	var regNum=/\d+/i;
	var rr=parseInt(tmp.match(regNum)[0]);
	if(rr>r){
		r=rr;
	}
	return r;
}
// 获取第二个的最大值   ##match 多值要加g，单值不加g
function getSecMax(tmp,r){
	var regNum=/\d+/gi;
	var rr=parseInt(tmp.match(regNum)[1]);
	if(rr>r){
		r=rr;
	}	
	return r;
}
// 获取固定值
function getCons(tmp,r){
	r=100;
	return r;
}
// 获取求和值
function getSum(tmp,r){
	var regNum=/\d+/i;
	var rr=parseInt(tmp.match(regNum)[0]);
	r+=rr;
	return r;
}
// 获得两数乘积
function getPdt(tmp,r){
	var regNum=/\d+/gi;
	var r1=parseInt(tmp.match(regNum)[0]);
	var r2=parseInt(tmp.match(regNum)[1]);
	var rr=r1*r2/100;
	if(rr>r){
		r=rr;
	}	
	return r;
}

//###### 按照卡片类型 排序：粉紫棕橙蓝绿白
function sortByTypeCheck(cInfo){
	var r=0;
	var msg="";
	for(var i=0;i<cInfo.length;i++){
		var tmp=cInfo[i];
		msg=tmp;
		// 卡片:黑暗之怒(精良)
		// ^自身净化$
		var reg1=/^卡片\:.*\(.*\)$/gi;
		if(reg1.test(tmp)){			
			var t=tmp.match(/\(.*\)/gi)[0];
			if(t=="(不朽)"){
				r=7;
			}else if(t=="(职业)"){
				r=6;
			}else if(t=="(PVP)"){
				r=5;
			}else if(t=="(合成)"){
				r=4;
			}else if(t=="(精良)"){
				r=3;
			}else if(t=="(优秀)"){
				r=2;
			}else if(t=="(普通)"){
				r=1;
			}else{
				r=0;
			}
			break;
		}
	}
	if(r==0){
		log("sortByTypeCheck获取卡片类型出现异常："+msg);
	}
	return r;
}
//###### 按照带延迟伤害 排序 :仅对于法术和物理伤害统计伤害总值，取最大
function sortByDelayAttCheck(cInfo){
	var r=0;
	var msg="";
	for(var i=0;i<cInfo.length;i++){
		var tmp=cInfo[i];
		msg=tmp;
		//获取积累伤害值（中毒+召唤）
		var reg3=/<(中毒|召唤)>每轮:.*,持续\d*轮/gi;
		if(reg3.test(tmp)){			
			var reg1=/\d*(法术|物理)伤害(|\(\d*%穿透\)),持续\d*轮/gi;
			if(reg1.test(tmp)){			
				var reg2=/\d+/gi;
				var nL=tmp.match(reg2);
				// log(nL);
				var r1,r2,rr;
				if(nL.length==2){
					r1=parseInt(nL[0]);
					r2=parseInt(nL[1]);
					rr=r1*r2;
				}else if(nL.length==3){
					r1=parseInt(nL[0]);
					r2=parseInt(nL[2]);
					rr=r1*r2;
				}				
				if(rr>r){
					r=rr;
				}
			}else{
				// log(tmp);
				r=1;
			}
		}		
	}
	return r;	
}

/*************************页面操作反馈区******************************/
// 卡组桌面排序
function sortDeck(sId){
	debug("排序命令："+sId);
	var objectStore=DB_SortDeck.transaction([DB_OS_Sort], "readwrite").objectStore(DB_OS_Sort);
    var request = objectStore.get(sId);
	request.onsuccess = function(evt) {
		var rs = request.result
		var data=rs.data;
		if(data==null||data.length==0){
			debug("待排序元素为0");
			alert("未发现符合排序要求的卡片！");
			return;
		}
		debug("排序元素："+data.length);
		rs.data=doSortDeckEx(data);		
		var requestUpdate = objectStore.put(rs);
		requestUpdate.onerror = function(event) {
			debug("排序引擎数据出错:"+evt.target.error.message);
		};	
		requestUpdate.onsuccess = function(evt) {
			debug("排序引擎数据更新:"+rs.id);
		}
	}	
}
// 按照卡组内容排序 {"cid":idDiv,"info":info} COPY_deck_card514_div card514_div
// 用来代替原有方法
function doSortDeckEx(data){	
	// 梳理排序数据
	var tmpMap={};
	var newId=[];
	for(var i=0;i<data.length;i++){
		tmpMap[data[i].cid]=data[i].info;
		newId.push(data[i].cid);
	}
	// 梳理排序数据
	var ac=document.querySelector("#active_cards");
	var cr=ac.querySelectorAll("div.cardlist.realcard");
	debug("当前card元素："+ac.querySelectorAll("div.cardlist.realcard").length);
	
	// 按照cardId进行排序，并组织数组
	for(var j=0;j<cr.length;j++){
		var tmpId=cr[j].id;
		if(tmpMap[tmpId]==null){
			newId.push(tmpId);
		}
	}
	debug("组织后元素数："+newId.length);
	
	//按照排序序列获取元素
	var newAc=document.createElement("DIV");	
	for(var k=0;k<newId.length;k++){
		var pxObj=newId[k];
		//追加到active_cards子对象末尾
		var cardCopy=ac.querySelector("#COPY_deck_"+pxObj);
		var unReal=true;
		if(cardCopy!=null){
			newAc.appendChild(cardCopy.cloneNode(true));
			unReal=false;
		}
		var card=ac.querySelector("#"+pxObj);
		if(card!=null){
			newAc.appendChild(card.cloneNode(true));
			unReal=false;
		}	
		if(unReal){
			delete tmpMap[pxObj];
		}
	}
	debug("排序后元素数："+newAc.children.length);
	document.querySelector("#active_cards").innerHTML=newAc.innerHTML;
	debug("排序后总元素："+ac.querySelectorAll("div.cardlist.realcard").length);
	var r=[];
	for(var cid in tmpMap){
		r.push({"cid":cid,"info":tmpMap[cid]});
	}
	return r;
}

/***********************************多卡排序  功能区  结束******************************************/

/************************ 数据预备区 **********************/
var DB_OS_Sort;
// {"key":DB_OS_SortConf,"value":}
const Key_SortVer="SortVer";
const Key_LocalCard="LocalCard";
var DB_OS_SortConf;

var DB_SortDeck;
// 数据库连接之后 自动执行的函数
function success_DB_SortDeck(db){
	// 变量赋值
	DB_OS_Sort = DC[SDECK_N].userOS[0];
	DB_OS_SortConf = DC[SDECK_N].userOS[1];
	// 检查引擎版本
	DB_SortDeck=db;
	var trans=DB_SortDeck.transaction([DB_OS_SortConf,DB_OS_Sort], "readwrite");
	var OS_SortConf=trans.objectStore(DB_OS_SortConf);
    var request = OS_SortConf.get(Key_SortVer);
	request.onsuccess = function(evt) {
		// 检查排序引擎版本
		var sortVer = request.result;
		if(sortVer==undefined||sortVer==null||sortVer["value"]!=sortRuleVer){
			//如果版本不存在，如果版本有更新，则更新版本
			var verUpdate = OS_SortConf.put({"key":Key_SortVer,"value":sortRuleVer});
			OS_SortConf.put({"key":Key_LocalCard,"value":null});
			verUpdate.onsuccess = function(evt) {
				var msg="排序引擎版本更新:"+sortRuleVer;
				debug(msg);
				//清空排序引擎数据
				var OS_Sort=trans.objectStore(DB_OS_Sort);				
				var requestClear = OS_Sort.clear();
				requestClear.onerror = function(evt) {
					debug("引擎数据清空出错:"+evt.target.error.message);
				};	
				requestClear.onsuccess = function(evt) {
					var msg="引擎数据清空成功";
					debug(msg);
					initSorter();
					// 载入排序引擎数据
					loadSorter();
				}
			}
			verUpdate.onerror =function(evt){
				var msg="排序引擎版本更新出错:"+evt.target.error.message;
				debug(msg);
			}
		}else{
			// 如果存在版本，则载入引擎数据
			loadSorter();
		}		
	}
	request.onerror =function(evt){
		var msg="排序引擎版本读取出错:"+evt.target.error.message;
		debug(msg);
	}
}
// 将sortConfig中的配置项，写入到db中
function initSorter(){
	// 初始化引擎数据
	var OS_Sort=DB_SortDeck.transaction([DB_OS_Sort], "readwrite").objectStore(DB_OS_Sort);	
	for(var i=0;i<sortConfig.length;i++){	
		var reqInit=OS_Sort.add({"id":sortConfig[i].id,"data":[]});
		reqInit.onsuccess = function(evt) {
			debug("引擎数据初始化:"+evt.target.result);
		}
		reqInit.onerror = function(evt) {
			debug("引擎数据初始化出错:"+evt.target.error.message);
		};	
	}	
}
// 装载排序对象的容器，给SortList赋值，然后调用页面排序检测的动作
function loadSorter(){
	// 载入规则引擎
	var scLen=sortConfig.length;
	var tmpNum=0;
	debug("排序容器加载开始...");
	var tmpMap={};
	for(var i=0;i<sortConfig.length;i++){
		var s=sortConfig[i];		
		var tmp=new sorter(s.id);
		tmp.check=s.check;
		if(s["regStrList"]!=null){tmp.regStrList=s.regStrList;}
		if(s["getValue"]!=null){tmp.getValue=s.getValue;}				
		tmp.regLog();	
		tmp.data=[];
		tmpMap[s.id]=tmp;
	}
	for(var id in tmpMap){
		var OS_Sort=DB_SortDeck.transaction([DB_OS_Sort], "readwrite").objectStore(DB_OS_Sort);	
		var reqData = OS_Sort.get(id);
		reqData.onerror = function(evt) {
			debug("引擎数据读取出错:"+evt.target.error.message);
		};	
		reqData.onsuccess = function(evt) {
			// 写入sortList作为排序对象的容器
			var tmpS=tmpMap[evt.target.result.id];
			tmpS.data=evt.target.result.data;
			sortList.push(tmpS);
			debug("引擎数据读取成功:"+evt.target.result.id);
			
			// 如果对象容器加载完成
			tmpNum++;
			// debug(scLen+"|"+tmpNum);
			if(scLen==tmpNum){
				debug(sortList);
				debug("排序容器加载结束...");
				// 获取页面的新卡片
				updateCardList();		
			}
		}
	}	
}
// 根据排序对象的容器中，检测页面中是否有新增的卡片信息
function updateCardList(){
	//获取所有卡牌列表
	var nowCardList=document.querySelectorAll("div.cardlist.realcard");
	// log(nowCardList[0]);
	debug("页面卡片数量:"+nowCardList.length);

	var tx=DB_SortDeck.transaction([DB_OS_SortConf,DB_OS_Sort], "readwrite");
	var OS_SortConf=tx.objectStore(DB_OS_SortConf)
	var reqLC=OS_SortConf.get(Key_LocalCard);
	reqLC.onsuccess = function(evt) {
		// 获取本地存储的cardList
		var rs=evt.target.result;
		var localCard=rs.value;		
		if(localCard==null){
			localCard={};			
		}
		debug("存储中卡片数量:"+Tool_getObjLength(localCard));
		
		var newLcl={};
		var nCnt=0;
		//循环检查新卡牌
		for(var i=0;i<nowCardList.length;i++){
			var tmp=nowCardList[i].id;
			if(localCard[tmp]==null){
				// log(tmp);			
				nCnt++;
				//解析新卡牌的情况
				var infoL=fxCard(tmp);
				// log(infoL);
				//将卡片送入排序池
				controller(tmp,infoL);
			}
			// 更新本地卡组列表
			newLcl[tmp]=i;
			// 删除本地卡牌信息
			delete localCard[tmp];
		}
		debug("发现有差异的卡片数量:"+Tool_getObjLength(localCard));
		debug("发现未排序的卡片数量："+nCnt);
		// 存储sortList中的数据
		if(nCnt>0){
			debug("引擎数据更新...");
			debug(sortList);
			var OS_Sort=DB_SortDeck.transaction([DB_OS_Sort], "readwrite").objectStore(DB_OS_Sort);	
			for(var j=0;j<sortList.length;j++){				
				OS_Sort.put({"id":sortList[j].id,"data":sortList[j].data});
				debug("引擎数据更新:"+sortList[j].id);
			}
		}		
		// 存储本地卡组列表
		rs.value=newLcl;
		var reqLocalCard=OS_SortConf.put(rs);
		reqLocalCard.onsuccess = function(evt) {
			debug("存储中卡片数量更新:"+Tool_getObjLength(newLcl));
		}
	}
}
/********************** 通道消息 处理区**********************/
/**
"cmd":"sortDeck","id":slt.value
**/
function handlePort_modSortDeck(port){	
	if(port.name == SDECK_N){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "sortDeck"){
				sortDeck(msg.id);
			}		
		});
	}
}
/********************** 自动执行区**********************/
var SDECK_N="mod_sortDeck";
function csjLoad_mod_sortDeck(){
	chrome.runtime.onConnect.addListener(handlePort_modSortDeck);
	Tool_connModDB(SDECK_N,success_DB_SortDeck);
}
csjLoad_mod_sortDeck();
log("load csj_mod_sortDeck.js done");