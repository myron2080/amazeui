$(document).ready(function(){
		var d = $("#applyChangePositionId");
		d.unbind('change');
		d.bind('change',function(){
			var jl = $("#applyChangeJoblevelId");
			jl.val(null);
			jl.html('');
			if($(d).val()){
				$.post(getPath()+'/basedata/position/getJobLevelByPosition',{position:d.val()},function(res){
					if(res && res.length > 0){
						for(var i = 0; i < res.length; i++){
							$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(jl);
						}
					}
				},'json');
			}
		});
});


function changeOrg(oldValue,newValue,doc){
	var p = $("#applyChangePositionId");
	p.val(null);
	p.html('');
	if(newValue){
		$.post(getPath()+'/basedata/position/getByOrg',{org:newValue.id},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(p);
				}
				p.trigger('change');
			}
		},'json');
	}
}

function saveAdd(preWinObj,operateType){
	currentDialog = preWinObj;
	submitData(preWinObj,operateType);
}

function submitData(preWinObj,operateType){
	var flag = true;
     if(operateType=="SUBMIT"){
    	 $("#billStatus").val("SUBMIT");
     }else if(operateType=="SAVE"){
    	 if(!$("#billStatus").val()){
        	 $("#billStatus").val("SAVE");
          }
     }
     //isdisable 默认为N
     $("#isdisable").val("N");
     
     var applyPersonId = $("#applyPersonId").val();
     if(!applyPersonId){
    	 art.dialog.tips('请选择调职申请人！');
	     flag = false;
     }
     
     /*var handOverPersonId = $("#handOverPersonId").val();
     if(!handOverPersonId){
    	 art.dialog.tips('请选择交接人！');
    	 flag = false;
     }*/
     
     /*var applyOrgId = $("#applyOrg.id").val();
     var applyPositionId = $("#applyPositionId").val();
     var applyJoblevelId = $("#applyJoblevelId").val();
     
     var applyChangeOrgId = $("#applyChangeOrgId").val();
     var applyChangePositionId = $("#applyChangePositionId").val();
     var applyChangeJoblevelId = $("#applyChangeJoblevelId").val();
     if(!applyChangeOrgId || !applyChangePositionId  || !applyChangeJoblevelId){
    	 art.dialog.tips('请选择正确的变动组织、变动职位、变动职级！');
    	 flag = false;
     }
     
     if(applyOrgId==applyChangeOrgId && applyPositionId==applyChangePositionId 
    		 && applyJoblevelId==applyChangeJoblevelId){
     
	     art.dialog.tips('职位相同，不允许保存！');
	     flag = false;
     }*/
     
     var effectdate = $("#effectdate").val();
     if(!effectdate){
		 art.dialog.tips('请选择生效日期！');
		 flag = false;
	 }
     var takeOfficeDate = $("#takeOfficeDate").val()||'';
     if(takeOfficeDate.trim()>effectdate.trim()){
    	 art.dialog.tips('生效日期不能小于任职日期！');
		 flag = false;
     }
	 if(flag){
		 $("form").submit();
	 }
	 
}

/**
 * 选择申请人
 * @param oldValue
 * @param newValue
 * @param doc
 */
function choosePerson(oldValue,newValue,doc){
	 $("#applyPersonId").val(newValue.id||"");
	 $("#applyPersonNumber").val(newValue.number||"");
	 $("#applyPersonName").val(newValue.name||"");
	 $("#applyOrgName").val(newValue["personPosition.position.belongOrg.name"]||"");
	 $("#applyOrgId").val(newValue["personPosition.position.belongOrg.id"]||"");
	 $("#applyPositionName").val(newValue["personPosition.position.name"]||"");
	 $("#applyPositionId").val(newValue["personPosition.position.id"]||"");
	 $("#applyJoblevelName").val(newValue["personPosition.jobLevel.name"]||"");
	 $("#applyJoblevelId").val(newValue["personPosition.jobLevel.id"]||"");
	 $("#takeOfficeDate").val(newValue["personPosition.effectDate"]||"");
	 $("#jobStatus").val(getFieldFromData(newValue,'jobStatus.id')||"");
}

/**
 * 选择交接人
 * @param oldValue
 * @param newValue
 * @param doc
 */
function chooseHandOverPerson(oldValue,newValue,doc){
	 $("#handOverPersonId").val(newValue.id||"");
	 $("#handOverPersonName").val(newValue.name||"");
}

function saveSubmit(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/employeedelrundisk/updateSubmit");
	saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/employeedelrundisk/cancleBill");
	saveAdd(dlg,'REVOKE');
}
