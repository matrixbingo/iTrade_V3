
//function dom_init() {
//    pageId = "marketDetail";
//    //创建页面布局
//    marketsDetailsCreateBody($("#gw-mobile-content"));
//    marketsDetailsIndexHtml();
//    marketsDetailsVender();
//    marketsDetailsAddEvent();
//    marketsDetailsRefreshData();
//}
var marketsDetailsMainBody = "marketsDetailsMainBody";
var marketsDetailsMainTitleId = "marketsDetailsMainTitleId";
var isMarketDetailSetInterval=false;
function createMarketsDetails(params) {
    pageId = params.pageId;
    //创建主页面
    createContent(params,marketsDetailsMainBody);
    buildBlueHeader(marketsDetailsMainTitleId,$("#"+marketsDetailsMainBody));
    marketsDetailsCreateBody($("#"+marketsDetailsMainBody),$("#"+marketsDetailsMainTitleId),params.params.dataUrl);
    marketsDetailsVender();
    marketsDetailsIndexHtml();
    marketsDetailsAddEvent();
    //滚动动画，
    animatingFun(params,function(){
        marketsDetailsRefreshData();

    });
    if(!isMarketDetailSetInterval){
        startMarketsDetailSetInterval();
        isMarketDetailSetInterval=true;
    }
}

//页面title显示数据的列表
// dataUrl 数据请求地址
// title1 大标题
// colTitle 列标题1,2,3
// sort 排序列
// sortCode 拍序列符号 ↓ ↑
function getTitleData(dataUrl){
    var data=[{"dataUrl":"sys/rankings/bindex","dataUrlSort":"sys/rankings/bindex_down","title":"热门板块","colTitle1":"板块名称","colTitle2":"涨跌幅","colTitle3":"领涨股","sort":"2","sortCode":"↓"}];
    data.push({"dataUrl":"sys/rankings/bindex_down","dataUrlSort":"sys/rankings/bindex","title":"热门板块","colTitle1":"板块名称","colTitle2":"涨跌幅","colTitle3":"领涨股","sort":"2","sortCode":"↑"});
    data.push({"dataUrl":"sys/rankings/hs300","dataUrlSort":"sys/rankings/hs300_down","title":"涨幅榜","colTitle1":"名称代码","colTitle2":"最新价","colTitle3":"涨幅","sort":"3","sortCode":"↓"});
    data.push({"dataUrl":"sys/rankings/hs300_down","dataUrlSort":"sys/rankings/hs300","title":"跌幅榜","colTitle1":"名称代码","colTitle2":"最新价","colTitle3":"跌幅","sort":"3","sortCode":"↑"});
    data.push({"dataUrl":"sys/rankings/hs_trunover","dataUrlSort":"sys/rankings/hs_trunover_down","title":"换手率榜","colTitle1":"名称代码","colTitle2":"最新价","colTitle3":"换手率","sort":"3","sortCode":"↓"});
    data.push({"dataUrl":"sys/rankings/hs_trunover_down","dataUrlSort":"sys/rankings/hs_trunover","title":"换手率榜","colTitle1":"名称代码","colTitle2":"最新价","colTitle3":"换手率","sort":"3","sortCode":"↑"});
    data.push({"dataUrl":"sys/rankings/hs_amp","dataUrlSort":"sys/rankings/hs_amp_down","title":"振幅榜","colTitle1":"名称代码","colTitle2":"最新价","colTitle3":"振幅","sort":"3","sortCode":"↓"});
    data.push({"dataUrl":"sys/rankings/hs_amp_down","dataUrlSort":"sys/rankings/hs_amp","title":"振幅榜","colTitle1":"名称代码","colTitle2":"最新价","colTitle3":"振幅","sort":"3","sortCode":"↑"});
    for(var i=0;i<data.length;i++){
        if(data[i].dataUrl==dataUrl){
            return data[i];
        }
    }
    return null;
}
/**
 * 构建表格布局
 */
