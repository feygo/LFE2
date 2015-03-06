console.log("load bg_tools.js");
/**********************MOD模块使用全局函数 功能区***************************/
function log(e){
	console.log(e);
}
function error(e){
	console.error(e);
}
//debug 应是模块使用的函数
function debug(e){
	if(EXT_CONF["devMode"]=="1"){
		console.debug(e);
	}		
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
	if(list==null||list.length==0){
		return list;
	}
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
// 获取url的查询参数
function Tool_getUrlSearch(url){
	var obj={};   
	if(url.indexOf("?") != -1){   
		var str = url.substr(1); 
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++){   
			obj[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);   
		}
	} 
	return obj;
}
// 获取url的查询参数
function Tool_getUserName(url){
	var un=Tool_getUrlSearch(url)["un"];
	if(un==undefined){
		un="";
	}
	return un;
}

console.log("load bg_tools.js done");