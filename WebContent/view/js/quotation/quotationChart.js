/**
 * User: zhen
 * Date: 13-12-18
 * Time: 下午3:30
 */
function createQuotationDetailBody(params,deforceAni) {
    pageId = params.pageId;
    showkeyboardChart = params.params.showkeyboard;
    var content = params.params.content;
    var arr = content.split("-");
    timeStr = arr[arr.length - 1]||new Date().getTime();
    quotationDetailBody = "quotationDetailBody"+timeStr;
    quotationDetailTitleId = "quotationDetailTitleId"+timeStr;
    quotationTimeLineId = "quotationTimeLineId"+timeStr;
	quotationKLineId = "quotationKLineId"+timeStr;
	stockCode = params.params.stockCode;
    if($("#"+quotationDetailBody).length == 0){
        //创建主页面
        createContent(params,quotationDetailBody);
        buildBlueHeader(quotationDetailTitleId,$("#"+quotationDetailBody));
    }
    //滚动动画，
    if(!deforceAni){
	    $("#"+quotationDetailBody).html("");
	    //创建页面布局
	    buildQuotationDetailContent($("#"+quotationDetailBody));
	    animatingFun(params,function(){
	
		    //绑定事件
		    bindQuotationDetailEvent();
		    //延时创建滚动事件
		    chartScroller = refreshNewsListData($("#quotationNews"+timeStr));
	
	        timeLineChart = null;
	        kLineChart = null;
	        refreshQuotationDetailData();
	        bottomOptional();
	        bottomRemind();
	        if(quotationChartInterval == null){
	            quotationChartInterval = setInterval(function(){
	                var marketInfo = getCurrentMarketInfo();
	                var current = new Date().format("HHmm");
	                if(pageId != "quotationChart" || !marketInfo.isTradeDay || parseInt(current) > parseInt("1459")){
	                    clearInterval(quotationChartInterval);
	                    quotationChartInterval = null;
	                    return;
	                }
	                if(marketInfo.isTradeDay && marketInfo.isIntime){
	                	refreshQuotationDetailHtml();
	                }
	            },30000);
	        }
	        
	        if(showkeyboardChart){
		        queryPageIsShow=false;
		    }
	        //将所有的股票代码放到缓存中
	        setTimeout(function(){
	            savaAllStockCodes();
	        },50);
	    });
    }else{
    	//回退至该页面时重置页面元素
	    var timelineSelected = $(".chartLine","#quotationNews"+timeStr).find("div.chartBtn-bd1").hasClass("chartBtnSelect");
	    var klineSelected = $(".chartLine","#quotationNews"+timeStr).find("div.chartBtn-bd2").hasClass("chartBtnSelect");
	    if(timelineSelected || (!timelineSelected && !klineSelected)){
	    	kLineChart = null;
	    	$(".chartLine","#quotationNews"+timeStr).find("div.chartBtn-bd2").removeClass("chartBtnSelect");
	    	var isTradeInfo = true;
	        //若为指数信息则不显示盘口信息
	        if(stockCode.indexOf(".index")>=0){
	            isTradeInfo = false;
	        }
	        timeLineChart = $('#chartContent'+timeStr).timeChart({
	            stockCode : stockCode,
	            prevClose : prevClose,
	            isTradeInfo : isTradeInfo,
	            beforeShow : function(){
	                if(pageId == "quotationChart" && timeLineChart != null){
	                    return true;
	                }
	                return false;
	            }
	        });	
	    }else{
	    	timeLineChart = null;
	    	$(".chartLine","#quotationNews"+timeStr).find("div.chartBtn-bd1").removeClass("chartBtnSelect");
	        kLineChart = $('#chartContent'+timeStr).kLineChart({
	            stockCode : stockCode
	        });
	    }
	    refreshQuotationDetailHtml();
    }
}
var timeStr = '';
var quotationDetailBody = "quotationDetailBody"+timeStr;
var quotationDetailTitleId = "quotationDetailTitleId"+timeStr;
var quotationTimeLineId = "quotationTimeLineId"+timeStr;
var quotationKLineId = "quotationKLineId"+timeStr;
var timeLineChart = null;
var kLineChart = null;
var stockCode = "";
var prevClose;
var chartScroller = null;
var quotationChartInterval = null;
var showkeyboardChart = null;