function marketsDetailsCreateBody($container,$header,dataUrl){
//    var data = getTitleData(getUrlParameter("dataUrl"));
    var data = getTitleData(dataUrl);
    if(data==null){
        return;
    }
    var title=data.title;
    var preHeader = '<div class="ui-gw-header-leftBtn"><div class="ui-gw-header-backward"></div></div>'+
        '<div class="ui-gw-header-title" data-url="'+data.dataUrl+'">'+title+'</div>' +
        '<div class="ui-gw-header-rightBtn">' +
        '<div id="refreshBtn" class="ui-gw-header-refresh"></div>'+
        '</div>' ;
    $header.html(preHeader);
    var html = '<div id="maketsDetailsQuotation" class="wrapperQuotation" style="bottom: 0px;">'+
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

var myScrollMarketsDetails;

function marketsDetailsVender() {
    //向下滚动
    var pullDownEl,
        pullDownOffset;
    //默认下拉提示区域为pullDown
    pullDownEl = $("#"+marketsDetailsMainBody + " #pullDown");
    var refreshBtn = $("#"+marketsDetailsMainTitleId + " #refreshBtn");
    var lastRefresh = $("#"+marketsDetailsMainBody + " #lastRefresh");
    if(pullDownEl && pullDownEl.size() > 0){
        pullDownOffset = pullDownEl.outerHeight();
    }
    var startY = -pullDownOffset;
    myScrollMarketsDetails = new iScroll('maketsDetailsQuotation',{
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
                marketsDetailsRefreshData();
                return;
            }
            this.isAlreadyGetData = false;
        }
    });
}

function marketsDetailsAddEvent(){
    $("#"+marketsDetailsMainTitleId + " #refreshBtn").bind("fastClick", function(){
        marketsDetailsRefreshData();
    });
    $("#"+marketsDetailsMainTitleId + " .ui-gw-header-backward").bind("fastClick",gobackByParams);
}

function marketsDetailsBindEvents(){
    $("#"+marketsDetailsMainBody + " .marketsList .details li").touchEvent({
        "fastClickEnd" : marketsFastClickToQuotationDetail
    });
    $("#"+marketsDetailsMainBody + " .mdTitle div .sortColor").touchEvent({
        "fastClickEnd" : marketsDetailsFastClickSort
    });

}


function marketsDetailsFastClickSort(){
    var url = $(this).attr("data-url");
    if(url&&url.length>0){
        var data = getTitleData(url);
        $("#"+marketsDetailsMainTitleId + " .ui-gw-header-title").attr("data-url",data.dataUrl);
        $("#"+marketsDetailsMainTitleId + " .ui-gw-header-title").html(data.title);
        marketsDetailsRefreshData();
    }
}
function marketsDetailsIndexHtml(){
    if($("#"+marketsDetailsMainBody + " #thelistMarkets").html()==""){
        var item=$("#"+marketsDetailsMainTitleId + " .ui-gw-header-title").attr("data-url").split("/")[2];
        var result=localStorage.getItem("dzhjpzx_markets_"+item);
        if(result!=null){
            var html = marketsDetailsCreateMarketsListLi(JSON.parse(result).result.datas);
            marketsDetailsRefreshHtml(html);
        }
    }
}
function marketsDetailsRefreshData(){
    if($("#"+marketsDetailsMainBody + " #maketsDetailsQuotation").size() <= 0){
        return;
    }
    $("#"+marketsDetailsMainTitleId + " #refreshBtn").addClass("loading");
    var html="";
    var url = getFullUrl($("#"+marketsDetailsMainTitleId + " .ui-gw-header-title").attr("data-url"));
    var item=$("#"+marketsDetailsMainTitleId + " .ui-gw-header-title").attr("data-url").split("/")[2];
    getAjaxDataByGet(url,{},function(result){
        if(result == "timeout"||Object.prototype.toString.call(result).toLowerCase() != "[object object]"|| result.result.datas.length==0){
            toastText("网络服务不给力⊙﹏⊙");
            myScrollMarketsDetails.refresh();
            return;
        }else{
            localStorage.setItem("dzhjpzx_markets_"+item,JSON.stringify(result));
            toastText("行情获取成功 "+new Date().format("yyyy-MM-dd HH:mm:ss"));
        }
        html=html+marketsDetailsCreateMarketsListLi(result.result.datas);
        marketsDetailsRefreshHtml(html);
    });
}
function marketsDetailsRefreshHtml(html){
    $("#"+marketsDetailsMainBody + " #thelistMarkets").html(html);
    marketsDetailsBindEvents();
    setTimeout(function(){
        myScrollMarketsDetails.refresh();
        var date = new Date();
        var dateStr = date.format("MM/dd HH:mm:ss");
        $("#"+marketsDetailsMainBody + " #lastRefresh").html("最后刷新时间：" + dateStr);
    },100);
}

