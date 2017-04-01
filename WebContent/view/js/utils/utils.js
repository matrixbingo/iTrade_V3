/**
 * 当前版本
 * @type {string}
 */
var versionNumber = "0.0.1";
/**
 *
 * @type {boolean}
 */
var isLatestVersion = true;
/**
 * 当前运行平台
 * @type {string}
 */
var platform = "android";
/**
 * 分辨高度
 * @type {string}
 */
var platHeightPixels = "";
/**
 * 分辨宽度
 * @type {string}
 */
var platWidthPixels = "";
/**
 * 除去状态栏窗口宽度
 * @type {number}
 */
var screenXdp = 0;
/**
 * 除去状态栏窗口高度
 * @type {number}
 */
var screenYdp = 0;
/**
 * 状态栏高度
 * @type {number}
 */
var statusBarHeight = 0;
/**
 * banbenhao
 * @type {string}
 */
var platformVersion = "";
/**
 *
 * @type {string}
 */
var uuid = "";
/**
 * 进入系统的时间
 * @type {Date}
 */
var entrySystemTIme = new Date();
/**
 * 屏幕高度
 * @type {number}
 */
var bodyHeight = 0;
/**
 * 屏幕宽度
 * @type {number}
 */
var bodyWidth = 0;
/**
 * 最新登陆状态
 * 用于标记弹出confirm之后的选择
 * 如果选择更新，则存储为latest
 * 如果选择取消则存储为update
 * @type {string}
 */
var versionStatusId = "cPlateVersionStatus";
/**
 * 页面id，标记为页面的url,不带参数
 * @type {string}
 */
var pageId = "";
/**
 * 将本次打开的盘中特供新闻列表放到内存中
 */
var cPlateNewsList = [];
/**
 * 特供新闻开始时间
 * @type {string}
 */
var cPlateBeginTime = "";
/**
 * 特供新闻结束时间
 * @type {string}
 */
var cPlateEndTime = "";
/**
 * 将本次打开的实时观察新闻列表放到内存中
 */
var realTimeONewsList = [];
/**
 * 实时观察新闻开始时间
 * @type {string}
 */
var realTimeBeginTime = "";
/**
 * 实时观察新闻结束时间
 * @type {string}
 */
var realTimeEndTime = "";
/**
 * 记录盘中特供上次滚动的位置
 * @type {number}
 */
var cPlateISrollY = 0;
/**
 * 记录实时观察上次滚动的位置
 * @type {number}
 */
var realTimeIscrollY = 0;
/**
 * 将本次所有的股票新闻放到列表中去
 * @type {Array}
 */
var allStocksNewsList = [];
/**
 * 记录股票新闻页面上次滚动的位置
 * @type {number}
 */
var allStockNewsScrollY = 0;
/**
 * 用来记录上次点过的新闻
 * @type {Array}
 */
var cPlateList = [];
/**
 *将所有的个股新闻，放到缓存中
 * 缓存的结果是json对象
 * {obj:datas}
 */
var allStocksNews = {};
/**
 *将所有个股新闻的列表开始时间和结束时间放到内存中
 * @type {{}}
 */
var allStockNewsTime = {};
/**
 * 所有个股的上次滚动的位置
 * @type {{}}
 */
var allStocksIScrollYs = {};
/**
 * 用于在内存中存放所有的股票代码
 * @type {Array}
 */
var allStockCodes = [];

/**
 * 在缓存中存放所有股票代码的id
 * @type {string}
 */
var allStockCodeIds = "dzhjpzx_allStockCodeIds";
/**
 * 用来存放所有点击过得新闻id
 * @type {string}
 */
var allClickedNewsId = "dzhjpzx_allClickedNewsId";
/**
 * 当前网络连接状态
 * @type {string}
 */
var currentConnectionStatue = "";

/**
 * 首页轮换图片的位置
 * 范围1-10，大于10直接归1
 * @type {number}
 */
var rollingPicNum = 1;

/**
 * 上次登录成功的用户名称
 * @type {string}
 */
var lastUserNameId = "cplateLastUserName";

/**
 * 新闻详细页面的body id
 * @type {string}
 */
var gwMobileViceBodyId = "gw-mobile-vice-body";
/**
 * 新闻详细页面的内容区域
 * @type {string}
 */
var gwMobileViceContentId = "gw-mobile-vice-Content";
/**
 * 新版本更新地址
 * @type {string}
 */
var versionUrl = "";
/**
 * 图片缓存
 * @type {Array}
 */
var picList = [];

/**
 *
 * @type {string}
 */
var pageCurrentLevel = "main";
/**
 * 是否在滚动过程中
 * @type {boolean}
 */
var isAnimating = false;
/**
 * 监听动画事件
 * @type {string}
 */
var animEndEventName = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';
/**
 * 创建主页面
 */
function createContent(params,content){
    var bodyContent = params.params.content;
    var html = "";
    html += "<div style='width:"+ (bodyWidth+"px") +";height: 100%;overflow: hidden;position: relative;background:#f4f4f4;' id='"+ content +"'></div>";

    $("#"+bodyContent).html(html);
}
/**
 * 清空内存中的新闻列表
 */
function clearNewsListInMemory(){
    //清空特供页面的内存
    cPlateNewsList = [];
    //清空实时观察的内存
    realTimeONewsList = [];
    //清空所有个股的内存
    allStocksNews = {};
}
var animatInter;
/**
 * 滚入滚出页面
 */
function animatingFun(params,callBack){
    /**
     * 滚出页面完成
     * @type {boolean}
     */
    var endCurrPage = false;
    /**
     * 滚入页面完成
     * @type {boolean}
     */
    var endNextPage = false;
    //首先解析参数
    var moveInContent = params.params.moveInContent;
    var moveOutContent = params.params.moveOutContent;
    var direction = params.params.direction;
    //如果滚动容器是同一个，直接返回
    if(moveInContent == "gw-mobile-main-content"){
        callBack();
        return;
    }
    if(isAnimating){
        return;
    }
    isAnimating =true;
    showPageCover();
    //根据滚动方向，获取相应的class
    if(!direction || direction == "left"){
        if(platform == "ios"){
            $("#"+moveInContent).transition({x:-bodyWidth},200,function(){
                callBack();
                setTimeout(function(){
                    isAnimating = false;
                    hidePageCover();
                },300);
                for(var i=0;i<removeContentParams.length;i++){
                    var tempContentId =removeContentParams[i].params.content;
                    $("#"+tempContentId).remove();
                    removeContentParams.splice(i,1);
                }
                //删除div已经删除的iscroll
                removeNewsDetailScroller();
            });
        }else{
            if( platHeightPixels != "" &&parseInt(platHeightPixels) < 1184
                && platWidthPixels !="" &&  parseInt(platWidthPixels) < 768){
                //对于分辨率低的手机，使用css动画，不会出现闪屏
                $("#"+moveInContent).transition({x:-bodyWidth},200,function(){
                    callBack();
                    setTimeout(function(){
                        isAnimating = false;
                        hidePageCover();
                    },300);
                    for(var i=0;i<removeContentParams.length;i++){
                        var tempContentId =removeContentParams[i].params.content;
                        $("#"+tempContentId).remove();
                        removeContentParams.splice(i,1);
                    }
                    //删除div已经删除的iscroll
                    removeNewsDetailScroller();
                });
            }else{
                //对于分辨率高的手机，使用定时任务动画，手机性能好滚动和谐
                var tempTimes = 1;
                var differLength = 0;
                if(animatInter){
                    clearInterval(animatInter);
                }
                animatInter = setInterval(function(){
                    if(tempTimes <= 30){
                        differLength = (bodyWidth/40)*tempTimes;
                    }else if(differLength <= bodyWidth){
                        differLength += bodyWidth/120;
                    }
                    if(differLength > bodyWidth){
                        differLength = bodyWidth;
                    }
                    $("#"+moveInContent).css("translate",[-differLength,0]);
                    if(differLength >= bodyWidth){
                        clearInterval(animatInter);
                        animatInter = null;
                        setTimeout(function(){
                            callBack();
                            setTimeout(function(){
                                isAnimating = false;
                                hidePageCover();
                            },300);
                        },100);
                        for(var i=0;i<removeContentParams.length;i++){
                            var tempContentId =removeContentParams[i].params.content;
                            $("#"+tempContentId).remove();
                            removeContentParams.splice(i,1);
                        }
                        //删除div已经删除的iscroll
                        removeNewsDetailScroller();
                    }
                    tempTimes ++;
                },3);
            }
        }
    }else if(direction == "right"){
        $("#"+moveOutContent).transition({x:bodyWidth},200,function(){
            callBack();
            setTimeout(function(){
                isAnimating = false;
                hidePageCover();
            },100);
        });
    }
}

function showPageCover(){
    if($(".pageCoverLayer").length > 0 ){
        $(".pageCoverLayer").show();
    }else{
        var html = "";
        html = "<div class='pageCoverLayer' style='display: block'></div>";
        $(document.body).append(html);
    }
    //延时1秒钟  如果pageCover图标还在的话，关闭pageCover
    pageCoverTimeout = setTimeout(function(){
        //关闭loading图标
        hidePageCover();
    },1000)
}

var pageCoverTimeout;

function hidePageCover(){
    if(pageCoverTimeout){
        clearTimeout(pageCoverTimeout);
    }
   if($(".pageCoverLayer").length > 0){
       $(".pageCoverLayer").hide();
   }
}

/**
 * 暂时使用，记录上次的页面
 * @type {string}
 */
var lastPage = "";
/**
 * 将所有的股票代码放到缓存中去
 */
function savaAllStockCodes(){
    //首先判断缓存中是否有股票代码，如果有的话把缓存中的代码放到内存中然后返回
    var oldAllCodes = getAllStocksCodes();
    if(oldAllCodes.length>0){
        //放到内存中
        allStockCodes = [].concat(oldAllCodes);
    } else {
        //内存中如果没有的话，就去后台取出来最新的然后放到内存中
        var url = getFullUrl("mobile/stock/getAllStockObj");
        getAjaxDatas(url,{},function(result){
            if(result && result.length>0 && result != "timeout"){
                //先放到内存中去，然后再放到缓存中去
                allStockCodes  = [].concat(result);
                var allCodesStr = "";
                for(var i=0;i<result.length;i++){
                    var tempObj = result[i];
                    allCodesStr += JSON.stringify(tempObj);
                    if(i != (result.length-1)){
                        //分号相隔
                        allCodesStr += ";";
                    }
                }
                if(localStorage){
                    //首先清空所有代码的缓存
                    localStorage.removeItem(allStockCodeIds);
                    localStorage.setItem(allStockCodeIds,allCodesStr);
                    saveAllStorageIds(allStockCodeIds);
                }
            }
        })
    }
}
/**
 * 取出所有的股票代码，并且放到缓存中去
 * 并且在内存中也保证一份
 */
function getAllStocksCodes(){
    var codes = [];
    if(localStorage){
        var tempCodesStr = localStorage.getItem(allStockCodeIds);
        if(tempCodesStr){
            var tempCodeArr = tempCodesStr.split(";");
            for(var i=0;i<tempCodeArr.length;i++){
                var tempObj = JSON.parse(tempCodeArr[i]);
                codes.push(tempObj);
            }
        }
    }
    return codes;

}

/**
 * 根据图片url获取缓存地址
 * @param picUrl
 */
function getPicFromLs(picUrl){
    var isHasPic = false;
    var resultPic;
    for(var i=0;i<picList.length;i++){
        var tempPic = picList[i];
        if(tempPic.src == picUrl){
            isHasPic = true;
        }
        if(isHasPic){
            resultPic = tempPic;
            break;
        }
    }
    //如果缓存中没有的话,放到缓存中
    if(!isHasPic){
        resultPic = new Image(100);
        resultPic.src = picUrl;
//        resultPic.src = "../../images/morningMsg.jpg";
        resultPic.onload = function(){
            picList.push(resultPic);
        }
    }
//    return resultPic;
}

