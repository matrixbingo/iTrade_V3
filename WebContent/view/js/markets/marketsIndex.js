
//function dom_init() {
//    pageId = "marketIndex";
//    bottomTiTle("行情");
//    //创建页面布局
//    marketsCreateBody($("#gw-mobile-content"));
//    marketsIndexHtml();
//    marketsVender();
//    marketsAddEvent();
//    marketsRefreshData();
//}
var marketsMainBody = "marketsMainBody";
var marketsMainTitleId = "marketsMainTitleId";
function createMarketsIndex(params) {
    pageId = params.pageId;
    //滚动动画，
    animatingFun(params,function(){
        //如果页面没有创建过，重新创建
        if($("#"+marketsMainBody).length == 0){
            //创建主页面
            createContent(params,marketsMainBody);
            buildBlueHeader(marketsMainTitleId,$("#"+marketsMainBody));
            //创建页面布局
            marketsCreateBody($("#"+marketsMainBody),$("#"+marketsMainTitleId));
            marketsIndexHtml();
            marketsVender();
            marketsAddEvent();
            startMarketsIndexSetInterval();

        }
        //判断下一层是否是键盘宝
        if(showkeyboardChart){
            pageId="quotationQuery";
            showkeyboardChart = null;
        }
        marketsRefreshData();
    });
}


/**
 * 构建表格布局
 */
function marketsCreateBody($container,$header){
    var preHeader =  '<div class="ui-gw-header-title">市场行情</div>' +
        '<div class="ui-gw-header-rightBtn">' +
        '<div class="ui-gw-header-query"></div>'+
        '<div id="refreshBtn" class="ui-gw-header-refresh"></div>'+
        '</div>';
    $header.html(preHeader);
    var html = '<div id="marketsIndexQuotation" class="wrapperQuotation">'+
        '<div id="scrollerQuotation" class="scrollerQuotation">'+
        '<div id="pullDown">'+
        '<span class="pullDownIcon"></span>' +
        '<span class="pullDownLabel"></span>' +
        '<span id="lastRefresh" class="pullDownTime"></span>'+
        '</div>'+
        '<ul id="thelistMarkets"></ul>'+
        '</div>'+
        '</div>';
    $container.html(html);

}

var ScrollMarketsIndex;

function marketsVender() {
    //向下滚动
    var pullDownEl,
        pullDownOffset;
    //默认下拉提示区域为pullDown
    pullDownEl = $("#"+marketsMainBody+" #pullDown");
    var refreshBtn = $("#"+marketsMainTitleId+" #refreshBtn");
    var lastRefresh = $("#"+marketsMainBody+" #lastRefresh");
    if(pullDownEl && pullDownEl.size() > 0){
        pullDownOffset = pullDownEl.outerHeight();
    }
    var startY = -pullDownOffset;
    ScrollMarketsIndex = new iScroll('marketsIndexQuotation',{
        hideScrollbar:true,//没有用户操作时，滚动条隐藏
        topOffset : pullDownOffset, //默认开始滚动位置
        y : startY,
//        hScroll:false, //隐藏横向滚动条
        onRefresh :function(){
            if (pullDownEl.hasClass('loading')) {
                pullDownEl.removeClass("loading");
                pullDownEl.find('.pullDownLabel').html('');
            }
            if(refreshBtn.hasClass("loading")){
                refreshBtn.attr("class","ui-gw-header-refresh");
            }
            this.isAlreadyGetData = false;
        },
        onScrollMove : function() {
            if(!this.isAlreadyGetData){
                if (this.y > 0 && !pullDownEl.hasClass('flip')) {
                    pullDownEl.attr("class","flip");
                    pullDownEl.find('.pullDownLabel').html('释放刷新');
                    if(lastRefresh.html().length > 0){
                        lastRefresh.show();
                    }
                    this.minScrollY = 0;
                    return;
                } else if (this.y <= 0 && pullDownEl.hasClass('flip')) {
                    pullDownEl.attr("class","down");
                    pullDownEl.find('.pullDownLabel').html('下拉刷新');
                    if(lastRefresh.html().length > 0){
                        lastRefresh.show();
                    }
                    this.minScrollY = -pullDownOffset;
                    return;
                }
            }
        },
        onScrollEnd : function() {
            //上拉重新请求数据，下拉取缓存中的数据
            if (pullDownEl.hasClass('flip')) {
                pullDownEl.attr("class","loading");
                refreshBtn.addClass("loading");
                pullDownEl.find('.pullDownLabel').html('更新中...');
                lastRefresh.hide();
                this.isAlreadyGetData = true;
                //调用刷新页面的方法
                marketsRefreshData();
                return;
            }
            this.isAlreadyGetData = false;
        }
    });
    ScrollMarketsIndex.scrollTo(0,0.1,1);
}

