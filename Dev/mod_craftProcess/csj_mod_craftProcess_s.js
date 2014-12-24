log("load csj_mod_craftProcess_s.js");

// 记录合成卡片的信息
function saveCraftCardNum(card){
	if(DB_CP_S==undefined){
		Tool_getDB(DB_NAME_CP,[DB_OS_CP],update_DB_CP_S,function(evt){
			success_DB_CP_S(evt);
			saveCraftCardNumEx(card);
		});
	}else{
		saveCraftCardNumEx(card)
	}
}
function saveCraftCardNumEx(card){		
	// 判断数量
	var cardnum=0;
	var num=document.querySelector("#inner_card_num"+card.cardId);
	if(num){
		cardnum=parseInt(num.innerText);
	}
	// 组装对象
	var cardData={"craftId":"","cardId":"","shopId":"","num":0};
	cardData.cardId=card.cardId;
	cardData.shopId=card.shopId;
	cardData.craftId=card.shopId+"-"+card.cardId;
	cardData.num=cardnum;
	
	var objectStore=DB_CP_S.transaction([DB_OS_CP], "readwrite").objectStore(DB_OS_CP);
	var request = objectStore.put(cardData);
	request.onsuccess = function(evt) {
		debug("合成卡片数量信息："+JSON.stringify(evt.target.result));
	}
}
/************************ 数据预备区 **********************/
var DB_OS_CP = USER_NAME+"#craftProcess";
var DB_NAME_CP = 'LFE2#Mod#craftProcess';

var DB_CP_S;

function update_DB_CP_S(evt){
	// {"craftId":"","cardId":"","shopId":"","num":0};
	evt.currentTarget.result.createObjectStore(DB_OS_CP, { keyPath: "craftId" });
}

function success_DB_CP_S(evt){
	DB_CP_S = evt.currentTarget.result;
}

log("load csj_mod_craftProcess_s.js done");