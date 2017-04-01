/**
 * 诊股页面
 * @author: 李云锋
 * @date: 2014-03-25
 */


//父容器
var diagnosisSharesContentId = "diagnosisShares-vice-content";

//父容器
var diagnosisSharesTopTitle = "diagnosisShares-title";
	
function createDiagnosisSharesBody(params){
    //创建2级页面部分
    createContent(params,diagnosisSharesContentId);
	//创建标题区域
    buildBlueHeader(diagnosisSharesTopTitle,$("#"+ diagnosisSharesContentId));
    //创建标题部分
    createDiagnosisSharesTitle(diagnosisSharesTopTitle,params);
    animatingFun(params,function(){
        //创建内容部分
    createDiagnosisSharesMainBody($("#"+diagnosisSharesContentId), params );
    });
};
	
/**
 * 创建标题
 */
function createDiagnosisSharesTitle(titleId,params){
		var stk_code = params.params.stockCode;
		var stk_name = params.params.stkName;
    var html = 
    	'<div class="ui-gw-header-leftBtn"><div id="diagnosisSharesBackward" class="ui-gw-header-backward"></div></div>'+
		//'<div class="ui-gw-header-title">'+
		//'<div class="title-inner title-inner-main" id="stkName_div"></div>'+
		//'<div class="title-inner title-inner-sub " id="stkCode"></div>'+
	  //'</div>'+
	  '<div class="ui-gw-header-stock clearfix">' +
    '<div class="ui-gw-header-stock-name">' +
    '<div class="name">' + stk_name + '</div>' +
    '<div class="number">' + stk_code.replace(/[^\d]/g,'') + '</div>' +
 		'</div>' +
    '</div>' +
		'<div class="ui-gw-header-rightBtn"></div>';
    //标题设置为空
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
    //左个角返回图标
    touchEventWithBackShadow($("#diagnosisSharesBackward"),function(){
    	gobackByParams();
    });
}

/**
 * 创建内容部分
 */
