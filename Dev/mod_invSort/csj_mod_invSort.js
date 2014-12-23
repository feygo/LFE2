log("load csj_mod_invSort.js");
/*********************物品排序区*************************/
// 获得背包，并给排序对象赋值
function getItemV(bagName,sorter){
	var itemList=document.querySelectorAll("#"+bagName+">div.realitem");
	for(var i=0;i<itemList.length;i++){
		var itemId=itemList[i].id;
		var sf=itemList[i].querySelector("span.floatright");
		var vStr=sf.childNodes[0].nodeValue;
		var v=0;
		if(vStr!=null&&vStr!=undefined){
			v=parseInt(Tool_trim(vStr.replace("G","")));
		}
		sorter.push(itemId,v);	
	}
}
// 排序对象  id: "item_frame491" ,info(金额): 242
function sorter(){
	this.data=[];
	this.push=function(idDiv,info,lv){
		this.data.push({"id":idDiv,"info":info,"lv":1});
	};
	this.lvUp=function(idDiv){
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].id==idDiv){
				this.data[i].lv=2;
			}
		}
	}
	this.lvLow=function(idDiv){
		var isLow=false;
		for(var i=0;i<this.data.length;i++){
			var sId=this.data[i].id;
			var tmpId="";
			if(sId.indexOf("item_frame")!=-1){tmpId=sId.replace("item_frame","");}
			if(sId.indexOf("looting_item_frame")!=-1){tmpId=sId.replace("looting_item_frame","");}
		
			if(tmpId==idDiv){
				this.data[i].lv=0;
				isLow=true;
			}
		}
		if(isLow){
			debug(idDiv+"调整了优先级为0");
		}
	}
	this.sort=function(a,b){	
		if(a.lv>b.lv){
			return -1;
		}else if(a.lv==b.lv){
			return b.info-a.info;
		}else if(a.lv<b.lv){
			return 1;
		}
	}
	this.doSort=function(){
		return this.data.sort(this.sort);
	}
} 
// 按照排序顺序，操作页面对象，进行排序
function doSortItem(bagName,sorter){
	var bag=document.querySelector("#"+bagName);
	sorter.doSort();	
	var itemList=sorter.data;		
	for(var i=0;i<itemList.length;i++){				
		var item=bag.querySelector("#"+itemList[i].id);		
		bag.appendChild(item);
	}	
}
// 物品排序的总体执行方法
function itemSort(){
	var itemNum1=document.querySelectorAll("div.realitem").length;

	var nbSort=new sorter();
	var nbName="normal_bag";
	var childNum11=document.querySelector("#"+nbName).children.length;
	getItemV(nbName,nbSort);
	doSortItem(nbName,nbSort);
	var childNum12=document.querySelector("#"+nbName).children.length;
	debug(nbName+"-排序前元素数:"+childNum11+",排序后元素数："+childNum12);
	
	
	var lbSort=new sorter();
	var lbName="looting_bag";
	var childNum21=document.querySelector("#"+lbName).children.length;
	getItemV(lbName,lbSort);
	doSortItem(lbName,lbSort);
	var childNum22=document.querySelector("#"+lbName).children.length;
	debug(lbName+"-排序前元素数:"+childNum21+",排序后元素数："+childNum22);
	var itemNum2=document.querySelectorAll("div.realitem").length;
	debug("物品总数量-排序前:"+itemNum1+",排序后："+itemNum2);
}
/********************** 自动执行区**********************/
function csjLoad_mod_invSort(){
	itemSort();
}
csjLoad_mod_invSort();
log("load csj_mod_invSort.js done");


