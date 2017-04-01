function createNewsDetail(newsParam) {
    //记录当前页面id
    pageId = newsParam.pageId;
    //重新设置页面id
    reSetNewsDetailContentIds(newsParam);
    //创建2级页面部分
    createContent(newsParam,newsDetailContentId);
    //创建新闻详细的标题区域
    buildBlueHeader(newsDetailTitleId,$("#"+ newsDetailContentId));
    //创建新闻详细的标题内容
    createNewsDetailTitle(newsDetailTitleId);
    //页面是否滚动完成
    isNewsDetailPageRun = false;
    //创建分享
    createSharePart($("#"+ newsDetailContentId));
    //创建页面Iscroll滚动
    createNewsDetailWrapper($("#" + newsDetailContentId));
    //获取参数
    getNewsParams(newsParam,function(){
        //设置顶部标题
        $("#"+newsDetailTitleId + " .ui-gw-header-title").html(topTitle);
        //先看看缓存中有没有数据，有的话直接赋值
        var storageId = "dzhjpzx_"+newsCode;
        var data = getDetailNewsFromLocalStorage(storageId);
        isNewsDone = false;
        var delayTime = 0;
        if(!data){
            //创建loading
            showNewsLoading($("#" + newsDetailContentId));
             delayTime = 100;
            //缓存中没有的话，动画开始之前就去取值
            getNewsDetailData(function(){
                bindImgChangeFun();
            });
        }else {
            var newContentDatas = createNewsDetailLiByData(data);
            if(newContentDatas && newContentDatas != ""){
                //渲染到页面上
                listDetail.initData(newContentDatas);
                //绑定图片事件
                bindImgChangeFun();
            }
            isNewsDone = true;
        }
        setTimeout(function(){
        	//动画完成之后再渲染页面内容
	        animatingFun(newsParam,function(){
	            //页面滚动完成
	            isNewsDetailPageRun = true;
	            //如果页面渲染完成的话直接关闭loading图标
	            if(!isNewsDone){
	                //将新闻的内容刷新到页面中
	                if(listDetail){
	                    //先去缓存中取值，缓存中有的话直接渲染到页面上
	                    var data = getDetailNewsFromLocalStorage(storageId);
	                    var newContentDatas = createNewsDetailLiByData(data);
	                    if(newContentDatas && newContentDatas != ""){
	                        //渲染到页面上
	                        listDetail.initData(newContentDatas);
	                        listDetail.delayCreateScroll();
	                        newsDetailScrollIds.push({contentId:newsDetailContentId,scrollObj:listDetail});
	                        //关闭loading
	                        hideNewsLoading();
	                        //绑定图片事件
	                        bindImgChangeFun();
	                    }
	                }
		        }else{
		                listDetail.delayCreateScroll();
		                newsDetailScrollIds.push({contentId:newsDetailContentId,scrollObj:listDetail});
		                //关闭loading
		                hideNewsLoading();
		         }
	        });
        }, delayTime);
    });
};
var newsDetailScrollIds = [];
/**
 *
 */
function reSetNewsDetailContentIds(params){
    var parContentId = params.params.content;
    var contentNum = parContentId.split("-")[parContentId.split("-").length - 1];
    newsDetailContentId = "newsDetail-vice-content-" + contentNum;
    newsDetailTitleId = "newsDetail-title-" + contentNum;
}
/**
 * 是否滚动完成
 * @type {boolean}
 */
var isNewsDetailPageRun = false;
var isNewsDone = false;
/**
 * 新闻详细的父容器
 * @type {string}
 */
var newsDetailContentId = "";
/**
 * 新闻详细页面的标题id
 * @type {string}
 */
var newsDetailTitleId = "";
//新闻的各种参数
var newsTitle = "";
var newsCode = "";
var newsType = "";
var newsContent = "";
var newsSource = "";
var entryTime = "";
var topTitle = "";
/**
 * 获取新闻的参数，如果
 */
