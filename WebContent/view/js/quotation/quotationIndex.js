/**
 * User: zhen
 * Date: 13-12-18
 * Time: 下午3:30
 */
function createQuotationBody(params) {
    pageId = params.pageId;
    if($("#"+quotationIndexBody).length == 0){
        //创建主页面
        createContent(params,quotationIndexBody);
        buildBlueHeader(quotationIndexTitleId,$("#"+quotationIndexBody));
        //创建页面布局
        buildQuotationIndexBody($("#"+quotationIndexBody));
        buildQuotationIndexEvent();
        refreshQuotationIndexData(true);
        addEvent();
    }
    refreshQuotationIndexData();
    if(quotationIndexInterval == null){
	        quotationIndexInterval = setInterval(function(){
            var marketInfo = getCurrentMarketInfo();
            var current = new Date().format("HHmm");
            if(pageId != "quotationIndex" || parseInt(current) > parseInt("1459") || !marketInfo.isTradeDay){
                clearInterval(quotationIndexInterval);
                quotationIndexInterval = null;
                return;
            }
            if(marketInfo.isTradeDay && (marketInfo.isIntime || current > parseInt("0925"))){
                refreshQuotationIndexData();
            }
        },30000);
    }
    //滚动动画，
    animatingFun(params,function(){
        //是否显示键盘
        if(showkeyboardChart){
            pageId="quotationQuery";
            showkeyboardChart = null;
        }
    });
}
//记录当前页面自选股默认排序
var optionalDataList = [];
var quotationIndexBody = "quotationIndexBody";
var quotationIndexTitleId = "quotationIndexTitleId";
var quotationIndexInterval = null;

/**
 * 构建表格布局
 */
function buildQuotationIndexBody($container){
var preHeader = '<div class="ui-gw-header-leftBtn"><div class="edit">编辑</div></div>' +
    '<div class="ui-gw-header-title">我的自选</div>' +
    '<div class="ui-gw-header-rightBtn">' +
        '<div class="ui-gw-header-query"></div>'+
        '<div id="refreshQuotationIndexBtn" class="ui-gw-header-refresh"></div>'+
    '</div>';
    //标题设置为空
    if($("#"+quotationIndexTitleId).length>0){
        $("#"+quotationIndexTitleId).html(preHeader);
    }
var lastRefresh = getLastRefresh();
var user = getUserInfo();
var html = '<div id="wrapperQuotation" class="wrapperQuotation">'+
        '<div id="scrollerQuotation" class="scrollerQuotation">'+
            '<div id="quotationIndexPullDown" class="pullDown">'+
                '<span class="pullDownIcon"></span>' +
                '<span class="pullDownLabel"></span>' +
                '<span id="lastRefresh" class="pullDownTime">'+
                ((lastRefresh&&lastRefresh.length>0)?('最后刷新时间：' + lastRefresh):'') +
                '</span>'+
            '</div>'+
            '<div class="quotationTitle">' +
                '<div id="name"><span>名称代码</span><i class="sortAble"></i></div>'+
                '<div id="price"><span>最新价</span><i class="sortAble"></i></div>'+
                '<div id="ratio"><span>涨跌幅</span><i class="sortAble"></i></div>'+
            '</div>'+
            '<ul id="thelistQuotation" class="thelistQuotation"></ul>'+
            '<div id="quotationLogin" class="login-tips"></div>' +
        '</div>'+
    '</div>';
    $container.html(html);
    setNonStockHtml($("#thelistQuotation"));
}

var myScrollQuotation;

