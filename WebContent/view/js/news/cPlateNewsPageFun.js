/**
 * 在内存中存放我的提醒
 * @type {string}
 */
var cPlateRemindStuatus = "";
/**
 * 创建盘中特供上部标题部分
 */
function createCplateTopTitle(cPlateTopTitleId){
    var myRemindTitle = "添加提醒";
    //首先判断用户是否登录
    var userInfo = getCurrentUserInfo();
    //如果未登录，显示直接显示添加提醒
    if(userInfo == ""){
        createCplateTitleBody(myRemindTitle,cPlateTopTitleId);
    }else {
        createCplateTitleBody("",cPlateTopTitleId);
        //如果登陆的话，去缓存中获取盘中特供的存储状态
        getAllMyRemindList(function(result){
            var isRemindOn = false ;
            //首先判断我的提醒有没有，如果有的话就显示为提醒
            if(result){
                for(var i=0;i<result.length;i++){
                    var tempReminds = result[i];
                    if(tempReminds.stockCode == ""){
                        isRemindOn = true;
                    }
                }
            }
            if(isRemindOn){
                myRemindTitle = "取消提醒";
            }
            $("#"+cPlateTopTitleId+" .ui-gw-header-addRemind").html(myRemindTitle);
        });
    }
}
/**
 * 刷新首页头部
 */
function refreshCPlateTitle(){
    var myRemindTitle = "添加提醒";
    var userInfo = getCurrentUserInfo();
    //判断是否登录
    if(userInfo == ""){
        //如果未登陆，直接替换成添加提醒
        $("#"+cPlateTopTitleId+" .ui-gw-header-addRemind").html(myRemindTitle);
    }else{
        //如果登陆的话，去缓存中获取盘中特供的存储状态
        getAllMyRemindList(function(result){
            var isRemindOn = false ;
            //首先判断我的提醒有没有，如果有的话就显示为提醒
            if(result){
                for(var i=0;i<result.length;i++){
                    var tempReminds = result[i];
                    if(tempReminds.stockCode == ""){
                        isRemindOn = true;
                    }
                }
            }
            if(isRemindOn){
                myRemindTitle = "取消提醒";
            }
            $("#"+cPlateTopTitleId+" .ui-gw-header-addRemind").html(myRemindTitle);
        });
    }
}

/**
 * 创建标题部分，并绑定事件
 */
function createCplateTitleBody(myRemindTitle,cPlateTopTitleId){
    var html = "";
    html += '<div class="ui-gw-header-leftBtn">' +
        '<div class="ui-gw-header-addRemind">'+ myRemindTitle +'</div>' +
        '</div>' +
        '<div class="ui-gw-header-title">' +
        '<div class="ui-gw-header-logo"><img src="../../images/pztg_logo.png" alt="" /></div>' +
        '</div>';
    if($("#"+cPlateTopTitleId).length > 0){
        $("#"+cPlateTopTitleId).html(html);
    }else if($(".ui-gw-header").length>0){
        $(".ui-gw-header").html(html);
    }
    //绑定添加提醒按钮事件,流出渲染时间
//    $(".ui-gw-header-addRemind").bind("click",function(){
    touchEventWithBackShadow($("#"+cPlateTopTitleId+" .ui-gw-header-addRemind"),function(){
        //先要判断是否是登陆状态
        var userInfo = getCurrentUserInfo();
        var userName = "";
        if(userInfo != ""){
            userName = userInfo.split(";")[0];
        }
        var text =  $(".ui-gw-header-addRemind").text();
        if(text == "取消提醒"){
            //取消提醒，则是在登陆状态，直接调用删除提醒
            var cancleValue = [{
                'userId':userName,
                'stockCode':"",
                'newsCat':"tnwpztg"
            }];
            removeMyRemindByTypeAndId(cancleValue,function(result){
                if(result && result == "success"){
                    //将显示值改为添加提醒
                    $(".ui-gw-header-addRemind").text("添加提醒");
                }
            });
        }else {
            var saveValue = [{
                'userId' : userName,
                'stockCode' : "",
                'title' : "盘中特供",
                'newsCat' : "tnwpztg"
            }];
            if(userInfo != ""){
                //登陆状态，直接保存
                saveMyRemindList(saveValue,function(result){
                    if(result && result != "error"){
                        //改变显示名称
                        $(".ui-gw-header-addRemind").text("取消提醒");
                    }
                });
            }else {
                createLoadingInfo(function(userNow){
                    if(userNow != "cancle" && userNow != "timeout"){
                        saveValue[0].userId = userNow.split(";")[0];
                        //登陆成功
                        saveMyRemindList(saveValue,function(result){
                            if(result && result != "error"){
                                //改变显示名称
                                $(".ui-gw-header-addRemind").text("取消提醒");
                            }
                        });
                    }
                });
            }
        }
    });
}
var lists;
/**
 * 刷新新闻列表部分
 */
