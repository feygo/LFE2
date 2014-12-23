log("c-training.js is loading");

/** 变量定义区 */
var nowAP=0;

var RunCnt=2;
var tmpRunCnt=0;

var FailCnt=1;
var tmpFailCnt=0;

var isRuning=false;


/*******************************信息获取区**************************************/
/** 获取怪物列表 
{"mob":mobname,"lv":""}
*/

function getMobList(){
	var list=[];
	var mmList=document.querySelectorAll("#mobunit>.name.floatinline");
	for(var i=0;i<mmList.length;i++){
		var mmDiv=mmList[i];
		
		var mm=mmDiv.querySelector("SPAN.tiplink.playername.nobr");
		var mmName=mm.innerText;
		var mmId=mm.id.replace("character_name","");
				
		var mms=mmDiv.querySelector("div.small");
		var mmlv=parseInt(mms.children[0].innerText);
		
		// log(mmId+"|"+mmName+"|"+mmlv);
		
		var lowLv=USER_LV-Lvlow;
		var upLv=USER_LV+Lvup;		
		if(lowLv<=mmlv&&mmlv<=upLv){
			var value="Lv."+mmlv+" "+mmName;
			// log(value);
			list.push({"value":value,"key":mmId});
		}
	}
	log("怪物列表："+lowLv+"-"+upLv);
	debug(list);
	return list;
}
// getMobList();
/** 获取卡组列表 

*/
function getCardList(){
	var gs=document.getElementById("gear_selector");
	return gs.innerHTML;
}
// log(getCardList());
/** 获取AP行动值*/
function getAP(){
	var apE=document.querySelector("#menu_action_point");
	var ap=apE.innerText;
	if(nowAP!="0"&&nowAP<parseInt(ap)){
		return nowAP;
	}
	return ap;
}
/*******************************自动训练区**************************************/
function doTraining(gId,mId,callback) {
	debug("gId:"+gId+".mId:"+mId);
	isRuning=true;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
		  if (xhr.status == 200) {
			var res = JSON.parse(xhr.responseText);
			callback(gId,mId,res);
		  } else {
			log(xhr);
		  }
		}
	  }
	var url ="/json/fight/action/training";
	var oForm = new FormData();
	oForm.append("gear_selector", gId);
	oForm.append("showlog", 0);
	oForm.append("showanima", 0);
	oForm.append("savelog", 0);
	oForm.append("training_mob", mId);
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
battle_winner: 1
combatlog_query: null
nowap: "74"
success: true
text: ">"
tinytext: null

var R={"rs":"","jq":"","jy":"","jn":"","note":""};
*/

function AfterTraining(gId,mId,res){
	if(res.success){
		debug(res);
		var isContinue=true;
		var stopMsg="百目说："
		//更新当前AP值
		nowAP=res.nowap;
		
		var R={"rs":"","jq":"","jy":"","jn":"","note":""};
		//战斗成功与失败 0:成功 1：失败
		if(res.battle_winner==1){
			R["rs"]="战败";		
			tmpFailCnt++;			
			debug(tmpFailCnt+"|"+FailCnt);
			if(tmpFailCnt==FailCnt){				
				isContinue=false;
				stopMsg+='"用‘战五渣‘来形容你，战五渣都会觉得耻辱！"\n';
			}			
			
		}
		if(res.battle_winner==0){
			R["rs"]="胜利";
			
			//解析战斗结果内容
			var yjList=zdJX(res.tinytext);
			
			for(var i=0;i<yjList.length;i++){
				var tmp=yjList[i];
				debug("==战斗结果解析==");
				debug(tmp);
				var reg2=/.d* 获得了 \d* 金币/gi;
				if(reg2.test(tmp)){
					var reg21=/获得了 \d* 金币/gi;
					var rs21=tmp.match(reg21);
					var dReg21=/\d+/gi;
					var d21=rs21[0].match(dReg21);
					R["jq"]+=d21[0];
					continue;
				}				
				var reg3=/.d* 的经验值增加了 \d* 点\(\d* \/ \d*\)/gi;
				if(reg3.test(tmp)){
					var reg31=/的经验值增加了 \d* 点\(\d* \/ \d*\)/gi;
					var rs31=tmp.match(reg31);
					var dReg31=/\d+/gi;
					var d31=rs31[0].match(dReg31);					
					R["jy"]+=d31[0];
					if(parseInt(d31[1])==parseInt(d31[2])){
						isContinue=false;
						stopMsg+='"你的经验槽就这么一点点么？！"\n';						
					}
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
					// var value="("+nList[1]+"/"+nList[2]+")";		
					var value="(<b>"+nList[0]+"</b>>>"+nList[1]+")";						
					R["jn"]+=name+""+value+"|";
					if(nList[1]==nList[2]){
						isContinue=false;
						stopMsg+='"有某些技能提升，阁下您更加雄壮了！"\n';
					}
					continue;
				}	
				var reg6=/已经掌握/gi;
				if(reg6.test(tmp)){
					var reg61=/\[.*\]/gi;
					var str61=tmp.match(reg61)[0];				
					R["jn"]+=str61+"提升|";				
					isContinue=false;
					stopMsg+='"有某些技能提升，阁下您更加雄壮了！"\n';
					continue;	
				}				
				R["note"]+=tmp;
			}			
		}		
		// log(R);
		//存储采集结果
		DB_TRN.transaction([DB_OS_TRNRS], "readwrite").objectStore(DB_OS_TRNRS).add(R);
		//判断是否继续运行		
		// 5.1、执行次数到达
		tmpRunCnt++;
		if(isContinue==true&&RunCnt!=-1&&tmpRunCnt>=RunCnt){
			stopMsg+='"作战任务完成！真是爽快～"\n';
			isContinue=false;
		}
		// 5.4、没有足够行动点
		if(isContinue==true&&parseInt(res.nowap)<12){
			stopMsg+='"时间好短，你的AP不够看呀～！"\n';
			isContinue=false;
		}
		
		// 继续调用
		if(isContinue){
			doTraining(gId,mId,AfterTraining);
		}else{
			isRuning=false;
			alert(stopMsg+"\n自动训练已经终止，请查收结果!");
		}
	}else{
		// 存储训练结果
		var rl=[{"rs":"","jq":"","jy":"","jn":"","note":"异常："+res.msg}];
		var reqAdd2 = DB_TRN.transaction([DB_OS_TRNRS], "readwrite").objectStore(DB_OS_TRNRS).add(rl);
		reqAdd2.onsuccess=function(evt){
			debug(evt);
		}	
		alert('百目说："是时候找寻求援助了！"');
		log(res);
	}
}

