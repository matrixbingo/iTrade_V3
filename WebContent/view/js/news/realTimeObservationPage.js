function createRealTimeObservatioin(params) {
    //记录当前页面值
    pageId = params.pageId;
    //各种容器id
    //计算简介部分最多可以展示多少个汉字
    countWidthOfShowText();
    //创建2级页面部分
    createContent(params,realTimeContentId);
    //创建新闻详细的标题区域
    buildBlueHeader(realTimeObTitleId,$("#"+ realTimeContentId));
    //创建上部标题内容
    createRealTimeTitle(realTimeObTitleId);
    //创建Iscroll滚动
    createRealTimeWrapper($("#"+realTimeContentId));
    //初始化的数据，去缓存中取,如果内存中有的话 应该是拿内存中的
    var newsList = getListFromLocalStorageById(realTimeOstorageId);
    listsRealtime.initData(reSetRealTimeONewsList(newsList));
    var delayTime = 0;
    //如果内存中没有数据
    if(listsRealtime){
        if(!isFierstComeIn){
            //创建loading
            showNewsLoading($("#" + realTimeContentId));
            $(".ui-gw-header-refresh").addClass("loading");
            listsRealtime.pullDownAction(true);
            isFierstComeIn = true;
            delayTime = 300;
        }else{
            $(".ui-gw-header-refresh").addClass("loading");
            listsRealtime.pullDownAction();
        }
    }
    setTimeout(function(){
        animatingFun(params,function(){
            //        //页面滚动完成
            //        isRealTimePageRun = true;
            //如果缓存中有数据，表示应取值完毕了
            if(realTimeONewsList.length > 0){
                //关闭loading
                hideNewsLoading();
            }
        });
    },delayTime);
}
var isFierstComeIn = false;
//页面是否滚动完成
var isRealTimePageRun = false;
/**
 * 新闻详细的父容器
 * @type {string}
 */
var realTimeContentId = "realTime-vice-content"
/**
 * 实时观察页面的标题
 * @type {string}
 */
var realTimeObTitleId = "realTimeOb-title";
/**
 * 一行所占高度
 * @type {number}
 */
var fiveLineTextNumber = 0;
/**
 * 创建新闻上部标题部分
 */
function createRealTimeTitle(titleId){
    //从参数中获取传过来的新闻标题
    var html = '';
    html += '<div class="ui-gw-header-leftBtn">' +
        '<div class="ui-gw-header-backward"></div>' +
        '</div>' +
        '<div class="ui-gw-header-title">实时观察</div>' +
        '<div class="ui-gw-header-rightBtn">' +
        '<div class="ui-gw-header-refresh"></div>' +
        '</div>';
    //将内容填充到标题区域
    $("#"+titleId).html(html);
    //绑定回退按钮事件
    touchEventWithBackShadow($("#"+realTimeObTitleId+" .ui-gw-header-leftBtn"),function(){
        //返回上层页面
        gobackByParams();
    });
    //绑定刷新事件
    touchEventWithBackShadow($("#"+realTimeObTitleId+" .ui-gw-header-refresh"),function(){
        $(".ui-gw-header-refresh").addClass("loading");
        if(listsRealtime){
            //如果滚动事件存在，直接调用滚动事件的listUp函数,并且让图标旋转
            setTimeout(function(){
                listsRealtime.pullDownAction();
            },200)
        }
    })

}
var listsRealtime;
//先创建上部的滚动区域
function createRealTimeWrapper($newsList){
    var  options = createRealTimeWrapperParams();
    listsRealtime = new NewsTitleList.List($newsList,getRealTimeObservationDatasByType,realTimeIscrollY,function(startY){
        //重新设置内存中开始位置
//        realTimeIscrollY = startY;
    },options);

}

var scrollerId;
/**
 * 创建实时观察的头部滚动区域
 */