function createDiagnosisSharesMainBody($container, params){
	var wrapperId = "wrapper"+(new Date()).getTime();
    var scrollerId = "scroller"+(new Date()).getTime();
    //创建id为wrapperId的列表
    var html = 
    	'<div class="wrapperStyle" id="'+ wrapperId + '">' +
        	'<div id="'+ scrollerId + '" style="width:100%">'+ 
        	
   // '<div class="">'+
        '<div class="wrapper-item  rating-today">'+
    '<div class="wrapper-block">'+
        '<div class="clearfix rating-today-result">'+
            '<h3 class="title title-main">今日评分</h3>'+
           ' <div class="fl left-part">'+
                '<div class="title title-sub" id="TOP_RANK_div"></div>'+
                '<div class="rating-score" id="RS_div">'+
                '</div>'+
            '</div>'+
            '<div class="fr right-part">'+
                '<a class="btn-operate-suggestion" href="#">'+
                    '<span class="btn-inner-content" id="OPADV">'+
                        '<span class="icon icon-arrow-right">></span>'+
                        //'<span class="btn-text" >操作建议</span>'+
                        '<span class="btn-text" >了解更多</span>'+
                    '</span>'+
                '</a>'+
            '</div>'+
        '</div>'+
        '<p class="rating-today-text" id="RS_AD_div">'+
        '</p>'+
    '</div>'+
'</div>'+
'<div class="wrapper-item wrapper-foldable wrapper-hot">'+
'<div class="splitter"></div>'+
    '<div class="wrapper-block title-bar">'+
        '<h3 class="title fl">热点题材扫描</h3>'+
        '<div class="star-rating fr" id="HSS_div">'+
        '</div>'+
    '</div>'+
    '<div class="wrapper-block content-block clearfix message-status" id="HS_div" style="display:none">'+
        
    '</div>'+
    '<div class="splitter"></div>'+
'</div>'+
'<div class="wrapper-item wrapper-foldable wrapper-index">'+
    '<div class="wrapper-block title-bar">'+
        '<h3 class="title fl">交易指标诊断</h3>'+
        '<div class="star-rating fr" id="TP_div">'+
        '</div>'+
    '</div>'+
    '<div class="wrapper-block content-block clearfix" style="display:none" id="canvas_layout">'+
        '<div class="clearfix" id="TP_div_1">'+
        '</div>'+
        '<div class="clearfix chart-container">'+
            '<div class="">'+
                '<canvas id="canvas_1" width="2732" height="350" style="width: 1366px; height: 175px; position: relative; z-index: 5; display: none;"></canvas>' +
            '</div>'+
            //'<p class="chart-title" id="canvas_1_bottom">'+
            '</p>'+
        '</div>'+
    '</div>'+
    '<div class="line line-gray"></div>'+
    '<div class="wrapper-block content-block clearfix hide"  id="fdChange_div">'+
        '<div class="turnover-status clearfix">'+
           ' <span class="fl sp1 red"></span>'+
           ' <span class="fr sp2 black text-right" >'+
              '  五日换手率<br>'+
              '  <span class="sub-text" ><span class="percentage" id="FCRate_span" ></span><span class="sm" >%</span></span>'+
            '</span>'+
        '</div>'+
        '<div class="turnover-container" >'+
           ' <div class="turnover-text" style="left:0%" id="FCRate_div"></div>'+
           ' <div class="turnover-bar">'+
               ' <div class="turnover-bar-inner">'+
                    '<div class="turnover-bar-position" style="left:0%" id="FCRate_div_1">'+
                        '<span class="arrow-triangle-down arrow-triangle-down-gray"></span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="wrapper-block content-block clearfix dragon-rank" id="dragonRank" style="display:none">'+
        '<div class="rank-title text-center black">龙虎榜</div>'+
        '<div class="dragon-rank-top">'+
            '<div class="sub-title">'+
                '最近一次上榜<br>'+
               ' <span class="date" id="dragonRankTime"></span>'+
            '</div>'+
            '<div class="medal-box clearfix" id="dragonRank_div">'+
                
            '</div>'+
        '</div>'+
        '<div class="dragon-rank-bottom">'+
            '<div class="trapezium"></div>'+
            '<div class="rectangle"></div>'+
        '</div>'+
    '</div>'+
    '<div id="RZRQ_div">' +
    '</div>' +
    '<div class="wrapper-block content-block clearfix shareholding-changes" id="MSChange_div" style="display:none">'+
        '<div class="clearfix">'+
            '<span class="fr sp2 black text-center" >高管持股变动</span>'+
        '</div>'+
        '<div class="clearfix">'+
            '<p class="text-center" id="MSChange">'+
            '</p>'+
        '</div>'+
    '</div>'+
    '<div class="splitter"></div>'+
'</div>'+
'<div class="wrapper-item wrapper-foldable wrapper-running">'+
    '<div class="wrapper-block title-bar">'+
        '<h3 class="title fl">经营指标诊断</h3>'+
        '<div class="star-rating fr" id="TD_div">'+
        '</div>'+
    '</div>'+
    '<div class="wrapper-block content-block clearfix" id="canvas_2_layout" style="display:none">'+
        '<div class="clearfix" id="TDI_div">'+
           
        '</div>'+
        '<div class="clearfix chart-container">'+
            '<div class="chart-data" id="canvas_2">'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="line line-gray"></div>'+
    '<div class="wrapper-block content-block clearfix" id="canvas_3_layout" style="display:none">'+
        '<div class="clearfix" id="ESI_div">'+
           
        '</div>'+
        '<div class="clearfix chart-container">'+
            '<div class="chart-data" id="canvas_3">'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="wrapper-block content-block clearfix" id="canvas_4_layout" style="display:none">'+
        '<div class="clearfix">'+
            '<div class="fl sp1" id="TTM_div">'+
            '</div>'+
            '<div class="fr sp2" >'+
                '<ul class="text-items fr">'+
                    '<li class="black">市盈率<sup>TTM</sup></li>'+
                '</ul>'+
            '</div>'+
        '</div>'+
        '<div class="clearfix chart-container">'+
            '<div class="chart-data" id="canvas_4" >'+
            		
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="line line-gray"></div>'+    
		'</div>'+
		'<div class="wrapper-item wrapper-foldable wrapper-strategy" id="StrategyData">' +
		'<div class="splitter"></div>' +
    '<div class="wrapper-block title-bar"><h3 class="title fl">策略指标诊断</h3>' +
		'<div class="star-rating fr" id="SG_div">' +
    '</div></div>' +
    '<div id="StrategyDataInfo"></div>'+
		'</div>'+
		'<div class="wrapper-item wrapper-foldable wrapper-operate">'+
    '<div class="wrapper-block content-block clearfix">'+
        '<div class="left-part fl">'+
            '<div class="top gray">今日评分</div>'+
            '<div class="bottom gray" id="RS_div_1"></div>'+
        '</div>'+
        //'<div class="right-part fl" id="OPADV_1"><a href="#" class="light-blue">立即查看操作建议</a></div>'+
        '<div class="right-part fl" id="OPADV_1"><a href="#" class="light-blue">了解更多</a></div>'+
    '</div>'+
		'</div>'+
		'<div class="wrapper-item wrapper-risk-warning">'+
    '<p class="text-center">该诊断结果由客观数据经数据模型运算而成，<br/>仅供参考，据此操作，风险自担。</p>' +
    '</div>' +
		'</div>' +
		'</div>';
    
    //$container.html(html);
    var selfData = {};
    selfData.html = html;
    selfData.wrapperId = wrapperId;
    selfData.scrollerId = scrollerId;
    selfData.isOnlyScroll = true;
    selfData.isUnBindClickEnt = true;
    selfData.delayCreate = true;
	  selfData.isCloseTrans3D = true;
    var listDetail = new NewsTitleList.List($container,"",0,function(){},selfData);
    //初始页面数据
    initDiagnosisSharesData(listDetail,params);
    
}

