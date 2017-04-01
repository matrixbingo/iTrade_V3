/**
 * Created with JetBrains WebStorm.
 * User: longge0516
 * Date: 14-2-11
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */
(function($) {
    /**
     *创建滚动列表
     * @param $container 滚动容器
     * @param getDatasFun 获取数据方法
     * @param startY 初始滚动位置
     * @param selfHtml 自定义滚动布局
     * @param selfWrapperId  自定义滚动id
     * @param selfScrollerId 自定义滚动区域id
     * @constructor
     */
    function NewsTitleList($container,getDatasFun,startY,reSetYFun,selfData) {
        var self = this;
        var wrapperId = "wrapperNewsList"+(new Date()).getTime();
        var scrollerId = "scrollerNewsList"+(new Date()).getTime();
        var isOnlyScroll = false;
        var evnClick;
        var showScrollBar = false;
        var pullDownId;
        var pullUpId;
        var createById;
        var isHideLiShadow = false;
        var delayCreate = false;
        var isCloseTrans3D = false;
        /**
         * 初始化列表
         * 如果自定义的整体html存在的话，采用自定义的滚动区域设置
         * @param selfHtml
         */
        function init(){
            var html = "";
            if(selfData){
                //通过自定义的滚动id改变全局变量的值
                if(selfData.html && selfData.html != ""){
                    html = selfData.html;
                    wrapperId = selfData.wrapperId;
                    scrollerId = selfData.scrollerId;
                }
                if(selfData.isOnlyScroll){
                    isOnlyScroll = true;
                }
                if(selfData.evnClick){
                    evnClick = selfData.evnClick;
                }
                if(selfData.isHideLiShadow){
                    isHideLiShadow = true;
                }
                if(selfData.pullDownId){
                    pullDownId = selfData.pullDownId;
                }
                if(selfData.pullUpId){
                    pullUpId = selfData.pullUpId;
                }
                if(selfData.createById){
                    createById = selfData.createById;
                }
                if(selfData.delayCreate){
                    delayCreate = selfData.delayCreate;
                }
                if(selfData.isCloseTrans3D){
                   isCloseTrans3D = selfData.isCloseTrans3D;
                }
            }
            if(!html){
                html = '';
                //创建id为wrapperId的列表
                html += '<div  class="wrapperStyle" id="'+ wrapperId + '">' +
                    '<div  id="'+ scrollerId + '">' +
                    '<div id="pullDown" style="background-color: #F9F7F6">'+
                    '<span class="pullDownIcon"></span> <span class="pullDownLabel"></span>'+
                    '</div>'+
                    '<ul></ul>'+
                    '<div id="pullUp" style="background-color: #F9F7F6">'+
                    '<span class="pullUpIcon"></span><span class="pullUpLabel"></span>'+
                    '</div>'+
                    '</div>' +
                    '</div>';
            }
            $container.html(html);
            //重新设置wrapperId的高度,使滚动区域的高度和容器的高度一致
            var height = $container.height()-2;
            $("#"+wrapperId).css("height",height+"px");
            if(!evnClick){
//                $('#'+wrapperId+'').bind("fastClick", handleClick);
                touchEventWithoutMove($('#'+wrapperId+''),handleClick);
            }else {
                if(!isOnlyScroll){
                    touchEventWithoutMove($('#'+wrapperId+''),evnClick)
//                    $('#'+wrapperId+'').bind("fastClick",evnClick);
                }
            }
        }
        /**
         * 绑定内容区域的点击事件
         * @param e
         * @returns {boolean}
         */
        function handleClick(e) {
//            //首先储存myScroll的位置
//            reSetYFun(myScroll.startY);
            //首先找到li节点，最深在5层位置
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
                myScroll.stop();
                row.addClass("touchedLi");
                row.addClass("clickedLi");
                //删除 myScroll
                //延时跳转到详文页面，将touchedLi渲染到页面上
                setTimeout(function(){
                    var newsParam = getParamsByDataUrl(row.attr('id'));
                    //根据参数，创建详文页面
                    changePageByParams(newsParam);
                },100)
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
        function getParamsByDataUrl(newsId){
            if(!stockCode || stockCode ==""){
                return false;
            }
            var returnParams = {pageId:"newsDetail",params:{callback:createNewsDetail}};
            var tempStockNewsList = getSocketsNewsByObj(stockCode);
            for(var i=0;i<tempStockNewsList.length;i++){
                if(tempStockNewsList[i]["id"] == newsId){
                    for(var pro in tempStockNewsList[i]){
                        var paramName = ""
                        if(pro=="nTitle"){
                            paramName = "title";
                        }else if(pro=="id"){
                            paramName = "newsCode";
                        }else if(pro=="cate_ws"){
                            paramName = "newsType";
                        }else if(pro=="nContent"){
                            paramName = "newsContent";
                        }else if(pro=="nSource"){
                            paramName = "newsSource";
                        }else if(pro=="EntryTime"){
                            paramName = "entryTime";
                        }else if(pro=="nChannel"){
                            paramName = "topTitle";
                        }
                        returnParams.params[paramName] = tempStockNewsList[i][pro];
                    }
                }
            }
            //添加股票上部的标题部分
            var titleParam = "";
            if($("#"+ quotationDetailTitleId +" .ui-gw-header-stock-name").length>0){
                var stockName = $("#"+ quotationDetailTitleId +" .ui-gw-header-stock-name .name").html();
                var stockShortCode = $("#"+ quotationDetailTitleId +" .ui-gw-header-stock-name .number").html();
                titleParam = stockName + ":" + stockShortCode;
            }
            returnParams.params["stockTopTitle"] = titleParam;
            return  returnParams;
        }
        /**
         * 根据传入值，刷新列表数据
         * @param data
         */
        function initData(html) {
            if(html != ""){
                $('#'+scrollerId + ' ul').html(html);
            }
            if(isOnlyScroll){
                if( $container.hasClass("newsContentLoading")){
                    $container.removeClass("newsContentLoading");
                }
            }else {
                //绑定元素的鼠标移动颜色
                if(!isHideLiShadow){
                    setDomHoverColor($('#'+scrollerId + ' ul li'));
                }
            }
            if(!delayCreate){
                //创建Iscroll
                wrapScroll();
                // 刷新节点
                setTimeout(function(){
                    myScroll.refresh();
                },100)
            }
        }
        /**
         * 当有新数据来的时候，将最新的数据放在原来的列表前面
         * @param data
         */
        function refreshData(html,type,isFirstTime,isRefreshData) {
            //只有刷新的时候才去掉滚动条
            hideNewsLoading();
            if(html == "" ){
                myScroll.refresh();
            }else{
                var $wrapperUl = $('#'+scrollerId+' ul');
                if(isFirstTime || isRefreshData){
                    //第一次pullUp的话，清空原有数据
                    $wrapperUl.empty();
                }
                //新数据来时，将新的数据放在原来列表的前面
                if(isFirstTime || type == "down"){
                    $wrapperUl.append(html);
                } else {
                    $wrapperUl.prepend(html);
                }
                //绑定元素的鼠标移动颜色
                if(!isHideLiShadow){
                    setDomHoverColor($('#'+scrollerId + ' ul li'));
                }
                // 立即刷新
                setTimeout(function(){
                    myScroll.refresh();
                },300)
            }
        }

        /**
         * 创建滚动对象
         */
        var myScroll;
        /**
         * 绑定滑动事件
         */
        function wrapScroll() {
            if(myScroll){
                myScroll.destroy();
            }
           //创建滚动区域
            if(!isOnlyScroll){
//                var wrapperHeight = $("#"+wrapperId).height();
//                var scrollerHeight = $("#"+scrollerId).height();
//                var diffH = 0;
                //滚动区域总高度减去滚动固定区域高度 - 上次初始滚动的位置（startY为负值
//                if(lastPage != "newsDetail"){
//                    diffH = scrollerHeight - wrapperHeight + startY+40;
//                    if(diffH < 0){
//                        startY = 0;
//                    }
//                }
                var option = {y:startY};
                if(pullUpId){
                    option.pullUpId =  pullUpId;
                }
                if(pullDownId){
                    option.pullDownId = pullDownId;
                }
                myScroll = createChangeContentScroll(wrapperId,pullDownAction,pullUpAction,true,option,function(){
                    reSetYFun(myScroll.y);
                });
            }else {
            	var option = {}
            	 if(isCloseTrans3D){
                	 option.isCloseTrans3D = isCloseTrans3D;
                }
                //否则就创建只带滚动效果的myScroll
                myScroll = createChangeContentScroll(wrapperId,'','',false,option);
            }
        }
        /**
         * 向下拉时，请求新的数据
         */
        function pullDownAction(isFirstTime){
            var entryStr = getAppointedDay(entrySystemTIme);
            setTimeout(function(){
                //如果是今天第一次请求，清空所有的内存数据
                if(!checkVersionDate(entryStr)){
                    entrySystemTIme = new Date();
                    //清空新闻列表的内存
                    clearNewsListInMemory();
                }
                //取最新的值
                getDatasFun("up",function(html,refreshParams){
                    var type = refreshParams.type;
                    var isRefreshLi = refreshParams.isRefreshLi;
                    var isRefreshData = refreshParams.isRefreshData;
                    refreshData(html,type,isRefreshLi,isRefreshData);
                },isFirstTime);
            },100)
        }
        /**
         * 向上拉时，取缓存中的数据
         */
        function pullUpAction(){
            var entryStr = getAppointedDay(entrySystemTIme);
            setTimeout(function(){
                //如果是今天第一次请求，清空所有的内存数据
                if(!checkVersionDate(entryStr)){
                    entrySystemTIme = new Date();
                    //清空新闻列表的内存
                    clearNewsListInMemory();
                    myScroll.scrollTo(0,0);
                }
                //向下请求数据
                getDatasFun("down",function(html,refreshParams){
                    var type = refreshParams.type;
                    var isRefreshLi = refreshParams.isRefreshLi;
                    var isRefreshData = refreshParams.isRefreshData;
                    refreshData(html,type,isRefreshLi,isRefreshData);
                });
            },200)
        }
        init();
        /**
         * 手动刷新滚动区域
         */
        function refreshDom(){
            if(myScroll){
                myScroll.refresh();
            }
        }
        function delayCreateScroll(){
            // 刷新节点
            setTimeout(function(){
                if(myScroll){
                    return ;
                }
                //创建Iscroll
                wrapScroll();
                myScroll.refresh();
                myScroll.scrollTo(0,0.1,1);
            },200)
        }
        function getScrollY(){
            return myScroll.y;
        }
        function destoryIscroll(){
            if(myScroll){
                myScroll.destroy();
                myScroll = null;
            }
        }
        function stopIscroll(){
            if(myScroll){
                myScroll.stop();
            }
        }
        function refreshUseTransform(){
            if(myScroll){
                myScroll.useTransform = false;
                myScroll.refresh();
            }
        }
        function getMyScroll(){
            if(myScroll){
                return myScroll;
            }
        }
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        document.addEventListener('mousemove', function (e) {
            e.preventDefault();
        }, false);
//        document.addEventListener('touchmove', function (e) { e.preventDefault();}, false);
        // Public API
        $.extend(this, {
            // Events
            "fastClick":               null,
            "refreshDom":           refreshDom,
            "delayCreateScroll":         delayCreateScroll,
            // Methods
            "initData":          initData,
            "refreshData":       refreshData,
            "pullDownAction":    pullDownAction,
            "pullUpAction":      pullUpAction,
            "getScrollY":        getScrollY,
            "destoryIscroll":    destoryIscroll,
            "stopIscroll":    stopIscroll,
            "refreshUseTransform":    refreshUseTransform,
            "getMyScroll":    getMyScroll
        });
    };
    $.extend(true, window, {
        NewsTitleList: {
            List: NewsTitleList
        }
    });
}(jQuery));
