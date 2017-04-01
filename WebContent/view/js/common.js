/*
 *公共基础方法
 *
 *应用开发二部    齐晓凯 创建日期 2013-12-4
 *
 */
String.prototype.replaceAll = function(s1, s2) {
	var r = new RegExp(s1.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,
					"\\$1"), "ig");
	return this.replace(r, s2);
};
//管理定时任务
var gwMobileIntervals = [];
window.oldSetInterval = window.setInterval;
window.setInterval = function() {
	var interval = window.oldSetInterval(arguments[0], arguments[1]);
	gwMobileIntervals.push(interval);
    return interval;
};

//保存页面访问路径，供回退用
var gwMobileBackUrls = [];
gwMobileBackUrls.push('../news/characteristicPlate.html');
var gwMobileCurrentUrl = '../news/characteristicPlate.html';
var gwMobileRun = false;
function changePage(url) {
	if(url == ''){
		alert('功能尚未实现！');
		return;
	}
	if (gwMobileRun) {
		return;
	} else {
		gwMobileRun = true;
	}
	$(window).unbind("resize");
	// 清除原有的定时执行
	for (var i = 0; i < gwMobileIntervals.length; i++) {
		clearInterval(gwMobileIntervals[i]);
	}
	var tempUrl = url.substring(0, url.lastIndexOf(".html") + 5);
    if(pageId == "news/newsDetail.html"){
        lastPage = "newsDetail";
    }else{
        lastPage = "";
    }
    //将pageId情空
    pageId = "";
    //隐藏loading图标
    hideNewsLoading();
	isShow = false;
	$("body").load(tempUrl + " #gw-mobile-content", function(html) {
		reflashJsAndCss(html);
        if(url != gwMobileBackUrls[gwMobileBackUrls.length - 1]){
		    gwMobileBackUrls.push(url);
        }
		gwMobileCurrentUrl = url;
		dom_init();
		gwMobileRun = false;
	});
}
//TODO 刷新JS和CSS
function reflashJsAndCss(html) {
	//移除旧页面的私有script,link
	$("link,script").each(function(){ 
	    var _this = $(this);
	    //移除本页面特定的js
	    if(_this.attr("private")){
	    	_this.remove();
	    } 
	});
	//将新页面的私有link和script加载到本页面中
	var regex = /<(link|script).*private\s*=\s*"true".*\s*.*\/(>|link>|script>)/gim;
	var groups = regex.exec(html);
	while(groups){
		$(groups[0]).appendTo($('head'));
		groups = regex.exec(html);
	}
}

/**
 * 用来存放访问路径的数组，标记进入页面
 * @type {Array}
 */
var gwMobileBackParams = [];
/**
 * 放入特供首页的页面参数
 */
gwMobileBackParams.push({pageId:"cPlateIndex",params:{callback:createCplateBody}});
var gwMobileCurrentParams = {pageId:"cPlateIndex",moveContent:"gw-mobile-main-content"};
/**
 * 需要删除的页面
 * @type {Array}
 */
var removeContentParams = [];
/**
 * 判断页面是否在滚动中
 * @type {boolean}
 */
var gwPageRun = false;
/**
 * 子页面的个数
 * @type {number}
 */
var vicePageNum = 0;
/**
 * 根据页面跳转参数
 * 选择所需要的div以及所要使用的动画效果
 * 目前只有次级页面的跳动
 * @param params
 * @param callback 创建页面的方法
 */
function changePageByParams(params){
    //删除touchendLi class
    if($(".touchedLi").length > 0){
        $(".touchedLi").removeClass("touchedLi");
    }
    if(!params){
        return;
    }
    if (gwPageRun || isAnimating) {
        return;
    } else {
        gwPageRun = true;
    }
    //回调函数
    var callback = params.params.callback;
    //跳转页面的id
    var nextPageId = params.pageId;
    //根据跳转页面的id获取将要使用的容器,movinContent和content
    var tempContent = getNextContentById(nextPageId);
    params.params.content = tempContent.content;
    //如果当前moveInContent不存在或者为空
    if( !params.params.moveInContent || params.params.moveInContent == ""){
        params.params.moveInContent = tempContent.moveInContent;
    }
    //修改当前页面的值
    gwMobileCurrentParams.pageId = nextPageId;
    gwMobileCurrentParams.moveContent = tempContent.moveInContent;
    //将参数放到路径串中,保持第一个是主页面
    var tempParamsArr = [].concat(gwMobileBackParams);
    //将页面滚动设置为false
    if(pageId != "navigation"){
        //将参数放到路径串中
        tempParamsArr.push(params);
    }
    var arrPosition = 0;
    //从后往前遍历，遇到主页面即停止
    for(var i = tempParamsArr.length-1;i>=0;i-- ){
        var tempId = tempParamsArr[i].pageId;
        if(tempId == "cPlateIndex" || tempId == "quotationIndex"
            || tempId == "marketIndex" || tempId == "setUpIndex"){
            arrPosition = i;
            break;
        }
    }
    gwMobileBackParams = [].concat(tempParamsArr.slice(arrPosition));
    //因为第一个肯定是主页面，将主页面的moveOut置空
    gwMobileBackParams[0].params.moveInContent = "gw-mobile-main-content";
    gwMobileBackParams[0].params.moveOutContent = "";

    //如果子页面数量大于3个，只取前面两个和最后面一个
    if(gwMobileBackParams.length > 4){
        var remindParams = gwMobileBackParams.slice(0,3).concat(gwMobileBackParams.slice(-1));
        removeContentParams = gwMobileBackParams.splice(3,(gwMobileBackParams.length - remindParams.length))
        gwMobileBackParams = [].concat(remindParams);
//        for(var i=0;i<deleteParams.length;i++){
//            var tempContentId =deleteParams[i].params.content;
//            $("#"+tempContentId).remove();
//        }
    }
    //调用回调方法，创建页面
    callback(params);
    gwPageRun = false;
}
var viceCommonPageIds = ["realtimeOb","newsDetail","quotationChart","quotationQuery","quotationEdit","marketDetail","feedback","register","forgetPassword","diagnosisShares","newsSubscribe","operateAdvice"];
/**
 * 根据页面id获取将要使用的容器
 * @param nextPageId
 */