/**
 * 根据code获取obj对象
 * @param code
 */
function getStockObjByCode(code){
    var objJson;
    for(var i=0;i<allStockCodes.length;i++){
        var tempObj = allStockCodes[i];
        var objStr = tempObj.obj;
        if(objStr.indexOf(code)>=0){
            objJson =  tempObj;
            break;
        }
    }
    return objJson;
}
/**
 * 根据id判断新闻是否被点击过
 * @param id
 */
function checkNewsIsClicked(id){
    var isClicked = false;
    if(localStorage){
        var tempIdsStr = localStorage.getItem(allClickedNewsId);
        if(tempIdsStr){
            var tempIdsArr = tempIdsStr.split(";");
            for(var i=0;i<tempIdsArr.length;i++){
                if(tempIdsArr[i] == id){
                    isClicked = true;
                }
            }
        }
    }
    return isClicked;
}
/**
 * 将点击过得新闻的id放到缓存中
 * 判断缓存中是否存在，如果不存在，则放到缓存中去
 * @param id
 */
function saveAllClickedNewsId(id){
    if(localStorage){
        var allIdsStr = "";
        var tempIdsStr = localStorage.getItem(allClickedNewsId);
        if(tempIdsStr){
            var tempIdsArr = tempIdsStr.split(";");
            allIdsStr += tempIdsStr;
            var isContain =false;
            for(var i=0;i<tempIdsArr.length;i++){
                if(tempIdsArr[i] == id){
                    isContain =true;
                }
            }
            if(!isContain){
                allIdsStr += ";" + id;
            }
        }else {
            allIdsStr += id;
        }
        localStorage.removeItem(allClickedNewsId);
        localStorage.setItem(allClickedNewsId,allIdsStr);
        saveAllStorageIds(allClickedNewsId);
    }
}
/**
 * 根据新闻类型和缓存id，获取新闻的详文参数
 * @param id
 * @param storageId
 */
function getNewsParamByIdAndType(id,storageId){
    var returnParams = {pageId:"",params:{}};
    var newsList;
    var newsParams;
    if(storageId && storageId != ""){
        newsList = getListFromLocalStorageById(storageId);
        if(newsList){
            //如果新闻列表存在
            for(var i=0;i<newsList.length;i++){
                var tempNews = newsList[i];
                if(id == tempNews.id){
                    newsParams = {};
                    newsParams.title = tempNews.nTitle;
                    newsParams.newsCode = tempNews.id;
                    newsParams.newsType = tempNews.cate_ws;
                    newsParams.newsContent = tempNews.nContent;
                    newsParams.newsSource = tempNews.nSource;
                    newsParams.entryTime = tempNews.EntryTime;
                    newsParams.topTitle = tempNews.nChannel;
                }
            }
        }
    }
    returnParams.pageId = "newsDetail";
    returnParams.params = newsParams;
    returnParams.params.callback = createNewsDetail;
    return returnParams;
}
/**
 * 所有缓存名称集合的id
 * @type {string}
 */
var allStorageId = "dzhjpzx_storageIds";
/**
 * 将所有的缓存的id 放到缓存中
 * 已经有的直接return，没有的加到缓存中去
 * @param storageId
 */
function saveAllStorageIds(storageId){
    if(storageId == ""){
        return;
    }
    var newAllStorageIds = "";
    if(localStorage){
        var storageStr = localStorage.getItem(allStorageId);
        var isAlreadeHas = false;
        if(storageStr){
            var storageArr = storageStr.split(";");
            for(var i=0;i<storageArr.length;i++){
                var tempStr = storageArr[i];
                if(storageId ==  tempStr){
                    isAlreadeHas = true;
                    break;
                }
            }
            newAllStorageIds += storageStr;
        }
        //如果没有，则加到缓存中去
        if(!isAlreadeHas){
            if(storageStr){
                newAllStorageIds += ";"
            }
            newAllStorageIds += storageId;
        }
        localStorage.removeItem(allStorageId);
        localStorage.setItem(allStorageId,newAllStorageIds);
    }
}
/**
 * 将状态保存到内存中去
 * @param status
 */
function saveVersionStatus(statusObj){
    if(localStorage){
        localStorage.setItem(versionStatusId,JSON.stringify(statusObj));
    }
//    saveAllStorageIds(versionStatusId);
}

/**
 * 从缓存中
 * @returns {string}
 */
function getVersionStatus(){
    var stutasObj;
    if(localStorage){
        var tempStutas = localStorage.getItem(versionStatusId);
        if(tempStutas){
            stutasObj = JSON.parse(tempStutas);
        }
    }
    return stutasObj;
}
/**
 * 判断是否是今天
 */
function checkVersionDate(date){
    var isToday =false;
    var todayStr = getAppointedDay(new Date());
    if(todayStr == date){
        isToday = true;
    }
    return isToday;
}
/**
 * 获取缓存中数据的大小
 */
function getAllLocalStorageDatasSize(){
    var storageSize = 0;
    if(localStorage){
        var tempIdsStr = localStorage.getItem(allStorageId);
        //先把id的大小放进去
        if(tempIdsStr){
            for(var i=0;i<tempIdsStr.length;i++){
                if(tempIdsStr.charCodeAt(i) > 255){
                    storageSize += 2;
                }else {
                    storageSize++;
                }
            }
            var tempIdsArr = tempIdsStr.split(";");
            //循环遍历所有的id，取出所有字节的大小
            for(var j=0;j<tempIdsArr.length;j++){
                var itemAtr = localStorage.getItem(tempIdsArr[j]);
                if(itemAtr){
                    for(var k=0;k<itemAtr.length;k++){
                        if(itemAtr.charCodeAt(k) > 255){
                            storageSize += 2;
                        }else {
                            storageSize++;
                        }
                    }
                }
            }
        }
    }
    var storageSizeStr = '';
    if(storageSize < 1024){
        storageSizeStr += ''+ storageSize + "B";
    }else if(storageSize < (1024 * 1024)){
        storageSizeStr += handleRawData("keep2Fields",storageSize/1024 )+ "KB";
    } else {
        storageSizeStr += handleRawData("keep2Fields",storageSize/(1024 * 1024) )+ "MB";
    }
    return storageSizeStr;
}
/**
 * 清空大智慧精品咨询的所有缓存
 */
function clearAllLocalStorageDatas(){
    if(localStorage){
        var tempAllIdsStr = localStorage.getItem(allStorageId);
        if(tempAllIdsStr){
            var tempAllIdsArr = tempAllIdsStr.split(";");
            for(var i=0;i<tempAllIdsArr.length;i++){
                //逐一删除缓存中的数据
                localStorage.removeItem(tempAllIdsArr[i]);
            }
        }
        //最后id的缓存
        localStorage.removeItem(allStorageId);
    }
}
/**
 * 删除内存中已经存在的新闻
 * 相同新闻id的新闻，替换内存中的新闻
 * @param newDatas
 * @param oldDatas
 */
function removeSameNewsIdData(newDatas,oldDatas,reFreshMemoryType,callBack){

//    如果内存中没有数据，直接返回
    if(oldDatas && oldDatas.length == 0){
        return newDatas;
    }
    var tempDatas = [];
    for(var i=0;i<newDatas.length;i++){
        var tempNewData = newDatas[i];
        var isContain = false;
        for(var j=0; j<oldDatas.length;j++){
            var tempOldData = oldDatas[j];
            if(tempNewData.id == tempOldData.id){
                replaceSameNewsIdData(reFreshMemoryType,j,tempNewData,function(){
                    if(callBack){
                        callBack();
                    }
                });
                isContain = true;
                break;
            }
        }
        //如果不包含，放到返回值中去
        if(!isContain){
            tempDatas.push(tempNewData);
        }
    }
    return tempDatas;
}
/**
 * 替换内存中id相同的数据
 * @param reFreshMemoryType
 * @param pos
 * @param newData
 */
function replaceSameNewsIdData(reFreshMemoryType,pos,newData,callBack){
    if(reFreshMemoryType && reFreshMemoryType == "cPlate"&& cPlateNewsList && cPlateNewsList[pos]){
        //如果内存中的这一条新闻存在 ，则判断新闻的标题，图片，简介以及想问链接是否想相同
        var propertyArrs = ["nTitle","nLink","nContent","nSource","memo"];
        for(var i=0;i< propertyArrs.length;i++){
            var oldStr = cPlateNewsList[pos][propertyArrs[i]];
            var newStr = newData[propertyArrs[i]];
            if(oldStr != newStr){
                //如果有一个属性不相同，直接替换
                cPlateNewsList[pos] = newData;
                if(callBack){
                    callBack();
                }
                break;
            }
        }
    }
}
/**
 *目前是将新闻列表的前20条缓存起来
 * 以后可能缓存所有的
 * @param result
 * @param storageId
 */
function setNewListIntoLocalStorage(newList,storageId,num){
    //首先判断localstorage是否存在
    if(localStorage){
        //取出内存中新闻的前20条,不够的话，有多少条算多少条
        var finalList;
        if(num){
            finalList = newList.slice(0,num);
        }else {
            finalList = newList.slice(0,20);
        }
        var finalStr = "";
        for(var j= 0;j<finalList.length;j++){
            //将json对象转换成string，然后放到缓存中,加上分号分隔符
            finalStr += JSON.stringify(finalList[j]);
            if(j != (finalList.length - 1)){
                finalStr += '";"';
            }
        }
        //删除原来缓存中的数据
        localStorage.removeItem(storageId);
        //最后放到缓存中去
        localStorage.setItem(storageId,finalStr);
        //将id放到缓存中的id列表中去
        saveAllStorageIds(storageId);
    }
}
/**
 * 先判断内存中是否有新闻，有的话，直接返回
 * 根据缓存id，从缓存中取出列表
 * 此方法主要是针对存放内容为数组的方式
 * @param storageId 缓存的id
 * @return 缓存中数据的集合
 */
function getListFromLocalStorageById(storageId){
    if(storageId == "dzhjpzx_characteristicPlate"){
        //判断内存中有没有
        if(cPlateNewsList.length>0){
            return cPlateNewsList;
        }
    }else if(storageId == "dzhjpzx_realTimeObservation"){
        //判断内存中有没有
        if(realTimeONewsList.length>0){
            return realTimeONewsList;
        }
    }
    //内存中没有的话，再去缓存中拿
    var newsList = [];
    if(localStorage){
        var listStr = localStorage.getItem(storageId);
        if(listStr){
            var listArr = listStr.split('";"');
            for(var i=0;i<listArr.length;i++){
                newsList.push(JSON.parse(listArr[i]));
            }
        }
    }
    return  newsList;
}
/**
 * 所有个股新闻存放的id
 * @type {string}
 */
var allSocketsNewsId = "dzhjpzx_allSocketsNewsId";
/**
 * 根据obj的名称，
 * 将数据放到缓存中，
 * 每个obj的数量不超过20条
 * 如果内存中有的，直接清掉缓存中原有的数据，从内存中取出前20条放到缓存中，不够的有多少条算多少条
 * @param datas {obj:"",datas:[]}
 */
