/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_craftFocusItem.js");
/*********************** 页面通道 通讯区 *********************/
var port_cf;
var port_if;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port_cf = chrome.tabs.connect(tab.id,{name: "mod_craftFocus"});
		// 载入监控卡片列表
		loadFocusCard();
		
		// 接收监控卡片列表
		port_cf.onMessage.addListener(function(msg) {
			bg.debug("收到"+port_cf.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load.rs"){
				showCardList(msg.data);
				getCraftItem(msg.id);
			}
		});
		
		port_if = chrome.tabs.connect(tab.id,{name: "mod_invFocus"});
		port_if.onMessage.addListener(function(msg) {
			bg.debug("收到"+port_if.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "get.rs"){
				// 更新合成材料的背包数量
				var itemNum=setItemN(msg.id,msg.data);	
				// 更新卡片状态中的材料数量
				updateItemToCardStat(msg.id,itemNum);
				// 更新卡片状态
				checkCardStat();
			}else if(msg.cmd == "getUserInv.rs"){
				updateUserInv(msg.data);			
			}
		});
		// 获取用户背包数量
		loadUserInv();
	});
}
// 载入用户背包数据
function loadUserInv(){
	port_if.postMessage({"cmd":"getUserInv"});
}
function updateUserInv(data){
	document.getElementById("nNum").innerText=data.nNum;
	document.getElementById("tNum").innerText=data.tNum;
}
// 载入监控卡片列表
function loadFocusCard(){
	// 清空缓存
	itemCache={};
	// 初始化页面
	clsList();
	addTitle();
	// 载入监控卡片列表
	port_cf.postMessage({"cmd":"load"});
}
// 载入监控列表表头
function addTitle(){
	addCardTitle(document.getElementById("cardList"));	
	addItemTitle(document.getElementById("itemList"));
}
// 清空内容区数据
function clsList(){
	document.getElementById("cardList").innerHTML="";	
	document.getElementById("itemList").innerHTML="";
}
/********************************* 页面载入区 扩展******************/
/**
	0、载入表格的表头：监控卡片标题和材料标题
	1、通过mod_craftFocus的port读取监控卡片的信息
	21、收到监控卡片信息，写入监控卡片TD行  showCardList
	22、根据监控卡片ID信息，获得合成材料的信息 getCraftItem
	3、查询bg-data数据，获得合成材料item信息，并写入监控材料TD行（回调）
	32、获取材料来源商店的信息 （异步回调）
	33、获取材料背包的数量信息 （异步回调）
	4、更新cardStat材料状态
	5、检测cardStat状态
*/
// 添加监控卡片列表 表头
function addCardTitle(rTable){
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>监控卡片名称</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>现有数量</b>";
	var tdT3=document.createElement("td");
	tdT3.className='name c5';
	tdT3.innerHTML="<b>状态</b>";
	var tdT4=document.createElement("td");
	tdT4.className='name c5';
	tdT4.innerHTML="<b>操作</b>";
	
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	trT.appendChild(tdT3);
	trT.appendChild(tdT4);
	
	rTable.appendChild(trT);
}
// 添加监控材料列表 表头
function addItemTitle(rTable){
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>材料名称</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>需求总量</b>";
	var tdT3=document.createElement("td");
	tdT3.className='name c5';
	tdT3.innerHTML="<b>现有数量</b>";
	var tdT5=document.createElement("td");
	tdT5.className='name c5';
	tdT5.innerHTML="<b>商店城市</b>";
	var tdT4=document.createElement("td");
	tdT4.className='name c5';
	tdT4.innerHTML="<b>状态</b>";
	
	trT.appendChild(tdT1);
	trT.appendChild(tdT2);
	trT.appendChild(tdT3);
	trT.appendChild(tdT4);
	trT.appendChild(tdT5);
	
	rTable.appendChild(trT);
}
// 添加监控卡片列表 卡片项
function showCardList(cf){
	var rTable=document.getElementById("cardList");
	// 卡片名称
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML=cf.cardName;
	// 卡片数量
	var td2=document.createElement("td");
	td2.innerText=cf.num;
	// 状态
	var td3=document.createElement("td");
	td3.className="cardStat";
	td3.id="cardStat"+cf.cardId;
	td3.dataset.num=cf.num;
	td3.dataset.reqItem=JSON.stringify({});
	var sign=document.createElement("font");
	sign.color="red";
	sign.innerHTML="材料不足";
	td3.appendChild(sign);	
	
	// 操作
	var td4=document.createElement("td");
	td4.innerHTML="<button name='D' value='"+cf.cardId+"'>拾取</button>&nbsp<select id='pickNum'><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select>";
	
	td4.querySelector('button').addEventListener('click', pickup);
	
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	rTable.appendChild(tr1);
}
// 添加监控材料列表 卡片项
function addItemList(item){
	// 检查材料列表中是否存在
	// 如果不存在，增加新行
	var itemTD=document.getElementById("item"+item.itemId);
	if(itemTD){
		appendItemList(item);
	}else{
		showItemList(item);												
	}
}
function showItemList(item){
	var rTable=document.getElementById("itemList");
	// 物品名称
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML=item.itemName;
	td1.id="item"+item.itemId;
	// 物品总量
	var td2=document.createElement("td");
	var cardTD=document.getElementById("cardStat"+item.cardId);
	var cardNum=cardTD.dataset.num;
	td2.id="itemT"+item.itemId;
	if(cardNum==-1){
		td2.innerText="-1";
	}else{
		td2.innerText=(5-cardNum)*item.reqNum;
	}	
	bg.debug(item.itemName+"新增"+td2.innerText);
	// 现有数量
	var td3=document.createElement("td");
	td3.id="itemN"+item.itemId;
	td3.innerHTML="";
	// 物品来源
	var td5=document.createElement("td");
	td5.id="from"+item.itemId;
	td5.innerHTML="";
	// 状态标识
	var td4=document.createElement("td");
	td4.id="itemStat"+item.itemId;
	td4.innerHTML="";

	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	tr1.appendChild(td5);
	rTable.appendChild(tr1);
}
function appendItemList(item){
	// 物品总量
	var itemT=document.getElementById("itemT"+item.itemId);
	var cardTD=document.getElementById("cardStat"+item.cardId);
	var cardNum=cardTD.dataset.num;
	var anum=0;
	if(cardNum!=-1){
		anum=(5-cardNum)*item.reqNum;
	}
	bg.debug(item.itemName+"追加"+anum);
	var nnum=parseInt(itemT.innerText);
	if(nnum==-1&&anum!=0){
		itemT.innerText=anum;
	}else if(nnum!=-1){
		itemT.innerText=nnum+anum;
	}
}
// 添加监控材料列物品的背包数量
function setItemN(id,item){
	// 设置物品的背包数量
	var itemN=document.getElementById("itemN"+id);
	var str="";
	var itemNum=0;
	var norNum=0;
	var lootNum=0;
	if(item!=null&&item.norNum){
		str+=item.norNum+"+";
		itemNum+=item.norNum;
		norNum=item.norNum;
	}else{
		str+="0+";
	}
	if(item!=null&&item.lootNum){
		str+=item.lootNum;
		itemNum+=item.lootNum;
		lootNum=item.lootNum;
	}else{
		str+="0";
	}	
	itemN.innerText=str;
	itemN.dataset.norNum=norNum;
	itemN.dataset.lootNum=lootNum;
	itemN.dataset.num=itemNum;
	// 更新物品的状态
	var itemT=document.getElementById("itemT"+id);
	var itemTnum=parseInt(itemT.innerText);
	if(itemNum>itemTnum){
		document.getElementById("itemStat"+id).innerHTML="<font color='green'>√</font>";
	}else{
		document.getElementById("itemStat"+id).innerHTML="<font color='red'>X</font>";
	}
	return itemNum;
}
// 更新卡片状态列中材料的数量信息
function updateItemToCardStat(id,itemNum){
	// 更新卡片材料信息
	var reqItemList=document.getElementsByName("craftItem"+id);
	for(var i=0;i<reqItemList.length;i++){
		reqItemList[i].dataset.bagNum=itemNum;
		var cnum=itemNum/reqItemList[i].dataset.reqNum;
		// 更新对应卡片的状态
		var stat=reqItemList[i].parentElement;
		
		var riData=JSON.parse(stat.dataset.reqItem);
		if(riData[id]){
			riData[id]=cnum;
			stat.dataset.reqItem=JSON.stringify(riData);
		}
	}
}
// 更新合成卡片的合成状态
function checkCardStat(){
	// 设置卡片状态数量
	var cardList=document.querySelectorAll("TD.cardStat");
	for(var j=0;j<cardList.length;j++){
		var cardStat=cardList[j];
		
		var hcNum=5-parseInt(cardStat.dataset.num);
		var riData=JSON.parse(cardStat.dataset.reqItem);
		
		var tmpC=0,tmpT=0;
		for(var itemId in riData){		
			var num=riData[itemId];
			if(num!="-1"&&num!="0"){
				if(hcNum>num){
					hcNum=num;
				}
				tmpT++;
			}
			tmpC++;
		}
		var isReady=false;
		if((tmpC==tmpT)&&(tmpC!=0)){
			isReady=true;
		}
		var sign=cardStat.querySelector("font");
		if(isReady){			
			sign.color="green";
			sign.innerHTML="可合成"+hcNum+"张";
			cardStat.dataset.craftNum=hcNum;
		}else{
			sign.color="red";
			sign.innerHTML="材料不足";
			cardStat.dataset.craftNum=-1;
		}
	}	
}
// 将合成材料信息，添加至cardStat列
function addItemToCardStat(item){
	var cardStat=document.getElementById("cardStat"+item.cardId);
	// 设置卡片商店的材料状态-材料信息
	var itemHidden=document.createElement("input");
	itemHidden.type="hidden";
	itemHidden.name="craftItem"+item.itemId;
	itemHidden.dataset.reqNum=item.reqNum;
	// itemHidden.dataset.stat=false;
	cardStat.appendChild(itemHidden);
	
	// 设置卡片商店的材料状态列表
	var riData=JSON.parse(cardStat.dataset.reqItem);
	riData[item.itemId]=-1;
	cardStat.dataset.reqItem=JSON.stringify(riData);
}