function marketsAddEvent(){
    $("#"+marketsMainTitleId+" .ui-gw-header-query").bind("fastClick", function(){showQuotationQuery();});
    $("#"+marketsMainTitleId+" #refreshBtn").bind("fastClick", function(){
        marketsRefreshData();
    });
}

function marketsBindEvents(){
    $("#"+marketsMainBody+" .title .title1").touchEvent({
        "fastClickEnd" : marketsFastClickSlideToggle
    });
    $("#"+marketsMainBody+" .title .title2").touchEvent({
        "fastClickEnd" : marketsFastClickToMarketDetail
    });
    $("#"+marketsMainBody+" .marketsIndex div").touchEvent({
        "fastClickEnd" : marketsFastClickToQuotationDetail
    });
    $("#"+marketsMainBody+" .marketsList .details li").touchEvent({
        "fastClickEnd" : marketsFastClickToQuotationDetail
    });
    $("#"+marketsMainBody+" .marketsIndustry .details li").touchEvent({
        "fastClickEnd" :marketsFastClickToMarketIndustryDetails
    });
}

function marketsFastClickSlideToggle(){
    var jiantou= $(this).parent();
    if (jiantou.hasClass('expanded')) {
        jiantou.removeClass("expanded");
    }else{
        jiantou.addClass("expanded");
    }
    var details=$(this).parent().parent().children("div.details");
    if(details.height()==0){
        if($(this).parent().parent().attr("class")=="marketsList"){
            details.height(500);
        }else{
            details.height(188);
        }
    }else{
        details.height(0);
    }
    setTimeout(function(){
        ScrollMarketsIndex.refresh();
    },500)
}
//跳转到行情详细页面
function marketsFastClickToMarketDetail(){
    var url = $(this).attr("data-url");
//    if(url&&url.length>0){
//        changePage(url);
//    }
    var realtimeParams = {pageId:"marketDetail",params:{
        callback:createMarketsDetails,dataUrl:url
    }}
    changePageByParams(realtimeParams);
}
//跳转到自选股页面
function marketsFastClickToQuotationDetail(){
    var url = $(this).attr("data-url");
//    if(url&&url.length>0){
//        changePage(url);
//    }
    var chartParams = {pageId:"quotationChart",params:{
        "stockCode" : url,
        callback:createQuotationDetailBody
    }};
    changePageByParams(chartParams);
}
//跳转到行业详细页面
function marketsFastClickToMarketIndustryDetails(){
}
//初始化前端页面，防止数据取不到时页面有空白
function marketsIndexHtml(){
    if($("#"+marketsMainBody+" #thelistMarkets").html()==""){
        var resultIndex=localStorage.getItem("dzhjpzx_markets_getMarketByObjs");
        var resultIndustry=localStorage.getItem("dzhjpzx_markets_bindex");
        var result1=localStorage.getItem("dzhjpzx_markets_hs300");
        var result2=localStorage.getItem("dzhjpzx_markets_hs300_down");
        var result3=localStorage.getItem("dzhjpzx_markets_hs_trunover");
        var result4=localStorage.getItem("dzhjpzx_markets_hs_amp");
        if(resultIndex!=null&&resultIndustry!=null&&result1!=null&&result2!=null&&result3!=null&&result4!=null){
            var html = marketsCreateIndex(JSON.parse(resultIndex));
            html = html+marketsCreateMarketsIndustryLi("热门板块",JSON.parse(resultIndustry).result.datas);
            html=html+marketsCreateMarketsListLi("涨幅榜",JSON.parse(result1).result.datas,"sys/rankings/hs300");
            html=html+marketsCreateMarketsListLi("跌幅榜",JSON.parse(result2).result.datas,"sys/rankings/hs300_down");
            html=html+marketsCreateMarketsListLi("换手率榜",JSON.parse(result3).result.datas,"sys/rankings/hs_trunover");
            html=html+marketsCreateMarketsListLi("振幅榜",JSON.parse(result4).result.datas,"sys/rankings/hs_amp");
            marketsRefreshHtml(html);
        }
    }
}
function marketsRefreshData(){
    saveAllStorageIds("dzhjpzx_markets_getMarketByObjs");
    saveAllStorageIds("dzhjpzx_markets_bindex");
    saveAllStorageIds("dzhjpzx_markets_bindex_down");
    saveAllStorageIds("dzhjpzx_markets_hs300");
    saveAllStorageIds("dzhjpzx_markets_hs300_down");
    saveAllStorageIds("dzhjpzx_markets_hs_trunover");
    saveAllStorageIds("dzhjpzx_markets_hs_trunover_down");
    saveAllStorageIds("dzhjpzx_markets_hs_amp");
    saveAllStorageIds("dzhjpzx_markets_hs_amp_down");
    if($("#"+marketsMainBody+" #marketsIndexQuotation").size() <= 0){
        return;
    }
    $("#"+marketsMainTitleId+" #refreshBtn").addClass("loading");
    var html="";
    //指数
    var urlIndex = getFullUrl("mobile/stock/getMarketByObjs");
    var datas = {"obj":"SH000001,SZ399001,SZ399006"};
    getAjaxDataByGet(urlIndex,datas,function(resultIndex){
        if(resultIndex == "timeout"|| resultIndex.length==0||resultIndex == "error"||resultIndex.substring(0,1)!= "["){
            toastText("网络服务不给力⊙﹏⊙");
            resultIndex=JSON.parse(localStorage.getItem("dzhjpzx_markets_getMarketByObjs"));
            if(resultIndex==null){
                ScrollMarketsIndex.refresh();
                return;
            }
        }else{
            localStorage.setItem("dzhjpzx_markets_getMarketByObjs",resultIndex);
            resultIndex=JSON.parse(resultIndex);
        }
        if(resultIndex!=null){
            if($("#"+marketsMainBody+" #thelistMarkets").html()==""){
                html = html+marketsCreateIndex(resultIndex);
            }else{
                marketsRefreshIndex(resultIndex);
            }
        }
        var url=getFullUrl("sys/rankings");
        var datasUrl = {"keys":"bindex,hs300,hs300_down,hs_trunover,hs_amp"};
        getAjaxDataByGet(url,datasUrl,function(result){
            if(result == "timeout"|| result.length==0||result == "error"||Object.prototype.toString.call(result).toLowerCase() != "[object object]"){
                toastText("网络服务不给力⊙﹏⊙");
                ScrollMarketsIndex.refresh();
                return;
            }else{
                if(result.bindex&&result.hs300&&result.hs300_down&&result.hs_trunover&&result.hs_amp){
                    toastText("行情获取成功 "+new Date().format("yyyy-MM-dd HH:mm:ss"));
                    localStorage.setItem("dzhjpzx_markets_bindex",JSON.stringify(result.bindex));
                    localStorage.setItem("dzhjpzx_markets_hs300",JSON.stringify(result.hs300));
                    localStorage.setItem("dzhjpzx_markets_hs300_down",JSON.stringify(result.hs300_down));
                    localStorage.setItem("dzhjpzx_markets_hs_trunover",JSON.stringify(result.hs_trunover));
                    localStorage.setItem("dzhjpzx_markets_hs_amp",JSON.stringify(result.hs_amp));
                    if($("#"+marketsMainBody+" #thelistMarkets").html()==""){
                        html = html+marketsCreateMarketsIndustryLi("热门行业",result.bindex.result.datas);
                        html=html+marketsCreateMarketsListLi("涨幅榜",result.hs300.result.datas,"sys/rankings/hs300");
                        html=html+marketsCreateMarketsListLi("跌幅榜",result.hs300_down.result.datas,"sys/rankings/hs300_down");
                        html=html+marketsCreateMarketsListLi("换手率榜",result.hs_trunover.result.datas,"sys/rankings/hs_trunover");
                        html=html+marketsCreateMarketsListLi("振幅榜",result.hs_amp.result.datas,"sys/rankings/hs_amp");
                    }else{
                        marketsRefreshMarketsIndustryLi(result.bindex.result.datas);
                        marketsRefreshMarketsListLi("涨幅榜",result.hs300.result.datas,0);
                        marketsRefreshMarketsListLi("跌幅榜",result.hs300_down.result.datas,1);
                        marketsRefreshMarketsListLi("换手率榜",result.hs_trunover.result.datas,2);
                        marketsRefreshMarketsListLi("振幅榜",result.hs_amp.result.datas,3);
                    }
                    marketsRefreshHtml(html);
                }else{
                    toastText("网络服务不给力⊙﹏⊙");
                    ScrollMarketsIndex.refresh();
                    return;
                }
            }
        });
    });
}