function kLine(o) {
    if(changeBtn($(o))){
        timeLineChart.hide();
        timeLineChart = null;
        kLineChart = $('#chartContent'+timeStr).kLineChart({
            stockCode : stockCode
        });
        refreshQuotationDetailHtml();
    }
}
function timeLine(o) {
    if(changeBtn($(o))){
        kLineChart.hide();
        kLineChart = null;
        var isTradeInfo = true;
        //若为指数信息则不显示盘口信息
        if(stockCode.indexOf(".index")>=0){
            isTradeInfo = false;
        }
        timeLineChart = $('#chartContent'+timeStr).timeChart({
            stockCode : stockCode,
            prevClose : prevClose,
            isTradeInfo : isTradeInfo,
            afterInit : function(){//初始化后的回调函数
                if(chartScroller!=null){
                    chartScroller.refreshDom();
                }
            },
            beforeShow : function(){
                if(pageId == "quotationChart" && timeLineChart != null){
                    return true;
                }
                return false;
            }
            //,interval : 15000
        });
        refreshQuotationDetailHtml();
    }
}
function changeBtn($o){
   if(!$o.hasClass("chartBtnSelect")){
       $(".chartBtn","#quotationNews"+timeStr).removeClass("chartBtnSelect");
       $o.addClass("chartBtnSelect");
       return true;
   } else {
       return false;
   }
}

function buildQuotationDetailContent($container){
    //创建标题
    var header = '';
    header += '<div class="ui-gw-header-leftBtn"><div class="ui-gw-header-backward"></div></div>' +
        '<div class="ui-gw-header-stock clearfix">' +
        '<div class="ui-gw-header-stock-name">' +
        '<div class="name"></div>' +
        '<div class="number"></div>'+
        '</div>'+
        '<div class="ui-gw-header-rightBtn">' +
            '<div id="refreshBtnDetail" class="ui-gw-header-refresh"></div>'+
        '</div>';
    var html =  '<div id="quotationNews'+timeStr+'"></div>';
    var bottom = '<div id="quotationBottom'+timeStr+'" class="ui-gw-optional-bottom">' +
        '<div class="quotation-optional">添加自选</div>'+
        '<div class="quotation-bottomtitle"></div>' +
        '<div class="quotation-remind"><span class="icon"></span><span>添加提醒</span></div>'+
        '</div>';
    //标题设置为空
    if($("#"+quotationDetailTitleId).length>0 && $("#"+quotationDetailTitleId).html()==""){
        $("#"+quotationDetailTitleId).html(header);
    }
    $container.append(html);
    $container.append(bottom);
    //设置内容高度
    var bHeight = $("#quotationBottom"+timeStr).outerHeight();
    var tHeight = $container.outerHeight();
    $("#quotationNews"+timeStr).css("height",tHeight - bHeight);
    var data = createStockWrapper();
    //绑定回退按钮事件
    touchEventWithBackShadow($(".ui-gw-header-backward","#"+quotationDetailTitleId),function(){
//        clearBody();
        gobackByParams();
    });
//    addTouchedStyle($(".ui-gw-header-backward","#"+quotationDetailTitleId),"touched");
}

function refreshQuotationDetailData(){
    $('#refreshBtnDetail').addClass("loading");
    //初始化
    if(timeLineChart == null && kLineChart == null){
        var isTradeInfo = true;
        //若为指数信息则不显示盘口信息
        if(stockCode.indexOf(".index")>=0){
            isTradeInfo = false;
        }
        timeLineChart = $('#chartContent'+timeStr).timeChart({
            stockCode : stockCode,
            prevClose : prevClose,
            isTradeInfo : isTradeInfo,
            afterInit : function(){//初始化后的回调函数
                if(chartScroller!=null){
                    chartScroller.refreshDom();
                }
            },
            beforeShow : function(){
                if(pageId == "quotationChart" && timeLineChart != null){
                    return true;
                }
                return false;
            }
            //,interval : 15000
        });
    }
    refreshQuotationDetailHtml();
}

/**
 * 刷新头部左侧显示信息
 */