function initDiagnosisSharesData(listDetail, params ){
	var stk_code = params.params.stockCode;
	var stk_name = params.params.stkName;
	var stk_price = params.params.price;
	$( "#stkName" ).html( stk_name );
  $( "#stkCode" ).html( stk_code.replace(/[^\d]/g,'') );
	checkNetwork();
	initBaseInfo( stk_code, stk_name );//基础信息加载
	initDumpButton( stk_code );//跳转按钮
	initDiagnosisSharesIndex( stk_code );//交易指标
	initDiagnosisSharesIndexTitle( stk_code );//资金流向标题填充
	initMarketProfit( stk_code );//市盈率
	initMarketProfitTitle( stk_code );//市盈率标题
	initRankData( stk_code );//初始化龙虎榜
	initRZRQData( stk_code );//融资融券
	initStockChange( stk_code );//高管持股变动
	initFiveChangeRate( stk_code );//五日换手率
	initHotSpot( stk_code );//热点诊断
	initTradeIncome( stk_code );//营业收入
	initEveryStockIncome( stk_code );//个股营收
	initStrategyData(  stk_code, stk_price, listDetail );//策略值填充
	
	setTimeout(function(){
    	listDetail.delayCreateScroll();
      listDetail.refreshDom();
    },800);
}

function initDiagnosisSharesIndex( stk_code ){
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getFundsFlow";
  var url = getFullUrl( "mobile/stock/rate/getFundsFlow" );
	var datas = {"code":stk_code};
	console.log(url);
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result && result.length>0){
    		var c = $( "#canvas_1" )[0];
				var ctx=c.getContext("2d");
				ctx.beginPath();
				ctx.lineWidth = 1;
				//var rW = document.body.clientWidth/ result.length < 1?1:parseInt( document.body.clientWidth/ result.length );
				var rW = 14;
				var avgh = c.height/4;
				var avgw = parseInt( document.body.clientWidth / result.length );
				var dheight = avgh;
				var dwidth = 5 ;
				var t = 0;
				for( var i = 0; i < result.length; i ++ ){
					var dd = result[i];
					var _value = Math.abs( dd.big_netflow );
					t = t < _value? _value: t;
				}
				for( var i = 0; i < 3; i ++ ){
					ctx.moveTo( 0, dheight );
					ctx.lineTo( c.width, dheight );
					dheight = dheight + avgh;
				}
				ctx.strokeStyle="#babfc4";
				ctx.stroke();
				
				var i = 0;
				if( avgw < 8 ){
					i = 10;
					avgw = parseInt( document.body.clientWidth / ( result.length - 10 ) );
				}
				var _x = 0;
				for( ; i < result.length; i ++ ){
					var dd = result[i];
					var _value = dd.big_netflow;
					var _p = _value/t;
					var _pY = avgh * 4 * _p;
					_value > 0? ctx.fillStyle="#DD1414" : ctx.fillStyle="#0B8040";
					ctx.fillRect( _x*2 , _value > 0? avgh * 2-Math.abs( _pY ):avgh*2+Math.abs( _pY ), rW, _pY );
					_x = _x + avgw ;
				}
				ctx.closePath();
				//$( "#canvas_1_bottom" ).html( result[0].time + "-" + result[ result.length - 1 ].time );
				
				var avgV = 0;
				for( var i = 1; i <= 5; i ++ ){
					avgV +=  eval( result[ result.length - i ].big_netflow );
				}
				avgV = Math.round(avgV/10000*100)/100;
				var html = '';
				if( avgV >= 0 ){
					html = '<span class="fl sp1 red"><span class="icon icon-arrow-up fl"></span><ul class="text-items fl"><li class="red" id="TDI_li_1">五日资金净流入</li>' +
            '<li class="red" id="">' + avgV + '万元</li></ul></span>'+
          '<span class="fr sp2 black" >资金流向</span>';
        }else{
        	html = '<span class="fl sp1 green"><span class="icon icon-arrow-down fl"></span><ul class="text-items fl"><li class="green" id="TDI_li_1">五日资金净流出</li>' +
            '<li class="green" id="">' + ( avgV * -1 ) + '万元</li></ul></span>'+
          '<span class="fr sp2 black" >资金流向</span>';
        }
				$( "#TP_div_1" ).html( html );
				$( "#canvas_1" ).css( 'display','inline' );
				$( "#canvas_layout" ).show();
    	}
    });
}

function initDiagnosisSharesIndexTitle( stk_code ){
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getIncomeIncreaseInfo";
	var url = getFullUrl( "mobile/stock/rate/getIncomeIncreaseInfo" );
	var datas = {"code":stk_code};
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result && result.length > 0 ){
    		var dep = result[0].dep == 0?"":"预期";
    		if( result[0].type == 1 ){
    			var html = ' <div class="fl sp1">'+
                		 '<span class="icon icon-arrow-up fl"></span>'+
               			 ' <ul class="text-items fl">'+
               			 '<li class="red" id="TDI_li_1">' + dep + getIncomeIncreaseInfoTitle( result[0].num )+ '</li>'+
                     ' <li class="black" id="TDI_div">同比增长率' +result[0].income_rate+ '%</li>' +
               			 ' </ul>'+
            			   '</div>'+
            				 '<div class="fr sp2" >'+
                		 '<ul class="text-items fr">'+
                		 '<li class="black">营业收入</li>'+
                     '<li class="blue">' +result[0].income+ '<span class="black sm">亿元</span></li>' +
                		 '</ul></div>';
          $( "#TDI_div" ).html( html );
    		}else{
    			var html = ' <div class="fl sp1">'+
                		 '<span class="icon icon-arrow-down fl"></span>'+
               			 ' <ul class="text-items fl">'+
               			 '<li class="green" id="TDI_li_1">' + dep + getIncomeIncreaseInfoTitle( result[0].num )+ '</li>'+
                     ' <li class="black" id="TDI_div">同比增长率' +result[0].income_rate+ '%</li>' +
               			 ' </ul>'+
            			   '</div>'+
            				 '<div class="fr sp2" >'+
                		 '<ul class="text-items fr">'+
                		 '<li class="black">营业收入</li>'+
                     '<li class="blue">' +result[0].income+ '<span class="black sm">亿元</span></li>' +
                		 '</ul></div>';
          $( "#TDI_div" ).html( html );
    		}
    	}
    });
}



