function dom_init(isResize) {
    try{
        //记录当前页面值
        pageId = "navigation";
        //屏幕高度
        bodyHeight = $(window).height();
        //屏幕宽度
        bodyWidth = $(window).width();
//        getLoadCfg(function(){
            //重新设置body的大小
            $(document.body).css("height",bodyHeight);
            $(document.body).css("width",bodyWidth);
            //随机抽取一张滚动图片
            rollingPicNum = parseInt(Math.random()*8);
            //绑定底部标题点击事件
            bindBottomTitleEvn();
            //首先显示新闻首页
            $("#gw-mobile-main-cPlate").css("width","100%");
            var href = window.location.href;
            var paramArr = href.split("?");
            if(paramArr.length > 1){
                getNewsParamsByLocaltion(function(newsParams){
                    //给全局新闻参数赋值
                    localtionParams = newsParams;
                    //跳转到特供页面，然后直接跳转到详文页面
                changePageByParams({pageId:"cPlateIndex",params:{callback:createCplateBody,isResize:isResize}});
                });
            }else{
                //默认跳转到特供页面
                changePageByParams({pageId:"cPlateIndex",params:{callback:createCplateBody,isResize:isResize}});
            }
            setTimeout(function(){
                //检查版本
                checkVersions("loading");
            },100);
//        });
    }catch(e){
        console.log(e.message);
    }
}
/**
 * 窗口大小调整时，重新设置高度
 */
function reSetMainContent(){
    var isExpand = false;
    var newBodyHeight = $(window).height();
    var newBodyWidth = $(window).width();
    if(newBodyHeight > bodyHeight && newBodyHeight <= screenYdp){
        //当新高度大于原来的高度，并且小于等于屏幕高度
        bodyHeight = newBodyHeight;
        $("#gw-mobile-content").css("height",bodyHeight);
        isExpand = true;
    }
    if(newBodyWidth > bodyWidth && newBodyWidth <= screenXdp){
        //当新高度大于原来的宽度度，并且小于等于屏幕宽度度
        bodyWidth = newBodyWidth;
        $("#gw-mobile-content").css("width",newBodyWidth);
        isExpand = true;
    }
    return isExpand;
}
/**
 * 获取基本参数
 */
function getLoadCfg(callBack){
    if(window.plugins){
        window.plugins.storagePlugin.loadCfg(function(params){
            postUrl = params.host;
            versionNumber = params.versionNumber;
            //高度分辨率
            if(params.screenHeight){
                platHeightPixels = params.screenHeight;
            }
            //宽度分辨率
            if(params.screenWidth){
                platWidthPixels = params.screenWidth;
            }
            //屏幕宽度
            if(params.xdp){
                screenXdp = params.xdp;
            }
            //屏幕宽度
            if(params.ydp){
                screenYdp = params.ydp;
            }
            //状态栏高度
            if(params.statusBarHeight){
                statusBarHeight = params.statusBarHeight;
            }
            callBack();
        });
    }
}
/**
 * window localtion的参数
 */
