/*********************** 后台通讯区 *********************/
var bg = chrome.extension.getBackgroundPage();   

bg.log("popup load pop_mod_note.js");
// 存储记事本数据
function saveRecord(){
	autoResize();
	var rec=document.getElementById("records").value;
	port.postMessage({"cmd":"saveRec","data":rec});
}
// 载入记事本数据
function loadRecord(){
	port.postMessage({"cmd":"loadRec"});
	port.onMessage.addListener(function(msg) {
		bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
		if (msg.cmd == "loaded"){
			document.getElementById("records").value=msg.data;
		}
		autoResize();
	});
}
var port;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "mod_note"});
		loadRecord();
	});
}

// 最小高度
var minRows = 5;
// 最大高度，超过则出现滚动条
var maxRows = 15;
function autoResize(){
	var t = document.getElementById('records');
	if (t.scrollTop == 0){
		t.scrollTop=1;
	} 
	while (t.scrollTop == 0){
		if (t.rows > minRows){
			t.rows--;
		}else{
			break;
		}
		t.scrollTop = 1;
		if (t.rows < maxRows){
			t.style.overflowY = "hidden";
		}
		if (t.scrollTop > 0){
			t.rows++;
			break;
		}
	}
	while(t.scrollTop > 0){
		if (t.rows < maxRows){
			t.rows++;
			if (t.scrollTop == 0){
				t.scrollTop=1;
			}
		}else{
			t.style.overflowY = "auto";
			break;
		}
	}
	t.style.resize="none";
	// document.getElementById('content').currHeight=t.width;
	// document.getElementById('content').currHeight=t.height;
	bg.debug(document.body.scrollHeight+"|"+(t.scrollTop+t.scrollHeight))
}

/**************窗体事件区*********************/
document.querySelector('#records').addEventListener('propertychange', saveRecord);
document.querySelector('#records').addEventListener('input', saveRecord);
document.querySelector('#records').addEventListener('focus', saveRecord);

window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_note.js done");