function setAllSocketsNewsByObj(obj){
    var objDatas = [];
    //首先判断内存中此obj是否有值,有值的话，取出前20条放到缓存中
    if(allStocksNews[obj]){
        objDatas = [].concat(objDatas,allStocksNews[obj]).slice(0,20);
    }
    if(objDatas.length>0){
        //先把这个obj的新闻数据变成字符串
        var objDatasStr = "";
        for(var i=0;i<objDatas.length;i++){
            var tempStr = JSON.stringify(objDatas[i]);
            objDatasStr += tempStr;
            if(i != (objDatas.length-1)){
                objDatasStr += '";;"';
            }
        }
        //把这个obj的新闻，包装成json数据
        var objDatasJson = {obj:obj,datas:objDatasStr};

        //再把缓存中这个obj对应的数据替换掉，一律直接替换
        var tempAllNewsStr = localStorage.getItem(allSocketsNewsId);
        if(tempAllNewsStr){
            var tempAllNewsArr = tempAllNewsStr.split('";"');
            var isContain = false;
            for(var j=0; j<tempAllNewsArr.length;j++){
                var tempData = tempAllNewsArr[j];
                var tempDataJson = JSON.parse(tempData);
                //如果此obj在缓存中有值，则替换原有的数据值
                if(tempDataJson["obj"] == obj){
                    isContain = true;
                    //清空原值
                    tempDataJson.datas = "";
                    //替换成新的值
                    tempDataJson.datas = objDatasStr;
                }
            }
            //如果此obj在缓存中没有值，则直接添加到里面去
            if(!isContain){
                tempAllNewsStr += '";"' + JSON.stringify(objDatasJson);
            }
            localStorage.removeItem(allSocketsNewsId);
            localStorage.setItem(allSocketsNewsId,tempAllNewsStr);
        } else {
            var objDatasJsonStr = JSON.stringify(objDatasJson);
            localStorage.setItem(allSocketsNewsId,objDatasJsonStr);
        }
    }
    //将新闻的缓存id，放到内存中去
    saveAllStorageIds(allSocketsNewsId);
}
/**
 * 根据obj对象，从缓存或者内存中取出数据
 * 内存中有的话，就不从缓存中取
 * @param obj
 */
function getSocketsNewsByObj(obj){
    //首先判断内存中有没有这只债券的数据，如果有直接返回内存中的数据
    if(allStocksNews[obj]){
        return allStocksNews[obj];
    }
    var objDatas=[];
    //没有的话，去缓存中取
    if(localStorage){
        var tempAllNewsStr = localStorage.getItem(allSocketsNewsId);
        if(tempAllNewsStr){
            var tempAllNewsArr = tempAllNewsStr.split('";"');
            for(var j=0; j<tempAllNewsArr.length;j++){
                var tempData = tempAllNewsArr[j];
                var tempDataJson = JSON.parse(tempData);
                //如果此obj在内存中有值，则取出来放到objDatas中去
                if(tempDataJson["obj"] == obj){
                    var datasStr = tempDataJson.datas;
                    var datasArr = datasStr.split('";;"');
                    for(var k=0;k<datasArr.length;k++){
                        objDatas.push(JSON.parse(datasArr[k]));
                    }
                }
            }
        }
    }
    return objDatas;
}
/**
 * 根据新闻id和新闻类型，去后台取出新闻，并且将新闻放到缓存中
 * @param datas
 */
function setDetailNewsIntoLocalStorage(data){
    //将取到的新闻，根据id放到缓存中去
    if(localStorage){
        var uid = data.uid;
        var storageId = "dzhjpzx_"+uid;
        //将json对象转换才string，放到缓存中去
        var newsStr = JSON.stringify(data);
        localStorage.setItem(storageId,newsStr);
        //将id放到缓存id中去
        saveAllStorageIds(storageId);
    }
}
/**
 * 根据缓存id获取新闻详情
 * @param storageId
 */
function getDetailNewsFromLocalStorage(storageId){
    var newsObj;
    if(localStorage){
        var newsStr = localStorage.getItem(storageId);
        if(newsStr){
            newsObj = JSON.parse(newsStr);
        }
    }
    return newsObj;
}
/**
 * 我的提醒缓存id
 * @type {string}
 */
var myRemindStorageId = "dzhjpzx_myReminList";
/**
 * 添加我的提醒
 * @param datas json对象，一定要包含stockCode、title、newsCat,其它的属性可以自己添加
 */
function saveMyRemindList(data,callBack,showTip){
    if(showTip != false) showTip = true;
    //现在保存到安卓那边
    if( window.plugins){
        window.plugins.storagePlugin.addRemind(data,function(){
            if(showTip){
                toastText("√ 已添加提醒");
            }
            if(callBack){
                callBack("success");
            }
        }, function(){
            if(callBack){
                callBack("error");
                toastText("网络服务不给力⊙﹏⊙");
            }
        });
    }
}
/**
 * 根据id和类型删除我的提醒
 * @param newsCat
 * @param remindType
 */
function removeMyRemindByTypeAndId(value,callBack,showTip){
    if(showTip != false) showTip = true;
    if(value && value.length>0){
        window.plugins.storagePlugin.deleteRemind(value,function(result){
            if(showTip){
                toastText("√ 已取消提醒");
            }
            callBack("success");
        },function(result){
            callBack("error");
            toastText("网络服务不给力⊙﹏⊙");
        });
    }
}
/**
 * 从缓存中获取我的提醒列表
 */
function getAllMyRemindList(callBack){
    //每次都去设备中取最新的 ，不再把它放到内存中去，因为内存中的删除更新不能保证最新
    var myRemindList = [];
    if(window.plugins){
        window.plugins.storagePlugin.getAllReminds(function(result){
            //将结果变成json格式
            if(result && result != ""){
                result = JSON.parse(result);
                for(var i=0;i<result.length;i++){
                    //对于股票对象，判断股票代码是否已经存在
                    if(result[i].stockCode != ""){
                        var stockNew = result[i].stockCode;
                        var isStockContain = false;
                        if(myRemindList.length > 0){
                            for(var j=0;j<myRemindList.length;j++){
                                var stockOld = myRemindList[j].stockCode;
                                if(stockNew == stockOld){
                                    //如果存在的话，就不加进去
                                    isStockContain = true;
                                }
                            }
                            if(!isStockContain){
                                myRemindList.push(result[i]);
                            }
                        }else {
                            myRemindList.push(result[i]);
                        }
                    }else {
                        myRemindList.push(result[i]);
                    }
                }
                //返回结果
                callBack(myRemindList);
            }else{
                callBack([]);
            }
        },function(){
            callBack(myRemindList);
            toastText("网络服务不给力⊙﹏⊙");
        });
    }else{
        var getPlugins = setInterval(function(){
            if(window.plugins){
                clearInterval(getPlugins);
                window.plugins.storagePlugin.getAllReminds(function(result){
                    //将结果变成json格式
                    if(result && result != ""){
                        result = JSON.parse(result);
                        for(var i=0;i<result.length;i++){
                            //对于股票对象，判断股票代码是否已经存在
                            if(result[i].stockCode != ""){
                                var stockNew = result[i].stockCode;
                                var isStockContain = false;
                                if(myRemindList.length > 0){
                                    for(var j=0;j<myRemindList.length;j++){
                                        var stockOld = myRemindList[j].stockCode;
                                        if(stockNew == stockOld){
                                            //如果存在的话，就不加进去
                                            isStockContain = true;
                                        }
                                    }
                                    if(!isStockContain){
                                        myRemindList.push(result[i]);
                                    }
                                }else {
                                    myRemindList.push(result[i]);
                                }
                            }else {
                                myRemindList.push(result[i]);
                            }
                        }
                        //返回结果
                        callBack(myRemindList);
                    }else{
                        callBack([]);
                    }
                },function(){
                    callBack(myRemindList);
                });
            }
        },200);
    }
}
/**
 * 判断登陆状态的时间
 */
var loadingTimeOut;
/**
 * 在所给容器中创建loading图标
 * @param $content
 */
function showNewsLoading($content){
    //如果loading定时任务还存在的话，关闭原来的定时任务
    if(loadingTimeOut){
        clearTimeout(loadingTimeOut);
    }
    if($content.find(".asynLoading").length > 0){
        $content.find(".asynLoading").show();
    }else{
        if($content){
            $content.append('<div class="asynLoading"><div class="asynLoading-ico"></div></div>');
        }
    }
    //延时3秒钟  如果loading图标还在的话，关闭loading
    loadingTimeOut = setTimeout(function(){
        //关闭loading图标
        hideNewsLoading();
    },3000)
}
/**
 * 隐藏页面中的loading图标
 */
function hideNewsLoading(){
    if(loadingTimeOut){
        clearTimeout(loadingTimeOut);
    }
    if($('.asynLoading').length > 0){
        setTimeout(function(){
            $('.asynLoading').hide();
        },100)
    }
}
/**
 * 网络连接状态
 * @type {boolean}
 */
var isDownLoadPicIn2Gr3G =false;
/**
 * 判断链接状态，以及设置
 */
function weatherShowPics(){
    if(currentConnectionStatue != ""){
        if(currentConnectionStatue == "Wifi"){
            isDownLoadPicIn2Gr3G = true ;
        }else if(currentConnectionStatue == "2G" || currentConnectionStatue == "3G" || currentConnectionStatue =="4G"){
            //如果是2、3、4 G网络
            //先去缓存中获取2g3g的状态
            var isOpen = getDownLoadPicFromLocalStorage();
            if(isOpen){
                isDownLoadPicIn2Gr3G = true ;
            }
        }
    }
    //将
    return isDownLoadPicIn2Gr3G;
}
var loadPicStorageId = "dzhjpzx_downLoadPic";
/**
 * 将是否2G3G下下载图片放到缓存中
 */
function setDownLoadPicIntoLocalStorage(isDownLoad){
    if(localStorage){
        //先清除
        localStorage.removeItem(loadPicStorageId);
        //然后直接塞入
        localStorage.setItem(loadPicStorageId,isDownLoad);
    }
}
/**
 * 取出是否2G3G下下载图片状态
 */
function getDownLoadPicFromLocalStorage(){
    var isDownLoad = false;
    if(localStorage){
        var isDownLoadStr = localStorage.getItem(loadPicStorageId);
        if(isDownLoadStr == "true"){
            isDownLoad = true;
        }
    }
    return isDownLoad;
}
/**
 * 从缓存中拿出详文字体的大小
 */
function getDetailFontSize(){
    var size="small";
    if(localStorage){
        var tempSize = localStorage.getItem(newsDetailFontSize);
        if(tempSize){
            size = tempSize;
        }
    }
    return size;
}
var newsDetailFontSize = "dzhjpzx_newsDetailFontSize";
/**
 * 将详文字体的大小放入缓存中
 */
function setDetailFontSize(size){
    var tempSize = "small";
    tempSize = size;
    if(localStorage){
        localStorage.removeItem(newsDetailFontSize);
        localStorage.setItem(newsDetailFontSize,tempSize)
        //将id放到缓存id中去
    }
}
/**
 * 根据类型字符串获取新闻类别
 * @param typeStr
 */
function getNewsTypeByStr(typeStr){
    var newsType = "";
    if(typeStr == "tnwpztg"){
        newsType = "特供";
    }else if(typeStr == "tnwkqs"){
        newsType = "快枪手";
    }else if(typeStr == "tnwdj"){
        newsType = "独家";
    }else if(typeStr == "tnwyzkpq"){
        newsType = "赢在开盘前";
    }else if(typeStr == "tnwsdyj"){
        newsType = "深度研究";
    }else if(typeStr == "tnwssdp"){
        newsType = "盘后综述";
    }else if(typeStr == "tnwtzzbc"){
        newsType = "早班车";
    }else if(typeStr == "tnwmslj"){
        newsType = "美式逻辑";
    }else if(typeStr == "tnwqttg"){
        newsType = "";
    }
    return newsType;
}
/**
 * 本次用户登录的缓存
 * @type {string}
 */
var dzhjpzx_userLoginInfo="";
/**
 * 用来标记登陆信息的callBack
 */
var loadingCallBack;
/**
 *是否显示登录信息
 * @type {boolean}
 */
var isShowLoginIn = false;
/**
 * 创建登陆信息
 */
