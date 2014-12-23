console.log("load bg_tools.js");
/**********************MOD模块使用全局函数 功能区***************************/
function log(e){
	console.log(e);
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

console.log("load bg_tools.js done");