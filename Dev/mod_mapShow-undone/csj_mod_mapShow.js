log("load csj_mod_mapShow.js");
function loadCityShow(){	
	var cityList=document.querySelectorAll("div.city");
	for(var i=0;i<cityList.length;i++){
		// 获得城市名称
		var tmpCityName=cityList[i].querySelector("a").innerText;
		var cityName=tmpCityName.replace("[","").replace("]","");
		if(cityName=="卡拉林"){
			cityName="卡拉林城";
		}
		sendRequest({"msg":{"type":"bg_mod_mapShow","cmd":"getCityPVP","data":"","id":cityName},"func":setCityPVP});
	}
}
// 设置城市名称
function setCityPVP(msg){
		// var tmpCP=document.querySelector("div.city."+info+">.city_preview");
		// var ci=CityInfo[info];
		// //附加PVP信息		
		// var tmpSt=document.createElement("span");
		// tmpSt.className="small";
		// tmpSt.innerText=ci["pvpSt"];
		// tmpCP.appendChild(tmpSt);
		// var tmpBr1=document.createElement("br");
		// tmpCP.appendChild(tmpBr1);
	// }	
}



/********************** 自动执行区**********************/
function csjLoad_mod_mapShow(){
	loadCityShow();
}
csjLoad_mod_mapShow();
log("load csj_mod_mapShow.js");