function initMarketProfitTitle( stk_code ){
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getMicroReduceInfo";
	var url = getFullUrl( "mobile/stock/rate/getMicroReduceInfo" );
	var datas = {"code":stk_code};
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result && result.length > 0 ){
    		if( result[0].type == 1 ){
    			var dep = result[0].dep == 0?"":"预期";
    			var html =  '<div class="fl sp1" >'+
    									'<span class="icon icon-arrow-up fl"></span>'+
                		 	'<ul class="text-items fl">'+
                     	'<li class="red">' + dep +getMicroReduceInfoTitle( result[0].num )+ '</li>'+
                     	'<li class="black">同比增长率' +result[0].income_rate+ '%</li>'+
                			'</ul>' +
            				  '</div>'+
            					'<div class="fr sp2" >'+
                			'<ul class="text-items fr">'+
                			'<li class="black">每股收益</li>'+
                  		'<li class="blue">' +result[0].income+ '<span class="black sm">元</span></li>'+
                			'</ul>'+
            					'</div>';
          $( "#ESI_div" ).html( html );
    		}else{
    			 var html =  '<div class="fl sp1" >'+
    									'<span class="icon icon-arrow-down fl"></span>'+
                		 	'<ul class="text-items fl">'+
                     	'<li class="green">' +getMicroReduceInfoTitle( result[0].num )+ '</li>'+
                     	'<li class="black">同比增长率' +result[0].income_rate+ '%</li>'+
                			'</ul>' +
            				  '</div>'+
            					'<div class="fr sp2" >'+
                			'<ul class="text-items fr">'+
                			'<li class="black">每股收益</li>'+
                  		'<li class="blue">' +result[0].income+ '<span class="black sm">元</span></li>'+
                			'</ul>'+
            					'</div>';
          $( "#ESI_div" ).html( html );
    		}
    	}
    });
}

function initStrategyData(  stk_code, stk_price, listDetail ){
	console.log("初始化交易指标诊断");
	//var url = "http://10.15.92.217:8080/mobile/stock/strategy/getStrategyByObj";
	var url = getFullUrl( "mobile/stock/strategy/getStrategyByObj" );
	var datas = {"obj":stk_code};
	console.log(url);
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result){
    		if( result.length == 0 ){
    			var html = 
    								 '<div class="wrapper-block content-block clearfix wrapper-shake" id="SK_div">' +
                		 '<div class="shake-text text-center light-blue">' +
                     '<span class="icon icon-avatar-sad-light"></span>' +
                     '<span class="title" style="margin-left: 0px;">此股票未被选入任何策略池</span>' +
                		 '</div>' +
                		 '<div class="shake" align="center">'+
                     '<img src="../../images/shake.png" height="200" width="200" alt="" id="shake_img">'+
                		 '</div>'+
                		 '<div class="tips black" align="center">摇一摇，看看策略池中有哪些牛股！</div>' +
            				 '</div>'+
           					 '<div class="line line-gray"></div>';
          $( "#StrategyData" ).removeClass();
          $( "#StrategyData" ).addClass( "wrapper-item wrapper-foldable wrapper-shake-result" );
          $( "#StrategyDataInfo" ).html( html );
          $( "#shake_img" ).click( function(){
          	shakeGetStock( stk_code );
          })
          var shakeCount = 0;
          
          var watchID = navigator.accelerometer.watchAcceleration(function(acceleration){ 
          	if(Math.abs(acceleration.x)>13 || Math.abs(acceleration.y)>13  ||Math.abs(acceleration.z)>13){
                if( $( "#StrategyData" ).offset().top <= 300 ){  
                shakeCount++;
              	if( shakeCount == 4 ){
              		shakeGetStock( stk_code, listDetail );
              		navigator.accelerometer.clearWatch(watchID);
              		navigator.notification.vibrate(1000);
              	}
              }
            }
            
          },function(){toastText("对不起，没有摇到牛股！");$( "#StrategyData" ).html('');},{frequency: 150});
          
    		}else{
    			
    			var html = 
    								 '<div class="wrapper-block content-block clearfix">'+
        						 '<ul class="item-list">'+
            				 '<li class="item-rocket text-center blue">'+
                		 '<span class="icon icon-rocket"></span>'+
                		 '<span class="title" >&nbsp;此股票已被选入以下' + result.length+ '个策略池!</span></li>';
            	for( var i = 0; i < result.length; i ++ ){
            		var dateTime = result[i].buyingDate/1000000;
            		var year = parseInt( dateTime/10000 ) + "年";
            		var month = parseInt( dateTime/100 )%100 + "月";
            		var day = dateTime%100 + "日";
            	 	html +='<li>'+
                '<div class="name"><span class="title">' +result[i].strategyName+ '</span></div>'+
                '<div class="info clearfix">'+
                    '<span class="time fl">'+
                        '<span class="gray">入选时间：</span>'+
                        '<span class="black">' + year + month + day + '</span>'+
                    '</span>'+
                    '<span class="income fr">'+
                        '<span class="gray">当前收益：</span>'+
                        '<span class="red">' + result[i].income + '%</span>'+
                    '</span>'+
                	'</div>'+
            		'</li>';
         			}
        			html += '</ul></div>';
        	$( "#StrategyData" ).removeClass();
          $( "#StrategyData" ).addClass( "wrapper-item wrapper-foldable wrapper-strategy" );
    			$( "#StrategyDataInfo" ).html( html);
    		}
    		listDetail.refreshDom();
    	}
    });
}