function marketsRefreshHtml(html){
    var el = $("#"+marketsMainBody+" #thelistMarkets");
    if($("#"+marketsMainBody+" #thelistMarkets").html()==""){
        el.html(html);
        marketsBindEvents();
    }
    setTimeout(function(){
        ScrollMarketsIndex.refresh();
        var date = new Date();
        var dateStr = date.format("MM/dd HH:mm:ss");
        $("#"+marketsMainBody+" #lastRefresh").html("最后刷新时间：" + dateStr);
    },100);
}

//构建指数前台展示代码
function marketsCreateIndex(data){
    var html = "<li class='marketsIndex'>";
    for(var i = 0; i < 3; i++){
        var res=data[i];
//        html=html+"<div data-url='../quotation/quotationChart.html?stockCode="+res.obj+"'><ul>"+
        html=html+"<div data-url='"+res.obj+"'><ul>"+
            "<li class='name'>"+res.stkName+"</li>"+
            "<li class='"+marketsSetRiseColor(res.updnratio)+"'><span>"+marketsSetRisePic(res.updnratio)+"</span>"+parseFloat(res.price).toFixed(2)+"&nbsp;</li>"+
            "<li class='marketsIndexValue'>"+marketsSetRiseSymbol(res.updn)+"&nbsp;&nbsp;"+marketsSetRiseSymbol(res.updnratio)+"%</li>"+
            "</ul></div>";
    }
    html=html+"</li>";
    return html;
}
//刷新指数前台展示数据
function marketsRefreshIndex(data){
    for(var i=0;i<3;i++){
        var res=data[i];
        var html1=res.stkName;
        $("#"+marketsMainBody+" .marketsIndex div:eq("+i+") ul li:eq(0)").html(html1);
        var html2="<span>"+marketsSetRisePic(res.updnratio)+"</span>"+parseFloat(res.price).toFixed(2)+"&nbsp;";
        $("#"+marketsMainBody+" .marketsIndex div:eq("+i+") ul li:eq(1)").html(html2);
        $("#"+marketsMainBody+" .marketsIndex div:eq("+i+") ul li:eq(1)").attr("class",marketsSetRiseColor(res.updnratio));
        var html3=marketsSetRiseSymbol(res.updn)+"&nbsp;&nbsp;"+marketsSetRiseSymbol(res.updnratio)+"%";
        $("#"+marketsMainBody+" .marketsIndex div:eq("+i+") ul li:eq(2)").html(html3);
    }
}