function refreshQuotationDetailHtml(callback){
    kLineChart = $('#chartContent'+timeStr).kLineChart({
        stockCode : stockCode
    });

    bottomPankou();
    //判断当前股票是否停牌
    var shobj = "SH000001.index";
    if(timeLineChart != null){
    	showLoading(quotationTimeLineId,$('#chartContent'+timeStr).get(0));
    }
    if(kLineChart != null){
    	showLoading(quotationKLineId,$('#chartContent'+timeStr).get(0));
    }
    getCurrentMarketInfo(function(marketInfo){
        var url = getFullUrl("mobile/stock/getMarketByObjs");
        var datas = {"obj":stockCode+(stockCode==shobj?"":","+shobj)};
        getAjaxDatas(url,datas,function(result){
            $('#refreshBtnDetail').attr("class","ui-gw-header-refresh");
            if(result == "timeout"){
            	if(timeLineChart != null){
			    	showLoading(quotationTimeLineId,$('#chartContent'+timeStr).get(0),true);
			    }
			    if(kLineChart != null){
			    	showLoading(quotationKLineId,$('#chartContent'+timeStr).get(0),true);
			    }
                return;
            }
            if(result && result.length>0){
                var res = result[0];
                var sh = null;
                if(result.length >= 2){
                    sh = result[1];
                }
                if(res && res.obj != stockCode){
                    if(result.length >= 2){
                        res = result[1];
                        sh = result[0];
                    }else{
                        res = null;
                    }
                }
                if(stockCode==shobj) sh = res;
                var lastTradeDay = null;
                if(marketInfo && marketInfo.lastTradeDay){
                    lastTradeDay = marketInfo.lastTradeDay;
                }
                if(res){
                    if(sh){
                        var shTime = sh.time;
                        var shDay = shTime.split(" ")[0];
                        var shMinute = shTime.split(" ")[1];
                        //判断当天是否为交易日
                        var cur = new Date();
                        var curMinute = cur.format("HHmm");
                        var info = getLocalQuotationProps("marketInfo");
                        if(!info.hasOwnProperty("isTradeDay") && (parseInt("1"+curMinute) > parseInt("10928"))){
                            var day = cur.format("yyyyMMdd");
                            var o = {"isTradeDay":true};
                            if(shDay && shDay!="" && shDay.replace(/\-/g,"") != day){
                                o.isTradeDay = false;
                            }
                            setLocalQuotationProps("marketInfo",o);
                            bottomPankou();
                        }

                        //判断是否停牌
                        if(shMinute && shMinute != ""){
                        	var min = shMinute.replace(/\:/g,"");
                            var oDay = res.time.split(" ")[0];
                            if(min=="000000" || 
                                (parseInt(shDay.replace(/\-/g,"")) > parseInt(oDay.replace(/\-/g,""))
                                &&parseInt("1"+min)<"1092800")){
                                if(lastTradeDay && (parseInt(oDay.replace(/\-/g,"")) < parseInt(lastTradeDay))){
                                    res.updnratio = "0.00";
                                    res.price = "0.00";
                                    res.updn = "0.00";
                                }
                            }else{
                            	if(parseInt(shDay.replace(/\-/g,"")) > parseInt(oDay.replace(/\-/g,""))){
                                    res.updnratio = "0.00";
                                    res.price = "0.00";
                                    res.updn = "0.00";
                                }
                            }
                        }
                    }
                    var lineHeader = $("#"+quotationDetailTitleId);
                    var stockBoardL = $("div.stock-board-l","#quotationNews"+timeStr);
                    var stockBoardR = $("div.stock-board-r","#quotationNews"+timeStr);
                    var obj = res.obj;
                    var name = getStrByNum(res.stkName,6);
                    var time = res.time;
                    var open = res.open;
                    var high = res.high;
                    var low = res.low;
                    var lastClose = res.lastclose
                    var volume = res.volume;
                    var amount = res.amount;
                    var price = res.price;
                    var updn = res.updn;
                    var updnratio = res.updnratio;
                    var sellPrice = res.sellPrice;
                    var buyPrice = res.buyPrice;
                    var sellVolume = res.sellVolume;
                    var buyVolume = res.buyVolume;
                    var code = "";
                    if(obj && obj != ""){
                        code = obj.substr(2,6);
                    }
                    if(updnratio&&updnratio!=""){
                        if(updnratio == "--"){
                            updnratio = "0.00";
                            price = "0.00";
                            updn = "0.00";
                        }
                        if(parseFloat(updnratio)>0){
                            updnratio = "+"+updnratio;
                            stockBoardL.removeClass("green");
                            stockBoardL.addClass("red");
                        }else if(parseFloat(updnratio)<0){
                            stockBoardL.removeClass("red");
                            stockBoardL.addClass("green");
                        }else{
                            stockBoardL.removeClass("red");
                            stockBoardL.removeClass("green");
                        }
                        updnratio = updnratio+"%";
                    }
                    if(name && name!="" && code!=""){
                        lineHeader.find(".name").html(name);
                        lineHeader.find(".number").html(code);
                    }
                    if(price && price!=""&&updnratio!=""){
                        var accuracy = (""+price).slice((""+price).indexOf("."));
                        if(accuracy.length >= 4){
                            price = parseFloat(price).toFixed(3);
                        }else{
                            price = parseFloat(price).toFixed(2);
                        }
                        lineHeader.find(".price").html(price);
                        lineHeader.find(".change").find("span:first").html(updn);
                        lineHeader.find(".change").find("span:last").html(updnratio);
                        stockBoardL.find("span.arrow").html(price);
                        stockBoardL.find("span.changeAmt").html(updn);
                        stockBoardL.find("span.changeRate").html(updnratio);
                    }
                    //行情明细右侧信息
                    if(amount && amount != ""){
                    	var len = ("" + parseInt(amount)).length||0;
						var unit = 1;
						var unitStr = "";
						if(len > 4 && len < 8){
							unit = 10000;
							unitStr = "万";
						} else if(len >= 8 && len < 10){
							unit = 1000000;
							unitStr = "百万";
						}else if(len >= 10 && len < 12){
							unit = 100000000;
							unitStr = "亿";
						} else if(len >= 12){
							unit = 10000000000;
							unitStr = "百亿";	
						}	
						amount = (parseFloat(amount) / unit).toFixed(1) + unitStr;
						var am = $(stockBoardR.find("td").get(0)).find("span").html(amount);
                    }
					if(open && open != "" && high && high != "" && low && low != ""){
						var range = ((parseFloat(high)-parseFloat(low))/parseFloat(lastClose)*100).toFixed(2);
						$(stockBoardR.find("td").get(1)).find("span").html(range+"%");
						if(stockCode.indexOf(".index")>0){
							//指数
							$(stockBoardR.find("td").get(2)).find("span").html(high);
							$(stockBoardR.find("td").get(3)).find("span").html(low);
							$(stockBoardR.find("td").get(4)).find("span").html(open);
							if(lastClose && lastClose != ""){
								$(stockBoardR.find("td").get(5)).find("span").html(lastClose);
							}
						}
					}
					var isStock = false;
				    if(stockCode.indexOf(".stk")>0){
				    	if(/^(SH6|SZ0|SZ3){1}/.test(stockCode)){
				    		isStock = true;
				    	}
				    }
					if(isStock){
						var url = getFullUrl("mobile/stock/rate/getStockInfo");
        				var datas = {"obj":stockCode};
						getAjaxDatas(url,datas,function(result){
				            if(!result || result == "timeout"){
				                return;
				            }
				            var fina_am = result.fina_am;//换手率
				            var marg_am = result.marg_am;//市盈率
				            var fina_am_mane = result.fina_am_mane;//总手
				            var marg_am_mane = result.marg_am_mane;//收益
				            if(fina_am_mane && fina_am_mane != ""){
				            	$(stockBoardR.find("td").get(2)).find("span").html(fina_am_mane);
				            }
				            if(fina_am && fina_am != ""){
								$(stockBoardR.find("td").get(3)).find("span").html(fina_am+"%");
				            }
				            if(marg_am_mane && marg_am_mane != ""){
								$(stockBoardR.find("td").get(4)).find("span").html(marg_am_mane);
				            }
				            if(marg_am && marg_am != ""){
								$(stockBoardR.find("td").get(5)).find("span").html(marg_am);
							}
						});
					}
                    var item = {};
                    item.obj = res.obj;
                    item.stkName = res.stkName;
                    item.code = res.obj.substr(0,8);
                    if(timeLineChart!=null){
                        prevClose = lastClose;
                        timeLineChart.refresh({
                            prevClose:prevClose,
                            buyPrice:buyPrice,
                            sellPrice:sellPrice,
                            buyVolume:buyVolume,
                            sellVolume:sellVolume
                        });
                    }
                    var currentKLine = null;
                    if(res.updnratio != "--"){
                        currentKLine = [time,open,high,low,price,volume,null];
                    }
                    if(kLineChart!=null){
                        kLineChart.refresh({
                            lastTradeDay:lastTradeDay,
                            currentKLine : currentKLine
                        });
                    }
                    if(callback){
                        callback(item);
                    }
                }else{
                	if(timeLineChart != null){
				    	showLoading(quotationTimeLineId,$('#chartContent'+timeStr).get(0),true);
				    }
				    if(kLineChart != null){
				    	showLoading(quotationKLineId,$('#chartContent'+timeStr).get(0),true);
				    }
                }
            }
        },true);
    });
}