function createLoadingInfo(callback){
    //改变登录状态
    isShowLoginIn = true;
    //替换callBack的值
    loadingCallBack = callback;
    var lastUserName = getLastLoadingUserName();
    if($('.loginBox').length>0){
//        $('.loginBox').show();
        //如果已经存在
        $("#dzhjpzxuname").val("");
        $("#dzhjpzxpasswd").val("");
        if(lastUserName != ""){
            //用户名显示为上次成功登录的用户名
            $("#dzhjpzxuname").val(lastUserName);
        }
        $(".loginBox").transition({y:"100%"},400,"ease-in-out",function(){
            $("#dzhjpzxuname").blur();
            $("#dzhjpzxpasswd").blur();
        });
        return ;
    }
    var isIOS7="";
    if(platform == "ios" ){
        var versionNum = platformVersion.split(".")[0];
        if(versionNum >= 7){
            isIOS7='style="margin-top: 20px;"';
        }
    }
    var html = "";
    html += '<div class="loginBox">' +
        ' <div class="loginBox-inner">' +
        '<div class="loginBox-close" '+isIOS7+'>'+
        '<div class="loginBox-closeBtn"></div></div>' +
        '<div class="loginBox-form">' +
        '<label class="login_lb login_lb_user"><input type="text" class="login_ipt" value="" placeholder="大智慧账号" id="dzhjpzxuname" name="dzhuname"></label>' +
        '<label class="login_lb login_lb_pasw"><input type="password" class="login_ipt" value="" placeholder="请输入密码" id="dzhjpzxpasswd" name="dzhpasswd"></label>' +
        '<div class="login_btns hbox">' +
        '<div class="login_btns_reg spacer">一键注册</div>' +
        '<div class="login_btns_sub spacer">立即登录</div>' +
        '</div>' +
        '<div class="loginBox-forget" style=""><a href="#" id="loginBox-forget">忘记密码？</a></div>' +
        '</div>' +
//        '<div class="loginBox-others">' +
//        '<div class="loginBox-hr hbox"><div class="loginBox-hr-l spacer"><span></span></div><div class="loginBox-hr-c spacer"><span>或者</span></div><div class="loginBox-hr-r spacer"><span></span></div></div>' +
//        '<div class="loginBox-by-qq"><i></i><span>QQ登录</span></div>' +
//        '</div>' +
        '</div>' +
        '<div class="loginBox-bg"></div>' +
        '</div>';
    $(document.body).append(html);
    //绑定关闭事件
    touchEventWithBackShadow($(".loginBox-inner .loginBox-closeBtn"),function(e){
        //直接关闭登陆页面
        clearLoadingInfo();
    });
    touchEventWithBackShadow($(".login_btns_reg"),function(e){
        //关闭登陆对话框
        clearLoadingInfo(function(){
            var params = {pageId:"register",params:{
                callback:createRegisterBody
            }}
            //跳转到注册页面
            changePageByParams(params);
        });
    });
    touchEventWithBackShadow($("#loginBox-forget"),function(e){
        //关闭登陆对话框
        clearLoadingInfo(function(){
            var params = {pageId:"forgetPassword",params:{
                callback:createForgetPasswordBody
            }}
            //跳转到忘记密码页面
            changePageByParams(params);
        });
    });
    if(lastUserName != ""){
        //用户名显示为上次成功登录的用户名
        $("#dzhjpzxuname").val(lastUserName);
    }
    if(isAnimating){
        return false;
    }
    isAnimating =true;
    setTimeout(function(){
        $(".loginBox").transition({y:"100%"},400,"linear",function(){
            isAnimating = false;
        });
    },50);
    //延时绑定事件
    setTimeout(function(){
        touchEventWithBackShadow($(".login_btns_sub"),function(){
            var unameObj = $("#dzhjpzxuname");
            var passwdObj = $("#dzhjpzxpasswd");
            //用户名和密码不能为空，并且用户名的长度不能少于三个字符
            if(unameObj.val() == ""){
                toastText("用户名不能为空",40);
                unameObj.focus();
                return false;
            }
            if(unameObj.val().length < 4){
                toastText("用户名长度不够，请重新输入",40);
                unameObj.focus();
                return false;
            }
            if(passwdObj.val() == ""){
                toastText("密码不能为空",40);
                passwdObj.focus();
                return false;
            }
            var userName = unameObj.val();
            var userPassWord = passwdObj.val();
            //验证登陆密码和用户名
            userPassWord = hex_md5(userPassWord);
            var url = getFullUrl("sys/login?uname="+userName+"&upass="+userPassWord);
            getAjaxDataByGet(url,"",function(result){
                if(result && result != 'error'){
                    var tempArr = result.split("&");
                    var userStatus = tempArr[0].split("=")[1];
                    if(userStatus =="ok" ){
                        //将登录状态置为空
                        if($("#dzhjpzxuname").length>0){
//                            $("#dzhjpzxuname").val("");
//                            $("#dzhjpzxpasswd").val("");
                        }
                        //获取用户id
                        var userId =  tempArr[1].split("=")[1];
                        var userInfo = userName + ";" + userId;
//                        if(window.plugins){
                            //注册推送，如果成功才执行成功的回调，失败的话则不执行
//                            window.plugins.storagePlugin.login(userName,function(result){
                                setCurrentUserInfo(userInfo);
                                //把用户名称放到内存中，不是缓存中
                                dzhjpzx_userLoginInfo = userName + ";" + userId;
                                //将成功登录的名称存储起来
                                setLastLoadingUserName(userName);
                                //改变登陆名称，关闭登陆对话框
                                //changeLoadingStatus(userName);
                                //关闭对话框
                                clearLoadingInfo(function(){
                                    if(loadingCallBack){
                                        loadingCallBack(userInfo);
                                    }
                                });
                                //调用phoneGap接口
                                window.plugins.storagePlugin.setCurrentUser(userName,function(){console.log("添加账号成功"),
                                    function(){console.log("添加账号失败")}});
//                            },function(result){
//                                callback("timeout");
//                                toastText("网络服务不给力⊙﹏⊙",40);
//                            });
//                        }
                    } else {
                        //登陆失败，判断是密码错误还是用户名错误
                        var message = tempArr[1].split("=")[1];
                        if(message == "username not exist"){
//                            unameObj.val("");
//                            passwdObj.val("");
                            unameObj.focus();
                            toastText("用户名不存在,请重新输入",40);
                        } else if(message == "password incorrect"){
//                            passwdObj.val("");
                            passwdObj.focus();
                            toastText("密码错误，请重新输入",40);
                        }
                    }
                } else {
                    setTimeout(function(){
                        callback("timeout");
                        toastText("网络服务不给力⊙﹏⊙",40);
                        clearLoadingInfo();
                    },500)
                }
            })
        });
        //取消按钮事件,直接关掉对话框
        touchEventWithoutMove($(".matter_close_btn"),function(){
            callback("cancle");
            clearLoadingInfo();
        });
    },50)
}
/**
 * 删除登陆状态
 */
function clearLoadingInfo(callBack){
    var loadingDiv = $(".loginBox");
    if(loadingDiv.length > 0){
        $("#dzhjpzxuname").blur();
        $("#dzhjpzxpasswd").blur();
        //判断键盘是否消失
        if(isKeyboardHide()){
            if(isAnimating){
                return false;
            }
            isAnimating =true
            $(".loginBox").transition({y:0},200,"linear",function(){
                isAnimating = false;
                //改变登陆状态
                isShowLoginIn = false;
                if(callBack){
                    callBack();
                }
            });
        }else{
            var loadingInt = setInterval(function(){
                if(isKeyboardHide()){
                    clearInterval(loadingInt);
                    if(isAnimating){
                        return false;
                    }
                    isAnimating =true
                    setTimeout(function(){
                        $(".loginBox").transition({y:0},200,"linear",function(){
                            isAnimating = false;
                            //改变登陆状态
                            isShowLoginIn = false;
                            if(callBack){
                                callBack();
                            }
                        });
                    },500)
                }
            },200);
        }
    }
}
/**
 * 检查版本更新
 */
function checkVersions(type,callBack){
    var url = getFullUrl("mobile/version/newEditionSelect");
    var param = {editionid:versionNumber,platform:platform};
    getAjaxDatas(url,param,function(result){
        if(result && result != "timeout"){
            var newVirsion = result.editionId;
            if(compareVersions(newVirsion)){
                isLatestVersion = false;
                //首先设置红点
                if($("#bottomSetUp").length>0){
                    if(! $("#bottomSetUp").hasClass("remindme")){
                        $("#bottomSetUp").addClass("remindme");
                    }
                }
                if(type == "loading"){
                    //如果是刚进入程序
                    //首先判断时候需要更新检查
                    var versionObj = getVersionStatus();
                    if(versionObj){
                        var date = versionObj.date;
                        //判断日期是否是今天
                        var isToday = checkVersionDate(date);
                        var status = versionObj.status;
                        if(isToday && status == "update"){
                            return;
                        }
                    }
                }
                versionUrl = result.updateUrl;
                //需要更新时，首先创建更新界面
                createUpdateBody(result.editionContent);
            }else {
                isLatestVersion = true;
                if(callBack){
                    callBack("最新");
                }
            }
        }
    })
}
/**
 * 比较版本号
 * @param newVersion
 */
function compareVersions(newVersion){
    var isNewVersion = false;
    if(newVersion){
        if(newVersion == versionNumber){
            isNewVersion = false;
        }else{
            var newArr = newVersion.split(".");
            var oldArr = versionNumber.split(".");
            for(var i=0;i<newArr.length;i++){
                if(parseFloat(oldArr[i]) < parseFloat(newArr[i])){
                    isNewVersion = true;
                    break;
                }else if(parseFloat(oldArr[i]) > parseFloat(newArr[i])){
                    break;
                }
            }
        }
    }
    return isNewVersion;
}
/**
 * 创建更新部分
 */
function createUpdateBody(msg){
    var html = '';
    html += '<div class="ui-gw-upgrade" style="display: none">' +
        '<div class="ui-gw-upgrade-inner">' +
        '<div class="ui-gw-upgrade-title">有新版本！</div>' +
        '<div class="ui-gw-upgrade-txt">'+ msg +'</div>' +
        '<div class="ui-gw-upgrade-btns"><div id="cancleUpdate">取消</div><div id="updateNow">立即升级</div></div>' +
        '</div>' +
        '</div>' +
        '<div class="overlay"></div>';
    $(document.body).append(html);
    if($(".bodyLoading").length==0){
        $(document.body).append("<div class='bodyLoading'style='display: none' >" +
            "<div class='bodyLoading_bg'></div>" +
            "<div class='bodyLoading_inner'></div></div>");
    }
    $(".ui-gw-upgrade").css("scale",0.5).show().transition({scale:1});
    //绑定事件
    setTimeout(function(){
        if($('#cancleUpdate').length > 0){
            touchEventWithoutMove($('#cancleUpdate'),clearUpdateBody);
        };
        if($('#updateNow').length > 0){
            touchEventWithoutMove($('#updateNow'),function(){
                clearUpdateBody();
                downLoadApkFile();
            });
        }
    },300);
}
/**
 * 删除更新部分
 */
function clearUpdateBody(){
    var tempObj = {
        date:getAppointedDay(new Date()),
        status:"update"
    };
    saveVersionStatus(tempObj);
    if($(".ui-gw-upgrade").length>0){
        $(".ui-gw-upgrade").remove();
    }
    if($(".overlay").length>0){
        $(".overlay").remove();
    }
}
/**
 *下载文件
 */
