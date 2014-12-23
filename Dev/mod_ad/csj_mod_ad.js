log("load csj_mod_ad.js");
/** 广告屏蔽区 */
function hiddenAD(){
	var ad=document.getElementById("linodas_ad");
	if(ad!=null){
		ad.style.display="none";//隐藏
	}
	document.getElementById("linodas_ad").innerHTML="";
}
/********************** 自动执行区**********************/
function csjLoad_mod_ad(){
	hiddenAD();
}
csjLoad_mod_ad();

log("load csj_mod_ad.js done");