function initRankData( stk_code ){
	console.log("初始化龙虎榜");
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getBoardTop";
	var url = getFullUrl( "mobile/stock/rate/getBoardTop" );
	var datas = {"code":stk_code};
	console.log(url);
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result){
    		if( result.length == 0 ){
    			$( '#dragonRank' ).remove();
    		}else{
    			var html = '';
    			for( var i = 0; i < result.length; i ++ ){
						html+='<div class="medal-wrapper">'+
                    '<div class="medal">'+
                    '<div class="medal-inner"><span>' +result[i].dep+ '</span></div>'+
                    '</div>'+
                   	' <div class="clear"></div>';
            if( result[i].type == 3 ){
                html += '<div class="medal-text">近60日<span class="number">' + result[i].sname + '</span>次</div>';
                   $( "#dragonRankTime" ).html( result[i].time );
            }
            html += '</div>';
            if( result.length == 2 ){
            	$( "#dragonRank" ).removeClass();
          		$( "#dragonRank" ).addClass( "wrapper-block content-block clearfix dragon-rank dragon-rank-2" );
          	}
          	else if( result.length == 1 ){
          		$( "#dragonRank" ).removeClass();
          		$( "#dragonRank" ).addClass( "wrapper-block content-block clearfix dragon-rank dragon-rank-1" );
          	}
    			}
    			$( '#dragonRank_div' ).html( html );
    			$( '#dragonRank' ).show();
    		}
    	}
    });
}

function initRZRQData( stk_code ){
	console.log("初始化融资融券");
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getFinaMarg";
	var url = getFullUrl( "mobile/stock/rate/getFinaMarg" );
	var datas = { "code":stk_code };
	console.log(url);
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result){
    		var html = '';
    		for( var i = 0; i < result.length; i ++ ){
    			html += '<div class="wrapper-block content-block clearfix financing financing-2">'+
        					'<div class="clearfix">'+
            			'<span class="fr sp2 black text-center" >融资融券</span>'+
        					'</div>'+
        					'<div class="clearfix">'+
            			'<div class="left-part fl ">'+
                	'<div class="golden-medal">' + _getFinaMarg( result[i].dep ) + '</div>'+
            			'</div>'+
            			'<div class="right-part fl item-list">'+
                	'<ul>'+
                    '<li>买入:<strong class="red ">' +result[i].income+ '万元</strong></li>'+
                    '<li>占流通盘比例:<strong class="red ">' + result[i].circ_rate+ '%</strong></li>'+
                    '<li>融资余额升幅:<strong class="green ">' + result[i].over_inc+ '%</strong></li>'+
                	'</ul>'+
                	//'<a href="#" class="icon icon-question fr">?</a>'+
            			'</div>'+
        					'</div>';
    							if( result[i].dep == 1 ){
    							html += '<div class="tips-main">融资余额指投资者每日融资买进与归还借款间的差额。融资余额若长期增加时，表示投资者心态偏向买方，市场人气旺盛，属强势市场；反之则属弱势市场</div>';
    							}else{
    							html += '<div class="tips-main">融券余额指投资者每日融券卖出与买进还券间的差额。融券余额增加，表示看空的投资仓位增加，市场趋向卖方；反之则趋向买方。</div>';
    							}
    							html += '</div><div class="line line-gray"></div>';
    							
    		}
    		$( "#RZRQ_div" ).html( html );
    	}
    });
}

function initStockChange( stk_code ){
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getChangNum";
	var url = getFullUrl( "mobile/stock/rate/getChangNum" );
	var datas = {"code": stk_code };
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result ){
    		if( result.length > 0 ){
    		var html = '近2个月合计' + ( result[0].type==1?'减持:':'增持:' )+
                '<span class="icon icon-arrow-up"></span>'+
                '<span class="red"><span class="number" >' + result[0].num + '</span>股</span>';
    		$( "#MSChange" ).html( html );
    		}else{
    			$( "#MSChange_div" ).remove();
    		}
    		$( "#MSChange_div" ).show();
    	}
    });
}