function buildQuotationIndexEvent() {
    //向下滚动
    var pullDownEl,
        pullDownOffset;
    //默认下拉提示区域为pullDown
    pullDownEl = $('#quotationIndexPullDown','#wrapperQuotation');
    var refreshBtn = $('#refreshQuotationIndexBtn');
    var lastRefresh = $('#lastRefresh');
    if(pullDownEl && pullDownEl.size() > 0){
        pullDownOffset = pullDownEl.outerHeight();
    }
    var startY = -pullDownOffset;
    myScrollQuotation = new iScroll('wrapperQuotation',{
        hideScrollbar:true,//没有用户操作时，滚动条隐藏
        topOffset : pullDownOffset, //默认开始滚动位置
        y : startY,
        hScroll:false, //隐藏横向滚动条
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
                    pullDownEl.attr("class","flip pullDown");
                    pullDownEl.find('.pullDownLabel').html('释放刷新');
                    if(lastRefresh.html().length > 0){
                        lastRefresh.show();
                    }
                    this.minScrollY = 0;
                } else if (this.y <= 0 && pullDownEl.hasClass('flip')) {
                    pullDownEl.attr("class","down pullDown");
                    pullDownEl.find('.pullDownLabel').html('下拉刷新');
                    if(lastRefresh.html().length > 0){
                        lastRefresh.show();
                    }
                    this.minScrollY = -pullDownOffset;
                }
            }
        },
        onScrollEnd : function() {
            if(!this.isAlreadyGetData){
                if (pullDownEl.hasClass('flip')) {
                    pullDownEl.attr("class","loading pullDown");
                    refreshBtn.addClass("loading");
                    pullDownEl.find('.pullDownLabel').html('更新中...');
                    lastRefresh.hide();
                    this.isAlreadyGetData = true;
                    //调用刷新页面的方法
                    loadOptionalData(function(optional){
                        var data = null;
                        if(optional){
                            data = optional["自选股"];
                        }
                        refreshHtml(data);
                    },true);
                }
            }
        }
    });

}

function addEvent(){
    //绑定查询
    touchEventWithBackShadow($(".ui-gw-header-query","#"+quotationIndexTitleId), function(){showQuotationQuery()});
    //绑定编辑
    touchEventWithBackShadow($(".edit","#"+quotationIndexTitleId),function(){
        var el = $("#thelistQuotation");
        if(el.find("li").size()>0){
            var params = {pageId:"quotationEdit",params:{
                callback : createQuotationEditBody
            }};
            changePageByParams(params);

        }
    });
    //绑定刷新
    touchEventWithBackShadow($("#refreshQuotationIndexBtn","#"+quotationIndexTitleId),function(){
        if(!$(this).hasClass("loading")){
            refreshQuotationIndexData();
        }
    });
    //绑定登录
    touchEventWithBackShadow($("#quotationLogin"),function(){
        var user = getUserInfo();
        if(user == null){
            login();
        }
    });
    //绑定标题排序
    $("#name",".quotationTitle").touchEvent({
        "fastClickStart" : function(event){event.preventDefault();event.stopPropagation();},
        "fastClickEnd" : function(){
        	$("#price",".quotationTitle").find("i").attr("class","sortAble");
	        $("#ratio",".quotationTitle").find("i").attr("class","sortAble");
	        if(optionalDataList.length == 0) return;
	        var className = $(this).find("i").attr("class");
	        if(className&&className.trim()=="sortAble"){
	            //升序
	            $(this).find("i").attr("class","sortAble sortAsc");
	            sortByTitle("first","up");
	        }else if(className.indexOf("sortAsc")>=0){
	            //降序
	            $(this).find("i").attr("class","sortAble sortDesc");
	            sortByTitle("first","down");
	        }else if(className.indexOf("sortDesc")>=0){
	            //默认
	            $(this).find("i").attr("class","sortAble");
	            sortByTitle("first","normal");
	        }
        }
    });
    $("#price",".quotationTitle").touchEvent({
        "fastClickStart" : function(event){event.preventDefault();event.stopPropagation();},
        "fastClickEnd" : function(){
        	$("#name",".quotationTitle").find("i").attr("class","sortAble");
	        $("#ratio",".quotationTitle").find("i").attr("class","sortAble");
	        if(optionalDataList.length == 0) return;
	        var className = $(this).find("i").attr("class");
	        if(className&&className.trim()=="sortAble"){
	            //降序
	            $(this).find("i").attr("class","sortAble sortDesc");
	            sortByTitle("mid","down");
	        }else if(className.indexOf("sortDesc")>=0){
	            //升序
	            $(this).find("i").attr("class","sortAble sortAsc");
	            sortByTitle("mid","up");
	        }else if(className.indexOf("sortAsc")>=0){
	            //默认
	            $(this).find("i").attr("class","sortAble");
	            sortByTitle("mid","normal");
	        }
        }
    });
    $("#ratio",".quotationTitle").touchEvent({
        "fastClickStart" : function(event){event.preventDefault();event.stopPropagation();},
        "fastClickEnd" : function(){
        	$("#name",".quotationTitle").find("i").attr("class","sortAble");
	        $("#price",".quotationTitle").find("i").attr("class","sortAble");
	        if(optionalDataList.length == 0) return;
	        var className = $(this).find("i").attr("class");
	        if(className&&className.trim()=="sortAble"){
	            //降序
	            $(this).find("i").attr("class","sortAble sortDesc");
	            sortByTitle("last","down");
	        }else if(className.indexOf("sortDesc")>=0){
	            //升序
	            $(this).find("i").attr("class","sortAble sortAsc");
	            sortByTitle("last","up");
	        }else if(className.indexOf("sortAsc")>=0){
	            //默认
	            $(this).find("i").attr("class","sortAble");
	            sortByTitle("last","normal");
	        }
        }
    });
    //绑定点击事件
    addTouchedStyle($("#name",".quotationTitle"),"touched");
    addTouchedStyle($("#price",".quotationTitle"),"touched");
    addTouchedStyle($("#ratio",".quotationTitle"),"touched");
}

