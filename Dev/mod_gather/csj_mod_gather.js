log("load csj_mod_gather.js");

/**	页面操作区
*/
/** 获得可以使用的采集项目 
{"id":"","name":""}
*/
/** 从未采集的原始界面获取采集项目列表
*/
function getGAListInFist(){
	var list=[];
	var gaList=document.querySelectorAll(".gather.row>.floatright.inline");
	for(var i=0;i<gaList.length;i++){
		var tmpN=gaList[i].children[0];
		if(tmpN.nodeName=="A"){
			var id=gaList[i].parentElement.id.replace("gather_entry","");
			var name=gaList[i].parentElement.children[0].innerText;
			list.push({"id":id,"name":name});
		}
	}
	return list;
}
/** 从采集之后的界面获取采集项目列表
*/
function getGAListInAfter(){
	var list=[];
	var idP1=document.querySelector("#gather_after_story>.gather.row");
	var idP2=document.querySelector("#gather_after_story>.label.inline.inv");
	var id=idP1.id.replace("gather_entry","");
	var name=idP2.innerText;
	list.push({"id":id,"name":name});
	return list;
	
}
/** 从界面获取采集项目列表 进行判断
*/
function getGAList(){
	var idP=document.querySelector("#gather_after_story");
	if(idP.innerHTML==""){
		return getGAListInFist();
	}else{
		return getGAListInAfter();
	}
}
// log(getGAList());
function getAP(){
	var apE=document.querySelector("#menu_action_point");
	var ap=apE.innerText;
	if(nowAP!="0"&&nowAP<parseInt(ap)){
		return nowAP;
	}
	return ap;
}
// log(getAP());

/**
	向后台发送请求,执行采集操作
*/

function doGA(type,callback) {
	isRuning=true;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
		  if (xhr.status == 200) {
			var res = JSON.parse(xhr.responseText);
			callback(type,res);
		  } else {
			log(xhr);
		  }
		}
	  }
	var url ="/json/city/action/gathering";
	var oForm = new FormData();
	oForm.append("id", type);
	xhr.open('POST', url, true);
	xhr.send(oForm);
};
/**回调函数，用于处理后续操作
	进行结果判断，解析结果
	5.0、出现失败
	5.1、执行次数到达
	5.4、没有足够行动点
	5.2、出现技能升级
	5.3、出现打不过怪物的情况
*/
/** 反馈信息集
"{"success":true,
"text":"",
"apreduce":"156"}"
*/
/** 战斗结果存储
1、战斗结果 成功，失败，无视
2、物品获得
3、是否发生战斗
4、技能增长
5、精英技能增长
*/
/**var R={"rs":"","wp":"","zd":"","jn":"","note":""};
*/
function AfterGA(type,res){
	if(res.success){
		// log(res);
		var isContinue=true;
		var stopMsg="百目说："
		//更新当前AP值
		nowAP=res.apreduce;
		//解析结果内容
		var yjList=yj(res.text)
		var R={"rs":"","wp":"","zd":"","jn":"","note":""};
		for(var i=0;i<yjList.length;i++){
			var tmp=yjList[i];
			// log(tmp);
			var reg1=/你顺利的完成了采集并获得了物品/gi;
			if(reg1.test(tmp)){
				R["rs"]="成功";
				continue;
			}
			var reg2=/.* 已经获得了物品\[.*\]X \d*/gi;
			if(reg2.test(tmp)){
				var reg21=/已经获得了物品\[.*\]X \d*/gi;
				var rs21=tmp.match(reg21);
				R["wp"]+=rs21[0].replace("已经获得了物品","")+"|";
				continue;
			}		
			var reg3=/.* 意外了遭遇了怪物的攻击，并在战斗中 被击败/gi;
			if(reg3.test(tmp)){
				R["zd"]="遭遇战斗失败";
				
				tmpFailCnt++;			
				debug(tmpFailCnt+"|"+FailCnt);
				if(tmpFailCnt==FailCnt){				
					isContinue=false;
					stopMsg+='"遭遇怪物战斗失败！*_*"\n';
					continue;
				}					
			}		
			var reg4=/.* 意外了遭遇了怪物的攻击，并在战斗中 获得胜利/gi;
			if(reg4.test(tmp)){
				R["zd"]="遭遇战斗胜利";
				continue;
			}		
			var reg5=/.* 的技能\[.*\]提升了 \d* 点\(\d* \/ \d*\)/gi;
			if(reg5.test(tmp)){
				var reg51=/的技能\[.*\]提升了 \d* 点\(\d* \/ \d*\)/gi;
				var str51=tmp.match(reg51);
				
				var reg52=/\[.*\]/gi;
				var name=str51[0].match(reg52)[0];
				var reg53=/\d+/gi;
				var nList=str51[0].match(reg53);
				// log(nList);
				var value="("+nList[1]+"/"+nList[2]+")";				
				R["jn"]+=name+""+value+"|";
				continue;
			}				
			var reg6=/.* 已经掌握\[.*\]技能 \(等级 \d*\)/gi;
			if(reg6.test(tmp)){				
				var reg61=/\[.*\]/gi;
				var str61=tmp.match(reg61)[0];				
				R["jn"]+=str61+"提升|";				
				isContinue=false;
				stopMsg+='"技能提升啦！^_^"\n';			
				continue;
			}			
			var reg7=/获得属性:.*/gi;
			if(reg7.test(tmp)){
				var str71=tmp.match(reg7)[0];
				var str72=str71.replace("获得属性:","");
				R["note"]+=str72;
				continue;
			}
			R["note"]+=tmp;
		}
		// log(R);
		//存储采集结果
		DB_GA.transaction([DB_OS_GARS], "readwrite").objectStore(DB_OS_GARS).add(R);
		//判断是否继续运行		
		// 5.1、执行次数到达
		tmpRunCnt++;
		if(isContinue==true&&RunCnt!=-1&&tmpRunCnt>=RunCnt){
			stopMsg+='"指定次数采集完成！@_@"\n';
			isContinue=false;
		}
		// 5.4、没有足够行动点
		if(isContinue==true&&parseInt(res.apreduce)<10){
			stopMsg+='"没有AP啦～讨厌！T_T"\n';
			isContinue=false;
		}
		
		// 继续调用
		if(isContinue){
			doGA(type,AfterGA);
		}else{
			isRuning=false;
			alert(stopMsg+"\n自动采集已经终止，请查收结果!");
		}
	}else{
		// 存储采集结果
		var rl={"rs":"","wp":"","zd":"","jn":"","note":"异常："+res.msg};		
		var reqAdd2 = DB_GA.transaction([DB_OS_GARS], "readwrite").objectStore(DB_OS_GARS).add(rl);
		reqAdd2.onsuccess=function(evt){
			debug(evt);
		}		
		alert('百目说："出现了某种神秘异常！"');
		debug(res);
	}
}
// 解析反馈语句
function yj(txt){
	var objE = document.createElement("div");
　　objE.innerHTML = txt;
	var rsList=[];
	var tmpStr="";
	var nList=objE.children[0].childNodes;
	debug(nList);
	for(var i=0;i<nList.length;i++){
		var n=nList[i];
		var nn=n.nodeName;
		if(nn.toUpperCase()=="H2"){
			tmpStr=Tool_trim(n.innerText);
			rsList.push(tmpStr);
			tmpStr="";
		}else if(nn.toUpperCase()=="A"){
		
			for(var j=0;j<n.children.length;j++){
				// log(n.children[j].className);
				if(n.children[j].className=="ITEM_item"){
					tmpStr+=Tool_trim(n.children[j].innerText);
				}
			}
			
		}else if(nn.toUpperCase()=="#TEXT"){
			tmpStr+=Tool_trim(n.nodeValue);
		}else if(nn.toUpperCase()=="SPAN"){
			tmpStr+=Tool_trim(n.innerText);
		}else if(nn.toUpperCase()=="BR"){
			rsList.push(tmpStr);
			tmpStr="";
		}else{
			rsList.push(n);			
		}
		
	}
	log(rsList);
	return rsList;
}