//构建各Li的标题前台展示代码
function marketsDetailsCreateTitle(){
    var data = getTitleData($("#"+marketsDetailsMainTitleId + " .ui-gw-header-title ").attr("data-url"));
    var c="class='sortColor' data-url='"+data.dataUrlSort+"'";
    var sortCode="<span class='sortCode'>"+data.sortCode+"</span>"
    var title="<div class='mdTitle'>";
    title=title+"<div class='title1'><span "+((data.sort=="1")?c:'')+">"+data.colTitle1+((data.sort=="1")?sortCode:'')+"</span></div>";
    title=title+"<div class='title2'><span "+((data.sort=="2")?c:'')+">"+data.colTitle2+((data.sort=="2")?sortCode:'')+"</span></div>";
    title=title+"<div class='title3'><span "+((data.sort=="3")?c:'')+">"+data.colTitle3+((data.sort=="3")?sortCode:'')+"</span></div>";
    title=title+"</div>";
    return title;
}

//构建排行榜Li的前台展示代码
function marketsDetailsCreateMarketsListLi(data){
    var html = "<li class='marketsList'>";
    html=html+marketsDetailsCreateTitle();
    var dataTitle = getTitleData($("#"+marketsDetailsMainTitleId + " .ui-gw-header-title ").attr("data-url"));
    var titleText=dataTitle.title;
    if(titleText=="热门板块"){
        html=html+"<div class='details1'><ul>";
        for(var i=0;i<data.length;i++){
            var res=data[i];
            var val="";
            html=html+"<li>"+
                "<div id='title1'><span>"+res[1]+"</span></div>"+
                "<div class='"+marketsDetailsSetRiseColor(res[5])+"' id='title2'><span>"+marketsDetailsSetRiseSymbol(res[5])+"%</span></div>"+
                "<div id='title3'><span>"+((res[7]!='null')?res[7]:'')+"</span></div>"+
                "</li>";
        }
    }else{
        html=html+"<div class='details' id='details2'><ul>";
        for(var i=0;i<data.length;i++){
            var res=data[i];
            var val="";
            if(titleText=="涨幅榜"||titleText=="跌幅榜"){
                val=marketsDetailsSetRiseSymbol(res[1])+"%";
            }else if(titleText=="换手率榜"){
                val=parseFloat(res[1]*100).toFixed(2)+"%";
            }else{
                val=parseFloat(res[1]).toFixed(2)+"%";
            }

//            html=html+"<li data-url='../quotation/quotationChart.html?stockCode="+res[0]+".stk'>"+
            html=html+"<li data-url='"+res[0]+".stk'>"+
                "<div class='info'><span class='name'>"+res[2]+"</span><br><span class='code'>"+res[0].substring(2,8)+"</span></div>"+
                "<div class='value'><span>"+parseFloat(res[3]).toFixed(2)+"</span></div>"+
                "<div class='ZF'><span class='"+((titleText=="涨幅榜"||titleText=="跌幅榜")?marketsDetailsSetRiseColor(res[1]):"")+"'>"+val+"</span></div>"+
                "</li>";
        }
    }

    html=html+"</ul></div>"+
        "</li>";
    return html;
}

function marketsDetailsSetRiseSymbol(rise){
    if(rise<0){
        return parseFloat(rise).toFixed(2);
    }else{
        return "+"+parseFloat(rise).toFixed(2);
    }
}

function marketsDetailsSetRiseColor(rise){
    if(rise>0){
        return "Red";
    }else if(rise<0){
        return "Green";
    }else{
        return "Black";
    }
}
//启动定时任务
function startMarketsDetailSetInterval(){
    setInterval(MarketsDetailSetInterval,30000);
}
function MarketsDetailSetInterval(){
    var hour= parseFloat(new Date().format("HHmm"));
    if(pageId=="marketDetail"&&hour>=900&&hour<=1500){
        marketsDetailsRefreshData();
    }
}