function sortByTitle(component,type){
    var selector = "";
    switch(component){
        case "first":selector = "span.char em";break;
        case "mid":selector = "span.mid"; break;
        case "last":selector = "span.last"; break;
        case "":break;
    }
    var el = $('#thelistQuotation');
    if(selector){
        var list = [];
        for(var i = 0; i < optionalDataList.length; i++){
            var obj = optionalDataList[i];
            var li = el.find("li[data-value='"+obj+"']");
            if(li.size()>0){
                var value = {};
                value.obj = obj;
                if(type!="normal"){
                    var html = li.find(selector).html();
                    if(!html || html == "" || html == "----" || html == "停牌"){
                        if(type == "up"){
                            value.value = Infinity;
                        }else if(type == "down"){
                            value.value = -Infinity;
                        }
                    } else {
                        switch(component){
                            case "first":
                                value.value = parseInt(html);
                                break;
                            case "mid":
                                value.value = parseFloat(html);
                                break;
                            case "last":
                                html = html.replace(/\%/g,"");
                                value.value = parseFloat(html);
                                break;
                        }
                    }
                }
                list.push(value);
            }
        }
        if(type != "normal"){
            list.sort(function(a,b){
                if(type == "up"){
                    return a.value - b.value;
                }else if(type == "down"){
                    return b.value - a.value;
                }
            });
        }
        //开始排序
        var prevLi = null;
        for(var j = 0; j < list.length; j++){
            var obj = list[j].obj;
            var li = el.find("li[data-value='"+obj+"']");
            if(li.size()>0){
                if(prevLi == null){
                    el.prepend(li);
                } else {
                    prevLi.after(li);
                }
                prevLi = li;
            }
        }
    }

}

//登陆并且设置自选股
function login(){
    createLoadingInfo(function(data){
        if(data == "timeout"){
            toastText("登录失败");
        }else{
            refreshQuotationIndexData();
            if(data && data != "" && data.indexOf(";")>0){
                $("#quotationLogin").html("您已登录，账号为"+data.split(";")[0]);
                $("#quotationLogin").removeClass("login-tips-bg");
            }
        }
    });
}

//显示搜索页面
function showQuotationQuery(){
    if($("#softkeyboard").size()<=0){
        createSoftKey();
    }
    showkeyboard();
    return false;
}

function bindQuotationIndexEvents(){
    $("li .btn","#thelistQuotation").touchEvent({
        "fastClickStart" : function(event){event.stopPropagation();},
        "fastClickEnd" : delOptional
    });
    $("li","#thelistQuotation").touchEvent({
        "fastClickStart" : function(event){
            event.preventDefault();
//            event.stopPropagation();
            $(this).addClass("touchedLi");
        },
        "moving" : function(event){
            event.preventDefault();
            if($(this).hasClass("touchedLi")){
                $(this).removeClass("touchedLi");
            }
        },
        "fastClickEnd" : fastClick,
        "longClickEnd" : function(event){
            event.preventDefault();
            if($(this).hasClass("touchedLi")){
                $(this).removeClass("touchedLi");
            }
        }
//        ,"moveLeft":btnToggle,
//        "moveRight":btnToggle
    });
}