var RunCnt=0;
var tmpRunCnt=0;

var FailCnt=1;
var tmpFailCnt=0;

var isRuning=false;

var nowAP=0;
// doGA("6",AfterGA);
/** 消息通讯区*/
// {"gaList":[],"ap":"","gaRS":[]}
function loadGA(port){
	var R={};
	//读取可采集项
	R["gaList"]=getGAList();
	//读取可行动点
	R["ap"]=getAP();
	//读取战斗结果	
	var garsList=[];
	var objectStore = DB_GA.transaction([DB_OS_GARS], "readonly").objectStore(DB_OS_GARS);
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			// debug(cursor);
			garsList.push(cursor.value);
			cursor.continue();
		}else {
			if(garsList!=null&&garsList.length!=0){
				R["gaRS"]=garsList;
			}else{
				var nullR={"rs":"","wp":"","zd":"","jn":"","note":"无上次采集的数据"}
				R["gaRS"]=[nullR];		
			}
			debug("读取采集信息成功！");
			debug(R);
			port.postMessage({"cmd":"load.rs","data":R});
		}
	};	
}
function beginGA(data){
	if(data.gaNum!=0){
		if(!isRuning){
			RunCnt=data.gaNum;
			FailCnt=data.failNum;
			tmpRunCnt=0;
			tmpFailCnt=0;
			var reqClear = DB_GA.transaction([DB_OS_GARS], "readwrite").objectStore(DB_OS_GARS).clear();
			reqClear.onsuccess=function(evt){
				doGA(data.gaType,AfterGA);
			}			
		}else{
			alert("自动采集正在执行中，请稍后再试！");
		}
	}
}

/************************ 数据预备区 **********************/
// {"rs":"","wp":"","zd":"","jn":"","note":"陌上开花缓缓归。"},
const DB_OS_GARS = USER_NAME+"#gars";
const DB_NAME_GA = 'LFE2#Mod#Gather';

var DB_GA;

function update_DB_GA(evt){
	evt.currentTarget.result.createObjectStore(DB_OS_GARS, { autoIncrement: true });
}

function success_DB_GA(evt){
	DB_GA = evt.currentTarget.result;
}
/********************** 通道消息 处理区**********************/
function handlePort_modGA(port){	
	if(port.name == "mod_gather"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load"){
				loadGA(port);
			}else if (msg.cmd == "ga"){
				beginGA(msg.data);
			}
		});
	}
}

/********************** 自动执行区**********************/
function csjLoad_mod_ga(){
	chrome.runtime.onConnect.addListener(handlePort_modGA);
	Tool_getDB(DB_NAME_GA,[DB_OS_GARS],update_DB_GA,success_DB_GA);
}
csjLoad_mod_ga();
// Tool_delDB(DB_NAME_GA);

log("load csj_mod_gather.js done");
