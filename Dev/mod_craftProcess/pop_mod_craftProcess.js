
/** 后台通讯区 */
var modName="mod_craftProcess";
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_craftProcess.js");
/*********************** 页面通道 通讯区 *********************/
var userName=bg.Tool_getUserName(location.search);
var port_bg;
function loadPort(){
	port_bg=chrome.runtime.connect({name: "BG#"+modName});
	port_bg.onMessage.addListener(function(msg) {
		bg.debug("pop_"+modName+"收到"+port_bg.name+"通道消息："+JSON.stringify(msg));	
	});
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.getCardNum.rs"){
			var cardId=msg.id;
			var num=msg.data;
			var shopId=msg.shopId;
			// 更新卡片商店详细列表缓存
			shopCardRS[shopId][cardId]["num"]=num;
			// 对应商店列表 进行计数，并且更新cp值
			if(num!=-1&&num!=0){
				cnt("uCnt");
				cnt(shopId+"_uc");
				cp(shopId);					
			}			
		}
	});

	// 显示商店列表页面
	showShopList();

	// 判断是否启动卡片监控功能
	if(bg.MOD_NOW["mod_craftFocus"]){
		bg.debug("启动Mod功能:合成商店卡片监控");
		isModCraftFocus=true;
	}else{
		isModCraftFocus=false;
	}
}
/********************************* 重构区******************/
// 显示商店列表页面
function showShopList(){	
	// 载入商店数量和合成卡片数量	
	document.getElementById("sCnt").innerText=0;	
	document.getElementById("cCnt").innerText=0;
	document.getElementById("uCnt").innerText=0;
	// 载入商店列表
	document.getElementById("shopList").innerHTML="";
	addShopTitle();
	loadShopList();
	// if(shopList.length>10){
		// rTable.style.height="400px";
		// rTable.style.overflowY='scroll';		
	// }
}
// 添加商店页面title
function addShopTitle(){
	var rTable=document.getElementById("shopList");
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
function addShopTr(si,sn,sc,uc,cp){
	var rTable=document.getElementById("shopList");
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML="<button name='V' value='"+si+"'>V</button>"+sn;
	var td2=document.createElement("td");
	td2.id=si+"_sc";
	td2.innerText=sc;
	var td3=document.createElement("td");
	td3.id=si+"_uc";
	td3.innerText=uc;
	var td4=document.createElement("td");
	td4.id=si+"_cp";
	td4.innerText=cp;
	
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	rTable.appendChild(tr1);
	/*******************************绑定事件***********/
	td1.querySelector('button').addEventListener('click', showCardList);
}
function cnt(name){
	var tmp=parseInt(document.getElementById(name).innerText);
	tmp++;
	document.getElementById(name).innerText=tmp;
}
// 计算商店的合成完成度 cp值
function cp(shopId){
	var sc=parseInt(document.getElementById(shopId+"_sc").innerText);
	var uc=parseInt(document.getElementById(shopId+"_uc").innerText);
	var cp=Math.round(uc / sc * 10000) / 100.00 + "%";
	document.getElementById(shopId+"_cp").innerText=cp;
}
//载入商店列表
function loadShopList(){
	bg.debug(bg.DB_OS_SHOP_ALL);
	bg.debug(bg);
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
				// 添加商店列表信息
				addShopTr(shopData.shopId,info,0,0,"-");
				// 商店计数器
				cnt("sCnt");
				// 获取商店合成卡片信息
				var cReq=txn.objectStore(bg.DB_OS_SHOP_CARD).index("shopId").openCursor(IDBKeyRange.only(shopData.shopId));
				cReq.onsuccess=function(cevt){
					var tmpCursor=cReq.result;
					if(tmpCursor){
						var sc=tmpCursor.value;
						var shopCard={"cardId":"","cardName":"","lv":"","num":-1};
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
						port_bg.postMessage({"cmd":"bg.getCardNum","un":userName,"id":sc.cardId,"shopId":sc.shopId});
						// 商店卡片计数
						cnt(sc.shopId+"_sc");
						// 卡片计数器
						cnt("cCnt");
						// 继续循环
						tmpCursor.continue();
					}					
				}				
				cursor.continue();
			}
		}
	})
}

/********************************* 重构区******************/
/********************************* 页面载入区 扩展******************/
var shopCardRS={};
var cardCnt=0;

// 添加商店卡片页面的title
function addCardTitle(){
	var sTable=document.getElementById("shop");
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
	document.getElementById("shop").innerHTML="";
	addCardTitle();
	var sTable=document.getElementById("shop");
	
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
					fsPort.postMessage({"cmd":"bg.checkFocusCard","un":userName,"id":cId});
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
/*************************** mod_craftFocus 监控卡片功能区 *******************/
var focusPort;
function getFocusPort(){
	if(focusPort){
	}else{
		focusPort=chrome.runtime.connect({name: "BG#"+"mod_craftFocus"});
		focusPort.onMessage.addListener(function(msg) {
			bg.debug("pop_"+modName+"收到"+focusPort.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "bg.checkFocusCard.rs"){
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
		fsPort.postMessage({"cmd":"bg.saveFocusCard","un":userName,"data":cf,"id":b.id});
	}else{
		fsPort.postMessage({"cmd":"bg.delFocusCard","un":userName,"id":b.id});
	}
}
/*************************** 权限控制区 *******************/
var isModCraftFocus=false;
/*************************** 绑定与自动执行区 *******************/

window.addEventListener('load', loadPort);
document.querySelector('#clsDiv').addEventListener('click', clsDiv);

bg.log("popup load pop_mod_craftProcess.js done");