function initFiveChangeRate( stk_code ){
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getPEQ";
	var url = getFullUrl( "mobile/stock/rate/getPEQ" );
	var datas = {"code": stk_code };
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result && result.length > 0){
    		$( "#FCRate_div" ).html( getPEQTitle( result[0].dep ) );
    		$( "#FCRate_span" ).html( result[0].num );
    		$( "#fdChange_div" ).removeClass();
        $( "#fdChange_div" ).addClass( "wrapper-block content-block clearfix" );
    				var percentage = 0, containerWidth = 0;
    				var n = result[0].num;
    				
    				if( n <= 10 ){
    					percentage = n/10*50;
    				}else{
    					percentage = ( n - 10 )/90 * 50 + 50;
    				}
    				if( percentage >= 99 )
    					percentage = 99;
    				
            containerWidth = $('.turnover-container').width(),
            offsetWidth = 10;
            $('.turnover-text').css({'margin-left' : -1 * ( $('.turnover-text').outerWidth() * 0.5  )});
            $('.turnover-bar-position').css({'left' : percentage + '%'});
            if( containerWidth * percentage * 0.01 < $('.turnover-text').outerWidth() * 0.5){
                $('.turnover-text').css({'left' : 0});
                if(containerWidth * percentage * 0.01 < offsetWidth){
                    $('.turnover-text').css({'margin-left' : -1 * (offsetWidth - containerWidth * percentage * 0.01) });
                }else{
                    $('.turnover-text').css({'margin-left' : 0});
                }
                
            }else if(containerWidth * percentage * 0.01 + $('.turnover-text').outerWidth() * 0.5 < containerWidth ){
                $('.turnover-text').css({'left' : percentage + '%','margin-left' : -1 * $('.turnover-text').outerWidth() * 0.5});
            }else{
                $('.turnover-text').css({'left' : containerWidth - $('.turnover-text').outerWidth() * 0.5});
                
                if(containerWidth * percentage * 0.01 + $('.turnover-text').outerWidth() * 0.5 - containerWidth < offsetWidth){
                    $('.turnover-text').css({'margin-left' : -1 * ( $('.turnover-text').outerWidth() * 0.5  )});
                }else{
                    $('.turnover-text').css({'margin-left' : -1 * ( $('.turnover-text').outerWidth() * 0.5 - offsetWidth )});
                }
            }
            
    	}
    });
}

function initHotSpot( stk_code ){
	//var url = "http://10.15.92.217:8080/mobile/stock/hotConcept/getHotConceptStock";
	var url = getFullUrl( "mobile/stock/hotConcept/getHotConceptStock" );
	var datas = {"obj":stk_code};
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if( result ){
    		if( !result.conceptOfPlate || result.conceptOfPlate ==''){
    			var html = 
                 '<div class="clearfix message-status-inner">' +
                 '<span class="icon icon-avatar-sad "></span>' +
                 '<p class="message-text">' +
                 '<strong class="main black">很遗憾</strong>' +
                 '<br>' +
                 '<span class="secondary">您的股票不属于近期市场热点主题</span>' +
                 '</p>' +
                 '</div>' +
            		 '</div>';
          $( "#HS_div" ).html( html );
          $( "#HS_div" ).show();
    		}else{
    				var num = result.newsOutpost.newNum;
    				var t = 1;
    				if( num > 2 && num <= 4 ){
    					t = 2;
    				}else if( num > 4 ){
    					t=3;
    				}
    				var html = '<div class="clearfix">'+
        		    			 '<span class="lottery-conception fl">' +result.conceptOfPlate+ '</span>'+
        		    			 '<span class="fire-score fl">';
        		for( var i=0; i < t; i ++ ){
        		  	html += '<span class="score"></span>';
        		}
        		html +='</span>'+
        					 '</div>'+
        					 '<p class="tips-main">'+
        					 '最新内参:' + result.newsOutpost.newTitle +
        					 '</p>';
        					 if( result.conceptOfPlateAvgWave != '--' ){
        					 html += '<div class="clearfix bottom-container">'+
        					 		'<div class="fl left-part">'+
        		    	 		'<p class="title blue">' +result.conceptOfPlateAvgWave+ '%</p>'+
        		    	 		'<p class="tips-sub">概念月涨幅</p>'+
        					 		'</div>'+
        					 		'<div class="fl right-part">'+
        		    	 		'<p class="title blue">' +result.conceptOfPlateLeadingName+ ' <span class="">' +result.conceptOfPlateLeading.split('\.')[0]+'</span></p>'+
        		    	 		'<p class="tips-sub">概念领涨股</p>'+
        					 		'</div>'+
        					 		'</div>';
        					}
        		$( "#HS_div" ).removeClass();
						$( "#HS_div" ).addClass( "wrapper-block content-block clearfix" );
        		$( "#HS_div" ).html( html );
        		$( "#HS_div" ).show();
      	}
    	}
    });
}