function getNextContentById(nextPageId){
    var returnParams = {content:"",moveInContent:"gw-mobile-main-content"};
    var isCommonVicePage = false;
    //首先如果是一般的二级页面
    if(nextPageId && nextPageId != ""){
        for(var i=0;i<viceCommonPageIds.length;i++){
            if(nextPageId == viceCommonPageIds[i]){
                isCommonVicePage = true;
            }
        }
        if(isCommonVicePage){
            //创建子页面的div
            var html = '<div  class="subPage pageBox pt-page" style="background:#f4f4f4;z-index:'+ (10 + vicePageNum) +'" id="gw-mobile-vice-page-'+ vicePageNum + '"></div>';
            $("#gw-mobile-content").append(html);
            returnParams.content = "gw-mobile-vice-page-" + vicePageNum;
            returnParams.moveInContent="gw-mobile-vice-page-" + vicePageNum;
            vicePageNum += 1;
        }
        //然后是主页面，四个主页面的移动content是一样的，但是内容content不一样
        if(nextPageId == "cPlateIndex"){
            returnParams.content="gw-mobile-main-cPlate";
        }else if(nextPageId == "quotationIndex"){
            returnParams.content="gw-mobile-main-stock";
        }else if(nextPageId == "marketIndex"){
            returnParams.content="gw-mobile-main-market";
        }else if(nextPageId == "setUpIndex"){
            returnParams.content="gw-mobile-main-setUp";
        }
    }
    return returnParams;
}
/**
 * 根据当前页面和下一个页面，来选择所需要的div和所需要的动画效果
 * @param currentPageId
 * @param nextPageId
 * @returns {{}}
 */
function getDivAndAnimationParams(currentPageId,nextPageId){
    var returnParams = {
        animation:"",
        contentId:""
    };
    var nextContentId = "";
    //根据pageId返回相应的contentId
    if(nextPageId == "cPlateIndex"){
        //特供首页
        nextContentId = "gw-mobile-main-cPlate";
    }else if(nextPageId == "quotationIndex"){
        //自选首页
        nextContentId = "gw-mobile-main-stock";
    }else if(nextPageId == "marketIndex"){
        //行情首页
        nextContentId = "gw-mobile-main-market";
    } else if(nextPageId == "setUpIndex"){
        //设置首页
        nextContentId = "gw-mobile-main-setUp";
    } else if(nextPageId == "quotationChart"){
        //自选股页面
        nextContentId = "gw-mobile-vice-stock";
    }else{
        //其它所有的二级页面
        nextContentId = "gw-mobile-vice-common";
    }
    returnParams.contentId = nextContentId;

    //根据上一个页面的id和当前页面id，判断所要选择的动画
    var nextAnimation = "";
}
/**
 * 模仿request.getParameter(); 但是只能接收三种提交 <form method=GET ..>...</form> <a
 * href="xxx.html?a=b&dc=3">xxx</a> 从浏览器直接输入URL中带有信息xxx.html return
 * 返回的是string类型，
 */
function getUrlParameter(name) {
	var pos = gwMobileCurrentUrl.indexOf("?");
	if (pos < 0)
		return null;
	var paramStr = unescape(gwMobileCurrentUrl);
	var paramStr = paramStr.substring(pos + 1);
	if (paramStr.length == 0)
		return null;
	var params = paramStr.split("&");
	for (var i = 0; i < params.length; i++) {
		var parts = params[i].split("=", 2);
		if (parts[0] == name) {
			if (parts.length < 2 || typeof(parts[1]) == "undefined"
					|| parts[1] == "undefined" || parts[1] == "null")
				return "";
			return parts[1];
		}
	}
	return null;
}
//var postUrl = "http://10.15.92.217:8080/";
//http://app.gw.com.cn/mobile/stock/loadStockKlineByID?obj=6000000&time=20140517000000&callback=jQuery19103029769391287118_1400316309999
//var postUrl = "http://app.gw.com.cn/";
//var postUrl = "http://10.15.92.217:8888/";
function getRootPath() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    //return window.location.protocol + '//' + window.location.host + '/' + webName + '/';
    return window.location.protocol + '//' + window.location.host + '/';
}

var postUrl = "http://127.0.0.1:8080/";
/**
 * 获取完整的Url,为参数自动增加域名
 */
function getFullUrl(url){
//	return 'http://10.15.92.220:8080/'+url;
//    return 'http://10.15.88.70:9089/'+url;
//    return 'http://10.15.107.147/'+url;
    return getRootPath() + url;
//    return 'http://10.15.92.46:8080/'+url;
//    return 'http://10.15.107.157/'+url;
}