function downLoadApkFile(callback){
    //如果有下载地址
    if(versionUrl != ""){
        if(platform == "ios"){
            var tempObj = {
                date:getAppointedDay(new Date()),
                status:"latest"
            };
            saveVersionStatus(tempObj);
            //调用插件，打开app
            window.plugins.updatePlugin.openApp(versionUrl,null,null);
        }else{
            if($(".overlay").length == 0){
                $(document.body).append( '<div class="overlay"></div>');
            }
            var sourcedir1="update";//下载一级目录
            var sourcedir2="boutiqueNews";//下载二级目录息
            //客户端下载地址
            var url = versionUrl;
            var source="BoutiqueNews.apk";
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                fileSystem.root.getDirectory(sourcedir1,{create:true,exclusive:false},function(entrydir){
                    entrydir.getDirectory(sourcedir2, {create:true,exclusive:false},  function(entrydir){
                        entrydir.getFile(source,{create:true,exclusive:false},function(parent){
                            var fileTransfer = new FileTransfer();
                            var uri = encodeURI(url);
                            //显示loading
                            if(platform != "ios"){
                                $(".bodyLoading").css("display",'block');
                            }
                            if(callback){
                                callback("success");
                            }
                            //下载文件
                            fileTransfer.download(uri,parent.fullPath,  function(entry){
                                if( $(".bodyLoading").length > 0){
                                    $(".bodyLoading").css("display",'none');
                                }
                                if($(".overlay").length > 0){
                                    $(".overlay").remove();
                                }
                                var tempObj = {
                                    date:getAppointedDay(new Date()),
                                    status:"latest"
                                };
                                saveVersionStatus(tempObj);
                                //将更新状态设置为最新
                                //调用自动安装的插件
                                window.plugins.updatePlugin.openFile(entry.fullPath,null,null);
                            },function(error) {toastText("下载失败")
                                $(".bodyLoading").css("display",'none');
                                if($(".overlay").length > 0){
                                    $(".overlay").remove();
                                }
                            });
                        }, function(){toastText("文件下载失败") });
                    }, function(){toastText("创建二级栏目失败")} );
                },function(){toastText("创建一级目录失败");})
            }, function(evt){console.log("加载文件系统出现错误");})
        }
    }
}

/**
 *
 * @type {string}
 */
var userInfoStorageId = "dzhjpzx_userInfo";
/**
 * 将用户的用户名和密码放到缓存中去
 * 此用户名在删除缓存时 不删除
 */
function setCurrentUserInfo(userInfo){
    if(localStorage){
        var oldUserName = localStorage.getItem(userInfoStorageId);
        if(oldUserName){
            localStorage.removeItem(userInfoStorageId);
        }
        localStorage.setItem(userInfoStorageId,userInfo);
    }
    if(userInfo != ""){
        var userName =  userInfo.split(";")[0];
        storagePlugin.prototype.setCurrentUser(userName,function(){
            console.log("保存成功");
        },function(){
            console.log("保存失败");
        });
    }
}
/**
 *获取用户名
 */
function getCurrentUserInfo(){
    //先判断内存中有没有，如果没有的话再去缓存中拿
    if(dzhjpzx_userLoginInfo != ""){
        return dzhjpzx_userLoginInfo;
    }
    var userInfo = "";
    if(localStorage){
        var tempInfo = localStorage.getItem(userInfoStorageId);
        if(tempInfo){
            userInfo = tempInfo;
            //将登录信息放到内存中去
            dzhjpzx_userLoginInfo = tempInfo;
        }
    }
    return userInfo;
}
/**
 * 存储上次成功登录的用户名
 * @param lastUserName
 */
function setLastLoadingUserName(lastUserName){
    if(localStorage){
        localStorage.removeItem(lastUserNameId);
        localStorage.setItem(lastUserNameId,lastUserName);
    }
    saveAllStorageIds(lastUserNameId);
}
/**
 * 取出上次成功登录的用户名
 */
function getLastLoadingUserName(){
    var userName = "";
    if(localStorage){
        var tempUserName = localStorage.getItem(lastUserNameId);
        if(tempUserName){
            userName = tempUserName;
        }
    }
    return userName;
}
/**
 * 返回用户名称
 * @param userName
 */
function getCurrentUser(){
    //先判断内存中有没有，如果没有的话再去缓存中拿
    if(dzhjpzx_userLoginInfo != ""){
        var userName = dzhjpzx_userLoginInfo.split(";")[0];
        return userName;
    }
    var userName = "";
    if(localStorage){
        var tempInfo = localStorage.getItem(userInfoStorageId);
        if(tempInfo){
            userName = tempInfo.split(";")[0];
            //将登录信息放到内存中去
            dzhjpzx_userLoginInfo = tempInfo;
        }
    }
    return userName;
}

/**
 * 删除用户信息
 */
function clearUserInfoIn(){
    if(localStorage){
        localStorage.removeItem(userInfoStorageId);
        //删除内存中的用户信息
        dzhjpzx_userLoginInfo = "";
    }
}
/**
 * 用正则表达式替换新闻标题
 */
function reSetNewsTitleList(nTitle){
    if(nTitle){
        var reg=/^[\\(|（][\u4E00-\u9FA5]+[\\)|）]/;
        var regResult = nTitle.match(reg);
        if(regResult && regResult.length>0){
            var tempResult = regResult[0];
            nTitle = nTitle.replace(tempResult,"")
        }
    }
    return nTitle;
}
/**
 * 用正则表达式替换新闻详文内容
 */
