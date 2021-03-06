/* 员工转正
 * @author Cai.xing
 * @since 2012-04-02
 * */
$list_addUrl = getPath()+"/hr/affair/positive/add";//新增url
$list_editUrl = getPath()+"/hr/affair/positive/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/hr/affair/positive/delete";//删除url
$list_editWidth = "952px";
$list_editHeight = "450px";
$list_dataType = "员工转正";//数据名称
$list_hr_approve = true;//是审批界面
var true_count=0;
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'option', align: 'center', width: 80},
            {display: '单据编号', name: 'number', align: 'left', width: 120},
            {display: '单据状态', name: 'billStatuName', align: 'center', width: 80},
            {display: '员工编码', name: 'applyPerson.number', align: 'left', width: 120},
            {display: '员工姓名', name: 'applyPersonName', align: 'left', width: 120},
            {display: '部门', name: 'applyOrg.name', align: 'left', width: 120},
            {display: '职位', name: 'applyPosition.name', align: 'center', width: 120},
            {display: '职级', name: 'applyJoblevel.name', align: 'center', width: 120},
            {display: '生效日期', name: 'validateTime', align: 'center', width: 120},
            {display: '创建日期', name: 'createTime', align: 'center', width: 120} 
        ],
        checkbox:true,
        delayLoad:true,
        url:getPath()+'/hr/affair/positive/listData'
    }));
	params ={};
	params.inputTitle = "范围";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	$("#revokeBtn").bind("click",function(){
		uodateBillStatu("REVOKE");
	});
	$("#rejectBtn").bind("click",function(){
		uodateBillStatu("REJECT");
	});
	$("#searchKeyWord").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	searchData();
});
function uodateBillStatu(ststu){
	 var selectRows = $list_dataGrid.getSelectedRows();
	 var housePowers =[];
	 if(selectRows==null || selectRows.length==0){
			art.dialog.tips("请至少选择一个进行操作！");
			return false;
		}
	 for (var i = 0; i < selectRows.length; i++)
	    {
		 	if(selectRows[i].billStatus=="SUBMIT" ){
		 		var newRow={};
			 	newRow.id = selectRows[i].id;
			 	newRow.billStatus =ststu;
		    	housePowers.push(newRow);
		 	}
	    }
	 if(housePowers.length==0){
		 art.dialog.alert("没有需要做此操作的单据！");
		 return;
	 }
	 	var hpStr  =JSON.stringify(housePowers);
		$.post(getPath()+"/hr/affair/leaveOffice/updateStatu",{hpStr:hpStr},function(data){
			if(data.STATE=="SUCCESS"){
   			art.dialog.tips(data.MSG);
   			resetList();
   		}else{
   			art.dialog.tips(data.MSG);
   			resetList();
   		}
		},"json");
}
//批量审批
function batchApp(){
	
	var array = $list_dataGrid.getCheckedRows () ;
	 var housePowers =[];
	 for (var i = 0; i < array.length; i++)
	    {
		 	if(array[i].billStatus=="SUBMIT" ){
		 		var newRow={};
			 	newRow.id = array[i].id;
		    	housePowers.push(newRow);
		 	}
	    }
	 if(housePowers.length==0){
		 art.dialog.tips("请选择审批中的单据进行操作！");
		 return;
	 }
	art.dialog.confirm("你选择了"+housePowers.length+"个可审批的单据,是否全部通过审批？",function(){
		var a=1;
		$(array).each(function(){
			if(this.billStatus=="SUBMIT" ){
			var billId = this.id;
			$.post(ctx+"/hr/affair/positive/approvalBill",{billId:billId},function(data){
					if(data.STATE=="SUCCESS"){
						true_count+=1;
						if(true_count==array.length ){
							true_count=0;
							art.dialog.tips(data.MSG,null,"succeed");
			    			resetList();
						}
		    		}else{
		    			art.dialog.alert(data.MSG);
		    			resetList();
		    		}
				
	    	});
			a++;
			}
		});
		
	});
	
}
function searchData(){
	$list_dataParam["billSta"] =  $("#billSta").val();
	//日期范围类型
	var dateType = $('#dateType').val();
	$list_dataParam['dateType'] = dateType;
	if(MenuManager.menus["createTime"]!=null){
		$list_dataParam["beginDate"] =  MenuManager.menus["createTime"].getValue().timeStartValue;
		$list_dataParam["endDate"] =  MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	if($("#orgId").val()!="所属组织"){
		$list_dataParam["orgId"] =  $("#orgId").val();
	}
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	resetList();
}
function cleanData(){
	$("#orgId").val("");
	$("#orgName").val("所属组织");
	$("#billSta").val("");
	$("#createTime").val("日期范围:不限");
	$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	MenuManager.menus["createTime"].resetAll();
}
function changeStatu(id,billStatu,opName){
	art.dialog.confirm("是否"+opName+"此单据？",function(){
		$.post(ctx+"/hr/affair/positive/changeStatu",{billId:id,billStatu:billStatu},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data.MSG);
    			resetList();
    			art.dialog.list["appView"].close();
    		}else{
    			art.dialog.tips(data.MSG);
    			resetList();
    		}
    	});
	});
}
function approval(id){
	art.dialog.confirm("是否通过审批？",function(){
		$.post(ctx+"/hr/affair/positive/approvalBill",{billId:id},function(data){
    		if(data.STATE=="SUCCESS"){
    			art.dialog.tips(data.MSG);
    			resetList();
    			art.dialog.list["appView"].close();
    		}else{
    			art.dialog.tips(data.MSG);
    			resetList();
    		}
    	});
	});
}