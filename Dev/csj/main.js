console.log("load main.js");
/**************************全局常量区******************/
var USER_NAME=getUserName();
function getUserName(){
	var hn=document.getElementById("header_nav");
	var r="";
	if(hn){
		var str=hn.children[0].children[0].innerText;
		if(str!=""){ 
			var tmp=str.indexOf(" ");
			r=str.substring(0,tmp);
		}
	}
	console.log("获取用户名称："+r);
	return r;
}
var USER_CITY=getCityName();
function getCityName(){
	var hn=document.getElementById("header_nav");
	var r="";
	if(hn){
		var str=hn.children[4].children[0].innerText;
		if(str!=""){ 
			var tmp=str.indexOf(" ");
			r=str.substring(tmp+1);
		}
	}
	console.log("获取用户城市："+r);
	return r;
}
var USER_INV=getUserInv();
function getUserInv(){
	var hn=document.getElementById("header_nav");
	var r={};
	if(hn){
		r={"nNum":0,"tNum":0};
		var bagA=hn.children[2].children[0];
		var numB=bagA.querySelectorAll("b");
		r.nNum=parseInt(numB[0].innerText);
		r.tNum=parseInt(numB[1].innerText);
	}
	console.log("获取用户背包数据："+JSON.stringify(r));
	return r;
}
var USER_LV=getUserLv();
// 百目悟空 Lv.25
function getUserLv(){
	var hn=document.getElementById("header_nav");
	var r=0;
	if(hn){
		var str=hn.children[0].children[0].innerText;
		// console.log("|"+str+"|");
		 // Lv.25
		var lvReg=/ lv.\d+/gi;
		var lvList=str.match(lvReg);
		// console.log("|"+lvList+"|");
		var dReg=/\d+/gi;
		var dList=lvList[0].match(dReg);
		// console.log("|"+dList[0]+"|");
		r=parseInt(dList[0]);
	}	
	console.log("获取用户等级："+r);
	return r;
}
/**************************URL获取判断权限******************/
function isInvalid(cp){
	if(cp=="/"||cp=="/index"){
		return true;
	}else if(document.getElementById("header_nav")==null){
		return true;
	}else{
		return false;
	}	
}
/**************************URL 路由，载入脚本和pop页面******************/
function  urlRouter(){
	// 获得上下文
	var cp=document.location.pathname;
	console.log("main.js 上下文:"+cp);
	// 判断是否有效
	if(isInvalid(cp)){
		console.log("非扩展范围URL，返回～");
		return;
	}	
	var msg={"msg":{"type":"bg_conf","cmd":"loadModByUrl","data":cp,"id":""},"func":logMsg}
	sendRequest(msg);
}
function logMsg(msg){
	// console.log(JSON.stringify(msg));
}


/********************************自动执行区********************************/
urlRouter();

console.log("load main.js done");