//构建各Li的标题前台展示代码
function marketsCreateTitle(titleText,dataUrl){
    var title="<div class='title expanded'>";
    title=title+"<div class='title1'><span></span>"+marketsAddWhiteSpace(titleText,8,1)+"</div><div class='title1'></div>";
    title=title+"<div class='title2' data-Url='"+dataUrl+"'><span>…</span></div>";
    title=title+"</div>";
    return title;
}

//构建热门行业Li的前台展示代码
function marketsCreateMarketsIndustryLi(titleText,data){
    var html="<li class='marketsIndustry'>";
//    html=html+marketsCreateTitle(titleText,"../markets/marketsDetails.html?dataUrl=sys/rankings/bindex");
    html=html+marketsCreateTitle(titleText,"sys/rankings/bindex");
    html=html+"<div class='details'>";
    for(var i = 0; i < 6; i++){
        var res=data[i];
        var detailsClass;
        if(i==0||i==1){
            detailsClass="details1";
        }else if(i==2){
            detailsClass="details13";
        }else if(i==3||i==4){
            detailsClass="details2";
        }else{
            detailsClass="";
        }
        html=html+"<div class='"+detailsClass+"'><ul>"+
            "<li></li>"+
            "<li>"+res[1]+"</li>"+
            "<li id='marketsIndustryZF' class='"+marketsSetRiseColor(res[5])+"'>"+marketsSetRiseSymbol(res[5])+"%</li>"+
            "<li id='marketsIndustryGG'>"+res[7]+"</li>"+
            "<li id='marketsIndustryGG'>"+res[8]+"&nbsp;&nbsp;"+marketsSetRiseSymbol(res[9])+"%</li>"+
            "<li></li>"+
            "</ul></div>";
    }
    html=html+"</div>"+
              "</li>";
    return html;
}
//刷新热门行业Li的前台展示数据
function marketsRefreshMarketsIndustryLi(data){
    for(var i=0;i<6;i++){
        var res=data[i];
        var html1=res[1];
        $("#"+marketsMainBody+" .marketsIndustry .details div:eq("+i+") ul li:eq(1)").html(html1);
        var html2=marketsSetRiseSymbol(res[5])+"%";
        $("#"+marketsMainBody+" .marketsIndustry .details div:eq("+i+") ul li:eq(2)").html(html2);
        var html3=res[7];
        $("#"+marketsMainBody+" .marketsIndustry .details div:eq("+i+") ul li:eq(3)").html(html3);
        var html4=res[8]+"&nbsp;&nbsp;"+marketsSetRiseSymbol(res[9])+"%";
        $("#"+marketsMainBody+" .marketsIndustry .details div:eq("+i+") ul li:eq(4)").html(html4);
    }
}
//构建排行榜Li的前台展示代码
function marketsCreateMarketsListLi(titleText,data,dataUrl){
    var html = "<li class='marketsList'>";
//    html=html+marketsCreateTitle(titleText,"../markets/marketsDetails.html?dataUrl="+dataUrl);
    html=html+marketsCreateTitle(titleText,dataUrl);
    html=html+"<div class='details'><ul>";
    for(var i = 0; i < 10; i++){
        var res=data[i];
        var val="";
        if(titleText=="涨幅榜"||titleText=="跌幅榜"){
            val=marketsSetRiseSymbol(res[1])+"%";
        }else if(titleText=="换手率榜"){
            val=parseFloat(res[1]*100).toFixed(2)+"%";
        }else{
            val=parseFloat(res[1]).toFixed(2)+"%";
        }

//        html=html+"<li data-url='../quotation/quotationChart.html?stockCode="+res[0]+".stk'>"+
        html=html+"<li data-url='"+res[0]+".stk'>"+
            "<div class='info'><span class='name'>"+marketsAddWhiteSpace(res[2],8,1)+"</span><br><span class='code'>"+res[0].substring(2,8)+"</span></div>"+
            "<div class='value'>"+marketsAddWhiteSpace(((parseFloat(res[3]).toFixed(2))?parseFloat(res[3]).toFixed(2):"----"),6,0)+"</div>"+
            "<div class='ZF'><span class='"+((titleText=="涨幅榜"||titleText=="跌幅榜")?marketsSetRiseColor(res[1]):"")+"'>"+val+"</span></div>"+
            "</li>";
    }
    html=html+"</ul></div>"+
        "</li>";
    return html;
}
//刷新排行榜Li的前台展示数据
function marketsRefreshMarketsListLi(titleText,data,listLength){
    for(var i=0;i<10;i++){
        var res=data[i];
//        $("#"+marketsMainBody+" .marketsList:eq("+listLength+") .details ul li:eq("+i+")").attr("data-url","../quotation/quotationChart.html?stockCode="+res[0]);
        $("#"+marketsMainBody+" .marketsList:eq("+listLength+") .details ul li:eq("+i+")").attr("data-url",res[0]+".stk");
        var html1="<span class='name'>"+marketsAddWhiteSpace(res[2],8,1)+"</span><br><span class='code'>"+res[0].substring(2,8)+"</span>";
//        var html1="<span class='name'>GQY视讯</span><br><span class='code'>"+res[0].substring(2,8)+"</span>";
        $("#"+marketsMainBody+" .marketsList:eq("+listLength+") .details ul li:eq("+i+") div:eq(0)").html(html1);
        var html2=marketsAddWhiteSpace(((parseFloat(res[3]).toFixed(2))?parseFloat(res[3]).toFixed(2):"----"),6,0);
        $("#"+marketsMainBody+" .marketsList:eq("+listLength+") .details ul li:eq("+i+") div:eq(1)").html(html2);
        var val="";
        if(titleText=="涨幅榜"||titleText=="跌幅榜"){
            val=marketsSetRiseSymbol(res[1])+"%";
        }else if(titleText=="换手率榜"){
            val=parseFloat(res[1]*100).toFixed(2)+"%";
        }else{
            val=parseFloat(res[1]).toFixed(2)+"%";
        }
        var html3="<span class='"+((titleText=="涨幅榜"||titleText=="跌幅榜")?marketsSetRiseColor(res[1]):"")+"'>"+val+"</span>";
        $("#"+marketsMainBody+" .marketsList:eq("+listLength+") .details ul li:eq("+i+") div:eq(2)").html(html3);
    }
}
function marketsSetRiseSymbol(rise){
    if(rise<0){
        return parseFloat(rise).toFixed(2);
    }else{
        return "+"+parseFloat(rise).toFixed(2);
    }
}