function refreshCplateNewsListData($newsList){
    //判断内存中数据的长度
    //初始化的数据，去缓存中取,如果内存中有的话 应该是拿内存中的
    var newsList = getListFromLocalStorageById(cPlatestorageId);
    //首先创建表格头部部分，及绑定事件
    var options = createCPlateWrapper();
    lists = new NewsTitleList.List($newsList,getNewsCplateDatasByType,cPlateISrollY,function(startY){
        //重新设置内存中开始位置
        cPlateISrollY = startY;
    },options);
    //然后调用pullDown方法，将数据放到上面
    lists.initData(reSetCplateNewsList(newsList));
    //如果内存中有数据的话，则不去取值
    if(cPlateNewsList.length == 0){
//        //首先给一个loading图标
//        showNewsLoading($newsList);
        setTimeout(function(){
            lists.pullDownAction(true);
        },100);
    }
    //绑定事件，如果移动的话，就不触发
    touchEventWithoutMove($(".ui-gw-topnews"),function(){
        var realtimeParams = {pageId:"realtimeOb",params:{
            callback:createRealTimeObservatioin
        }};
        changePageByParams(realtimeParams);
    });
    setTimeout(function(){
        //设置顶部滚动区域标题内容
        getCplateRollingNewsTitles(function(result){
            createCPlateRollingTitle(result);
        });
    },100);
    //每三分钟执行一次
    setInterval(function(){
        //设置顶部滚动区域标题内容
        getCplateRollingNewsTitles(function(result){
            createCPlateRollingTitle(result);
        });
    },3*60*1000);
}
function lazyLoadImg(){
    $(".ui-specialNews-thumb").each(function(){
        var picUrl =  $(this).attr("picUrl");
        if(picUrl && picUrl != ""){
            $(this).attr("src",picUrl);
            $(this).attr("picUrl","");
        }
    });
}
/**
 * 设置顶部标题滚动
 */
function createCPlateRollingTitle(rollingNewsTitles){
    var html = "";
    for(var i=0;i<rollingNewsTitles.length;i++){
        html += '<div>';
        html += rollingNewsTitles[i];
        html += '</div>';
    }
    $(".ui-gw-topnews-list").html(html);
    //绑定这边区域的滚动事件
    $('.ui-gw-topnews-list').wrapInner('<div class="ui-gw-topnews-list-inner">');
    setTimeout(function(){
        setIntervalEvn();
    },300);
}
var picInterval;
var titleInterval;
/**
 * 等页面元素创建完成之后，在创建定时任务
 */
function setIntervalEvn(){
    if(picInterval){
        clearInterval(picInterval);
    }
    if(titleInterval){
        clearInterval(titleInterval);
    }
    picInterval = setInterval('autoScroll(".ui-gw-topnews-list div.ui-gw-topnews-list-inner")', 10000);
    //每三小时换一下底色
    var imgArr = ["../../images/0.jpg","../../images/1.jpg","../../images/2.jpg","../../images/3.jpg","../../images/4.jpg","../../images/5.jpg",
        "../../images/6.jpg","../../images/7.jpg"];
    titleInterval = setInterval(function(){
        if(pageId == "news/characteristicPlate.html"){
            //当前显示的动画
            var  picNowNum = rollingPicNum;
            do{
                var temoRollingNum = parseInt(Math.random()*8);
                rollingPicNum = temoRollingNum;

            }while(picNowNum == temoRollingNum);

            var nextImgUrl = "url("+ imgArr[rollingPicNum] +")";

            $('#imgRolling')[0].style.backgroundImage = nextImgUrl;
        }
    },3*60*60*1000);
}
var rollingTitlePos = 0;
/**
 * 顶部标题滚动方法
 * @param obj
 * @constructor
 */