function createRealTimeWrapperParams(){
    var wrapperId = "wrapperStockNews"+(new Date()).getTime();
    scrollerId = "scrollerStockNews"+(new Date()).getTime();
    var pullDownId = "realTimePullDown";
    var pullUpId = "realTimePullUp";
    var html = '';
    //创建id为wrapperId的列表
    html += '<div  class="wrapperStyle" id="'+ wrapperId + '">' +
        '<div id="'+ scrollerId + '">' +
        '<div class="pullDown" id="'+ pullDownId +'">'+
        '<span class="pullDownIcon"></span> <span class="pullDownLabel"></span>'+
        '</div>';
    html +='<ul class="ui-timeObservation-list"></ul>'+
        '<div class="pullUp" id="'+ pullUpId +'">'+
        '<span class="pullUpIcon"></span><span class="pullUpLabel"></span>'+
        '</div>'+
        '</div>' +
        '</div>';
    var returnData = {};
    returnData.html = html;
    returnData.wrapperId = wrapperId;
    returnData.scrollerId = scrollerId;
    returnData.isHideLiShadow = true;
//    returnData.isOnlyScroll = false;
    returnData.evnClick = _bindRealTimeEvn;
    returnData.pullDownId = pullDownId;
    returnData.pullUpId = pullUpId;
    returnData.createById = true;
    return returnData;
}
/**
 * 详文的展开和收起事件
 * @private
 */
function _bindRealTimeEvn(e){
    var evn = $(e.target);
    var cell;
    var row;
    if($(e.target)[0].tagName == "SPAN" || $(e.target)[0].tagName == "I"){
        evn = evn.parent(); //父层div
        evn = evn.parent(); //带有class的div
    }
    if(evn.hasClass("ui-timeObservation-more")){
        //首先获取li的id
        for(var i=0;i<4;i++){
            if(evn.parent().length==0){
                break;
            }
            if(evn.parent()[0].tagName == "LI"){
                cell = evn;
                row = cell.parent();
                break;
            } else {
                evn = evn.parent();
            }
        }
        if(row && row.attr('id')!="" && row.attr('id') != undefined){
            var liId = row.attr('id');
            var parDiv = row.children();
            parDiv.toggleClass("expanded");
            var span = $("#"+liId +" .ui-timeObservation-more span");
            var type = "";
            if(parDiv.hasClass("expanded")){
                type = "show";
                //将按钮的文字变成收起
                span.html("收起");
            }else{
                type = "hide";
                //将按钮的文字变成展开
                span.html("展开");
            }
            var divId = "div_"+row.attr('id');
            //根据id和类型获取详文或者简介
            getMemoOrContent(row.attr('id'),type,function(result){
                $("#"+divId).html(result);
                //刷新列表
                listsRealtime.refreshDom();
            });
        }
    }
}
/**
 * 根据id和类型获取memo或者详文
 * @param id
 * @param type
 */
function getMemoOrContent(id,type,callBack){
    var memo = "";
    //从内存或者缓存中取出当前页面的新闻列表
    var nowNewsList = getListFromLocalStorageById(realTimeOstorageId);
    for(var i=0;i<nowNewsList.length;i++){
        if(nowNewsList[i].id == id){
            memo = nowNewsList[i].memo;
        }
    }
    if(memo != ""){
        var memoObject = checkTextLength(memo);
        if(type == "hide"){
            callBack(memoObject.shortContent);
        }else {
            callBack(memoObject.fullContent);
        }
    }
}
/**
 * 放到缓存中的id
 * @type {string}
 */
var realTimeOstorageId = "dzhjpzx_realTimeObservation";
/**
 * 根据所传类型来判断数据是向上取还是向下取
 * @param type up是向上取值，down是向下取值
 * @return 返回请求结果
 */