function zdJX(txt){
	var objE = document.createElement("div");
　　objE.innerHTML = txt;
	var rsList=[];
	var tmpStr="";
	var nList=objE.childNodes;
	debug(nList);
	for(var i=0;i<nList.length;i++){
		var n=nList[i];
		var nn=n.nodeName;
		if(nn.toUpperCase()=="#TEXT"){
			tmpStr+=Tool_trim(n.nodeValue);
		}else if(nn.toUpperCase()=="SPAN"){
			tmpStr+=Tool_trim(n.innerText);
		}else if(nn.toUpperCase()=="B"){
			tmpStr+=Tool_trim(n.innerText);
		}else if(nn.toUpperCase()=="BR"){
			rsList.push(tmpStr);
			tmpStr="";
		}else if(nn.toUpperCase()=="DIV"){	
			// 如果是测试内容，则屏蔽解析
			if(n.style.display=="none"){
			}else{
				rsList.push(n);	
			}
		}else{
			rsList.push(n);			
		}		
	}
	debug(rsList);
	return rsList;
}
// var tmpT="百目悟空 获得了 39 金币 <br /> 百目悟空 的经验值增加了 1 点 <span class='lesser'>(100 / 100)</span>  <b class='lesser'>(经验值已满)</b> <br /> 百目悟空 的技能 <span class=upper>[斧]</span> 提升了 3 点 <span class=lesser> (174 / 180) </span><br />";
// log(zdJX(tmpT));
/*******************************消息通信区**************************************/
// {"mobList":[],"ap":"","gSelHTML":"","trnRS":[]}
function loadTrn(data,port){
	//设置怪物获取等级范围
	Lvlow=data.lvLow;
	Lvup=data.lvUp;
	
	var R={};
	//读取目标怪物项
	R["mobList"]=getMobList();
	//读取可行动点
	R["ap"]=getAP();
	//读取可选卡组html
	R["gSelHTML"]=getCardList();
	//读取战斗结果
	var trnrsList=[];
	var objectStore = DB_TRN.transaction([DB_OS_TRNRS], "readonly").objectStore(DB_OS_TRNRS);
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			trnrsList.push(cursor.value);
			cursor.continue();
		}else {
			if(trnrsList!=null&&trnrsList.length!=0){
				R["trnRS"]=trnrsList;
			}else{
				var nullR={"rs":"","jq":"","jy":"","jn":"","note":"无上次训练的数据"};
				R["trnRS"]=[nullR];		
			}
			debug("读取训练信息成功！");
			debug(R);
			port.postMessage({"cmd":"load.rs","data":R});
		}
	};	
}
// {"gId":gid,"mId":mid,"trnNum":trnNum}
function beginTrn(data){
	if(data.trnNum!=0){
		if(!isRuning){
			RunCnt=data.trnNum;	
			FailCnt=data.failNum;
			tmpRunCnt=0;	
			tmpFailCnt=0;
			var reqClear = DB_TRN.transaction([DB_OS_TRNRS], "readwrite").objectStore(DB_OS_TRNRS).clear();
			reqClear.onsuccess=function(evt){
				doTraining(data.gId,data.mId,AfterTraining);
			}			
		}else{
			alert('百目说："本大人正在奋战，不要添乱！"');
		}
	}
}
// doTraining(54915,9010,AfterTraining);

/************************ 数据预备区 **********************/
// {"rs":"","jq":"","jy":"","jn":"","note":""};
const DB_OS_TRNRS = USER_NAME+"#trnrs";
const DB_NAME_TRN = 'LFE2#Mod#Train';

var DB_TRN;

function update_DB_TRN(evt){
	evt.currentTarget.result.createObjectStore(DB_OS_TRNRS, { autoIncrement: true });
}

function success_DB_TRN(evt){
	DB_TRN = evt.currentTarget.result;
}
/********************** 通道消息 处理区**********************/
function handlePort_modTrn(port){	
	if(port.name == "mod_train"){
		port.onMessage.addListener(function(msg) {
			debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load"){
				loadTrn(msg.data,port);
			}else if (msg.cmd == "trn"){
				beginTrn(msg.data);
			}
		});
	}
}
/********************** 自动执行区**********************/
function csjLoad_mod_trn(){
	chrome.runtime.onConnect.addListener(handlePort_modTrn);
	Tool_getDB(DB_NAME_TRN,[DB_OS_TRNRS],update_DB_TRN,success_DB_TRN);
}
csjLoad_mod_trn();
// Tool_delDB(DB_NAME_TRN);


log("c-training.js is done");