function autoScroll(obj) {
    if(pageId == "cPlateIndex"){
        if($(".ui-gw-topnews-list div.ui-gw-topnews-list-inner").length>0){
            var tempObj = $(".ui-gw-topnews-list div.ui-gw-topnews-list-inner");
            tempObj.stop();
            tempObj.animate({
                marginTop: "-30px"
            }, 300, function () {
                if($(".ui-gw-topnews-list div.ui-gw-topnews-list-inner").length>0){
                    $(".ui-gw-topnews-list div.ui-gw-topnews-list-inner").css({ marginTop: "0px" }).find("div:first").appendTo(this);
                }
            });
        }
    }
}
/**
 * 创建盘中特供的滚动区域
 */
function createCPlateWrapper(){
    //首先强制改变wrapper容器的顶部和底部
    var wrapperId = "wrapperStockNews"+(new Date()).getTime();
    var scrollerId = "scrollerStockNews"+(new Date()).getTime();
    var pullDownId = "cPlatePullDown";
    var pullUpId = "cPlatePullUp";
    var html = '';
    //创建id为wrapperId的列表
    html += '<div  class="wrapperStyle" id="'+ wrapperId + '">' +
        '<div  id="'+ scrollerId + '">' +
        '<div id="'+ pullDownId +'" class="pullDown">'+
        '<span class="pullDownIcon"></span> <span class="pullDownLabel"></span>'+
        '</div>';
    var bodyWidth = $(document.body).width();
    var imgHeight = parseInt(bodyWidth*(255/720))+"px";
    //创建非动态添加列表区域
    html += '<div class="ui-gw-topnews" style="height: '+ imgHeight +'">' +
        '<div class="ui-gw-topnews-img">' +
        '<div id="imgRolling" style="background-image:url(../../images/'+ rollingPicNum +'.jpg)"></div>'+
        '</div>' +
        '<div class="ui-gw-topnews-title">实时观察</div>'+
        '<div class="ui-gw-topnews-list">' +
        '</div>'+
        '</div>';
    html +='<ul class="ui-specialNews-list"></ul>'+
        '<div id="'+ pullUpId +'" class="pullUp">'+
        '<span class="pullUpIcon"></span><span class="pullUpLabel"></span>'+
        '</div>'+
        '</div>' +
        '</div>';
    var returnData = {};
    returnData.html = html;
    returnData.wrapperId = wrapperId;
    returnData.scrollerId = scrollerId;
    returnData.isOnlyScroll = false;
    returnData.evnClick = _bindCPlateListsEvn;
    returnData.pullDownId = pullDownId;
    returnData.pullUpId = pullUpId;
    returnData.createById = true;
    return returnData;
}
/**
 *
 * @private
 */
