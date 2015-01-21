log("load csj_mod_lessFiveCard_s.js");

// 更新不满足5张数量的卡片
function saveLessFiveByShop(card){
	if(DB_LFC_S==undefined){
		Tool_getDB(DB_NAME_LFC,[DB_OS_LFC],update_DB_LFC_S,function(evt){
			success_DB_LFC_S(evt);
			saveLessFiveByShopEx(card);
		});
	}else{
		saveLessFiveByShopEx(card)
	}
}
function saveLessFiveByShopEx(card){		
	// 判断数量
	var cardnum=0;
	var num=document.querySelector("#inner_card_num"+card.cardId);
	if(num){
		cardnum=parseInt(num.innerText);
	}
	var objectStore=DB_LFC_S.transaction([DB_OS_LFC], "readwrite").objectStore(DB_OS_LFC);
	var request = objectStore.get(card.cardId);
	request.onsuccess = function(evt) {
		var rs=evt.target.result;
		if(rs){
			// 如果存在则更新数量
			rs.num=cardnum;
			var putReq1=objectStore.put(rs);
			putReq1.onsuccess=function (evt){
				debug("更新不满5张的卡片数量："+JSON.stringify(evt.target.result));
			}
		}else{
			if(0<cardnum&&cardnum<5){
				// 如果不存在则保存，状态设置为已激活
				var cardData={"cardId":"","cardName":"","lv":"","cardType":""};
				cardData.cardId=card.cardId;
				cardData.cardName=card.cardName;
				cardData.lv=card.lv;
				cardData.cardType=card.cardType;
				cardData["stat"]="已激活";	
				cardData["num"]=cardnum;						
				var putReq2=objectStore.put(cardData);
				putReq2.onsuccess=function (evt){
					debug("新增不满5张的卡片数量："+JSON.stringify(evt.target.result));
				}
			}		
		}
	}
}
/************************ 数据预备区 **********************/
var DB_OS_LFC = USER_NAME+"#lessFiveCard";
var DB_NAME_LFC = 'LFE2#Mod#lessFiveCard';

var DB_LFC_S;

function success_DB_LFC_S(evt){
	DB_LFC_S = evt.currentTarget.result;
}
log("load csj_mod_lessFiveCard_s.js done");