function marketsSetRisePic(rise){
    if(rise<0){
        return "▼";
    }else{
        return "▲";
    }
}

function marketsSetRiseColor(rise){
    if(rise>0){
        return "Red";
    }else if(rise<0){
        return "Green";
    }else{
        return "Black";
    }
}
//给字符串加HTML空格--&nbsp;
//length 需要的字符串长度
//position 空格加的位置 0前面 1后面
function marketsAddWhiteSpace(value,length,position){
    var valuelen=marketsCheckstrlenghth(value);
    if(valuelen<length){
        for(var i=0;i<length-valuelen;i++){
            if(position==1){
                value=value+"&nbsp;&nbsp;"
            }else{
                value="&nbsp;&nbsp;"+value;
            }
        }
        return value;
    }else{
        return value;
    }
}
//计算字符长度，中文为2
function marketsCheckstrlenghth(chars) {
    var sum = 0;
    for ( var i = 0; i < chars.length; i++) {
        var c = chars.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            sum++;
        } else {
            sum += 2;
        }
    }
    return sum;
}
//启动定时任务
function startMarketsIndexSetInterval(){
    setInterval(MarketsIndexSetInterval,30000);
}
function MarketsIndexSetInterval(){
    var hour= parseFloat(new Date().format("HHmm"));
    if(pageId=="marketIndex"&&hour>=900&&hour<=1500){
        marketsRefreshData();
    }
}