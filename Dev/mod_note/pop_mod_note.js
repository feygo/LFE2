/*********************** 后台通讯区 *********************/
var bg = chrome.extension.getBackgroundPage();   

bg.log("popup load pop_mod_note.js");
// 存储记事本数据
function saveRecord(){
	autoResize();
	var rec=document.getElementById("records").value;
	//存储数据
	var note={"user":userName,"note":rec};
	var msg={"cmd":"bg.saveRecord","un":userName,"data":note};
	port_bg.postMessage(msg);
}
// 载入记事本数据
function loadRecord(){
	var msg={"cmd":"bg.loadRecord","un":userName,"id":userName};
	port_bg.postMessage(msg);
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
	// bg.debug(document.body.scrollHeight+"|"+(t.scrollTop+t.scrollHeight))
}

/**************自动执行区*********************/
var modName="mod_note";
var userName=bg.Tool_getUserName(location.search);
var port_bg;
function loadPort(){	
	port_bg=chrome.runtime.connect({name: "BG#"+modName});
	port_bg.onMessage.addListener(function(msg) {
		bg.debug("pop_"+modName+"收到"+port_bg.name+"通道消息："+JSON.stringify(msg));	
	});		
	port_bg.onMessage.addListener(function(msg) {
		if (msg.cmd == "bg.loadRecord.rs"){
			document.getElementById("records").value=msg.data;
			autoResize();
		}
	});	
	loadRecord();
}
/**************窗体事件区*********************/
document.querySelector('#records').addEventListener('propertychange', saveRecord);
document.querySelector('#records').addEventListener('input', saveRecord);
document.querySelector('#records').addEventListener('focus', saveRecord);

window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_note.js done");