function reSetNewsContent(nContent){
//    var reg=/[\\(|（]([0-9]{6}[.]*[A-Za-z]*)[\\)|）]/g;
    var reg=/([0-9０１２３４５６７８９]{6}[．.]{1}[SHZshzＳＨＺｓｈｚ]{2})/g;
    var regResult = nContent.match(reg);
    if(regResult && regResult.length>0){
        for(var i=0;i<regResult.length;i++){
            var tempResult = regResult[i];
            var objCode = tempResult.split(".")[0];
            var objHead = tempResult.split(".")[1].toUpperCase();
//            var objCode = ''+ tempResult.slice(0, 6);
//            var objHead = "";
//            var objBack = tempResult.slice(8,tempResult.length - 1).toUpperCase();
//            if(objBack == "SZ" || objBack == "SH"){
//                objHead = objBack;
//            }
            //完整代码
            var fullCode="";
            fullCode = objHead + objCode +".stk";
            var tempChangeResult = '<a data-type="stock" id="'+ fullCode +'" herf="">'
                +tempResult + "</a>";
            nContent = nContent.replace(
                tempResult,tempChangeResult);
        }
    }
//    var testStr = '<img alt="" src="http://rdfile.gw.com.cn/37/B2/37B22084B1CFD0CB8071B59ADFE2F5F9.JPG" style="width: 192px; height: 600px;" />';
    var imgReg=/[\<]([imgIMG]{3})(.*?)[\/][\>]/g;
    var imgResult = nContent.match(imgReg);
    if(imgResult && imgResult.length>0){
        for(var i=0;i<imgResult.length;i++){
            var urlSmall = getFullUrl("rdfile/mimg/");
            var urlBig = getFullUrl("rdfile/");
            var tempResult = imgResult[i];
            var srcReg = /([src="]{4})([\s\S]+)["]/g;
            var srcResult = tempResult.match(srcReg);
            var tempSrc = "";
            if(srcResult){
                tempSrc = srcResult[0].split('"')[1];
                tempSrc = tempSrc.replace("//","");
                var tempArr = tempSrc.split("/");
                tempSrc = tempSrc.replace(tempArr[0]+'/',"");
            }
            var bodyWidth = $("#gw-mobile-content").width();
            var ParWidth = bodyWidth-20;
            urlSmall += tempSrc+'?w='+ParWidth+'&h=10000';
            urlBig += tempSrc+'?w='+bodyWidth+'&h=10000';
            var tempImg = '<img src="';
            tempImg += urlSmall;
            tempImg += '"';
            tempImg += ' bigUrl="'+urlBig +'"';
            tempImg += ' />';
            nContent = nContent.replace(tempResult,tempImg);
        }
    };
    nContent = nContent.replace("<body>","").replace("</body>","")
    return nContent;
}
/**
 * 绑定事件，如果移动的话，就不触发点击事件
 * @param $content
 */
function touchEventWithoutMove($content,callBack){
//    $content.bind("fastClick",function(e){
//        callBack(e)
//    });
    //判断开始的位置和结束的位置是否一致，如果一致的话，则执行end的事件
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        END_EV = hasTouch ? 'touchend' : 'mouseup';
    var pageYNow = 0;
    $content.bind(START_EV,function(e){
        e.preventDefault();
        var touch = hasTouch ? e.originalEvent.touches[0]:e.originalEvent;
        pageYNow = touch.pageY;
    });
    //绑定实时观察跳转页面
    $content.bind(END_EV,function(e){
        var changeTouch = hasTouch ? e.originalEvent.changedTouches[0]:e.originalEvent;
        var endY = changeTouch.pageY;
        var diffLength = Math.abs(pageYNow - endY);
        if(diffLength <= 5){
            callBack(e);
        }
        pageYNow = 0;
    })
}
/**
 * 点击事件触发时，添加背景颜色
 * end时触发事件
 * @param $content
 * @param callBack
 */
function touchEventWithBackShadow($content,callBack,className){
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup';
    //判断移动位置是否超出5个像素
    var pageYNow = 0;
    var isTouchMove =false;
    var touchClassName = "";
    if(!className){
        touchClassName = "touched";
    }else{
        touchClassName = className;
    }
    $content.unbind(START_EV);
    $content.unbind(MOVE_EV);
    $content.unbind(END_EV);
    $content.bind(START_EV,function(e){
        isTouchMove =false;
        e.preventDefault();
        $content.addClass(touchClassName);
        var touch = hasTouch ? e.originalEvent.touches[0]:e.originalEvent;
        pageYNow = touch.pageY;
//        $("#pageCovered").show();
    });
    $content.bind(MOVE_EV,function(e){
        e.preventDefault();
        var touch = hasTouch ? e.originalEvent.touches[0]:e.originalEvent;
        var diffLength = Math.abs(touch.pageY - pageYNow);
        //如果移动范围超出五个像素，则去掉底色，不执行end
        if(diffLength > 5){
            isTouchMove =true;
            $content.removeClass(touchClassName);
        }
    })
    //绑定实时观察跳转页面
    $content.bind(END_EV,function(e){
        e.preventDefault();
        //延时100ms，去掉class，调用回调事件
        if(!isTouchMove){
            setTimeout(function(){
                $content.removeClass(touchClassName);
            },100)
            if(callBack){
                callBack(e);
//                $("#pageCovered").hide();
            }
        }
    })
}

/**
 * 设置鼠标移动元素时的颜色
 * @param $container
 */
function setDomHoverColor($container){
    var timeStart;
    var touchInt;
    var tempContainer;
//    $container.unbind("touchstart");
//    $container.unbind("touchmove");
//    $container.unbind("touchend");
    var pageYNow = 0;
    $container.bind("touchstart",function(e){
        var touch = e.originalEvent.touches[0];
        pageYNow = touch.pageY;
        timeStart = new Date();
        tempContainer = $(this);
        if(touchInt){
            clearInterval(touchInt);
        }
        touchInt = setInterval(function(e){
            var newTime = new Date().getTime();
            var oldTime = timeStart.getTime();
            var diffTime = newTime - oldTime;
            if(diffTime > 500){
                tempContainer.addClass("touchedLi");
                clearInterval(touchInt);
            }
        },300)
    })
    $container.bind("touchmove",function(e){
        e.preventDefault();
        var touch = e.originalEvent.touches[0];
        var diffLength = Math.abs(touch.pageY - pageYNow);
        //如果移动范围超出五个像素，则去掉底色，不执行end
        if(diffLength > 5){
            if(touchInt){
                clearInterval(touchInt);
                tempContainer.removeClass("touchedLi");
            }
        }
    });
    $container.bind("touchend",function(e){
        if(touchInt){
            clearInterval(touchInt);
            tempContainer.removeClass("touchedLi");
        }
    })
}
/**
 * 创建切换页面的滚动动画
 * @param wrapperId
 * @param pullDownAction
 * @param pullUpAction
 * @param isShowLoading
 * @param options
 * @param reSetYFun
 */
function createChangeContentScroll(wrapperId,pullDownAction,pullUpAction,isShowLoading,options,reSetYFun){
    //向下滚动
    var pullDownEl,
        pullDownOffset;
    var pullDownSpan;
    //向上滚动
    var pullUpEl,
        pullUpOffset;
    var pullUpSpan;
    //默认下拉提示区域为pullDown
    if(options && options.pullDownId){
        pullDownEl = $("#"+options.pullDownId);
        pullDownSpan = $("#"+options.pullDownId + " .pullDownLabel");
    }else{
        pullDownEl = $("#pullDown");
        pullDownSpan = $("#pullDown .pullDownLabel");
    }
    if(pullDownEl && pullDownEl != 'undefined'){
        pullDownOffset = pullDownEl.offsetHeight;
    }
    //默认上拉提示区域为pullUp
    if(options && options.pullUpId){
        pullUpEl = $("#"+options.pullUpId);//document.getElementById(options.pullUpId);
        pullUpSpan = $("#"+options.pullUpId+" .pullUpLabel");
    }else{
        pullUpEl = $("#pullUp")//document.getElementById('pullUp');
        pullUpSpan = $("#pullUp .pullUpLabel");
    }
    var isCloseTrans3D = false;
    if(options && options.isCloseTrans3D){
    	isCloseTrans3D = options.isCloseTrans3D;
    }
    if(pullUpEl && pullUpEl != 'undefined'){
//        pullUpOffset = pullUpEl.offsetHeight;
    }
    //设置默认滚动开始位置，默认开始位置都是从默认下拉滚动区域的下方开始，默认值为50
    var topOffset = 40;
    if(!isShowLoading){
        topOffset = 0;
    }
    var startY = -topOffset;
    if(options && options.y && options.y != 0){
        startY = options.y;
    }
    var isAlreadyGetData = false;
    //创建滚动区域，
    var myScroll = new iScroll(wrapperId,{
        hideScrollbar:true,//没有用户操作时，滚动条隐藏
        topOffset : topOffset, //默认开始滚动位置
        y : startY,
        hScroll:false, //隐藏横向滚动条
        lastTimeY:-40,
        useTransform:!isCloseTrans3D,
//        useTransition: true,
        onRefresh :function(){
            if(isShowLoading){
                if(this.maxScrollY< -100){
                    if(pullUpSpan.html() != "加载中..."){
                        pullUpSpan.html("");
                    }
                }
                isAlreadyGetData = false;
                if (pullDownEl.hasClass('loading')) {
                    pullDownEl.removeClass();
                    pullDownEl.addClass("pullDown");
                    pullDownSpan.html("");
                }
                if (pullUpEl.hasClass('loading')) {
                    pullUpEl.removeClass();
                    pullUpSpan.html("");
                    setTimeout(function(){
                        pullUpEl.addClass("pullUp");
                    },10)
                }

            }
        },
        onScrollMove : function() {
//            $("#pageCovered").show();
            //开始滚动的时候，先将请求设置为false
            if(isShowLoading){
                //移动高度，向下为整数，向下为负数
                if (this.y>=-40 && !pullDownEl.hasClass('flip')) {
                    if(!isAlreadyGetData){
                        pullDownEl.removeClass("flip");
                        pullDownEl.removeClass("loading");
                        if(!pullDownEl.hasClass('down')){
                            pullDownEl.addClass('down');
                        }
                        var pullDownHtml =  pullDownSpan.html();
                        if(pullDownHtml != "下拉刷新..."){
                            pullDownSpan.html('下拉刷新...');
                        }
                        if(this.minScrollY != -40){
                            this.minScrollY = -40;
                        }
                    }
                }
                if (this.y > 0 && !pullDownEl.hasClass('flip')) {
                    if(!isAlreadyGetData){
                        pullDownEl.removeClass("down");
                        pullDownEl.removeClass("loading");
                        pullDownEl.addClass("flip");
                        pullDownSpan.html('释放刷新...');
                        this.minScrollY = 0;
                    }
                } else if (this.y<this.lastTimeY && this.y < (this.maxScrollY - 20) && !pullUpEl.hasClass('flip')) {
                    if(!isAlreadyGetData){
                        //用来判断是不是向上滚动this.y < cuurentY
                        pullUpEl.removeClass("loading");
                        pullUpEl.removeClass("flip");
                        var pullUpHtml = pullUpSpan.html();
                        if(pullUpHtml != "释放更新..."){
                            pullUpSpan.html('释放更新...');
                        }
                        if(!pullUpEl.hasClass("flip")){
                            pullUpEl.addClass("flip");
                        }
                    }
                }
            }
        },
        onScrollEnd : function() {
//            $("#pageCovered").hide();
            if(!isAlreadyGetData){
                isAlreadyGetData = true;
                if(isShowLoading){
                    //记录滑动的位置，切换页面返回时能到上次打开的位置
                    if(reSetYFun){
                        reSetYFun();
                    }
                    //上拉重新请求数据，下拉取缓存中的数据
                    if (pullDownEl.hasClass('flip')) {
                        pullDownEl.removeClass("down");
                        pullDownEl.removeClass("flip");
                        pullDownEl.addClass("loading");
                        pullDownSpan.html('加载中...');
                        pullDownAction();	// Execute custom function (ajax call?)
                    } else if (pullUpEl.hasClass('flip')) {
                        pullUpEl.removeClass("down");
                        pullUpEl.removeClass("flip");
                        pullUpEl.addClass("loading");
                        pullUpSpan.html('加载中...');
                        pullUpAction();	// Execute custom function (ajax call?)
                    }else{
                        isAlreadyGetData =false
                    }
                }
            }
            this.lastTimeY = this.y;
        }
    });
//    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
//        hasTouch = 'ontouchstart' in window && !isTouchPad,
//        START_EV = hasTouch ? 'touchstart' : 'mousedown';
//    $("#pageCovered").bind(START_EV,function(){
//        myScroll.stop();
//        $("#pageCovered").hide();
//    })
    return myScroll;
}
/**
 * 创建滚动区域，默认都是相同id的上下滚动div
 * @param wrapperId 滚动区域的id
 * @param pullDownAction 下拉放大
 * @param pullUpAction 上拉执行方法
 * @param isShowLoading 是否显示滚动提示区域
 */
function createScroll(wrapperId,pullDownAction,pullUpAction,isShowLoading,options,reSetYFun){
    //向下滚动
    var pullDownEl,
        pullDownOffset;
    //向上滚动
    var pullUpEl,
        pullUpOffset;
    //默认下拉提示区域为pullDown
    pullDownEl = document.getElementById('pullDown');
    if(pullDownEl && pullDownEl != 'undefined'){
        pullDownOffset = pullDownEl.offsetHeight;
    }
    //默认上拉提示区域为pullUp
    pullUpEl = document.getElementById('pullUp');
    if(pullUpEl && pullUpEl != 'undefined'){
        pullUpOffset = pullUpEl.offsetHeight;
    }
    //设置默认滚动开始位置，默认开始位置都是从默认下拉滚动区域的下方开始，默认值为50
    var topOffset = pullDownOffset;
    if(!isShowLoading){
        topOffset = 0;
    }
    var startY = -topOffset;
    if(options && options.y && options.y != 0){
        startY = options.y;
    }
    //创建滚动区域，
    var myScroll = new iScroll(wrapperId,{
        hideScrollbar:true,//没有用户操作时，滚动条隐藏
        topOffset : topOffset, //默认开始滚动位置
        y : startY,
        hScroll:false, //隐藏横向滚动条
        isAlreadyGetData:false,
        lastTimeY:-40,
//        useTransition: true,
        onRefresh :function(){
            if(isShowLoading){
                if(this.maxScrollY< -100){
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
                }
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '';
                } else if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
                }
            }
        },
        onScrollMove : function() {
            //开始滚动的时候，先将请求设置为false
            if(isShowLoading){
                //移动高度，向下为整数，向下为负数
                if (this.y>=-40 && !pullDownEl.className.match('flip')) {
                    var pullDownClassName = pullDownEl.className;
                    if(pullDownClassName != 'down'){
                        pullDownEl.className = 'down';
                    }
                    var pullDownHtml =  pullDownEl.querySelector('.pullDownLabel').innerHTML;
                    if(pullDownHtml != "下拉刷新..."){
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                    }
                    if(this.minScrollY != -40){
                        this.minScrollY = -40;
                    }
                }
                if (this.y > 0 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新...';
                    this.minScrollY = 0;
                }else if (this.y<this.lastTimeY && this.y < (this.maxScrollY - 20) && !pullUpEl.className.match('flip')) {
                    //用来判断是不是向上滚动this.y < cuurentY
                    var pullUpHtml = pullUpEl.querySelector('.pullUpLabel').innerHTML;
                    if(pullUpHtml != '释放更新...'){
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放更新...';
                    }
                    var pullUpClassName = pullUpEl.className;
                    if(pullUpClassName != "flip"){
                        pullUpEl.className = 'flip';
                    }
                    //如果滚动过程中到达底部，则请求数据
                    if(!this.isAlreadyGetData){
                        this.isAlreadyGetData = true;
                    }
                    //滑动到达某个位置时，请求一次数据
                }
            }
        },
        onScrollEnd : function() {
//            if($("img.lazy").length > 0){
//                $("img.lazy").lazyload();
//            }
            if(isShowLoading){
                //记录滑动的位置，切换页面返回时能到上次打开的位置
                if(reSetYFun){
                    reSetYFun();
                }
                //上拉重新请求数据，下拉取缓存中的数据
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                    pullDownAction();	// Execute custom function (ajax call?)
                } else if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                    console.log("请求数据");
                    pullUpAction();	// Execute custom function (ajax call?)
                }
            }
            this.isAlreadyGetData =false;
            this.lastTimeY = this.y;
        }
    });
    return myScroll;
}

/**
 * 重新拼接新闻的请求串
 * @param obj
 */
function reSetStockStr(obj){
    var tempStr = ""
    if(obj){
        tempStr += obj + "$ydqsz,"+obj + "$ztlwt," + obj +"$dsfxw,"+obj+ "$xws";
    }
    return tempStr;
}
/**
 * 基础工具方法
 */
function getAppointedDay(date, timeType, offset) {
    var dateResult;
    var dateStr = date;
    if (new Date(dateStr) == 'Invalid Date') {
        dateStr = '';
        var chr = date.match(/[^\d\.]/g);
        //获取当前日期的类型符
        var beConverted = (chr != null) ? chr[0] : '';
        var dateArr = [];

        //将日期拆成年月日三个部分
        if (beConverted != '') {
            dateArr = date.split(beConverted);
        } else {
            dateArr[0] = date.slice(0, 4);
            dateArr[1] = date.slice(4, 6);
            dateArr[2] = date.slice(6, 8);
        }
        //将数据转换成YYYY-MM-DD类型
        for (var i = 0; i < dateArr.length; i++) {
            if (i < (dateArr.length - 1)) {
                dateStr += dateArr[i] + '-';
            } else {
                dateStr += dateArr[i];
            }
        }
    }
    //计算偏移量
    var N = offset ? offset : 0;
    var type = timeType ? timeType : '';
    dateResult = new Date(dateStr);
    dateResult.setDate(dateResult.getDate() + N);
    var y = dateResult.getFullYear();
    var m = dateResult.getMonth() + 1;
    var d = dateResult.getDate();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    dateStr = '' + y + type + m + type + d;
    return dateStr;
}

/**
 * 给date对象添加format方法,使用时指定format内的格式字符串即可
 * 例如：date.format("yyyy-MM-dd HH:mm:ss")
 * @param fmt
 * @returns {*}
 */