function getRealTimeObservationDatasByType(type,callBack,isFirstTime){
    //新闻请求参数，默认取前20条，往下取的话，就按内存后面的取
    var url = getFullUrl("sys/full/news");
    var datas = {keys:"stock59",_limit:"0,5",_begin:"",_end:""};
    var refeshLiParams = {type:type,isRefreshLi:isFirstTime};
    if(realTimeONewsList.length == 0){
        //如果内存中的数据位空的话
        refeshLiParams.type = "up";
        refeshLiParams.isRefreshLi = true;
        isFirstTime = true;
        type = "up";
    }
    if(type != "up"){
        if(realTimeONewsList.length > 0){
            datas._limit = ''+realTimeONewsList.length+",5";
        }
    }
    if(type == "up"){
        datas._begin = realTimeBeginTime;
    }else{
        datas._end = realTimeEndTime;
    }
    //发送ajax请求获取参数
    console.log(url);
    console.log(datas);
    getAjaxDataByGet(url,datas,function(result){
        if($(".ui-gw-header-refresh").hasClass("loading")){
            setTimeout(function(){
                $(".ui-gw-header-refresh").removeClass("loading");
            },300);
        }
        var newDatasArr = [];
        //默认新闻是倒序排列的
        if(result && result.result && result.result.datas &&result.result.datas.length>0){
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
                var newDatas = removeSameNewsIdData(datasArr,realTimeONewsList);
                if(newDatas.length > 0){
                    newDatasArr = [].concat(newDatas);
                    //如果有返回值，根据取值方向，把数据放到内存中去
                    if(type == "up"){
                        realTimeONewsList = [].concat(newDatas,realTimeONewsList);
                    }else {
                        realTimeONewsList = [].concat(realTimeONewsList,newDatas);
                    }
                    //更新新闻列表的前后时间
                    realTimeBeginTime = realTimeONewsList[0].EntryTime;
                    realTimeEndTime = realTimeONewsList[realTimeONewsList.length - 1].EntryTime;
                    //更新缓存中的值，每次取内存中的前5条放到缓存中，不够的话，有多少算多少
                    setNewListIntoLocalStorage(realTimeONewsList,realTimeOstorageId,5);
                }
            }
        }
        if(type == "up" && !isFirstTime){
            //第一次的话，倒序排序
//            newDatasArr.reverse();
        }
        //如果滚动完成
//        if(isRealTimePageRun){
        //关闭loading
        hideNewsLoading();
        //调用回调函数
        callBack(reSetRealTimeONewsList(newDatasArr),refeshLiParams);
//        }
    })
}
/**
 * 重新设置头条的新闻列表
 * @param result
 */
function reSetRealTimeONewsList(result){
    //将数据变成html对象，然后返回
    var html = '';
    for(var i=0;i<result.length;i++){
        var termData = {time:"",memo:"",id:""};
        termData.time = result[i].EntryTime;
        termData.memo = result[i].memo;
        termData.id = result[i]["id"];
        html += createRealTimeLiByData(termData);
    }
    return html;
}
/**
 * 创建列表对象
 * @param row
 * @returns {string}
 */
function createRealTimeLiByData(row){
    var id = row.id;
    var divId = "div_"+id;
    var memo = row.memo;
    var timeObject = reSetRealTimeCount(row.time);
    var isToday = timeObject.isToday;
    var time = timeObject.time;
    var date = timeObject.date;
    var memoObject = checkTextLength(memo);
    var isOver = memoObject.isOver;
    var shortContent = memoObject.shortContent;
    var fullContent = memoObject.fullContent;
    //判断是否点击过
//    var isClicked = checkNewsIsClicked(id);
    var html = '<li';
    if(isToday){
        html += ' class="newer" '
    }
    html += ' id="'+id +'" >';

    html += '<div class="ui-timeObservation">' +
        //内容区域
        '<div class="ui-timeObservation-detail" id="'+ divId +'">';
    if(!isOver){
        html += fullContent;
    }else {
        html += shortContent;
    }
    html +='</div>';
    //时间区域
    html += ' <div class="ui-timeObservation-time">';
    if(!isToday){
        html += '<div><span>'+date+'</span><span>'+time +'</span></div>';
    }else {
        html += '<div><span>'+time +'</span></div>';
    }
    html += '</div>';
    //展开区域，如果详文比较短，则不展示
    if(isOver){
        html += '<div class="ui-timeObservation-more"><div><span>展开</span><i></i></div></div>';
    }
    html += '</div></li>';
    return html;
}
/**
 * 先计算出能够展示
 */
