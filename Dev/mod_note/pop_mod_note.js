/*********************** 后台通讯区 *********************/
var bg = chrome.extension.getBackgroundPage();   

bg.log("popup load pop_mod_note.js");
// 存储记事本数据
function saveRecord(){
	autoResize();
	var rec=document.getElementById("records").value;
	//存储数据
	var note={"user":userName,"note":rec};
	var objectStore = DB_Note.transaction([DB_OS_Note], "readwrite").objectStore(DB_OS_Note);
	var requestUpdate = objectStore.put(note);
	requestUpdate.onerror = function(event) {
		bg.error("更新记事本数据出错:"+evt.target.error.message);
	};	
}
// 载入记事本数据
function loadRecord(){
	var request = DB_Note.transaction([DB_OS_Note], "readonly").objectStore(DB_OS_Note).get(userName);
	request.onsuccess = function(evt){
		var data=evt.target.result;
		if(data){
			document.getElementById("records").value=data.note;
		}else{
			document.getElementById("records").value="";
		}
		autoResize();
	}
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
var port;
var userName;
function loadPort(){
	chrome.tabs.getSelected(function(tab){
		port = chrome.tabs.connect(tab.id,{name: "MAIN"});
		port.postMessage({"cmd":"getUserName"});
		port.onMessage.addListener(function(msg) {
			bg.debug("收到"+port.name+"通道消息："+JSON.stringify(msg));
			if (msg.cmd == "getUserName.rs"){
				if(msg.data!=""){
					userName=msg.data;
					bg.Tool_connUserDB(userName,success_DB_Note);
				}
			}			
		});
	});
}
var DB_OS_Note;
var DB_Note;
var modName="mod_note";
function success_DB_Note(db){
	DB_OS_Note = bg.MOD_DEF[modName].data[0];
	DB_Note = db;
	loadRecord();
}

/**************窗体事件区*********************/
document.querySelector('#records').addEventListener('propertychange', saveRecord);
document.querySelector('#records').addEventListener('input', saveRecord);
document.querySelector('#records').addEventListener('focus', saveRecord);

window.addEventListener('load', loadPort);

bg.log("popup load pop_mod_note.js done");