function bottomOptional(){
    loadOptionalData(function(optional){
        var data = null;
        if(optional){
            data = optional["自选股"];
        }
        if(data){
            var flag = false;
            for(var i = 0; i < data.length; i++){
                var key = data[i];
                if(key.indexOf(stockCode)>=0){
                    flag = true;
                    break;
                }
            }
            var quotationBottom = $("#quotationBottom"+timeStr);
            if(flag){
                quotationBottom.find(".quotation-optional").html("取消自选");
            } else {
                quotationBottom.find(".quotation-optional").html("添加自选");
            }
        }
    },true);
}

function bottomRemind(){
    isOptionalRemind(stockCode,function(data){
         if(data && data.result){
             $(".quotation-remind","#quotationBottom"+timeStr).find("span:last").html("取消提醒");
         }
    });
}

function bottomPankou(){
    //刷新底部时间信息(未开盘、开盘 、已收盘)
    var date = new Date();
    var timeStrb = date.format("HHmm");
    var title = $(".stock-state","#quotationNews"+timeStr);
    var marketInfo = getCurrentMarketInfo();
    if(marketInfo.isTradeDay && marketInfo.isIntime){
        //开盘
        title.find("span:first").html("开盘");
        title.addClass("quotation-bottomtitle-open");
        title.removeClass("quotation-bottomtitle-close");
    } else {
        var txt = "未开盘";
        if(marketInfo.isTradeDay && parseInt(timeStrb) >= parseInt("1500")){
            txt = "已收盘";
        }
        //未开盘
        title.find("span:first").html(txt);
        title.addClass("quotation-bottomtitle-close");
        title.removeClass("quotation-bottomtitle-open");
    }
    title.find("span:last").html(date.format("MM-dd HH:mm:ss"));
}

