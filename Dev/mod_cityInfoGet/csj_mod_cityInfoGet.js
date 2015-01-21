log("load csj_mod_cityInfoGet.js");

// var TypeDefList=["一般地下城","特殊地下城","城市设施","战斗","职业工会","其他"];
// var DungeonDefList=["一般地下城","特殊地下城","其他"];
// var otherList=["职业工会"];

function getPVPstat(){
	var nameList=document.querySelectorAll("div.infoname.row");
	for(var i=0;i<nameList.length;i++){	
		if(nameList[i].innerText.indexOf("PVP状态")!=-1){
			var ns=nameList[i].nextSibling;
			if(ns.nodeType==3){
				ns=ns.nextSibling;
			}
			var stat=ns.querySelector("span").innerText;
			if(stat!=null){
				sendRequest({"msg":{"type":"bg_mod_cityInfoGet","cmd":"updatePVP","data":stat,"id":USER_CITY}});	
			}	
		}
	}
}

/********************** 自动执行区**********************/
function csjLoad_mod_cig(){
	getPVPstat();
}
csjLoad_mod_cig();

log("load csj_mod_cityInfoGet.js done");