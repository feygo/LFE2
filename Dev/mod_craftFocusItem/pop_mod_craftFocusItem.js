/** 后台通讯区 */
var bg = chrome.extension.getBackgroundPage();   
bg.log("popup load pop_mod_craftFocusItem.js");
/*********************** 页面通道 通讯区 *********************/
var port_cf;
var port_cfi;
function loadPort(){
	loadTitle();
	chrome.tabs.getSelected(function(tab){
		port_cf = chrome.tabs.connect(tab.id,{name: "mod_craftFocus"});
		// 载入监控卡片列表
		port_cf.postMessage({"cmd":"load"});
		
		// 接收监控卡片列表
		port_cf.onMessage.addListener(function(msg) {
			bg.debug("收到"+port_cf.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "load.rs"){
				showCardList(msg.data);
				getCraftItem(msg.id);
				// 框架展示
				// 存储监控卡片信息
				// 根据监控卡片信息获取合成材料列表
				// 获取背包材料的数量
				// 获取材料来源
				// 存储背包材料的数量
			}
		});
		
		port_cfi = chrome.tabs.connect(tab.id,{name: "mod_craftFocusItem"});
		port_cfi.onMessage.addListener(function(msg) {
			bg.debug("收到"+port_cfi.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "get.rs"){
				setItemN(msg.id,msg.data);				
			}
		});
	});
}
function loadTitle(){
	addCardTitle(document.getElementById("cardList"));	
	addItemTitle(document.getElementById("itemList"));
}
/********************************* 页面载入区 扩展******************/
// 添加监控卡片列表 表头
function addCardTitle(rTable){
	var trT=document.createElement("tr");				
	var tdT1=document.createElement("td");
	tdT1.className='name c5';
	tdT1.innerHTML="<b>监控卡片名称</b>";
	var tdT2=document.createElement("td");
	tdT2.className='name c5';
	tdT2.innerHTML="<b>卡片数量</b>";
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
	var tdT4=document.createElement("td");
	tdT4.className='name c5';
	tdT4.innerHTML="<b>来源</b>";
	var tdT5=document.createElement("td");
	tdT5.className='name c5';
	tdT5.innerHTML="<b>状态</b>";
	
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
	td1.id="card"+cf.cardId;
	td1.dataset.num=cf.num;
	// 卡片数量
	var td2=document.createElement("td");
	td2.innerText=cf.num;
	// 状态
	var td3=document.createElement("td");
	td3.id="cardStat"+cf.cardId;
	td3.innerHTML="";
	// td3.id=cf.cardId;
	// td3.className="item";
	// 操作
	var td4=document.createElement("td");
	td4.innerHTML="<button name='D' value='"+cf.cardId+"'>拾取物品</button>";
	
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	rTable.appendChild(tr1);
	
	// td4.querySelector('button').addEventListener('click', delFocusCard);
	// 更新监控卡片数量
	// var fcnt=document.getElementById("fcnt");
	// var ncnt=parseInt(fcnt.innerText)+1;
	// fcnt.innerText=ncnt;
}
// 添加监控卡片列表 卡片项
function showItemList(item){
	var rTable=document.getElementById("itemList");
	// 物品名称
	var tr1=document.createElement("tr");	
	var td1=document.createElement("td");
	td1.innerHTML=item.itemName;
	td1.id="item"+item.itemId;
	// 物品总量
	var td2=document.createElement("td");
	var cardTD=document.getElementById("card"+item.cardId);
	td2.id="itemT"+item.itemId;
	td2.innerText=(5-cardTD.dataset.num)*item.reqNum;
	bg.debug(item.itemName+"新增"+td2.innerText);
	// 现有数量
	var td3=document.createElement("td");
	td3.id="itemN"+item.itemId;
	td3.innerHTML="";
	// td3.id=cf.cardId;
	// td3.className="item";
	// 物品来源
	var td4=document.createElement("td");
	td4.id="from"+item.itemId;
	td4.innerHTML="";
	// 状态标识
	var td5=document.createElement("td");
	td5.id="itemStat"+item.itemId;
	td5.innerHTML="";

	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);
	tr1.appendChild(td4);
	tr1.appendChild(td5);
	rTable.appendChild(tr1);
}
// 添加监控卡片列表 卡片项
function appendItemList(item){
	// 物品总量
	var itemT=document.getElementById("itemT"+item.itemId);
	var cardTD=document.getElementById("card"+item.cardId);
	var anum=(5-cardTD.dataset.num)*item.reqNum;
	bg.debug(item.itemName+"追加"+anum);
	itemT.innerText=parseInt(itemT.innerText)+anum;
}
// 添加物品的背包数量
function setItemN(id,num){
	var itemN=document.getElementById("itemN"+id);
	itemN.innerText=num;
}
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
					// 检查材料列表中是否存在
					// 如果不存在，增加新行
					var itemTD=document.getElementById("item"+item.itemId);
					if(itemTD){
						appendItemList(item);
					}else{
						showItemList(item);
						// 查询合成材料的相关信息
						var itemReq=txn.objectStore(bg.DB_OS_SHOP_ITEM).get(item.itemId);
						itemReq.onsuccess=function(e){
							var itemInfo=e.currentTarget.result;
							if(itemInfo){
								document.getElementById("from"+itemInfo.itemId).innerText=itemInfo.itemCity;
							}
						}
						itemReq.onerror=function(e){
							bg.debug("获得合成材料来源信息出错:"+evt.target.error.message);
						}
						// 获取背包材料的相关信息
						port_cfi.postMessage({"cmd":"get","id":item.itemId});
					}	
					cursor.continue();
				}else{
					db.close();
				}
			}
		});
}

/*************************** 绑定与自动执行区 *******************/
window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_craftFocusItem.js done");