function refreshNewsListData($newsList){
    //首先创建表格头部部分，及绑定事件
    var options = createStockWrapper();
    var y = allStocksIScrollYs[stockCode];
    var quotationChartScroller = new NewsTitleList.List($newsList,getSocketsNewsDatasByType,y,function(startY){
        //重新设置内存中开始位置
        allStocksIScrollYs[stockCode] = startY;
    },options);
    //初始化的数据，去缓存中取
    var newsList = getSocketsNewsByObj(stockCode);
    quotationChartScroller.initData(reSetStockNewsList(newsList));
    //如果内存中没有，则调用这个pullDown方法，如果有的话，则不执行
    if(!allStocksNews[stockCode]){
        //首先给一个loading图标
        $newsList.addClass("newsContentLoading");
        quotationChartScroller.pullDownAction(true);
    }
    $(".chartLine","#quotationNews"+timeStr).find("div.chartBtn-bd1").touchEvent({
        "fastClickStart" : function(event){event.preventDefault();event.stopPropagation();},
        "fastClickEnd" : function(){timeLine(this);}
    });
    $(".chartLine","#quotationNews"+timeStr).find("div.chartBtn-bd2").touchEvent({
        "fastClickStart" : function(event){event.preventDefault();event.stopPropagation();},
        "fastClickEnd" : function(){kLine(this);}
    });
    //新闻订制按钮事件
    touchEventWithBackShadow($("#stockNews-custom"+timeStr),function(e){
    	//需要登录
    	var user = getUserInfo();
        if(user == null){
            createLoadingInfo(function(data){
            	var params = {pageId:"newsSubscribe",params:{callback:createNewsSubscribeBody}}
		    	//跳转到新闻订制页面
		    	changePageByParams(params);
            });
        }else{
	    	var params = {pageId:"newsSubscribe",params:{callback:createNewsSubscribeBody}}
	    	//跳转到新闻订制页面
	    	changePageByParams(params);
        }
    });
    touchEventWithBackShadow($("#zhenggu"+timeStr),function(){
    	var lineHeader = $("#"+quotationDetailTitleId);
    	var stkName = lineHeader.find(".name").html();
    	var price = lineHeader.find(".price").html();
    	//需要登录
    	var user = getUserInfo();
        if(user == null){
            createLoadingInfo(function(data){
		    	var params = {pageId:"diagnosisShares",params:{
		    		callback:createDiagnosisSharesBody,
		    		stockCode : stockCode,
		    		stkName : stkName,
		    		price : price
		    	}}
		    	//跳转到诊股页面
		    	changePageByParams(params);
            });
        }else{
	    	var params = {pageId:"diagnosisShares",params:{
	    		callback:createDiagnosisSharesBody,
	    		stockCode : stockCode,
	    		stkName : stkName,
	    		price : price
	    	}}
	    	//跳转到诊股页面
	    	changePageByParams(params);
        }
    });
    return quotationChartScroller;
}
/**
 * 创建个股页面的滚动区域
 */
