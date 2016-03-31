$(document).ready(function(){
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });

	 $('#monthDiv').find('a').bind("click",function(){
		 var oType='down';
		 if($(this).hasClass("icon-svg23")){
			 oType='up'; 
		 }
		 changeMonth(oType);
	 });
	 searchData('0');
});

function searchData(str){
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	if(!$('#queryMonth').val()){
		commonTipShow("日期不能为空！",1000);
		return false;
	}
	para.showMonth=$('#queryMonth').val();
	showLoader();
	$.post(base+'/mobile/bi/busiCenter/bsRankData',para,function(res){
		$("#totalPage").val(res.data.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		if(null != res.data.items&&res.data.items.length!=0){
			var showList=res.data.items;
			var div="";
			var colorIndex="d";
			if(str == '0'){//初始化
				$(".Perfolist").html("");
			}
			for(var i=0;i<showList.length;i++){	
				if(thePage==1 && i==0){
					colorIndex="a";
				}
				if(thePage==1 && i==1){
					colorIndex="b";
				}
				if(thePage==1 && i==2){
					colorIndex="c";
				}
				if(i>2){
					colorIndex="d";
				}
				$('<dl>'+
					'<dt><b class="'+colorIndex+'-ico bold font16 fl">'+accAdd(para.pageSize*(para.currentPage-1),accAdd(1,i))+'</b>'+showList[i].DATANAME+'</dt>'+
					'<dd><span second class="perfoDigital">二手房：'+accAdd(showList[i].RENT_PRICE,showList[i].SALE_PRICE)+'</span><span new class="perfoDigital">新房：'+showList[i].NEW_PRICE+'</span></dd>'+
					'</dl>').appendTo('.Perfolist');
			}
			var busiType=res.busiType;
			if(busiType=="ALL"){
				$('[second]').show();
				$('[new]').show();
			}else if(busiType=="BROKER"){
				$('[second]').show();
				$('[new]').hide();
			}else if(busiType=="FASTSALE"){
				$('[second]').hide();
				$('[new]').show();
			}
			
			$('#dataName').text(res.dataName.name);
			$('#orgMaxCount').text(res.busiCount);
			$('#span_rent').text(res.rentCount);
			$('#span_sale').text(res.saleCount);
			$('#span_new').text(res.newCount);
			
		}else{
			$(".Perfolist").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$(".Perfolist").append(html);
		}
		$.mobile.loading( "hide" );
	},'json');
}