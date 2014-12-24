console.log("load main_tools.js");
/**********************MOD模块使用全局函数 功能区***************************/
var isDebug="1";
function log(e){
	console.log(e);
}
//debug 应是模块使用的函数
function debug(e){
	if(isDebug=="1"){
		console.debug(e);
	}		
}
function checkDevMode(){
	var msg={"msg":{"type":"bg_conf","cmd":"isDebug","data":"","id":""},
			"func":function(msg){
				isDebug=msg.res;
				console.log("日志模式："+isDebug);
				}
			};
	sendRequest(msg);
}
/**********************特定函数 功能区***************************/
// 是否存在指定函数 
function Tool_isExitsFunction(funcName) {
    // try {
        // if (typeof(funcName) == "function") {
            // return true;
        // }
    // } catch(e) {}
    // return false;
	return funcName in window;
}
// Array数组元素去重
function Tool_arrayQC(list){
	list.sort();
	var re=[list[0]];
	for(var i = 1; i < list.length; i++)
	{
		if( list[i] !== re[re.length-1])
		{
			re.push(list[i]);
		}
	}
	return re;
}
// 字符串去除空格
function Tool_trim(str){   
    str = str.replace(/^(\s|\u00A0)+/,'');   
    for(var i=str.length-1; i>=0; i--){   
        if(/\S/.test(str.charAt(i))){   
            str = str.substring(0, i+1);   
            break;   
        }   
    }   
    return str;   
}
// 获得对象的属性长度
function Tool_getObjLength(obj){
	var i=0;
	for(var c in obj){
		i++;
	}
	return i;
}
/**********************页面信息处理 功能区***************************/
function Tool_getHref(str){
	if(str.indexOf("http://www.linodas.com")!=-1){
		return str.replace("http://www.linodas.com","");
	}
	return null;
}
function Tool_getCardData(){
	return {"cardId":"","cardName":"","str":"","dex":"","ent":"","con":"","lv":"","cardType":"","tech1":"","tech2":""};
}
// var cardData={"cardId":"","cardName":"","str":"","dex":"","ent":"","con":"","lv":"","cardType":"","tech1":"","tech2":""};
function Tool_getCardByOutframe(cardData,ofrm){	
	var a=ofrm.querySelector("a div[title]");
	if(cardData.cardName!=undefined){cardData.cardName=a.title;}	
	var tmpType=a.className;
	if(cardData.cardType!=undefined){cardData.cardType=tmpType.replace("cardtitle ","");}
		
	var tmpId=ofrm.querySelector("a").id;
	if(cardData.cardId!=undefined){cardData.cardId=tmpId.replace("card_frame_link","");}	
	
	var techArray=ofrm.querySelectorAll("div.cardfooter>div[title]");
	if(cardData.tech1!=undefined){cardData.tech1=techArray[0].title;}
	if(cardData.tech2!=undefined){cardData.tech2=techArray[1].title;}	
	
	var tmpStat=ofrm.querySelector("div.cardtext span.lesser").innerText;		
	// debug(tmpStat);
	var tmpS=tmpStat.match(/\d+智力/gi);
	if(tmpS){
		if(cardData.ent!=undefined){cardData.ent=tmpS[0].replace("智力","");}		
	}
	var tmpS=tmpStat.match(/\d+力量/gi);
	if(tmpS){
		if(cardData.str!=undefined){cardData.str=tmpS[0].replace("力量","");}		
	}
	var tmpS=tmpStat.match(/\d+敏捷/gi);
	if(tmpS){
		if(cardData.dex!=undefined){cardData.dex=tmpS[0].replace("敏捷","");}		
	}		
	var tmpS=tmpStat.match(/\d+耐力/gi);
	if(tmpS){
		if(cardData.con!=undefined){cardData.con=tmpS[0].replace("耐力","");}		
	}		
	var tmpS=tmpStat.match(/等级: \d+/gi);
	if(tmpS){
		if(cardData.lv!=undefined){cardData.lv=tmpS[0].replace("等级: ","");}		
	}	
	return cardData;
}
/**********************indexedb 功能区***************************/
function Tool_getDB(DB_NAME,OS_List,updateFunc,succFunc) {
	if (!window.indexedDB) {
		alert("你的浏览器不支持IndexedDB，插件数据无法保存，请更新最新的chrome浏览器！")
	}
	debug("initDb "+DB_NAME+"...");
	var req = window.indexedDB.open(DB_NAME);
	req.onsuccess = function (evt) {
		var DB = this.result;
		// log(DB);
		// log(OS);
		var isUpdate=false;
		for(var i=0;i<OS_List.length;i++){
			if(!DB.objectStoreNames.contains(OS_List[i])){
				debug(OS_List[i]);
				isUpdate=true;
			}			
		}
		if(isUpdate){
			var newVer=DB.version+1;
			DB.close();
			var newreq=window.indexedDB.open(DB_NAME,newVer);
			debug("initDb "+DB_NAME+" update version:"+newVer);	
			newreq.onupgradeneeded = function (evt) {		
				updateFunc(evt);
				debug("initDb.onupgradeneeded");
			};
			newreq.onsuccess = function (evt) {
				DB = this.result;
				debug("initDb new "+DB_NAME+" DONE");
				succFunc(evt);
			}
			newreq.onerror = function (evt) {
				debug("initDb new error:"+evt.target.error.message);
			};
		}
		debug("initDb "+DB_NAME+" DONE");		
		succFunc(evt);
	};
	req.onerror = function (evt) {
		debug("initDb:"+evt.target.error.message);
	};

}
function Tool_delDB(DB_NAME){
	window.indexedDB.deleteDatabase(DB_NAME);
}

/**********************自动载入区***************************/
function loadMainTools(){
	checkDevMode();
}
loadMainTools();

console.log("load main_tools.js done");