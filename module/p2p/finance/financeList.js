/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/p2p/investmentProject/listDate';
$list_editUrl = getPath()+'/broker/garden/updateView';
$list_addUrl = '/shihua-surety/scheme/initEdit';
$list_deleteUrl = getPath()+'/broker/garden/deleteGarden';
$list_buildingUrl = getPath()+'/broker/building/getList';
$list_buildlistUrl =base+'/broker/building/buildList' //旧版：getPath()+'/broker/building/getList';
$list_imageUrl = getPath()+'/broker/garden/deleteGarden';
$list_modelUrl = getPath()+'/broker/room/modelManager';
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '借款类型', name: 'typeName', align: 'left', width:'8%'},
			{display: '项目金额', name: 'amount', align: 'left', width:'10%'},
			{display: '联系人', name: 'applyUserName', align: 'center', width:'8%' },
			{display: '联系电话', name: 'tel', align: 'center', width:'10%' },
			{display: '借款期限', name: 'deadline', align: 'center', width: '8%'},
			{display: '居住地址', name: 'address', align: 'center', width: '8%'},
			{display: '是否系统用户', name: 'loginApply.name', align: 'center', width: '8%'},
			{display: '申请日期', name: 'applyDate', align: 'center', width: '8%'},
			{display: '操作', name: 'operate', align: 'center', width: '12%',render:operateRender}
        ],
        url:getPath()+"/finance/listData",
        onDblClickRow : ViewProject
    }));
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	var params ={};
	params.width = 260;
	params.inputTitle = "申请时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	//新增项目
	
	
	function addProject(dlg){
		$('form').attr('action',getPath()+"/p2p/investmentProject/save");
		saveAdd(dlg);
	}
	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
		delete $list_dataParam['geographyAreaId'];
		delete $list_dataParam['areaId'];
		delete $list_dataParam['cityId'];
		delete $list_dataParam['gardenName'];	
		$("#City").val("");
		$("#area").val("");
		$("#geographyArea").val("");
		$("#gardenId").attr("value", "");
	});

	
});
function ViewProject(){
	
}
/************************
 * 根据条件查询数据
 * **********************
 */
function addpro(appId){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/add?appId="+appId, {
		id : 'addGardenWindow',
		width : 880,
		title:"新增项目",
		height : 420,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addProject){
			 		dlg.iframe.contentWindow.addProject(dlg);
				}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	
	});
}
function setTab(name,aa){
	$(".hover").removeClass("hover");
	$(aa).addClass("hover");
	selectList();
}
function selectList(){
	$list_dataParam['status'] =$(".hover").attr("id");
	//录入时间
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["effectdate"]){
		startDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startDate'] = startDate;
	} else {
		delete $list_dataParam['startDate'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endDate'] = endDate;
	} else {
		delete $list_dataParam['endDate'];
	}
	$list_dataParam['paymentOptions'] =$("#paymentOptions").val();
	if($("#borroweName").val()!='手机号,身份证,姓名'){
		$list_dataParam['borroweName'] =$("#borroweName").val();
	}else{
		delete $list_dataParam['borroweName']
	}
	if($("#title").val()!='标书号,标题'){
		$list_dataParam['title'] =$("#title").val();
	}else{
		delete $list_dataParam['title']
	}
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var returnStr = "";
	if(data.status){
		if(data.status=='1'){
			returnStr+='已经发标';
		}else{
			returnStr+='驳回原因:'+data.remark;
		}
	}else{
		returnStr+='<a href="javascript:addpro(\''+data.id+'\');">审批</a>|<a href="javascript:back(\''+data.id+'\');">驳回</a>';
	}
	return returnStr;
}

function back(fid){
	art.dialog({
		title:"驳回原因",
			content: $("#remark").get(0),
			width:500,
			height:150,
			id: 'EF893L',
			ok: function () {
				$.post(getPath()+"/finance/updateStatus",{fid:fid,remark:$("#remarkc").val()},function(data){
					if(data.STATE='SUCCESS'){
						 art.dialog.tips("操作成功",null,"succeed");
						 selectList();
					}else{
						art.dialog.alert("系统异常，原因："+data.MSG);
					}
				});
			}, 
			cancelVal: '关闭',
		    cancel: true 
		});
}
function createtimeRender(data,index,cdata){	
	var d=new Date(data.createTime);
	return  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}
function publishProject(pid,status){
	$.post(getPath()+"/p2p/investmentProject/publishProject",{id:pid,status:status},function(data){
		if(data.SUCESS){
			art.dialog.tips(data.SUCESS,null,"succeed");
			resetList();
		}else{
			art.dialog.alert(data.FAIL);
		}
	},"json");
}
function projectView(pid){	
	art.dialog.open(getPath()+"/p2p/investmentProject/view?id="+pid, {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 980,
		title:"查看项目",
		height : 650,
		lock:true,
		cancelVal: '关闭',
	    cancel: true 
	});			
}

function updateProject(pid){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/add?id="+pid, {
		id : 'addGardenWindow',
		width : 880,
		title:"新增项目",
		height : 420,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addProject){
			 		dlg.iframe.contentWindow.addProject(dlg);
				}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	
	});
}

function deleteGarden(id){
	art.dialog.confirm("你确定要此记录？",function(){
		$.post($list_deleteUrl,{gardenId:id},function(res){ 
			if(res!=null){
				if(res.STATE=="1"){
					art.dialog.tips(res.MSG,null,"succeed");
					selectList();
				}else{
					art.dialog.alert(res.MSG);
				}
			}
		},'json');
	});
}

function showMenuArea() {
	$.post(getPath()+"/basedata/area/getListDataByKey",{term:$("#areaName").val()},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#areaName");
			var cityOffset = $("#areaName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function showMenuCity() {
	$.post(getPath()+"/basedata/area/getListDataByKey",{term:$("#cityName").val(),type:"1"},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#cityName");
			var cityOffset = $("#cityName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function showMenu() {
	$.post(getPath()+"/broker/garden/getGardensByKey",{term:$("#gardenName").val()},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#gardenName");
			var cityOffset = $("#gardenName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "gardenName" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
function beforeClick(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	id= "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
		id += nodes[i].id + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var gardenObj = $("#gardenName");
	gardenObj.attr("value", v);
	var gardenId = $("#gardenId");
	gardenId.attr("value",id);
	
	$("#cityName").val("");
	$("#cityName").val("");
}

var setting = {
		check: {
			enable: true,
			chkboxType: {"Y":"", "N":""}
		},
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onCheck: onCheck
		}
	};
var zNodes;

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