function initBaseInfo( stk_code, stk_name ){
	//var url = "http://10.15.92.217:8080/mobile/stock/rate/getStarInfo";
	var url = getFullUrl( "mobile/stock/rate/getStarInfo" );
	var datas = {"code":stk_code };
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if(result && result.length > 0 ){
    		$( "#RS_div" ).html( result[0].starLevel );
    		$( "#RS_div_1" ).html( result[0].starLevel );
    		$( "#TOP_RANK_div" ).html( '打败了' +result[0].top+ '%的股票' );
    		// 2014.4.28 风控后暂时隐藏
    		// $( "#RS_AD_div" ).html( getStarInfoTitle( result[0].dep, result[0].num ) );
    		var html = '';
    		for( var i = 0; i < result[0].starLevel_1; i ++ ){
    			html += '<span class="star"></span>';
    		}
    		$( "#HSS_div" ).html( html );
    		
    		html = '';
    		for( var i = 0; i < result[0].starLevel_2; i ++ ){
    			html += '<span class="star"></span>';
    		}
    		$( "#TP_div" ).html( html );
    		
    		html = '';
    		for( var i = 0; i < result[0].starLevel_3; i ++ ){
    			html += '<span class="star"></span>';
    		}
    		$( "#TD_div" ).html( html );
    		
    		html = '';
    		for( var i = 0; i < result[0].starLevel_4; i ++ ){
    			html += '<span class="star"></span>';
    		}
    		$( "#SG_div" ).html( html );
    	}
    });
}

function initTradeIncome( stk_code ){
	$.indicatorChart({
	    	"target":$('#canvas_2'),
	    	//url:"http://10.15.92.217:8080/mobile/stock/rate/getIncomeIncrease",
	    	tlMargin : 0,
	    	trMargin : 60,
	    	rMargin : 80,
	    	divId : "canvas_2_layout",
	    	url:getFullUrl( "mobile/stock/rate/getIncomeIncrease" ),
	    	param:{code:stk_code},
	    	list:["营业收入","同比增长率(%)","行业(%)"]
	   	});
}

function initEveryStockIncome( stk_code ){
	$.indicatorChart({
	    	"target":$('#canvas_3'),
	    	//url:"http://10.15.92.217:8080/mobile/stock/rate/getMicroReduce",
	    	tlMargin : 0,
	    	trMargin : 60,
	    	rMargin : 80,
	    	divId : "canvas_3_layout",
	    	url:getFullUrl( "mobile/stock/rate/getMicroReduce" ),
	    	param:{code:stk_code},
	    	list:["每股收益","同比增长率(%)"]
	   	});
}
function initMarketProfit( stk_code ){
	$.proEarnChart({
	    	"target":$('#canvas_4'),
	    	//url:"http://10.15.92.217:8080/mobile/stock/rate/getProEarn",
	    	tlMargin : 0,
	    	trMargin : 60,
	    	rMargin : 80,
	    	divId : "canvas_4_layout",
	    	url:getFullUrl( "mobile/stock/rate/getProEarn" ),
	    	param:{code:stk_code},
	    	list:["市盈率","行业水平"]
	   	});
}