function _bindCPlateListsEvn(e){
    var evn = $(e.target);
    var cell;
    var row;
    for(var i=0;i<5;i++){
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
    //跳转到新闻详细页面
    if(row && row.attr('data-url') != '' && row.attr('data-url') != undefined){
        //将点过的新闻id放到内存中，然后再存到缓存中
        saveAllClickedNewsId(row.attr('id'));
        lists.stopIscroll();
        //将本节点加一个点击过得class
        row.addClass("touchedLi");
        row.addClass("clickedLi");
        //获取新闻参数
        var newsParam = getNewsParamByIdAndType(row.attr('id'),cPlatestorageId);
        //根据参数，创建详文页面
        setTimeout(function(){
            changePageByParams(newsParam);
        },100);
        //跳转到详文页面
//        changePage(row.attr('data-url'));
    }
    if (self.fastClick) {
        // handler will return true if the event was handled
        if (self.fastClick(e, row, cell)) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
}
/**
 * 放到缓存中的id
 * @type {string}
 */
var cPlatestorageId = "dzhjpzx_characteristicPlate";
/**
 * 根据所传类型来判断数据是向上取还是向下取
 * @param type up是向上取值，down是向下取值
 * @return 返回请求结果
 */
function getNewsCplateDatasByType(type,callBack,isFirstTime){
    //新闻请求参数，默认取前20条，往下取的话，就按内存后面的取
    var url = getFullUrl("sys/full/news");
    var datas = {keys:"tnwpztg,tnwkqs,tnwdj,tnwyzkpq,tnwsdyj,tnwssdp,tnwtzzbc,tnwmslj,tnwqttg",_limit:"0,20",_begin:"",_end:""};
    var refeshLiParams = {type:type,isRefreshLi:isFirstTime,isRefreshData:true};
    if(cPlateNewsList.length == 0){
        //如果内存中的数据位空的话
        refeshLiParams.type = "up";
        refeshLiParams.isRefreshLi = true;
        isFirstTime = true;
        type = "up";
    }
    if(type != "up"){
        if(cPlateNewsList.length > 0){
            datas._limit = ''+cPlateNewsList.length+",20";
        }
    }
    if(type == "up"){
        datas._begin = cPlateBeginTime;
    }else{
        datas._end = cPlateEndTime;
    }
    //发送ajax请求获取参数
    getAjaxDataByGet(url,datas,function(result){
        hideNewsLoading();
        var newDatasArr = [];
        var reFreshData = false;
        //默认新闻是倒序排列的
        if(result && result.result && result.result.datas && result.result.datas.length>0){
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
                var newDatas = removeSameNewsIdData(datasArr,cPlateNewsList,"cPlate",function(){
                    //有相同id的新闻，重新刷新列表
                    reFreshData = true;
                });
                if(newDatas.length > 0){
                    newDatasArr = [].concat(newDatas);
                    //如果有返回值，根据取值方向，把数据放到内存中去
                    if(type == "up"){
                        cPlateNewsList = [].concat(newDatas,cPlateNewsList);
                    }else {
                        cPlateNewsList = [].concat(cPlateNewsList,newDatas);
                    }
                    cPlateBeginTime = cPlateNewsList[0].EntryTime;
                    cPlateEndTime = cPlateNewsList[cPlateNewsList.length - 1].EntryTime;
                    //更新缓存中的值，每次取内存中的前20条放到缓存中，不够的话，有多少算多少
                    setNewListIntoLocalStorage(cPlateNewsList,cPlatestorageId);
                }
            }
        }
        if(type == "up" && !isFirstTime){
            //第一次的话，倒序排序
//            newDatasArr.reverse();
        }
        if(reFreshData){
            callBack(reSetCplateNewsList(cPlateNewsList),refeshLiParams);
        }else{
            refeshLiParams.isRefreshData = false;
            callBack(reSetCplateNewsList(newDatasArr),refeshLiParams);
        }
    })
}
/**
 * 重新设置头条的新闻列表
 * @param result
 */
function reSetCplateNewsList(result){
    //将数据变成html对象，然后返回
    var html = '';
    for(var i=0;i<result.length;i++){
        var turnUrl = "../news/newsDetail.html?newsCode=";
        var termData = {id:'',title:"",time:"",url:"",sources:"",picUrl:"",cate_ws:"",memo:""};
        termData.title = reSetNewsTitleList(result[i].nTitle);
        termData.time = result[i].EntryTime;
        termData.cate_ws = result[i].cate_ws;
        termData.sources = result[i].nSource;
        termData.id = result[i]["id"];
//        turnUrl += termData.id + "&title="+termData.title+"&newsType="+result[i].cate_ws +
//            "&newsContent=" + result[i].nContent + "&newsSource="+result[i].nSource + "&entryTime="+result[i].EntryTime+
//            "&topTitle="+result[i].nChannel;
        termData.url = turnUrl;
        termData.memo = result[i].memo;
        var picUrl = result[i].nLink;
//        new Image()
        if(picUrl&& picUrl != ""){
            termData.picUrl = getFullUrl("") + result[i].nLink.replace("/","").replace("/images","")+".100x10000.png";
        }
        html += createCplateLiByData(termData);
    }
    setTimeout(function(){
        lazyLoadImg();
    },500)
    return html;
}

/**
 * 获取顶部滚动新闻标题
 * 目前是每次进到特供页面都会去请求一次
 */
function getCplateRollingNewsTitles(callBack){
    var url = getFullUrl("sys/full/news");
    var datas = {keys:"stock59",_limit:"0,3"};
    getAjaxDataByGet(url,datas,function(result){
        var titlesArr = [];
        if(result && result.result && result.result.datas && result.result.datas.length>0){
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
                for(var j=0;j<datasArr.length;j++){
                    var timeStr = reSetCplateTimeCount(datasArr[j].EntryTime,true);
                    titlesArr.push(timeStr + datasArr[j].memo);
                }
            }
        }
        callBack(titlesArr);
    })
}
/**
 * 创建列表对象
 * @param row
 * @returns {string}
 */