function getNewsParams(newsParams,callBack){
    if(localtionParams){
        newsTitle = reSetNewsTitleList(localtionParams.newsTitle);
        newsCode = localtionParams.newsCode;
        newsType = localtionParams.newsType;
        newsContent = localtionParams.newsContent;
        newsSource = localtionParams.newsSource;
        entryTime = localtionParams.entryTime;
        topTitle = getNewsTypeByStr(newsType);
        if(topTitle == ""){
            topTitle = "资讯";
        }
        localtionParams = null;
    }else{
        var tempParams = newsParams.params;
        if(tempParams){
            newsTitle = reSetNewsTitleList(tempParams.title);
            newsCode = tempParams.newsCode;
            newsType = tempParams.newsType;
            newsContent = tempParams.newsContent;
            newsSource = tempParams.newsSource;
            entryTime = tempParams.entryTime;
            topTitle = getNewsTypeByStr(newsType);
            if(topTitle == ""){
                topTitle = "资讯";
            }
            if(tempParams.stockTopTitle && tempParams.stockTopTitle != ""){
                var stockName = tempParams.stockTopTitle.split(":")[0];
                var stockNumber = tempParams.stockTopTitle.split(":")[1];
                var html = '<div class="ui-gw-header-stock-name" style="height:100%;float: none;display: inline-block">' +
                    '<div class="name">'+ stockName +'</div>' +
                    '<div class="number">'+ stockNumber +'</div>' +
                    '</div>';
                topTitle = html;
            }
        }
    }
    if(newsContent != ""){
        callBack();
    }else{
        var url = getFullUrl("sys/news/find");
        var params = {
            id:newsParams.params.newsCode
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
                    newsTitle = reSetNewsTitleList(tempNewsInfo.nTitle);
                    newsCode = tempNewsInfo.id;
                    newsType = tempNewsInfo.cate_ws;
                    newsContent = tempNewsInfo.nContent;
                    newsSource = tempNewsInfo.nResource;
                    entryTime = tempNewsInfo.EntryTime;
                    topTitle = getNewsTypeByStr(newsType);
                    callBack();
                }
            }else{
                callBack();
            }
        })
    }
}
/**
 * 删除div已经不存在的Iscroller
 */
function removeNewsDetailScroller(){
    //删除div已经删除的iscroll
    for(var i=0;i<newsDetailScrollIds.length;i++){
        var tempContentId = newsDetailScrollIds[i].contentId;
        if($("#"+tempContentId).length == 0){
            newsDetailScrollIds[i].scrollObj.destoryIscroll();
            newsDetailScrollIds[i].scrollObj = null;
            newsDetailScrollIds.splice(i,1);
        }
    }
}
/**
 * 创建新闻详细的标题部分
 */
function createNewsDetailTitle(newsDetailTitleId){
    //获取缓存中设置的字体大小
    var fontSize = getDetailFontSize();
    var smallClass = "setFontSize-small";
    var bigClass = "setFontSize-big";
    if(fontSize == "small"){
        smallClass += " selected";
    }else {
        bigClass += " selected";
    }
    if(!topTitle){
        topTitle = ""
    }
    //从参数中获取传过来的新闻标题
    var html = '';
    html += '<div class="ui-gw-header-leftBtn"><div class="ui-gw-header-backward"></div></div>' +
        '<div class="ui-gw-header-title">'+ topTitle +'</div>' +
        '<div class="ui-gw-header-rightBtn">' +
        '<div class="ui-gw-header-setFontSize"><div class="'+smallClass+'">T</div><div class="'+bigClass+'">T</div></div>' +
        '</div>';
    //标题设置为空
    if($("#"+newsDetailTitleId).length > 0){
        $("#"+newsDetailTitleId).html(html);
    }
    setTimeout(function(){
        _bindNewsDetailEvn();
    },100);
}
function _bindNewsDetailEvn(){
    touchEventWithBackShadow($("#"+newsDetailTitleId+" .ui-gw-header-backward"),function(){
        gobackByParams();
    });
    //绑定切换字体大小事件
    touchEventWithBackShadow($("#"+ newsDetailTitleId +" .ui-gw-header-rightBtn"),function(){
        //切换大小字体的class
        $(".setFontSize-small").toggleClass("selected");
        $(".setFontSize-big").toggleClass("selected");
        $(".gw-mobile-newsDetail").toggleClass("fbig");
        var smallSize = $(".setFontSize-small").hasClass("selected");
        if(smallSize){
            setDetailFontSize("small");
        }else {
            setDetailFontSize("big");
        }
        //刷新滚动区域
        if(listDetail){
            listDetail.refreshDom();
        }
    })
}

var listDetail;
/**
 * 创建Iscroll滚动
 * @param $container
 */
function createNewsDetailWrapper($container){
    listDetail = null;
    //根据返回的值，创建新闻列表
    var selfData = createNewsDetailContent();
    listDetail = new NewsTitleList.List($container,"",0,function(){},selfData);
}

/**
 * 绑定图标点击事件
 */
function bindImgChangeFun(){
    //绑定超链接事件
    if($("#"+newsDetailContentId +" a").length>0){
        $("#"+newsDetailContentId +" a").bind("fastClick",function(){
            var dataType = $(this).attr("data-type");
            //先判断是不是股票的跳转
            if(dataType && dataType == "stock"){
                var objStock = $(this).attr("id");
                //是股票的话，跳转到个股页面
                if(objStock && objStock != ""){
                    var params = {pageId:"quotationChart",params:{callback:createQuotationDetailBody,stockCode:objStock}}
                    changePageByParams(params);
                }
            }
        })
    }
    //因为图片加载需要时间，所以延时创建点击事件
    setTimeout(function(){
        if($("#"+newsDetailContentId +" img").length > 0){
            $("#"+newsDetailContentId +" img").load(function(){
                //图片加载完成后，刷新节点
                setTimeout(function(){
                    listDetail.refreshDom();
                },100);
            });
            //绑定图片事件
            touchEventWithoutMove($("#"+newsDetailContentId +" img"),function(e){
                var imgObj = $(e.target);
                var bigUrl = imgObj.attr('bigurl');
//                createBigImg("../../images/1.jpg");
                createBigImg(bigUrl);
            });
        }
    },300)
}
/**
 * 创建分享链接
 */