function createStockWrapper(){
    var wrapperId = "wrapperStockNews"+(new Date()).getTime();
    var scrollerId = "scrollerStockNews"+(new Date()).getTime();
    var pullDownId = "quotationChartPullDown"+timeStr;
    var pullUpId = "quotationChartPullUp"+timeStr;
    var clientHeight = document.body.clientHeight;
    var height = clientHeight*2/5;
    if(height < 200){
        height = 200;
    }
    height = Math.floor(height) - 10 + 6;
    var isStock = false;
    if(stockCode.indexOf(".stk")>0){
    	if(/^(SH6|SZ0|SZ3){1}/.test(stockCode)){
    		isStock = true;
    	}
    }
    var html = '';
    //创建id为wrapperId的列表
    html += '<div class="wrapperStyle"  id="'+ wrapperId + '">' +
        '<div  id="'+ scrollerId + '">' +
        '<div class="pullDown" id="'+ pullDownId +'">'+
        '<span class="pullDownIcon"></span> <span class="pullDownLabel"></span>'+
        '</div>'+
        '<div class="stock-board hbox">'+
    	'<div class="stock-board-l red" style="display:block;">'+
        	'<div><b class="realprice"><span class="arrow"></span></b></div>'+
            '<div><span class="changeAmt"></span><span class="changeRate"></span></div>'+
        '</div>'+
    	'<div class="stock-board-r spacer" style="display:block;">'+
    		(!isStock ?
    		('<table width="100%">'+
            	'<tbody>' +
            	'<tr>'+
                	'<td><b>成交额:</b><span>--</span></td><td><b>振幅:</b><span>--</span></td>'+
                '</tr>'+
                '<tr>'+
                	'<td><b>最高:</b><span>--</span></td><td><b>最低:</b><span>--</span></td>'+
                '</tr>'+
                '<tr>'+
                	'<td><b>今开:</b><span>--</span></td><td><b>昨收:</b><span>--</span></td>'+
                '</tr>'+
            	'</tbody>' +
            '</table>'):
        	('<table width="100%">'+
            	'<tbody>' +
            	'<tr>'+
                	'<td><b>成交额:</b><span>--</span></td><td><b>振幅:</b><span>--</span></td>'+
                '</tr>'+
                '<tr>'+
                	'<td><b>总手:</b><span>--</span></td><td><b>换手率:</b><span>--</span></td>'+
                '</tr>'+
                '<tr>'+
                	'<td><b style="width:52px;">每股收益:</b><span>--</span></td><td><b>市盈率:</b><span>--</span></td>'+
                '</tr>'+
            	'</tbody>' +
            '</table>'))+
        '</div>'+
    	'</div>'+
        '<div class="stock-chart">' +
            '<div class="chartLine">' +
                '<div class="chartLine-inner">' +
                    '<div class="chartBtn chartBtn-bd1 chartBtnSelect"><span>分时</span></div>' +
                    '<div class="chartBtn chartBtn-bd2"><span>日K</span></div>' +
                '</div>' +
            '</div>' +
        '</div>'+
        '<div class="stock-state"><span></span><span></span></div>'+
        '<div style="position:relative;">' +
        '<div id="chartContent'+timeStr+'" class="chartContent" style="display:block;height:'+height+'px;"></div>' +
        '</div>'+
        '<div class="ui-stockNews-tabs">' +
        '<div class="ui-stockNews-tabs-inner hbox">' +
        (!isStock ?
        ('<div class="selected spacer"><span>要闻</span></div>' +
        '<div id="stockNews-custom'+timeStr+'" class="spacer"><span>新闻订制</span></div>') :
        ('<div class="selected spacer"><span>要闻</span></div>' +
        '<div id="stockNews-custom'+timeStr+'" class="spacer"><span>新闻订制</span></div>' +
        '<div id="zhenggu'+timeStr+'" class="spacer"><span class="remindme">诊股</span></div>')) +
        '</div>' +
        '</div>'+
        '<ul class="ui-stockNews-list"></ul>'+
        '<div class="pullUp" id="'+ pullUpId +'">'+
        '<span class="pullUpIcon"></span><span class="pullUpLabel"></span>'+
        '</div>'+
        '</div>' +
        '</div>';
    var returnData = {};
    returnData.html = html;
    returnData.wrapperId = wrapperId;
    returnData.scrollerId = scrollerId;
    returnData.isOnlyScroll = false;
    returnData.pullDownId = pullDownId;
    returnData.pullUpId = pullUpId;
    returnData.createById = true;
    returnData.isCloseTrans3D = true;
    return returnData;
}
/**
 * 根据所传类型来判断数据是向上取还是向下取
 * @param type up是向上取值，down是向下取值
 * @return 返回请求结果
 */