var localtionParams;
function getNewsParamsByLocaltion(callBack){
    var newsParams = {
        newsTitle : "",
        newsCode : "",
        newsType :"",
        newsContent : "",
        newsSource : "",
        entryTime : "",
        topTitle : ""
    };
    var href = window.location.href;
    var paramArr = href.split("?")[1].split("&");
    if(paramArr.length > 2){
        for(var i=0;i<paramArr.length;i++){
            if(paramArr[i].indexOf("newsCode") >=0){
                newsParams.newsCode = paramArr[i].split("=")[1];
            } else if(paramArr[i].indexOf("title") >=0){
                newsParams.newsTitle = decodeURI(decodeURI(paramArr[i].split("=")[1]));
            } else if(paramArr[i].indexOf("newsType") >=0){
                newsParams.newsType = paramArr[i].split("=")[1]
            } else if(paramArr[i].indexOf("newsContent") >=0){
                newsParams.newsContent = paramArr[i].split("=")[1]
            } else if(paramArr[i].indexOf("newsSource") >=0){
                newsParams.newsSource = decodeURI(decodeURI(paramArr[i].split("=")[1]));
            } else if(paramArr[i].indexOf("entryTime") >=0){
                newsParams.entryTime = paramArr[i].split("=")[1]
            } else if(paramArr[i].indexOf("topTitle") >=0){
                newsParams.topTitle = decodeURI(decodeURI(paramArr[i].split("=")[1]));
            }
        }
        callBack(newsParams);
    }else{
        for(var i=0;i<paramArr.length;i++){
            if(paramArr[i].indexOf("newsCode") >=0){
                newsParams.newsCode = paramArr[i].split("=")[1];
            } else if(paramArr[i].indexOf("newsType") >=0){
                newsParams.newsType = decodeURI(decodeURI(paramArr[i].split("=")[1]));
            }
        }
        var url = getFullUrl("sys/news/find");
        var params = {
            id:newsParams.newsCode
        };
        //根据参数，去查询新闻的详细信息
        getAjaxDataByGet(url,params,function(result){
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
                    var tempNewsInfo = datasArr[0];
                    newsParams.newsTitle = tempNewsInfo.nTitle;
                    newsParams.newsCode = tempNewsInfo.id;
                    newsParams.newsType = tempNewsInfo.cate_ws;
                    newsParams.newsContent = tempNewsInfo.nContent;
                    newsParams.newsSource = tempNewsInfo.nResource;
                    newsParams.entryTime = tempNewsInfo.EntryTime;
                    newsParams.topTitle = getNewsTypeByStr(newsParams.newsType);
                    callBack(newsParams);
                }
            }else{
                callBack(newsParams);
            }
        })
    }

}
/**
 *绑定底部标题切换的时间
 */
function bindBottomTitleEvn(){
    //根据点击的底部的id，跳转到相应的页面
    $('.ui-gw-bottomHeader-column').each(function(){
        var $targetObj = $(this);
//        touchEventWithoutMove($targetObj,function(e){
        var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            START_EV = hasTouch ? 'touchstart' : 'mousedown';
        $targetObj.bind(START_EV,function(e){
            e.preventDefault();
            e.stopPropagation();
            var evn = $(e.target);
            if(evn[0].tagName != "DIV"){
                evn = evn.parent();
            }
            changeMainPage(evn[0].id);
//            //移动底部动画
//            var length = $targetObj.offset().left;
//            var selectPos = $('.ui-gw-bottomHeader-select').offset().left;
//            if(length != selectPos){
//                //根据id，切换页面
//                $('.ui-gw-bottomHeader-select').transition({x:length+"px"},50);
//            }
        })
    })
}
/**
 * 主页面的四个content和对应的title
 * @type {Array}
 */
var mainContentAndTitleArr = [
    {title:"bottomCharacteristicPlate",content:"gw-mobile-main-cPlate",pageId:"cPlateIndex",callback:createCplateBody},
    {title:"bottomSelfSockets",content:"gw-mobile-main-stock",pageId:"quotationIndex",callback:createQuotationBody},
    {title:"bottomMarkets",content:"gw-mobile-main-market",pageId:"marketIndex",callback:createMarketsIndex},
    {title:"bottomSetUp",content:"gw-mobile-main-setUp",pageId:"setUpIndex",callback:createSetUpBody}
];
/**
 *
 * @param titleId
 */
function changeMainPage(contentId){

    var tempParams = {pageId:"",params:{}}
    var mainContentId;
    //如果当前页面是显示的，直接return
    if($("#"+contentId).hasClass("selected")){
        return;
    }
    if(contentId != ''){
        for(var i=0;i<mainContentAndTitleArr.length;i++){
            var tempParam = mainContentAndTitleArr[i];
            if(tempParam.title == contentId){
                tempParams.pageId = tempParam.pageId;
                tempParams.params.callback = tempParam.callback;
                mainContentId = tempParam.content;
                $("#"+tempParam.content).css("width",(bodyWidth+"px"));
                $("#"+tempParam.title).addClass("selected");
            }else{
                $("#"+tempParam.content).css("width","0px");
                $("#"+tempParam.title).removeClass("selected");
            }
        }
    }
    //如果div中没有内容，执行changePage
    changePageByParams(tempParams);
}
