function createCplateBody(params) {
    pageId = params.pageId;
    var isResize = params.params.isResize;
    //滚动动画，
    animatingFun(params,function(){
        //如果页面没有创建过，重新创建
        if($("#"+cPlateMainBody).length == 0 || isResize){
            //创建主页面
            createContent(params,cPlateMainBody);
            //创建上部标题区域
            buildBlueHeader(cPlateTopTitleId,$("#"+cPlateMainBody));
            //创建上部标题内容
            createCplateTopTitle(cPlateTopTitleId);
            //刷新新闻列表部分
            refreshCplateNewsListData($("#"+cPlateMainBody));
        }else{
            //如果页面创建过 ，刷新头部
            refreshCPlateTitle();
        }
        //如果是从详文推送进入，直接跳转到详文页面
        if(localtionParams){
            setTimeout(function(){
                changePageByParams({pageId:"newsDetail",params:{callback:createNewsDetail}});
            },500);
        }
        //重新计算一下内容区域的高度
        var mainParContentHeight = $("#gw-mobile-main-cPlate").height();
        var topTitleHeight = $("#"+cPlateTopTitleId).height()+2;
        $("#"+cPlateMainBody).css("height",(mainParContentHeight - topTitleHeight) + "px");
        $("#"+cPlateMainBody + " .wrapperStyle").css("height",(mainParContentHeight - topTitleHeight) + "px");
        if(lists){
            lists.refreshDom();
        }
//        绑定resize事件
        $(window).unbind("resize");
        $(window).resize(function(){
            var isExpand = reSetMainContent();
            if(pageId != "cPlateIndex" || !isExpand){
                return;
            }
            $("#gw-mobile-main-cPlate").css("height",(bodyHeight - $(".ui-gw-bottomHeader").height())+"px")
            $("#gw-mobile-main-cPlate").css("width",bodyWidth);
            var mainParContentHeight = $("#gw-mobile-main-cPlate").height();
            var mainParContentWidth = $("#gw-mobile-main-cPlate").width();
            var topTitleHeight = $("#"+cPlateTopTitleId).height();
            $("#"+cPlateMainBody).css("height",(mainParContentHeight - topTitleHeight) + "px");
            $("#"+cPlateMainBody).css("width",(mainParContentWidth) + "px");
            $("#"+cPlateMainBody + " .wrapperStyle").css("height",(mainParContentHeight - topTitleHeight) + "px");
            $("#"+cPlateMainBody + " .wrapperStyle").css("width",(mainParContentWidth) + "px");
            if(lists){
                lists.refreshDom();
            }
        });
    });

}

/**
 * 盘中特供页面标题id
 * @type {string}
 */
var cPlateTopTitleId = "cPlateMainTitle";
/**
 * 盘中特供页面内容部分
 * @type {string}
 */
var cPlateMainBody = "cPlateMainBody";
/**
 * 子页面是否显示loading
 * @type {boolean}
 */
var isNotShowLoading = false;