//按钮展示
function btnToggle(){
    var btn = $(this).find(".btn");
    if(btn.size()>0){
        var right = parseInt(btn.css("right").replace("px",""));
        //判断动画效果是否完成若未完成则不执行
        if((right>-50&&right<0)||right>0){
            return;
        }
        if(btn.is(":hidden")){
            btn.show();
            btn.animate({"right": "+=50px"}, "normal");
        }else{
            btn.animate({"right": "-=50px"}, "normal",function(){$(this).hide();$(this).css("right","-50px")});
        }
    }
}

function delOptional(event){
    var li = $(this).parents("li");
    var data = li.attr("data-value");
    if(li.parent().find("li").size()<=1){
        setNonStockHtml(li.parent());
    }
    li.remove();
    myScrollQuotation.refresh();
    //同步数据
//    loadOptionalData(function(localData){
//        if(localData != null){
//            delete localData[data];
//            setOptionalData(localData);
//        }
//    });
    return false;
}

function fastClick(){
    if($(this).hasClass("touchedLi")){
        $(this).removeClass("touchedLi");
    }
    var code = $(this).attr("data-value");
    if(code && code.length>0){
        var chartParams = {pageId:"quotationChart",params:{
            "stockCode" : code,
            callback:createQuotationDetailBody
        }};
        changePageByParams(chartParams);
    }
}

function refreshQuotationIndexData(local){
    //显示是否登录
    var user = getUserInfo();
    if (user != null) {
        $("#quotationLogin").removeClass("login-tips-bg");
        $("#quotationLogin").html("您已登录，账号为"+user.userName);
    } else {
        $("#quotationLogin").addClass("login-tips-bg");
        $("#quotationLogin").html("登录大智慧账号，多终端同步自选股");
    }
    if($("#wrapperQuotation").size() <= 0){
        return;
    }
    if(!$('#refreshQuotationIndexBtn').hasClass("loading")){
        $('#refreshQuotationIndexBtn').addClass("loading");
    }
    //若已登录则先取本地自选股信息
    if(user!=null && local){
        var optional = loadLocalData();
        venderQuotationIndexHtml(optional);
    } else {
        loadOptionalData(function(optional){
            var data = venderQuotationIndexHtml(optional);
            bindQuotationIndexEvents();
            refreshHtml(data);
        },false);
    }
}

function venderQuotationIndexHtml(optional){
    var el = $('#thelistQuotation');
    var li;
    var html = "";
    var data = null;
    //为null且登陆状态时，表示查询失败,返回结果为null
    if(optional == null && getUserInfo() != null){
    	return data;	
    }
    if(optional){
        data = optional["自选股"];
    }
    if(!data || data.length <= 0){
    	data = [];
        setNonStockHtml(el);
        myScrollQuotation.disable();
    }else{
    	$(".quotationTitle").find("i.sortAble").attr("class","sortAble");
        $(".quotationTitle").show();
        for(var i = 0; i < data.length; i ++){
            var obj = data[i];
            if(!obj||obj == "")continue;
            var code = obj.split("#")[0];
            if(code){
                var liHtml = el.find('li[data-value="'+code+'"]').prop("outerHTML");
                if(liHtml && liHtml != ""){
                    html += liHtml;
                } else {
                    var stockInfo = getLocalQuotationProps("stockInfo");
                    var scode = code.substring(0,code.indexOf("."));
                    var stkName = null;
                    var price = null;
                    var updnratio = null;
                    var ratioClass = "";
                    if(stockInfo && stockInfo[code]){
                        var stock = stockInfo[code];
                        stkName = stock.stkName;
                        price = stock.price;
                        updnratio = stock.updnratio;
                        //设置涨跌幅样式
                        if(updnratio && updnratio.length >0){
                            if(updnratio.substring(0,1)=="+"){
                                ratioClass = " up";
                            }else if(updnratio.substring(0,1)=="-"){
                                ratioClass = " down";
                            }
                        }
                    }
                    scode = scode.replace("SH","").replace("SZ","");
                    html += "<li data-value=\""+code+"\" " +
                        "data-url=\"../quotation/quotationChart.html?stockCode="+code+"\">"+
                        "<div><span class=\"char\"><span id=\"stkName\">" +
                        ((stkName && stkName!="")? stkName : "----") +
                        "</span><br><em>"+scode+"</em></span></div>"+
                        "<div><span class=\"num mid\">" +
                        ((price && price!="")? price : "----") +
                        "</span></div>"+
                        "<div style=\"position:relative;\">" +
                        "<span class=\"num last"+ratioClass+"\">" +
                        ((updnratio && updnratio!="")? updnratio : "----") +
                        "</span>" +
                        "<span class=\"btntop\">" +
                        "<span class=\"btn\">删除<span>" +
                        "</span>"+
                        "</div>"+
                        "</li>";
                    optionalDataList.push(code);
                }
            }
        }
        el.html(html);
        myScrollQuotation.enable();
//        myScrollQuotation.refresh();
    }
    return data;
}