function createSharePart($container){
    var html = "";
    html += '<div class="gw-bottom-share">' +
        '<div class="gw-bottom-share-btn">分享资讯</div>' +
        '</div>';

    $container.after(html);
    var oldHeight = $container.height();
    $container.css("height",oldHeight-44);
    //绑定分享事件
    $('.gw-bottom-share').unbind("fastClick");
    $('.gw-bottom-share').bind("fastClick",function(){
        if(!newsType){
            newsType = "";
        }
        var shareUrl = getFullUrl("mobile/news/shareNewsByID?type=&uid="+newsCode);
        cordova.exec(function(){console.log("分享成功")}, function(){console.log("失败")},
            "share", 'show', [newsTitle,shareUrl,'']);
    })
}
/**
 * 创建新闻详文的页面
 */
function createNewsDetailContent(){
    var html = "";
    var wrapperId = "wrapper"+(new Date()).getTime();
    var scrollerId = "scroller"+(new Date()).getTime();
    //创建id为wrapperId的列表
    html += '<div class="wrapperStyle" id="'+ wrapperId + '">' +
        '<div id="'+ scrollerId + '">' +
        '<ul class="detailUl"></ul>'+
        '</div>' +
        '</div>';
    var returnData = {};
    returnData.html = html;
    returnData.wrapperId = wrapperId;
    returnData.scrollerId = scrollerId;
    returnData.isOnlyScroll = true;
    returnData.isUnBindClickEnt = true;
    returnData.delayCreate = false;
    return returnData;
}
/**
 * 根据gwMobileCurrentUrl，获取当前新闻的code和标题
 */
function getNewsDetailData(callBack){
    if(!newsContent || newsContent == ""){
        return;
    }
    var url = getFullUrl("newsdetail/"+newsContent.replace("#DZH2DATA#0#/",""));
    getAjaxDataByGet(url,{},function(result){
//        result = result + '<p><img  src="../../images/1.jpg" alt=""></p>';
        if(result && result != "error" && result != "timeout" ){
            //添加跳转链接
            result = reSetNewsContent(result);
            //再渲染到页面上
            reSetDetailNewsData(result);
            callBack();
        }
    })
}
/**
 * 重新设置新闻行情的数据，并把它放到列表中去
 * @param result
 */
function reSetDetailNewsData(result){
    if(result){
        var tempObject ={
            title:'',keyWords:'',time:'',sources:'',content:'',picUrl:[],largePicUrl:''
        };
        tempObject.uid = newsCode;
        tempObject.title = reSetNewsTitleList(newsTitle);
        tempObject.time = entryTime;
        tempObject.sources = newsSource;
        tempObject.content = result;
        //先将数据放到缓存中去
        setDetailNewsIntoLocalStorage(tempObject);
        //如果滚动完成了
        if(isNewsDetailPageRun){
            //先关闭loading图标
            hideNewsLoading();
            //将数据渲染到页面上
            listDetail.initData(createNewsDetailLiByData(tempObject));
            isNewsDone = true;
            listDetail.delayCreateScroll();
        }
    }
}
/**
 *
 * @param row
 * @returns {string}
 */
function createNewsDetailLiByData(row){
    if(!row){
        return;
    }
    var title = row.title;
    var time = reSetNewsDetailTimeCount(row.time);
    var keyWords = row.keyWords;
    var sources = row.sources;
    var content = row.content;
    var picUrl = row.picUrl;
    var largePicUrl = row.largePicUrl;
    //判断是否显示图片
    var isShowPic = weatherShowPics();
    //判断字体显示大小
    var fontSize = getDetailFontSize();
    var fSize ="";
    if(fontSize == "big"){
        fSize = " fbig";
    }
    var html = '<li>';
    html += '<div class="gw-mobile-newsDetail'+ fSize +'">';
    html += '<h4>'+ title +'</h4>';
    html += '<div class="detailSourcesAndTime"><span>'+ sources +'</span><span>'+ time +'</span></div>';
    html += ' <div class="detailContext">'+ content +'</div>';
    html += '</div></li>';
    return html;
}
function reSetNewsDetailTimeCount(timeString){
    var dateString = timeString.substr(0, 4) + "/" + timeString.substr(4, 2) + "/" + timeString.substr(6, 2) + " " + timeString.substr(8, 2) + ":" + timeString.substr(10, 2) + ":" + timeString.substr(12, 2);
    var year =  timeString.substr(0, 4);
    var month = timeString.substr(4, 2);
    var day = timeString.substr(6, 2);
    var hour = timeString.substr(8, 2);
    var min = timeString.substr(10, 2);
    var sec = timeString.substr(12, 2);
    var returnString = "";
    returnString = year + '-' + month + '-'+day+' '+ hour + ":"+min;
    return returnString;
}