function getSocketsNewsDatasByType(type,callBack,isFirstTime){
    //新闻请求参数，默认取前20条，往下取的话，就按内存后面的取
    var url = getFullUrl("sys/full/news");
    var datas = {keys:"",_limit:"0,20",_begin:"",_end:""};
//    var datas = {keys:"SZ300052.stk$companynews",_limit:"0,20"};
    datas.keys = reSetStockStr(stockCode);
    var refeshLiParams = {type:type,isRefreshLi:isFirstTime};
    if(!allStocksNews[stockCode] ||  allStocksNews[stockCode].length ==  0){
        //如果内存中的数据位空的话
        refeshLiParams.type = "up";
        refeshLiParams.isRefreshLi = true;
        isFirstTime = true;
        type == "up";
    }
    if(type != "up"){
        if(allStocksNews[stockCode] && allStocksNews[stockCode].length > 0){
            datas._limit = ''+allStocksNews[stockCode].length+",20";
        }
    }
    if(type == "up"){
        datas._begin = (allStockNewsTime[stockCode] && allStockNewsTime[stockCode].beginTime) || "";
    }else{
        datas._end = (allStockNewsTime[stockCode] && allStockNewsTime[stockCode].endTime) || "";
    }
    //发送ajax请求获取参数
    getAjaxDataByGet(url,datas,function(result){
        var newDatasArr = [];
        //默认新闻是倒序排列的
        if(result && result.result && result.result.datas&&result.result.datas.length>0){
            var  datas = result.result.datas;
            var  head = result.result.head;
            var datasArr = [];
            for(var i=0; i<datas.length; i++){
                var data = datas[i];
                var dataJson = {};
                for(var j=0;j<head.length;j++){
                    dataJson[head[j]] = data[j];
                }
                datasArr.push(dataJson);
            }
            if(datasArr.length > 0){
                //筛选数据，去掉重复的,跟内存中的数据进行比较
                var oldDatas = allStocksNews[stockCode] || [];
                var newDatas = removeSameNewsIdData(datasArr,oldDatas);
                if(newDatas.length > 0){
                    newDatasArr = [].concat(newDatas)
                    //如果有返回值，根据取值方向，把数据放到内存中去
                    if(type == "up"){
                        allStocksNews[stockCode] = [].concat(newDatas,oldDatas);
                    }else {
                        allStocksNews[stockCode] = [].concat(oldDatas,newDatas);
                    }
                    var tempTimeParam = {
                        beginTime : allStocksNews[stockCode][0].EntryTime,
                        endTime : allStocksNews[stockCode][allStocksNews[stockCode].length - 1].EntryTime
                    }
                    allStockNewsTime[stockCode] = tempTimeParam;
                }
                //更新缓存中的值，每次取内存中的前20条放到缓存中，不够的话，有多少算多少
                setAllSocketsNewsByObj(stockCode);
            }
        }
        if(type == "up" && !isFirstTime){
            //第一次的话，倒序排序
//            newDatasArr.reverse();
        }
        callBack(reSetStockNewsList(newDatasArr),refeshLiParams);
    })
}
/**
 * 重新设置头条的新闻列表
 * @param result
 */
function reSetStockNewsList(result){
    var html = "";
    if(result){
        for(var i=0;i<result.length;i++){
            var turnUrl = "../news/newsDetail.html?newsCode=";
            var termData = {id:'',title:"",time:"",url:"",sources:"",picUrl:"",nChannel:"",memo:""};
            termData.title = reSetNewsTitleList(result[i].nTitle);
            termData.time = result[i].EntryTime;
            termData.nChannel = result[i].nChannel;
            termData.sources = result[i].nSource;
            termData.id = result[i]["id"];
//            turnUrl += termData.id + "&title="+termData.title+"&newsType="+result[i].cate_ws +
//                "&newsContent=" + result[i].nContent + "&newsSource="+result[i].nSource + "&entryTime="+result[i].EntryTime+
//                "&topTitle="+result[i].nChannel+"&stockTopTitle=";
            termData.url = turnUrl;
            termData.memo = result[i].memo;
            termData.picUrl = result[i].nlink;
            html += createStockNewsLiByData(termData);
        }
    }
    return html;
}
function createStockNewsLiByData(row){
    var title = row.title;
    var id = row.id;
    var timeObject = reSetStockNewsCount(row.time);
    var isToday = timeObject.isToday;
    var time = timeObject.time;
    var date = timeObject.date;
    var url = row.url;
    //判断是否点击过
    var isClicked = checkNewsIsClicked(id);
    var html = '<li';
    if(isClicked){
        html += ' class="clickedLi" '
    }
    html += ' id="'+id +'" data-url ="' + url +
        '" >'
    html += '<div class="ui-stockNews">';
    html += '<h4>'+ title +'</h4>';
    html += '<div class="ui-stockNews-time">';
    if(isToday){
        html += time;
    }else {
        html += date;
    }
    html += '</div>';
    html += '</div></li>';
    return html;
}
/**
 * 重新设置倒计时时间
 * @param timeString
 * @returns {string}
 */
