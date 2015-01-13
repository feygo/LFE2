
/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_craftProcess.js");
/*********************** 页面通道 通讯区 *********************/
var port;
var tabId;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		tabId=tab.id;
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
		
		// 判断是否启动卡片监控功能
		if(bg.MOD_NOW["mod_craftFocus"]){
			bg.debug("启动Mod功能:合成商店卡片监控");
			isModCraftFocus=true;
		}else{
			isModCraftFocus=false;
		}
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
				bg.debug("====合成商店列表====")
				bg.debug(shopList);
				bg.debug("====合成商店信息====")
				bg.debug(shopCardRS);
				bg.debug("商店数量："+shopCnt);
			}
		}
	})
}
// 添加商店页面title
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
// 添加商店页面 列表项
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
	/*******************************绑定事件***********/
	td1.querySelector('button').addEventListener('click', showCardList);
}
// 
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
		var cp=Math.round(sc_unt/sc_cnt* 100) / 1.0 ;
		if(sc_cnt==0){
			sc_cnt=-1;
		}
		addShopTr(rTable,shopId,shopNameInfo,sc_cnt,sc_unt,cp+"%");
	}
}
// 添加商店卡片页面的title
function addCardTitle(sTable){
	// 组成table 表头
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>卡片列表</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>现有卡片数量</b>";
	if(isModCraftFocus){
		var tdT3=document.createElement("td");
		tdT3.className='name c5';
		tdT3.innerHTML="<b>是否列为监控目标</b>";
	}
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	if(isModCraftFocus){
		trT.appendChild(tdT3);
	}
	sTable.appendChild(trT);
}
// 添加商店卡片页面 列表项
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

		if(isModCraftFocus){
			var tdTmp3=document.createElement("td");
			if(card.num!="5"){
					tdTmp3.innerHTML="<input type=\"checkbox\" name=\""+card.cardName+"\" id=\""+cId+"\" value=\""+card.num+"\" />";
					tdTmp3.querySelector('input').addEventListener('click', setFocusStatus);
					// 核查监控卡片状态
					var fsPort=getFocusPort();
					fsPort.postMessage({"cmd":"check","id":cId});
			}else{
				tdTmp3.innerHTML="";
			}
		}
		trTmp.appendChild(tdTmp1);
		trTmp.appendChild(tdTmp2);
		if(isModCraftFocus){
			trTmp.appendChild(tdTmp3);
		}
		sTable.appendChild(trTmp);	
		/*******************************绑定事件***********/
		tdTmp1.querySelector('button').addEventListener('click', getCardInfo);
	}	
	// 结果区显示
	var rs=document.getElementById('rsDiv');
	rs.style.display="";
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
var focusPort;
function getFocusPort(){
	if(focusPort){
	}else{
		focusPort = chrome.tabs.connect(tabId,{name: "mod_craftFocus"});
		focusPort.onMessage.addListener(function(msg) {
			bg.debug("收到"+focusPort.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "check.rs"){
				document.getElementById(msg.id).checked=msg.data;// true or false
			}
		});
	}
	return focusPort;
}
function setFocusStatus(){
	var fsPort=getFocusPort();
	var b=event.srcElement;
	if(b.checked){
		var cf={"cardId":"","cardName":"","num":0};
		cf["cardId"]=b.id;
		cf["cardName"]=b.name;
		cf["num"]=b.value;
		fsPort.postMessage({"cmd":"add","data":cf,"id":b.id});
	}else{
		fsPort.postMessage({"cmd":"del","id":b.id});
	}
}
/*************************** 权限控制区 *******************/
var isModCraftFocus=false;
/*************************** 绑定与自动执行区 *******************/

window.addEventListener('load', loadPort);
document.querySelector('#clsDiv').addEventListener('click', clsDiv);

bg.log("popup load pop_mod_craftProcess.js done");