function createCplateLiByData(row){
    var title = row.title;
    var id = row.id;
    var time = reSetCplateTimeCount(row.time);
    var cateWs = row.cate_ws;
    var memo = row.memo;
    var url = row.url;
    var picUrl = row.picUrl;
    var defaultPic = "";
    var nChannel = "";
    nChannel = getNewsTypeByStr(cateWs);
    if(nChannel == "早班车"){
        picUrl = '../../images/morningMsg.jpg';
    }
    //判断是否点击过
    var isClicked = checkNewsIsClicked(id);
    //判断是否有图片
    var isHasPic = false;
    var newsImg;
    if(picUrl && picUrl != ""){
        defaultPic = '../../images/defaultPic.png';
        isHasPic = true;
    }
    var html = '<li';
    if(isClicked){
        //如果点击过，则显示被点击的状态
        html += ' class="clickedLi" '
    }
    html += ' id="'+id +'" data-url ="' + url +
        '">';
    html +='<div class="ui-specialNews';
    if(isHasPic){
        //如果有图片，则显示图片区域
        html += ' hasThumb'
    }
    html += '">';
    html += '<div class="ui-specialNews-content" id="'+"picPar_"+ id +'">' +
        '<div class="ui-specialNews-title">'+ title +'</div>'+
        '<div class="ui-specialNews-intro">'+ memo +'</div>';
    if(isHasPic){
        html += '<img class="ui-specialNews-thumb"src="'+ defaultPic +'" picUrl="'+ picUrl +'">';
    }
    html += '</div>';
    //底部时间和特供区域
    html += '<div class="ui-specialNews-meta">' +
        '<div class="ui-specialNews-time">'+ time +'</div>' +
        '<div class="ui-specialNews-tags"><span class="';
    //根据类型值，改变底色
    var naClass = "";
    if(nChannel == "特供"){
        naClass = "ui-specialNews-tags-a";
    } else if(nChannel == "独家"){
        naClass = "ui-specialNews-tags-b";
    } else if(nChannel == "快枪手"){
        naClass = "ui-specialNews-tags-c";
    } else {
        naClass = "ui-specialNews-tags-n";
    }
    html += naClass;
    html +='">'+ nChannel +'</span></div>';
    html += '</div>';

    html += '</div></li>';
    return html;
}
/**
 * 重新设置倒计时时间
 * @param timeString
 * @returns {string}
 */
function reSetCplateTimeCount(timeString,isRealTime){
    var dateString = timeString.substr(0, 4) + "/" + timeString.substr(4, 2) + "/" + timeString.substr(6, 2) + " " + timeString.substr(8, 2) + ":" + timeString.substr(10, 2) + ":" + timeString.substr(12, 2);
    var dateParam = new Date(dateString);
    //判断是不是今天
    var isToday = false;
    var dateToday = getAppointedDay(new Date());
    if(parseFloat(timeString) > parseFloat(dateToday+"000000")){
        isToday = true;
    }
    var returnString = "";
    if(isToday){
        //如果时间是今天，则显示今天+时：分
        var hour = (dateParam.getHours()< 10)?("0"+dateParam.getHours()):dateParam.getHours();
        var minutes = (dateParam.getMinutes() < 10)?("0"+dateParam.getMinutes()):dateParam.getMinutes();
        if(isRealTime){
            returnString += hour + ":" + minutes;
        }else{
            returnString += "今天 ";
            returnString += hour + ":" + minutes;
        }
    }else {
        //如果时间不是今天，则显示月，日
        var dateNews = getAppointedDay(dateParam);
        var month = dateNews.substr(4,2);
        var day = dateNews.substr(6,2);
        returnString = month + "月" + day + "日";
    }
    return returnString;
}