Date.prototype.format=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 保留位数
 * @param filedName
 * @param fieldValue
 * @returns {*}
 */
function handleRawData(filedName, fieldValue){
    /**
     * 保留整数
     */
    var keepInteger = {
        integerNum:""
    }
    /**
     * 保留两位
     * @type {{}}
     */
    var keep2PrecisionFields = {
        keep2Fields:""
    }
    if(filedName in keep2PrecisionFields){
        return round(fieldValue,2) + '';
    }
    if(filedName in keepInteger){
        return round(fieldValue, 0) + '';
    }
    return fieldValue;
}
function round(v, e) {
    var l = e;
    var t = 1;
    for (; e > 0; t *= 10, e--);
    var _num = Math.round(v * t) / t + "";
    var _numFloat = _num.indexOf(".");
    if (_numFloat > 0) {
        var decLength = _num.substring(_num.indexOf(".") + 1).length;
        if (decLength < l) {
            for (var i = 0; i < (l - decLength); i++) {
                _num += "0";
            }
        }
    } else {
        if(l==0){
            //保留整数时
        } else {
            _num = _num + ".";
            for (var i = 0; i < l; i++) {
                _num += "0";
            }
        }

    }
    return _num;
}

/**
 * 根据容器的大小自适应图片大小
 * 将图片放在居中位置
 * @param img
 * @param boxWidth
 * @param boxHeight
 */
function adjustImgSize(img, boxWidth, boxHeight){
    var tempImg = new Image();
    tempImg.src = img.attr('src');
//            if (tempImg.complete) {
//                alert(tempImg.width);
//                return;
//            }
    //让照片的高度不低于50px,宽度不低于40px
    if(boxHeight<50){
        boxHeight = 50;
    }
    if(boxWidth < 40){
        boxWidth = 40
    }
    //等待照片加载完成之后
    tempImg.onload = function () {
        var imgWidth=tempImg.width;
        var imgHeight=tempImg.height;
        //比较imgBox的长宽比与img的长宽比大小
        if((boxWidth/boxHeight)>=(imgWidth/imgHeight))
        {
            //重新设置img的width和height
            img.width((boxHeight*imgWidth)/imgHeight);
            img.height(boxHeight);
            //让图片居中显示
            var margin=(boxWidth-img.width())/2;
            img.css("margin-left",margin);
        }
        else
        {
            //重新设置img的width和height
            img.width(boxWidth);
            img.height((boxWidth*imgHeight)/imgWidth);
            //让图片居中显示
            var margin=(boxHeight-img.height())/4;
            img.css("margin-top",margin);
        }
    };
}
/**
 * 根据url 通过发送ajax请求，获取数据，并且通过回调函数返回获取的结果
 * @param url
 * @param data 参数
 * @param callBack
 * @param hideTip 为true时不显示失败提示,不加或为false时显示
 */
function getAjaxDatas(url,data,callBack,hideTip){
    console.log(url);
    //根据url发送ajax跨域请求
    $.ajax(
        {
            type : "get",
            url:url,
            data:data,
            dataType : "jsonp",
            jsonp: "callback",
            timeout: 5000,
            success:function(result){
                callBack(result);
            },
            complete:function(e,t){
                if(t && (t == "timeout" || t == "error" || t == "notmodified" || t == "parsererror")){
                	if(!hideTip){
                    	toastText("网络服务不给力⊙﹏⊙");
                	}
                    callBack("timeout");
                }
            }
        }
    )
}

/**
 * 通过get的方式直接请求数据
 */
function getAjaxDataByGet(url,param,callBack){
    console.log(url);
    $.ajax(
        {
            type : "get",
            url:url,
            data:param,
            timeout: 5000,
            success:function(result){
                callBack(result);
            },
            error:function(){
                toastText("网络服务不给力⊙﹏⊙");
                callBack("error");
            },
            complete:function(e,t){
                if(t && t == "timeout" && t == "parsererror"){
                    toastText("网络服务不给力⊙﹏⊙");
                    callBack("timeout");
//                    alert("请求超时");
                }

            }
        }
    )
}

function getAjaxJsonDataByGet(url,param,callBack){
    $.ajax({
        type : "get",
        url:url,
        data:param,
        timeout: 3000,
        dataType: "json",
        success:function(result){
            callBack(result);
        },
        error:function(){
            toastText("网络服务不给力⊙﹏⊙");
            callBack("error");
        },
        complete:function(e,t){
            if(t && t == "timeout"){
                toastText("网络服务不给力⊙﹏⊙");
                callBack("timeout");
            }
        }
    })
}

var isGoBackRun = false;
/**
 * 根据参数返回页面
 * 暂时设置300ms内只能执行一次goback
 */
function gobackByParams(params){
    //如果还在滚动，直接返回
    if(isGoBackRun || isAnimating){
        return false;
    }
    isGoBackRun = true;
    var tempGwMobileBackParams;
    //将当前页面的in和out页面存储起来
    var tempMoveInContent =  gwMobileBackParams[gwMobileBackParams.length - 1].params.moveInContent;
    tempGwMobileBackParams = gwMobileBackParams[gwMobileBackParams.length-1];
    gwMobileBackParams.pop();
    if(tempGwMobileBackParams){
        tempGwMobileBackParams.params.direction = "right";
        tempGwMobileBackParams.params.moveOutContent = tempMoveInContent;
        tempGwMobileBackParams.params.moveInContent = "";
        if(params){
            $.extend(tempGwMobileBackParams.params,params);
        }
        animatingFun(tempGwMobileBackParams,function(){
            setTimeout(function(){
                //销毁div
                $("#"+tempMoveInContent).remove();
                //删除不用的iscroll
                removeNewsDetailScroller();
                //将子页面的记录数减一
                if($(".subPage").length > 0){
                    vicePageNum -= 1;
                }else{
                    vicePageNum = 0;
                }
                //判断id,如果是个股页面，调用个股页面的方法
                var lastBackParam = gwMobileBackParams[gwMobileBackParams.length - 1];
                pageId = lastBackParam.pageId;
                if(lastBackParam.pageId == "quotationChart"){
                    createQuotationDetailBody(lastBackParam,true);
                }
                if(lastBackParam.pageId == "quotationIndex"){
                    refreshQuotationIndexData();
                }
            },100)
        });
//        changePageByParams(tempGwMobileBackParams);
        var goBackEndTime = new Date().getTime();
        var diffTime = goBackEndTime - goBackEndTime;
        if(diffTime < 300 ){
            diffTime = 300;
        }
        setTimeout(function(){
            isGoBackRun = false;
        },diffTime);
    }else{
        setTimeout(function(){
            isGoBackRun = false;
        },300);
    }
    return false;
}
/**
 * 回退到上个页面
 * @returns {boolean}
 */
function goback() {
    var gwMobileBackUrl;
    if (gwMobileBackUrls.length >= 2) {
        gwMobileBackUrls.pop();
        gwMobileBackUrl = gwMobileBackUrls[gwMobileBackUrls.length - 1];

        if (gwMobileBackUrl == 'url') {
            gwMobileBackUrls.pop();
            gwMobileBackUrl = gwMobileBackUrls[gwMobileBackUrls.length - 1];
        }
    }
    if (gwMobileBackUrl) {
        changePage(gwMobileBackUrl, false);
    } else {
        changePage("../news/characteristicPlate.html", false);
    }
    return false;
}

/**
 * 获取当前网络连接状态
 */
function checkConnectionStatus(){
    var networkState = navigator.network.connection.type;
    var states = {};
    //不知名网络
    states[Connection.UNKNOWN]  = 'unknownConnection';
    //以太网络
    states[Connection.ETHERNET] = 'ethernetConnection';
    //wifi连接
    states[Connection.WIFI]     = 'Wifi';
    //2G网络
    states[Connection.CELL_2G]  = '2G';
    //3G网络
    states[Connection.CELL_3G]  = '3G';
    //4G网络
    states[Connection.CELL_4G]  = '4G';
    //无网络连接
    states[Connection.NONE]  = 'noNetworkConnection';
    var connection = states[networkState];

    currentConnectionStatue = connection;
}
(function(window, document,jQuery){
    //绑定phoneGap  API加载完成之后执行的事件
    document.addEventListener('deviceready',onDeviceready,false);
    function onDeviceready(){
        //绑定设备的回退按钮事件
        document.addEventListener('backbutton',onBackKeyDown,false);
        //回退事件
        function onBackKeyDown(){
            var fonsetBox = $(".fontSetBox");
            var zoomImg = $(".zoomImg");
            if(zoomImg.length > 0){
                //关闭大图
                zoomImg.remove();
            }else if(fonsetBox.length > 0 && fonsetBox.css("display") == "block"){
                //关闭选择大小写字体
                $(".fontSetBox-inner").transition({y:0},300,"linear",function(){
                    //直接隐藏
                    isFontSizeRun = false;
                    $(".fontSetBox").hide();
                });
            }else if(isShowLoginIn){
                //如果登陆页面存在，并且处于显示状态,隐藏掉
                clearLoadingInfo();
            }else if($(".subPage ").length > 0){
                gobackByParams();
            }else if(queryPageIsShow){
                //关闭键盘宝
                closekeyboard();
            }else {
                cordova.exec(null, null,"exitApp", 'exit',[]);
//                //是一级目录，直接退出程序
//                if(confirm("确认退出程序?")){
//                    // 如果不包含回退按钮的话,提示退出程序
//                    navigator.app.exitApp();
//                }
            }
        }
        //获取当前网络状态
    }
}(window, document,jQuery))


/**
 * toast效果
 * @param message
 */
function toastText(message,pos){
    var alert = $("#toast");
    if(alert.size() <= 0){
        alert = $('<div id="toast"></div>');
        $(document.body).append(alert);
    }
    if(pos){
        alert.css("top",pos);
    }
    alert.html(message);
    setTimeout(function(){
        alert.css("opacity",0);
        if(alert.size()>0){
            alert.remove();
        }
    }, 2000);
}

/**
 * 重新设置页面高度
 */
function topResize() {
    var titleHeight = 0;
    if($(".ui-gw-header").length>0){
        titleHeight += 46;
    };
    if($(".ui-gw-bottomHeader").length>0){
        titleHeight += 57;
    }
    if($("#gw-mobile-content").length>0){

        $("#gw-mobile-content").css("height", (''+ bodyHeight - titleHeight) + "px");
    }
}

/**
 * 根据现在浏览器的高度
 * 判断键盘是否隐藏
 */
function isKeyboardHide(){
    var isKeyHide = true;
    var bodyHeightNow = $(document.body).height();
    if(bodyHeightNow != bodyHeight){
        isKeyHide = false;
    }
    return isKeyHide;
}
/**
 * 创建详文中的大图
 */
function createBigImg(imgUrl){
    if($(".zoomImg").length > 0 ){
        return;
    }
    var html = "";
    html += '<div class="zoomImg">';
    html +=  '<div class="zoomImg-inner">';
    html += '<div class="imgBox"><img src="'+ imgUrl +'" alt="" /></div>';
    html +=   ' </div>' ;
    html += '<div class="zoomImg-bot">' +
        '</div>' +
        '</div>';
    $(document.body).append(html);
    showNewsLoading($(".zoomImg"));
    $(".zoomImg img").load(function(){
        hideNewsLoading();
    });
    touchEventWithoutMove($(".zoomImg"),function(e){
        var tagName = $(e.target)[0].tagName;
        if(tagName != "IMG"){
            //如果点击的不是图片本身，直接退出
            $(".zoomImg").remove();
        }
    });
    bindLargePic($(".zoomImg img"));
}
/**
 * 绑定图片的放大缩小事件
 */