// item缓存
var itemCache={};
// 查询合成材料的数量，并设置合成材料
function getCraftItem(cardId){	
	bg.Tool_getDB([bg.DB_OS_CRAFT_ITEM],function(evt){
			var db = evt.currentTarget.result;
			var txn=db.transaction([bg.DB_OS_CRAFT_ITEM,bg.DB_OS_SHOP_ITEM], "readonly")
			var os_craftItem=txn.objectStore(bg.DB_OS_CRAFT_ITEM);	
			// 获取商店列表
			var request = os_craftItem.index("cardId").openCursor(IDBKeyRange.only(cardId));
			request.onsuccess = function(evt) {
				var cursor = request.result;
				if(cursor){
					var item=cursor.value;					
					// 向监控材料列表中 写入或更新数据
					addItemList(item);
					// 设置卡片商店的材料状态-材料信息
					addItemToCardStat(item);
					// 查询合成材料的来源信息
					var itemReq=txn.objectStore(bg.DB_OS_SHOP_ITEM).get(item.itemId);
					itemReq.onsuccess=function(e){
						var itemInfo=e.currentTarget.result;
						if(itemInfo){
							document.getElementById("from"+itemInfo.itemId).innerText=itemInfo.itemCity;
						}
					}
					itemReq.onerror=function(e){
						bg.debug("获得合成材料来源信息出错:"+e.target.error.message);
					}
					
					// 获取背包材料的相关信息
					if(itemCache[item.itemId]){
					}else{
						port_if.postMessage({"cmd":"get","id":item.itemId});
						itemCache[item.itemId]=1;
					}

					cursor.continue();
				}else{
					db.close();
				}
			}
		});
}
/*************************** 材料拾取功能区 *******************/
function pickup(){
	var b=event.srcElement;
	var cardId=b.value;
	var stat=document.getElementById("cardStat"+cardId);
	// 可合成的卡片数量
	var craftNum=parseInt(stat.dataset.craftNum);
	if(craftNum==-1){
		alert("材料不足，不要瞎点我");
		return;
	}
	// 每个卡片的材料总量
	var pickData={"cardNum":0,"itemList":[]};
	var itemList=stat.querySelectorAll("input");
	for(var i=0;i<itemList.length;i++){
		var reqNum=parseInt(itemList[i].dataset.reqNum);
		var itemId=itemList[i].name.replace("craftItem","");
		var norNum=parseInt(document.querySelector("#itemList td#itemN"+itemId).dataset.norNum);
		pickData["itemList"].push({"itemId":itemId,"reqNum":reqNum,"norNum":norNum});
	}
	// 需要合成的卡片数量
	var pNum=parseInt(document.getElementById("pickNum").value);
	if(craftNum<pNum){		
		if(confirm("现有材料只能合成 "+craftNum+"张卡片，是否拾取所需材料？")){
			pickData["cardNum"]=craftNum;			
		}else{
			return;
		}
	}else{
		if(confirm("是否要拾取合成 "+pNum+"张卡片所需的材料？")){
			pickData["cardNum"]=pNum;
		}else{
			return;
		}
	}
	if(checkInvNum(pickData)){
		bg.debug("==拾取物品数据==");
		bg.debug(pickData);
		pickupAction(pickData);
	}
}
function checkInvNum(pickData){
	// 获得用户背包数据
	var nNum=parseInt(document.getElementById("nNum").innerText);
	var tNum=parseInt(document.getElementById("tNum").innerText);
	var cardNum=pickData.cardNum;
	var rNum=0;
	// 计算拾取物品总数
	for(var i=0;i<pickData.itemList.length;i++){
		var item=pickData.itemList[i];
		var loot=item.reqNum*cardNum-item.norNum;
		if(loot<0){
			loot=0;
		}
		rNum+=loot;
		item["loot"]=loot;
	}
	// 检查合成材料是否超出 背包数量
	if((nNum+rNum)>tNum){
		alert("将要拾取"+rNum+"个物品，超出了背包剩余空间 \n请重新选择将合成卡片数量!!");
		return false;
	}else{
		return true;
	}
}
function pickupAction(pickData){
	// 清空拾取状态区
	clsPickStat();
	// 拾取物品
	var list=pickData.itemList;
	showPickStat({"success":true,"text":"开始拾取，拾取结束后请刷新^背包^页面以更新数据<br>"});
	for(var i=0;i<list.length;i++){
		if(list[i].loot>0){
			pickupItem(list[i].itemId,list[i].loot);		
		}else{
			showPickStat({"success":true,"text":"物品需拾取0个"});
		}
	}
	// 刷新表格
	// loadFocusCard();
}
function pickupItem(itemId,lootNum) {	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
		  if (xhr.status == 200) {
			var res = JSON.parse(xhr.responseText);
			showPickStat(res);
			bg.debug(res);
		  } else {
			bg.debug("===========动态请求出现异常=============");
			bg.debug(xhr);
			alert("拾取物品功能出现异常！");			
		  }
		}
	  }
	var url ="http://www.linodas.com/json/item/action/loot_item";
	var oForm = new FormData();
	oForm.append("itemid", itemId);
	oForm.append("lootnum", lootNum);	
	xhr.open('POST', url, true);
	xhr.send(oForm);
};
function showPickStat(res){
	var stat=document.getElementById("pickStat");
	var tmp=document.createElement("font");
	tmp.innerHTML=res.text+";<br>";	
	if(res.success){
		tmp.color="green";
	}else{
		tmp.color="red";	
	}
	stat.appendChild(tmp);	
}
function clsPickStat(){
	document.getElementById("pickStat").innerHTML="";
}
/*************************** 绑定与自动执行区 *******************/
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_craftFocusItem.js done");