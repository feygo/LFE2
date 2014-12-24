
/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_craftProcess.js");
/*********************** 页面通道 通讯区 *********************/
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_craftProcess"});
		loadCraftShopList();
		
		/**
		页面操作指令 消息结构：{"cmd":"loadDeck","dId":slt.value}
		页面操作反馈 消息结构：{"rs":list};
		*/
		/** 业务功能区 */
		var tmpCardCnt=0;
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "getCardNum.rs"){
				var craftId=msg.id;
				var num=msg.data;
				var tmp=craftId.split("-");
				var shopId=tmp[0];
				var cardId=tmp[1].replace("-","");
				shopCardRS[shopId][cardId]["num"]=num;
				tmpCardCnt++
				if(tmpCardCnt==cardCnt){
					showCraftShopList();
				}
			}
		});
		
		
	});
}

/********************************* 页面载入区 扩展******************/
// 当页面载入的时候，获取可选卡组项、怪物列表、行动点AP、上一次的训练结果    
/**
页面操作指令 消息结构：{"msgType":"c-card","opnType":"load"};
						={"msgType":"c-card","opnType":"loadShop","sId":sn};
						{"msgType":"c-card","opnType":"saveFocus","data":f};
						
						{"shopCnt":1,"cardCnt":33,"colShop":[{"sn":"瑞普斯的厄运实验室","sc":12,"uc":4,"cp":"33.33%"}]}	
						"168":{"cardId":"168","cardName":"浸毒骨杖","cardLevel":"9","cardNum":"5"},
*/

var shopList=[];
var shopCardRS={};
var shopCnt=0;
var cardCnt=0;
//载入商店列表
function loadCraftShopList(){
	bg.Tool_getDB([bg.DB_OS_SHOP_ALL],function(evt){
		var db = evt.currentTarget.result;
		var txn=db.transaction([bg.DB_OS_SHOP_ALL,bg.DB_OS_SHOP_CARD], "readonly")
		var os_shopAll=txn.objectStore(bg.DB_OS_SHOP_ALL);	
		// 获取商店列表
		var request = os_shopAll.index("type").openCursor(IDBKeyRange.only("合成工坊"));

		request.onsuccess = function(evt) {
			var cursor = request.result;
			if(cursor){
				var shopData=cursor.value;
				var info=shopData.shopName+" "+shopData.shopLv+"@"+shopData.shopCity.toString();
				shopList.push({"shopInfo":info,"shopId":shopData.shopId});
				// 商店计数器
				shopCnt++;
				// 获取商店合成卡片信息
				var cReq=txn.objectStore(bg.DB_OS_SHOP_CARD).index("shopId").openCursor(IDBKeyRange.only(shopData.shopId));
				cReq.onsuccess=function(cevt){
					var tmpCursor=cReq.result;
					if(tmpCursor){
						var sc=tmpCursor.value;
						var craftId=sc.shopId+"-"+sc.cardId;
						var shopCard={"craftId":"","cardId":"","cardName":"","lv":"","num":-1};
						shopCard["craftId"]=craftId;
						shopCard.cardId=sc.cardId;
						shopCard.lv=sc.lv;
						shopCard.cardName=sc.cardName;
						if(shopCardRS[sc.shopId]){
							shopCardRS[sc.shopId][sc.cardId]=shopCard;
						}else{
							shopCardRS[sc.shopId]={};
							shopCardRS[sc.shopId][sc.cardId]=shopCard;
						} 
						// 从csj中获得卡片数量
						//发送消息，获取合成卡片数量
						port.postMessage({"cmd":"getCardNum","id":craftId});
						// 卡片计数器
						cardCnt++;	
						
						tmpCursor.continue();
					}					
				}				
				cursor.continue();
			}else{
				// 页面展示
				bg.debug("=========")
				bg.debug(shopList);
				bg.debug(shopCardRS);
				bg.debug(shopCnt);
			}
		}
	})
}
function addShopTitle(rTable){
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>所有已知的合成商店</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>合成商店卡片数量</b>";
	var tdT3=document.createElement("td");
	tdT3.className='name c5';
	tdT3.innerHTML="<b>已经拥有的卡片数量</b>";
	var tdT4=document.createElement("td");
	tdT4.className='name c5';
	tdT4.innerHTML="<b>卡片收集度</b>";
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	trT.appendChild(tdT3);
	trT.appendChild(tdT4);
	rTable.appendChild(trT);
}
function addShopTr(rTable,si,sn,sc,uc,cp){
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML="<button name='V' value='"+si+"'>V</button>"+sn;
	var td2=document.createElement("td");
	td2.innerText=sc;
	var td3=document.createElement("td");
	td3.innerText=uc;
	var td4=document.createElement("td");
	td4.innerText=cp;
	
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	rTable.appendChild(tr1);
}
function showCraftShopList(){	
	// 载入商店数量和合成卡片数量	
	document.getElementById("sCnt").innerText=shopCnt;	
	document.getElementById("cCnt").innerText=cardCnt;
	// 载入商店列表
	var rTable=document.getElementById("shopList");
	rTable.innerHTML="";
	addShopTitle(rTable);
	
	if(shopList.length>10){
		rTable.style.height="400px";
		rTable.style.overflowY='scroll';		
	}
	
	for (var i=0;i<shopList.length;i++){
		var shopId=shopList[i].shopId;
		var shopNameInfo=shopList[i].shopInfo;
		var shopCard=shopCardRS[shopId];
		var sc_cnt=0;
		var sc_unt=0;
		for(var cId in shopCard){
			var card=shopCard[cId];
			sc_cnt++;
			if(card.num==5){
				sc_unt++;
			}
		}
		var cp=sc_unt/sc_cnt*100
		addShopTr(rTable,shopId,shopNameInfo,sc_cnt,sc_unt,cp+"%");
	}

	/*******************************绑定事件***********/
	var bl=document.getElementsByName('V');
	for(var i=0;i<bl.length;i++){		
		bl[i].addEventListener('click', showCardList);
	}
}

