/** select操作区 */
// 1.判断select选项中 是否存在Value="paraValue"的Item    
function jsSelectIsExitItem(objSelect, objItemValue) {        
    var isExit = false;        
    for (var i = 0; i < objSelect.options.length; i++) {        
        if (objSelect.options[i].value == objItemValue) {        
            isExit = true;        
            break;        
        }        
    }        
    return isExit;        
}  

// 2.向select选项中 加入一个Item        
function jsAddItemToSelect(objSelect, objItemText, objItemValue) {        
    //判断是否存在        
    if (jsSelectIsExitItem(objSelect, objItemValue)) {        
        alert("该Item的Value值已经存在");        
    } else {        
        var varItem = new Option(objItemText, objItemValue);      
        objSelect.options.add(varItem);      
    }        
}   

// 3.从select选项中 删除一个Item        
function jsRemoveItemFromSelect(objSelect, objItemValue) {        
    //判断是否存在        
    if (jsSelectIsExitItem(objSelect, objItemValue)) {        
        for (var i = 0; i < objSelect.options.length; i++) {        
            if (objSelect.options[i].value == objItemValue) {        
                objSelect.options.remove(i);        
                break;        
            }        
        }        
    } else {        
        alert("该select中 不存在该项");        
    }        
}    
// 4.删除select中选中的项    
function jsRemoveSelectedItemFromSelect(objSelect) {        
    var length = objSelect.options.length - 1;    
    for(var i = length; i >= 0; i--){    
        if(objSelect[i].selected == true){    
            objSelect.options[i] = null;    
        }    
    }    
}      

// 5.修改select选项中 value="paraValue"的text为"paraText"        
function jsUpdateItemToSelect(objSelect, objItemText, objItemValue) {        
    //判断是否存在        
    if (jsSelectIsExitItem(objSelect, objItemValue)) {        
        for (var i = 0; i < objSelect.options.length; i++) {        
            if (objSelect.options[i].value == objItemValue) {        
                objSelect.options[i].text = objItemText;        
                break;        
            }        
        }        
        alert("成功修改");        
    } else {        
        alert("该select中 不存在该项");        
    }        
}        
 //  6.设置select中text="paraText"的第一个Item为选中         
 function  jsSelectItemByValue(objSelect, objItemText)  {            
      // 判断是否存在         
      var  isExit  =   false ;        
      for  ( var  i  =   0 ; i  <  objSelect.options.length; i ++ )  {        
          if  (objSelect.options[i].text  ==  objItemText)  {        
             objSelect.options[i].selected  =   true ;        
             isExit  =   true ;        
              break ;        
         }         
	}    
}