function countWidthOfShowText(){
    if($("#countOneTextWidth").length > 0){
        $("#countOneTextWidth").html("");
    }else {
        //计算一个字占的宽度，目前的方案是建一个div，给它里面塞一个汉字
        $(document.body).append("<div id='countOneTextWidth' style='visibility:hidden;position:absolute;left:-9999px;top:-9999px;'></div>");
    }
    $("#countOneTextWidth").html("国");
    var oneTextWidth = $("#countOneTextWidth").width();
    var totalWidth = $(document.body).width() - 104;
    fiveLineTextNumber = parseInt(parseInt(totalWidth/oneTextWidth)*5);
    $("#countOneTextWidth").remove();
}

/**
 * 计算文本的宽度，如果文本内容超过最大长度，截取相应的字符
 * @param nContent
 */
function checkTextLength(nContent){
    var textObject = {
        isOver:false,
        shortContent:"",
        fullContent:""
    };
    textObject.fullContent = nContent;
    var tempContent = "";
    //首先将所有的<p></p>都替换掉
    tempContent = nContent.replaceAll("</p>","<br>")
    tempContent = tempContent.replaceAll("</P>","<br>")
    tempContent = tempContent.replaceAll("<P>","");
    tempContent = tempContent.replaceAll("<p>","");
    tempContent = tempContent.replaceAll("<P class=Para>","");
    tempContent = tempContent.replaceAll("<p class=Para>","");
    tempContent = tempContent.replaceAll("<u>","");
    tempContent = tempContent.replaceAll("</u>","");
//    var length = tempContent.length;
    var totalTextNum = 0;
    //计算
    for(var i=0;i<tempContent.length;i++){
        for(var j=0;j<tempContent[i].length;j++){
            if(tempContent[i].charCodeAt(j) > 255 ){
                totalTextNum += 2;
            }else {
                totalTextNum +=1
            }
        }
    }
    totalTextNum /= 2;
    if(totalTextNum > fiveLineTextNumber){
        //如果字数超出
        textObject.isOver = true;
        //截取fiveLineTextNumber汉字大小的空间
        var shortNum = 0;
        var textLength = 0;
        for(var j=0;j<tempContent.length;j++){
            for(var i=0;i< tempContent[j].length;i++){
                if(tempContent[j].charCodeAt(i) > 255){
                    shortNum +=2;
                }else {
                    shortNum +=1;
                }
            }
            if((shortNum/2) >= (fiveLineTextNumber-6) ){
                textLength = j;
                break;
            }
        }
        var shortString = tempContent.substr(0,textLength);
        //首先判断shortString中有几个换行，超过5个，取前五个
        var num = 0;
        var start = 0;
        var end = 0;
        var k=shortString.indexOf("<br>");
        while(k>-1)
        {
            num+=1;
            if(num == 4){
                start = k;
            }
            if(num == 5){
                end = k
            }
            k=shortString.indexOf("<br>",k+1);
        }
        //超过五个<br>，取前四个截取第五个
        if(num > 5){
            var tempNum = 0;
            if(((start+4+fiveLineTextNumber/5)-5) > end){
                tempNum = end;
            }else {
                tempNum = (start+4+fiveLineTextNumber/5)-5;
            }
            shortString = shortString.substr(0,tempNum);
        }
        //判断最后几位是否是<br>标签的一部分，检查最后四个字符，如果是<br>的一部分，直接删除
        for (var i = 0;i<4;i++){
            var tempString = shortString.slice(shortString.length-1);
            if(tempString.indexOf("<br>") >= 0 || tempString == " "){
                shortString = shortString.replace(tempString,"");
            }
        }
        shortString += "...";
        textObject.shortContent = shortString;
    }else {
        textObject.shortContent = nContent;
    }
    return textObject;
}

/**
 * 重新设置倒计时时间
 * @param timeString
 * @returns {string}
 */
function reSetRealTimeCount(timeString){
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
        var dateNews = getAppointedDay(dateParam);
        var month = dateNews.substr(4,2);
        var day = dateNews.substr(6,2);
        returnObject.date = month + "月" + day + "日";
    }
    return returnObject;
}