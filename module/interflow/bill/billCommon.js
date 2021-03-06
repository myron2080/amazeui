editbill = function(id){
	var flag = false;
	var hasY = hasScroll(window.parent.document).Y ; 
	if(hasY){
		$(window.parent.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	var dlg = art.dialog.open(getPath()+"/interflow/bill/editBill?id="+id+(jbfb=='1'?"&enterWay=simp":""),{
		title:'修改'+(jbfb=='1'?'简报':'战报'),
		 lock:true,
		 width:'800px',
		 height:'500px',
		 id:"editBill",
		 close:function(){
			 if(flag){
				 initBillData($("#curpage").val());
			 }		 	
			 if(hasY){
					$(window.parent.document).find('body').css({overflow:"scroll"});    //启用滚动条
			}
			},
			cancel:function(){
				
			},
			ok:function(){
				 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateBillForm){
					 dlg.iframe.contentWindow.validateBillForm(dlg);
					 flag = true;
				}
				return false;
			}
	});
}

function getBillType(){
	$.post(getPath()+"/interflow/bill/getBillTypes",function(data){
		
		var htmlStr='<option value="">全部战报</option>';
		for(var i =0;i<data.length;i++){
			htmlStr +='<option value="'+data[i].value+'">'+data[i].name+'</option>';
		}
		$(htmlStr).appendTo("#type");
	},'json');
}

deletebill = function(id){
	art.dialog.confirm("确定删除这条战报吗?",function(){		
		$.post(getPath()+"/interflow/bill/deteleById",{id:id},function(data){
			art.dialog.tips("删除成功",null,"succeed");
			initBillData($("#curpage").val());
		},"json");
	},function(){});
}

function viewbill(obj,id){
	if($("#reply_"+id).css("display")=='none'){
		$("#reply_"+id).show();
		$("#reply_talk_"+id).show();
		initBillCommentData($("#reply_list_"+id),id);
	}else{
		$("#reply_"+id).hide();
		$("#reply_talk_"+id).hide();
		
	}
	
}

toBillReplyStr = function(billId,reCreatorName,creatorById,orgById){
	$("#creatorById_"+billId).val(creatorById);
	$("#orgById_"+billId).val(orgById);
	$("#rely_content_"+billId).val("回复"+reCreatorName+":");
}

initBillCommentData = function(obj,billId){
	$.post(getPath()+"/interflow/billComment/getAllReply",{billId:billId},function(res){
		$(obj).html('');
		var data = res.comment;
		var clickCount = res.clickCount;		
		$("#reply_click_"+billId).html(clickCount);
		$("#reply_comment_"+billId).html(data.length);
		for(var i = 0;i<data.length;i++){
			var photo ="";
			if(data[i].reCreator.photo){
				
				photo="images/"+data[i].reCreator.photo;
			}else{
				photo = "default/style/images/home/man_head.gif";
			}		
			   var hmcom = "<dl>";
			   hmcom +="<dt class='kd-avatar01'><img src='"+getPath()+"/"+photo+"'/></dt>";
			   hmcom += "<dd class='kd_msg01'><div class='replyBox01'><p><b class='fl link-blue'>"+data[i].belongOrg.name+"："+data[i].reCreator.name+"&nbsp;&nbsp;&nbsp;"+data[i].dateStr+"</b> ";
			   hmcom += " <b class='fr'><a class='kd-talk-ico03' onclick=toBillReplyStr('"+billId+"','"+data[i].reCreator.name+"','"+data[i].reCreator.id+"','"+data[i].belongOrg.id+"') href='javascript:void(0)'>回复</a></b>"
			   hmcom += "</p>";
			   hmcom += "<p>"+convertImg(data[i].reContent)+"</p>";
			   hmcom += "</div></dd>"+"</dl>";
			   $(hmcom).appendTo($(obj));
			   
		}
		
	});
}

addBillComment = function(obj,billId){
	$(obj).attr("disabled",true);
	var creatorById = $("#creatorById_"+billId).val();
	var orgById = $("#orgById_"+billId).val();
	var content = $("#rely_content_"+billId).val();
	if(content==""){
		art.dialog.tips('评论不能为空！');
		return
	}else{
		$.post(getPath()+"/interflow/billComment/addBillComment",{billId:billId,reContent:content,creatorBy:creatorById,orgBy:orgById},function(data){
			$("#rely_content_"+billId).val("");
			
			initBillCommentData($("#reply_list_"+billId),billId);
			$(obj).attr("disabled",false);
			
		});
	}
}

function addBill(type){
	
	var hasY = hasScroll(window.parent.document).Y ; 
	if(hasY){
		$(window.parent.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/interflow/bill/addBill"+(type?("?enterWay="+type):""),{
			title:(type=='simp'?'发布简报':'发布战报'),
			 lock:true,
			 width:'800px',
			 height:'400px',
			 id:"addBill",
			 close:function(){
				 if(flag){
					 initBillData();
				 }
				 if(hasY){
						$(window.parent.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
				},
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.validateBillForm){
							dlg.iframe.contentWindow.validateBillForm(dlg);
							flag = true;
						}
						
						return false;
					}},{name:'取消',callback:function(){
						
						return true;
					}}]
		});
		
	}

function pagGetBillData(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips('已经是第一页');
			return
		}else{
			initBillData(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initBillData(page+1);
		}
	}
}


function initBillData(page){
	if(!page) page = 1;
	$("#curpage").val(page);
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	var name = $("#billCon").val();
	if(name==$("#billCon").attr('defaultValue')){
		name='';
	}
	//var type = $("#type").val();
	var param = {};
	param.page = page;
	param.startDate = queryStartDate;
	param.endDate = queryEndDate;
	param.searchName = name;
	//param.type = type;
	$.post(getPath()+"/interflow/bill/billTemp",param,function(data){
		$(".kd-report-list").html('');
		$(".kd-report-list").html($(data).find("#searchlist").html());
		$("div[key='content']").each(function(){
				 var content = $(this).html();
				 $(this).html(convert2face(getPath(),content));
			});	
		$("#panelbody").scrollTop(0);
		EnlargerImg.init();
		personPop.init();
		$("#Pagination").html('');
		$("#Pagination").html($(data).find("#pagediv").html());
	});
}