//加载股票数据
function reloadData(data,callback){
    //拼装realCode
    if(!data) {
        callback(data,false);
        return;
    }
    var str = "";
    for(var i = 0;i < data.length; i++){
        var obj = data[i];
        if(obj&&obj.indexOf("#")>0){
            str += obj.split("#")[0]+",";
        }
    }
    getCurrentMarketInfo(function(marketInfo){
        if(str.length>0){
            var url = getFullUrl("mobile/stock/getMarketByObjs");
            str = str.substring(0,str.length-1);
            var isContain = true;
            //加大盘obj用以判断股票是否停牌
            var shobj = "SH000001.index";
            if(str.indexOf(shobj) < 0){
                str += "," + shobj;
                isContain = false;
            }
            var datas = {"obj":str};
            getAjaxDatas(url,datas,function(result){
                var date = new Date().format("yyyy-MM-dd HH:mm:ss");
                if(result == "timeout"){
                    //请求超时,则调用回调函数时不返回值
                    toastText("网络服务不给力⊙﹏⊙");
                    callback(data,false);
                }else {
                    if(result && result.length>0){
                        toastText("自选股行情获取成功 "+date);
                        var backdata = {};
                        for(var i = 0; i < result.length; i++){
                            var res = result[i];
                            var key = res.obj;
                            var obj = {};
                            if(!res.time || res.time.length <= 0){
                                continue;
                            }
                            obj.time = res.time;
                            if(res.price){
                                obj.price = res.price;
                            }
                            if(res.stkName&&res.stkName.length>0){
                                obj.stkName = res.stkName;
                            }
                            var updnratio = res.updnratio;
                            if(res.updnratio!="--"){
                                if(parseFloat(updnratio) > 0){
                                    obj.updnratio = "+"+res.updnratio+"%";
                                }else if(parseFloat(updnratio) < 0){
                                    obj.updnratio = res.updnratio+"%";
                                }else{
                                	obj.updnratio = "0.00";
                                }
                            }else{
                                obj.updnratio = res.updnratio;
                            }
                            if(res.lastclose){
                                obj.lastclose = res.lastclose;
                            }
                            backdata[key] = obj;
                        }
                        var sh = backdata[shobj];
                        if(!isContain){
                            delete backdata[shobj];
                        }
                        var shTime = sh.time;
                        var shDay = shTime.split(" ")[0];
                        var shMinute = shTime.split(" ")[1];
                        var cur = new Date();
                        var curMinute = cur.format("HHmm");
                        //判断当天是否为交易日
                        if(!marketInfo.hasOwnProperty("isTradeDay") && (parseInt(curMinute) > parseInt("0925"))){
                            var day = cur.format("yyyyMMdd");
                            var o = {"isTradeDay":true};
                            if(shDay && shDay!="" && shDay.replace(/\-/g,"") != day){
                                o.isTradeDay = false;
                            }
                            setLocalQuotationProps("marketInfo",o);
                        }
                        if(shMinute && shMinute != ""){
                            for(var key in backdata){
                            	if(key == shobj) continue;
                                var object = backdata[key];
                                var oDay = object.time.split(" ")[0];
                                var min = shMinute.replace(/\:/g,"");
                                if(min=="000000" || 
                                (parseInt(shDay.replace(/\-/g,"")) > parseInt(oDay.replace(/\-/g,""))
                                &&parseInt("1"+min)<"1092800")){
                                	if(marketInfo && marketInfo.lastTradeDay){
                                        var lastTradeDay = marketInfo.lastTradeDay;
                                        if(parseInt(oDay.replace(/\-/g,"")) < parseInt(lastTradeDay)){
                                            object.updnratio = "停牌";
                                            object.price = "0.00";
                                        }
                                    }
                                }else{
                                	if(parseInt(shDay.replace(/\-/g,"")) > parseInt(oDay.replace(/\-/g,""))){
                                        object.updnratio = "停牌";
                                        object.price = "0.00";
                                    }
                                }
                                if(object.updnratio == "--"){
                                    object.updnratio = "停牌";
                                    object.price = "0.00";
                                }
                            }
                        }
                        //将数据缓存起来(先删除后添加)
                        setLocalQuotationProps("stockInfo");
                        setLocalQuotationProps("stockInfo",backdata);
                    }
                    callback(backdata,true);
                }
            });
        }else{
            callback(data,false);
        }
    });
}