function bindLargePic($content){
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup';
    $content.unbind(START_EV);
    $content.unbind(MOVE_EV);
    $content.unbind(END_EV);
    //左右拖动时的x和y
    var beginX = 0;
    var beginY = 0;
    var isMove = true;
//    var moveX = 0;
//    var moveY = 0;
    //手指缩放时的坐标轴
    var beginX0= 0;
    var beginY0= 0;
    var beginX1= 0;
    var beginY1= 0;
    var diffLengthB = 0;
    var moveDiffLength = 0
    var picStuates = 0;
    var close = false; //如果移动的话，就不删除
    var isAnimatRun = false;
    $content.bind(START_EV,function(e){
        close = false;
        isMove = true;
        var touches = hasTouch ? e.originalEvent.touches:e.originalEvent;
        if(touches.length == 2){
            beginX0 = touches[0].pageX;
            beginY0 = touches[0].pageY;
            beginX1 = touches[1].pageX;
            beginY1 = touches[1].pageY;
            diffLengthB = Math.sqrt(countCube(beginX0 - beginX1) + countCube(beginY0 - beginY1));
        }else if(touches.length == 1){
            beginX = touches[0].pageX;
            beginY = touches[0].pageY;
        }
    })
    $content.bind(MOVE_EV,function(e){
        close = true;
        e.preventDefault();
        var touches = hasTouch ? e.originalEvent.touches:e.originalEvent;
//        var touches = e.originalEvent.touches;
        if(touches.length == 2){
            isMove = false;
            var moveBeginX0 = touches[0].pageX;
            var moveBeginY0 = touches[0].pageY;
            var moveBeginX1 = touches[1].pageX;
            var moveBeginY1 = touches[1].pageY;
            moveDiffLength = Math.sqrt(countCube(moveBeginX0 - moveBeginX1) + countCube(moveBeginY0 - moveBeginY1));
            var diffScale = moveDiffLength/diffLengthB;
            if(picStuates != 0){
                diffScale = 2 + (diffScale - 1);
            }
            $(this).css({ scale: diffScale });
        }else if(touches.length == 1){
            if(isMove){
                if(picStuates != 0){
                    var windHeight = $(document.body).height();
                    var windWidth = $(document.body).width();
                    var moveX = touches[0].pageX;
                    var moveY = touches[0].pageY;
                    var diffX = moveX - beginX;
                    var diffY = moveY - beginY;
                    var picHeight = $(this).height();
                    var picWidth = $(this).width();
                    var translateDataOld = $(this).css('translate');
                    if(translateDataOld != 0){
                        var tanslateX =parseInt(translateDataOld.split(",")[0]);
                        var tanslateY =parseInt(translateDataOld.split(",")[1]);
                        diffX = diffX + tanslateX;
                        diffY = diffY + tanslateY;
                    }
                    if(Math.abs(diffX) > (picWidth/4 + 5) ){
                        if(diffX > 0){
                            diffX = (picWidth/4 + 5);
                        }else{
                            diffX = - (picWidth/4 + 5);
                        }
                    }
                    if(Math.abs(diffY) >(picHeight/4 + 5)){
                        if(diffY > 0){
                            diffY = picHeight/4 + 5;
                        }else{
                            diffY = -(picHeight/4 + 5);
                        }
                    }

                    //控制滚动方向
                    if(windHeight > (picHeight * 2)){
                        diffY = 0;
                    }
                    if(windWidth > (picWidth * 2)){
                        diffX = 0;
                    }

                    if(isAnimatRun){
                        return false;
                    }
                    //如果某个方向上的移动距离小于5，在这个方向上不滚动
                    if(Math.abs(diffX) < 10){
                        diffX = 0;
                    }
                    if(Math.abs(diffY) < 10){
                        diffY = 0;
                    }
                    isAnimatRun = true;
                    $(this).transition({x:diffX,y:diffY},100,function(){
                        isAnimatRun=false;
                    });
//                    $(this).css({ translate: [diffX,diffY] });
                }
            }
        }
    });
    $content.bind(END_EV,function(e){
        if(moveDiffLength != 0 && diffLengthB != 0){
            var diffLenth = moveDiffLength/diffLengthB;
            if(diffLenth <= 1){
                diffLenth = 1;
                picStuates = 0;
            }else{
                diffLenth = 2;
                picStuates = 1;
            }
            $(this).css({ scale: diffLenth });
            if(picStuates == 0){
                $(this).css({ translate: [0,0]},200);
            }
            //        每次结束的时候重新置0
            beginX0= 0;
            beginY0= 0;
            beginX1= 0;
            beginY1= 0;
            beginX = 0;
            beginY = 0;
            diffLengthB = 0;
            moveDiffLength = 0;
        }else{
            if(!close){
                //普通点击的话，关闭大图
                $(".zoomImg").remove();
            }
        }
//        }
    })
    /**
     * 计算平方
     * @param count
     * @returns {number}
     */
    function countCube(count){
        return count * count;
    }
}

//获取设备id
function getDeviceId(){
    var deviceId = uuid;
    return deviceId;
}

/**
 * 获取短信验证码
 * @author 李云锋
 * @接口提供者 尚学金
 */
function getRegVerifyCode(phone, callback){
    //var url = "http://10.15.107.157/captcha/request?mobile="+phone;
    var url = getFullUrl("captcha/request?mobile="+phone);
    console.log(url);
    //{message: "captcha sent by sms", status: 1}
    getAjaxJsonDataByGet(url,{},function(result){
        console.log("获取短信验证码getRegVerifyCode的结果如下：");
        console.log(result);
        var isSuc = false;
        if(result && result== "timeout"){
            toastTextShow("访问超时！");
        }else if(result && result== "error"){
            toastTextShow("获取手机验证码失败，请检查网络！！");
        }else if(result && result.status==1){
            isSuc = true;
        }else{
            toastTextShow("获取手机验证码失败，请检查网络！！");
        }
        callback(isSuc,result);
    });
}

/**
 * 验证短信验证码是否正确
 * @author 李云锋
 * @接口提供者 尚学金
 */
function validateRegVerifyCode(phone, code, callback){
    //var url = "http://10.15.107.157/captcha/verify?mobile="+phone+"&captcha="+code;
    var url = getFullUrl("captcha/verify?mobile="+phone+"&captcha="+code);
    console.log(url);
    //{status: 1, captcha: "920324", message: "ok"}
    getAjaxJsonDataByGet(url,{},function(result){
        //result.status = 1;
        console.log("验证验证码结果如下：");
        console.log(result);
        var isSuc = false;
        if(result && result== "timeout"){
        	toastTextShow("访问超时！");
        }else if(result && result== "error"){
            toastTextShow("获取手机验证码失败，请检查网络！！");
        }else if(result && result.status==-1){
            toastTextShow("验证码不正确！");
        }else if(result && (result.status==-2 || result.status==-601)){
            toastTextShow("验证码已失效！");
        }else if(result && result.status==1){
            isSuc = true;
            callback(isSuc);
        }else{
            toastTextShow("验证码不正确或网络异常！");
        }
    });
}

//如果键盘未关闭，则先关闭，关闭完执行回调函数
function doAfterHideKeyBoard(callback){
	//执行定时任务，判断当前页面的高度是否等于初始页面的高度
	if(isKeyboardHide()){
		//如果键盘是隐藏的 直接返回
		//gobackByParams();
		callback();
	}else{
		//如果键盘没有隐藏，你懂的
		var goToSetUp = setInterval(function(){
			if(isKeyboardHide()){
				//如果键盘是隐藏的 直接返回
				//gobackByParams();
				callback();
				clearInterval(goToSetUp);
			}
		},200);
	}
}

function toastTextShow(message, pos){
	if(isKeyboardHide() || pos){
		toastText(message, pos);
	}else{
		toastText(message, 77);
	}
}

/**
*
**/
function getIncomeIncreaseInfoTitle( type ){
	type = parseInt( type );
	switch( type ){
		case 1: return "大幅减少";break;
		case 2: return "明显减少";break;
		case 3: return "同比减少";break;
		case 4: return "略微减少";break;
		case 5: return "小幅增长";break;
		case 6: return "同比增长";break;
		case 7: return "增长明显";break;
		case 8: return "大幅增长";break;
		case 9: return "与去年持平";break;
		default: return "";
	}
}
/**
*
**/
function getMicroReduceInfoTitle( type ){
	type = parseInt( type );
	switch( type ){
		case 1: return "大幅减少";break;
		case 2: return "明显减少";break;
		case 3: return "同比减少";break;
		case 4: return "略微减少";break;
		case 5: return "小幅增长";break;
		case 6: return "同比增长";break;
		case 7: return "增长明显";break;
		case 8: return "大幅增长";break;
		case 9: return "与去年持平";break;
		case 10: return "扭亏为盈";break;
		case 11: return "出现亏损";break;
		default: return "";
	}
}
/**
*
**/
function getPEQTitle( type ){
	type = parseInt( type );
	switch( type ){
		case 1: return "该股成交极度低迷";break;
		case 2: return "该股票成交活跃度相当低迷";break;
		case 3: return "该股票成交比较温和，近期波动有限";break;
		case 4: return "该股票近期成交相对活跃";break;
		case 5: return "该股票近期成交活跃";break;
		case 6: return "该股票近期成交高度活跃，注意短期波动";break;
		case 7: return "该股票近期成交极度活跃！注意短期波动剧烈";break;
		default: return "";
	}
}
/**
*
**/
function getStarInfoTitle( src, num ){
	var arr = src.split( "," );
	var html = "";
	for( var i = 0; i < arr.length;i ++ ){
		html += _getStarInfoByLevel( arr[i] );
	}
	html += _getStarInfoByNum( num );
	return html;
}

function _getStarInfoByNum( type ){
	type = parseInt( type );
	if( type > 15 ){
		return "投资者可加强关注";
	}else if( type >= 10 && type <= 15 ){
		return "投资者应加强仓位控制";
	}else if( type >=5 && type <= 9 ){
		return "投资者应注意及时止盈止损";
	}else{
		return "请投资者注意风险控制";
	}
}

function _getStarInfoByLevel( type ){
	type = parseInt( type );
	switch( type ){
		case 1: return "该股票目前不属于市场热点。";break;
		case 2: return "该股票不属于近期热点题材，资金关注度较低。";break;
		case 3: return "该股票属于近期热点题材，但热点持续性不强。";break;
		case 4: return "该股票属于近期热点，题材受到资金追捧。";break;
		case 5: return "该股票属于近期主流热点，板块集聚效应较大。";break;
		case 6: return "近期资金出逃迹象明显，短期仍有调整可能。";break;
		case 7: return "近期资金持续流出，市场参与热情不高。";break;
		case 8: return "近期资金有流入迹象，开始受到资金关注。";break;
		case 9: return "近期资金持续流入，资金关注度不断提高。";break;
		case 10: return "近期资金大幅流入，受到资金热捧。";break;
		case 11: return "公司经营业绩不佳。";break;
		case 12: return "公司经营情况一般。";break;
		case 13: return "公司经营情况正常。";break;
		case 14: return "公司经营情况较好。";break;
		case 15: return "公司业绩具有成长性。";break;
		case 16: return "另外，该股票也被我们投资家策略池中收录，说明该股在各方面颇有可圈可点之处。";break;
		default: return "";
	}
}

function _getProEarnTitle( type ){
	type = parseInt( type );
	switch( type ){
		case 1: return "估值好于同业水平";break;
		case 2: return "估值差于同业水平";break;
		case 3: return "估值与同业水平持平";break;
		default: return "";
	}
}

function _getFinaMarg( type ){
	type = parseInt( type );
	switch( type ){
		case 1: return "融资余额最高";break;
		case 2: return "融资余额最高";break;
		case 3: return "单日融券最高";break;
		case 4: return "融券余额最高";break;
		default: return "";
	}
}