function addCardTitle(sTable){
	// 组成table 表头
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>卡片列表</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>现有卡片数量</b>";
	if(isD){
		var tdT3=document.createElement("td");
		tdT3.className='name c5';
		tdT3.innerHTML="<b>是否列为监控目标</b>";
	}
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	if(isD){
		trT.appendChild(tdT3);
	}
	sTable.appendChild(trT);
}
//载入具体的商店信息
function showCardList(){
	var shopId=window.event.srcElement.value;
	// 商店的卡片列表，拥有该卡片的数量，是否列为监控目标
	var sTable=document.getElementById("shop");
	sTable.innerHTML="";
	addCardTitle(sTable);
	
	var cnt=0;
	// 生成卡片信息
	var shopCard=shopCardRS[shopId];
	for(var cId in shopCard){
		cnt++;
		var card=shopCard[cId];
		var trTmp=document.createElement("tr");				
		var tdTmp1=document.createElement("td");
		tdTmp1.innerHTML="<button  name='C' value='"+cId+"'>+</button>";
		if(card.lv!=""){
			tdTmp1.innerHTML+="Lv."+card.lv+" "+card.cardName;
		}else{
			tdTmp1.innerHTML+=card.cardName;
		}	
		var tdTmp2=document.createElement("td");
		tdTmp2.innerText=card.num;

		if(isD){
			var tdTmp3=document.createElement("td");
			if(card.num!="5"){
				// if(tmp.isFocus){
					// tdTmp3.innerHTML="<input type=\"checkbox\" name=\"isFocus\" checked value=\""+cId+"\" />";
				// }else{
					tdTmp3.innerHTML="<input type=\"checkbox\" name=\"isFocus\" value=\""+cId+"\" />";
				// }
			}else{
				tdTmp3.innerHTML="";
			}
		}
		trTmp.appendChild(tdTmp1);
		trTmp.appendChild(tdTmp2);
		if(isD){
			trTmp.appendChild(tdTmp3);
		}
		sTable.appendChild(trTmp);
	}
	
	if(cnt<3){
		sTable.style.height="100px";
		sTable.style.overflowY='scroll';		
	}
	
	/*******************************绑定事件***********/
	var bl=document.getElementsByName('C');
	for(var i=0;i<bl.length;i++){		
		bl[i].addEventListener('click', getCardInfo);
	}
	// 结果区显示
	var rs=document.getElementById('rsDiv');
	rs.style.display="";
	if(isD){
		document.getElementById('focusBtn').style.display="";
	}else{
		document.getElementById('focusBtn').style.display="none";
	}

}

/*************************** 卡片信息获取区 *******************/
function getCardInfo() {	
	var id=this.value;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
		  if (xhr.status == 200) {
			var res = JSON.parse(xhr.responseText);
			showCardInfo(id,res.text);
		  } else {
			console.log(xhr);
		  }
		}
	  }
	var url ="http://www.linodas.com/json/card/action/showfull";
	var oForm = new FormData();
	oForm.append("id", id);
	xhr.open('POST', url, true);
	xhr.send(oForm);
};
function showCardInfo(id,txt){
	bg.log(txt);
	var objE = document.getElementById("cardDiv");
	bg.log(objE);
　　objE.innerHTML = txt;
}
function clsDiv(){
	var objE = document.getElementById("cardDiv");
　　objE.innerHTML = "";
}
/*************************** 监控卡片功能区 *******************/
function doFocus(){
	var chkList=document.getElementsByName('isFocus');
	var sn=document.getElementById('nowShop').value;
	var f={};
	var c=[];
	for(var i=0;i<chkList.length;i++){
		if(chkList[i].checked){
			c.push(chkList[i].value);
		}
	}
	f[sn]=c;
	// bg.log(f);
	saveFocus(f);
}
/*************************** 权限控制区 *******************/
var isD=true;
/*************************** 绑定与自动执行区 *******************/

window.addEventListener('load', loadPort);
document.querySelector('#clsDiv').addEventListener('click', clsDiv);
// document.querySelector('#focusBtn').addEventListener('click', doFocus);

bg.log("popup load pop_mod_craftProcess.js done");