function refreshHtml(data){
    reloadData(data,function(result,success){
        if(success){
            //此result的数据结构同本地存储中的数据结构
            var el = $('#thelistQuotation');
            el.find("li").each(function(){
                var li = $(this);
                var obj = li.attr("data-value");
                var url = li.attr("data-url");
                if(obj&&obj!=""){
                    var spanChar = li.find(".char span");
                    var spanMid =  li.find("span.mid");
                    var spanLast = li.find("span.last");
                    var data = result[obj];
                    if(!data) return;
                    var name = getStrByNum(data.stkName,6);
                    var updnratio = data.updnratio;
                    //设置名称
                    if(name && name!=spanChar.html()){
                        spanChar.html(name);
                    }
                    if(data.price && data.price.length > 0){
                    	var len = 2;
                    	if(data.price.indexOf(".") > 0){
                    		len = data.price.substring(data.price.indexOf(".")+1).length;
                    	}
                    	if(!len || len < 2)len = 2;
                        var price = parseFloat(data.price).toFixed(len);
                        if( price && price.length>0 && price!=spanMid.html()){
                            spanMid.html(price);
                        }
                    }
                    //设置涨跌幅样式
                    if(updnratio && updnratio.length >0 && updnratio!=spanLast.html()){
                        if(updnratio.substring(0,1)=="+"){
                            spanLast.attr("class","num last up");
                        }else if(updnratio.substring(0,1)=="-"){
                            spanLast.attr("class","num last down");
                        }else{
                            spanLast.attr("class","num last");
                        }
                        spanLast.html(updnratio);
                    }
                }
            });
            //获取数据成功，记录获取数据时间，并缓存当前数据
            var date = new Date();
            var dateStr = date.format("MM/dd HH:mm:ss");
            setLastRefresh(dateStr);
        }
        //计算ul的距离
        myScrollQuotation.refresh();
        var lastRefresh = getLastRefresh();
        if(lastRefresh && lastRefresh.length > 0){
            $("#lastRefresh").html("最后刷新时间：" + lastRefresh);
        }
    });
}

function getLastRefresh(){
    return getLocalQuotationProps("lastRefresh");
}

function setLastRefresh(o){
    if(o){
        setLocalQuotationProps("lastRefresh",o);
    }
}

function setNonStockHtml(el){
    if(el){
        var height = $("#"+quotationIndexBody).outerHeight() - 57;
        html = '<div class="gw-no-query non-bottom" style="height:'+height+'px">' +
            '<div class="gw-no-query-add">' +
            '<i><span>+</span></i><div>暂无股票 点击添加</div>' +
            '</div>'+
            '</div>';
        $(".quotationTitle").hide();
        el.html(html);
        //绑定事件
        $(".gw-no-query").bind("fastClick",function(){showQuotationQuery()});
    }
}