function shakeGetStock( stk_code, listDetail ){
	//var url = "http://10.15.92.217:8080/mobile/stock/strategy/getStrategDataByObj";
	var url = getFullUrl( "mobile/stock/strategy/getStrategDataByObj" );
	var userInfo = getCurrentUserInfo();
	var userId = '';
	if( userInfo ){
		userId = userInfo.split( ":" )[0];
	}
	var stk = _getShakeStockTime();
	var time = '';
	if( stk ){
		time = stk.dep;
	}
	var datas = { "id":userId };
	getAjaxDatas(url,datas,function(result){
    	if(result && result== "timeout"){
    		toastText("发送超时！");
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！！");
    	}else if( result ){
    		if( result[0].type==1 ){
    			_setShakeStock( JSON.stringify( result[0] ) );
    			var time = result[0].time/1000000;
    			var year = ~~( time/10000 );
    			var month = ~~( time/100 )%100;
    			var day = time%100;
    			var html = '<div class="wrapper-block content-block clearfix">' +
                		 '<h3 class="title light-blue" style="margin-left:15px;margin-right:15px;">哟！牛股出现！</h3>' +
                		 '<table class="stock-item"><tbody><tr><td>' +
                     '<ul><li class="black"><span class="weighed">' +result[0].sname+ '</span></li>' +
                     '<li class="sm gray">' +result[0].co+ '</li></ul></td>' +
                     '<td><ul><li class="black"><span class="weighed">' + result[0].fina_am + '</span></li>' +
                     '<li class="red"><span class="weighed">' +result[0].fina_circ_rate+ '%</span></li>' +
                     '</ul></td><td><ul class="diff"><li class="black"><sup class="gray">评分</sup>' +
                     '<span class="rating-result weighed">' +result[0].starLevel+ '</span></li></ul></td></tr>' +
                     '</tbody></table><div class="info clearfix"><span class="time fl">' +
                     '<span class="gray">入选时间：</span><span class="black">' +year + "年" + month + "月" + day + '日</span>' +
                     '</span><span class="income fr"><span class="gray">当前收益：</span>' +
                     '<span class="red">' +result[0].marg_am+ '%</span></span></div></div>';
          //$( "#StrategyData" ).removeClass();
          //$( "#StrategyData" ).addClass( "wrapper-block content-block clearfix wrapper-foldable" );
          //$( "#StrategyData" ).html( html );
          $( "#SK_div" ).html( html );
    		}else{
    			if( stk && stk != 'undefined' && stk.co && stk.co != 'undefined' ){
    			var time = stk.time/1000000;
    			var year = ~~( time/10000 );
    			var month = ~~( time/100 )%100;
    			var day = time%100;
    			var html = '<div class="wrapper-block content-block clearfix">' +
                		 '<h3 class="title light-blue" style="margin-left:15px;margin-right:15px;">每天只能摇一次哦!上次摇到的股票：</h3>' +
                		 '<table class="stock-item"><tbody><tr><td>' +
                     '<ul><li class="black"><span class="weighed">' +stk.sname+ '</span></li>' +
                     '<li class="sm gray">' +stk.co+ '</li></ul></td>' +
                     '<td><ul><li class="black"><span class="weighed">' + stk.fina_am + '</span></li>' +
                     '<li class="red"><span class="weighed">' +stk.fina_circ_rate+ '%</span></li>' +
                     '</ul></td><td><ul class="diff"><li class="black"><sup class="gray">评分</sup>' +
                     '<span class="rating-result weighed">' +stk.starLevel+ '</span></li></ul></td></tr>' +
                     '</tbody></table><div class="info clearfix"><span class="time fl">' +
                     '<span class="gray">入选时间：</span><span class="black">' +year + "年" + month + "月" + day + '日</span>' +
                     '</span><span class="income fr"><span class="gray">当前收益：</span>' +
                     '<span class="red">' +stk.marg_am+ '%</span></span></div></div>';
          //$( "#StrategyData" ).removeClass();
          //$( "#StrategyData" ).addClass( "wrapper-block content-block clearfix wrapper-foldable" );
          //$( "#StrategyData" ).addClass( "wrapper-item wrapper-foldable wrapper-strategy" );
          $( "#SK_div" ).html( html );
        	}else{
        		//'<div class="splitter"></div>' +
        		//'<div class="wrapper-block title-bar"><h3 class="title fl">策略指标诊断</h3>' +
						//'<div class="star-rating fr" id="SG_div">' +
    				//'</div></div>' +  
        		var html = '<div class="wrapper-block content-block clearfix">' +
                		 '<h3 class="title light-blue" style="margin-left:15px;margin-right:15px;font-size:14px;">很遗憾，今天牛股有点羞涩，不能让您看见。。。请您明天再来试试看</h3></div>';
            //$( "#StrategyData" ).removeClass();
          	//$( "#StrategyData" ).addClass( "wrapper-block content-block clearfix wrapper-foldable" );
          	//$( "#StrategyData" ).addClass( "wrapper-item wrapper-foldable wrapper-strategy" );
          	$( "#SK_div" ).html( html );
        	}
    		}
    		listDetail.refreshDom();
    	}
    });
}


function _drawTextDiv(o, id, text, x, y, style) {
	var div = $(document).find("#"+id);
	if(div.size()<=0){
      div = $("<div id="+id+"></div>");
      $(o).append(div);
  }
  style.color = style.color || '#000000';
  style.font = style.font || '8pt sans-serif';
  style.textAlign = style.textAlign || 'center';
  div.css(style);
  div.css("position","absolute");
  div.css("left",x + "px");
  div.css("top",y + "px");
  div.html(text);
  div.show();
}

function initDumpButton(){
	touchEventWithBackShadow($("#OPADV"),function(){
    	var params = {pageId:"operateAdvice",params:{callback:createOperateAdviceBody}}
    	//跳转到新闻订制页面
    	changePageByParams(params);
  	});
  	touchEventWithBackShadow($("#OPADV_1"),function(){
    	var params = {pageId:"operateAdvice",params:{callback:createOperateAdviceBody}}
    	//跳转到新闻订制页面
    	changePageByParams(params);
  	});
}

var shakeStock = "PZTG_SHAKE_STOCK";
function _setShakeStock(stock){
    if(localStorage){
        var oldUserName = localStorage.getItem(shakeStock);
        if(oldUserName){
            localStorage.removeItem(shakeStock);
        }
        localStorage.setItem(shakeStock,stock);
    }
}

function _getShakeStockTime(){
	var result;
    if(localStorage){
        var tempCodesStr = localStorage.getItem(shakeStock);
        if(tempCodesStr){
            result = JSON.parse( tempCodesStr );
        }
    }
    return result;
}

function checkNetwork(){
	var networkState = navigator.network.connection.type;
	var states = {};
  states[Connection.UNKNOWN]    = 'Unknown connection';
  states[Connection.ETHERNET]  = 'Ethernet connection';
  states[Connection.WIFI]       = 'WiFi connection';
  states[Connection.CELL_2G]    = 'Cell 2G connection';
  states[Connection.CELL_3G]    = 'Cell 3G connection';
  states[Connection.CELL_4G]    = 'Cell 4G connection';
  states[Connection.NONE]       = 'No network connection';
  if( states[networkState] == 'Cell 2G connection' ){
  	toastText( "网速不给力，请在3G或WIFI环境下使用" );
  }else if( states[networkState] == 'No network connection' ){
  	toastText( "请检查网络连接" );
  }
}