function reSetStockNewsCount(timeString){
    var returnObject = {
        isToday:false,
        time:"",
        date:""
    };
    var dateString = timeString.substr(0, 4) + "/" + timeString.substr(4, 2) + "/" + timeString.substr(6, 2) + " " + timeString.substr(8, 2) + ":" + timeString.substr(10, 2) + ":" + timeString.substr(12, 2);
    var dateParam = new Date(dateString);
    //判断是不是今天
    var isToday = false;
    var dateToday = getAppointedDay(new Date());
    if(parseFloat(timeString) > parseFloat(dateToday+"000000")){
        isToday = true;
        returnObject.isToday = true;
    }
    var hour = (dateParam.getHours()< 10)?("0"+dateParam.getHours()):dateParam.getHours();
    var minutes = (dateParam.getMinutes() < 10)?("0"+dateParam.getMinutes()):dateParam.getMinutes();
    //显示今天+时：分
    returnObject.time += hour + ":" + minutes;

    if(!isToday){
        //如果时间不是今天，则显示月，日 加时间
        //先判断是不是今年
        var yearNow = new Date().getFullYear();
        var dateNews = getAppointedDay(dateParam);
        var year = dateNews.substr(0,4);
        var month = dateNews.substr(4,2);
        var day = dateNews.substr(6,2);
        var yearNews = dateParam.getFullYear();
        if(yearNow == yearNews){
            returnObject.isThisYear = true;
            //如果是今年
            returnObject.date = month + "-" + day;
        }else {

            returnObject.date = year + '-' + month + "-" + day;
        }
    }
    return returnObject;
}
function bindQuotationDetailEvent(){
    touchEventWithBackShadow($("#refreshBtnDetail","#"+quotationDetailTitleId),function(){
        refreshQuotationDetailData();
    });
    touchEventWithBackShadow($(".quotation-remind","#quotationBottom"+timeStr), function(){
        //根据状态选择是添加还是删除
        var that = this;
        var action = "";
        var html = $(".quotation-remind","#quotationBottom"+timeStr).find("span:last").html();
        if(html == "添加提醒"){
            action = "add";
        }else{
            action = "delete";
        }
        var title = $(".name","#"+quotationDetailTitleId).html();
        if(action == "add"){
            if(stockCode && stockCode.length > 0 && title && title.length > 0){
                var user = getUserInfo();
                if(user == null){
                    createLoadingInfo(function(data){
                        if(data == "timeout"){

                        }else{
                            saveOptionalRemind(stockCode,title,function(data){
                                //更改状态
                                if(data){
                                    $(".quotation-remind","#quotationBottom"+timeStr).find("span:last").html("取消提醒");
                                    $(".quotation-optional","#quotationBottom"+timeStr).html("取消自选");
                                }
                            });
                        }
                    });
                }else{
                    saveOptionalRemind(stockCode,title,function(data){
                        //更改状态
                        if(data){
                            $(".quotation-remind","#quotationBottom"+timeStr).find("span:last").html("取消提醒");
                            $(".quotation-optional","#quotationBottom"+timeStr).html("取消自选");
                        }
                    });
                }
            }else{
                //重新刷新页面获取相应数据
                toastText("页面加载错误，请刷新页面");
            }
        } else if(action == "delete"){
            removeOptionalRemind([stockCode],function(data){
            	if(data)$(".quotation-remind","#quotationBottom"+timeStr).find("span:last").html("添加提醒");
            });
        }
    });
    touchEventWithBackShadow($(".quotation-optional","#quotationBottom"+timeStr), function(){
        //判断是添加还是删除
        var that = $(".quotation-optional","#quotationBottom"+timeStr)[0];
        var action = "";
        if($(that).html()=="取消自选"){
            action = "delete";
        }else if($(that).html()=="添加自选"){
             action = "add";
        }
        if(action == "delete"){
            removeOptionalData([stockCode],function(data){
                if(data.success){
                    $(that).html("添加自选");
                    $(".quotation-remind","#quotationBottom"+timeStr).find("span:last").html("添加提醒");
                }
            });
        } else  if(action == "add"){
            setOptionalData([stockCode],function(data){
                if(data.success){
                    $(that).html("取消自选");
                }
            });
        }
    });
    //新闻订制按钮事件
    touchEventWithBackShadow($("#quotationBottom"+timeStr+" .stockNews-custom"),function(e){
    	//需要登录
    	var user = getUserInfo();
        if(user == null){
            createLoadingInfo(function(data){
            	var params = {pageId:"newsSubscribe",params:{callback:createNewsSubscribeBody}}
		    	//跳转到新闻订制页面
		    	changePageByParams(params);
            });
        }else{
	    	var params = {pageId:"newsSubscribe",params:{callback:createNewsSubscribeBody}}
	    	//跳转到新闻订制页面
	    	changePageByParams(params);
        }
    });
}

//function clearBody(){
//    $('#'+quotationDetailBody).remove();
//}
