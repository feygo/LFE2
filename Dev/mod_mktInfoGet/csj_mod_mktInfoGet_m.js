log("load csj_mod_mktInfoGet_m.js");

function getMktInfo(){
	// 获取商店的标题
	var nameList=document.querySelectorAll("div.title>span.name");
	for(var i=0;i<nameList.length;i++){			
		// 商店类型
		var shopType=nameList[i].innerText;
		// 商店类型后内容的div
		var ns=nameList[i].parentElement.nextSibling;		
		if(ns.nodeType==3){
			ns=ns.nextSibling;
		}		
		if(ns.nodeName=="DIV"){	
			var shopList=ns.children;
			// 循环 获取商店的信息，并组成对象
			for(var j=0;j<shopList.length;j++){
				var shopObj={"shopType":"","shopId":"","shopName":"","shopLv":"","shopCity":[]};
		
				var shop=shopList[j];
				var si=shop.querySelector("a");	
				// 商店名称
				shopObj.shopCity.push(USER_CITY);
				shopObj.shopType=shopType;
				shopObj.shopName=si.innerText;
				// 商店等级
				var slv=shop.querySelector("div.text");	
				var tmpLv=slv.innerText.match(/\[等级 \d*(|-)\d*\]/gi);
				if(tmpLv){
					shopObj.shopLv=tmpLv[0];
				}
				// 商店ID	
				var tmpId=Tool_getHref(si.href);
				if(tmpId!=null){
					shopObj.shopId=tmpId.replace("/market/shop/id/","");
					// debug(shopObj);	
					sendRequest({"msg":{"type":"bg_mod_mktInfoGet","cmd":"updateShop","data":shopObj,"id":shopObj.shopId}});	
				}				
			}
		}
	}
}


/********************** 自动执行区**********************/
function csjLoad_mod_mig_m(){
	getMktInfo();
}
csjLoad_mod_mig_m();

log("load csj_mod_mktInfoGet_m.js done");