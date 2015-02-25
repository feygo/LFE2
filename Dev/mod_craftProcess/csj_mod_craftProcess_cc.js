log("load csj_mod_craftProcess_cc.js");

// 获取少于5张的卡片信息
function loadCraftCard(){
	var acList=document.querySelectorAll("#active_cards>div[data-rank=CRAFT]");
	// 获取卡片的数量信息
	var txn=DB_CP_CC.transaction([DB_OS_CP_CC], "readonly");
	var objectStore=txn.objectStore(DB_OS_CP_CC);	
	for(var i=0;i<acList.length;i++){
		// 记录卡片id card1613_div
		var cardId=acList[i].id.replace("card","").replace("_div","");		
		var request = objectStore.get(cardId);
		request.onsuccess = function(evt) {
			debug(evt.srcElement);
			// 获得卡片数量 inner_card_num1613
			var tmpNum=document.getElementById("inner_card_num"+cardId);
			var num=parseInt(tmpNum.innerText);
			// 判断数据库结果
			var cpData=evt.currentTarget.result;
			debug(cpData);	
			var nt=DB_CP_CC.transaction([DB_OS_CP_CC], "readwrite");
			var os=nt.objectStore(DB_OS_CP_CC);	
			if(cpData){
				cpData.num=num;
				var putReq=os.put(cpData);
				putReq.onsuccess=function(evt){
					debug(evt);
				}
				putReq.onerror=function(evt){
					debug(evt);
					error("更新合成卡片信息出错:"+evt.target.error.message);
				}
			}else{
				var cardData={"cardId":"","shopId":"","num":""};
				cardData.cardId=cardId;
				cardData.num=num;
				var addReq=os.add(cardData);
				addReq.onsuccess=function(evt){
					debug(evt);
				}
				addReq.onerror=function(evt){
					debug(evt);
					error("保存合成卡片信息出错:"+evt.target.error.message);
				}
			}
		}
	}
}
/************************ 数据预备区 **********************/
var DB_OS_CP_CC;
var DB_CP_CC;
function success_DB_CP_CC(db){
	DB_OS_CP_CC = DC[CP_N][0];
	DB_CP_CC = db;
	loadCraftCard();
}
/********************** 自动执行区**********************/
var CP_N="mod_craftProcess";
function csjLoad_mod_craftProcess_cc(){
	Tool_connUserDB(success_DB_CP_CC);
}
csjLoad_mod_craftProcess_cc();
log("load csj_mod_craftProcess_cc.js done");