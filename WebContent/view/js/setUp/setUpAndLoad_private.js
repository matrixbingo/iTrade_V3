    /**
 * 创建设置页面的内容
 */
function createSetUpBody(params){
    pageId = params.pageId;
    //滚动
    animatingFun(params,function(){
        //如果设置页面不存在
        if($("#"+setUpMainBody).length == 0){
            //创建主页面
            createContent(params,setUpMainBody);
            //创建上部标题区域
            buildBlueHeader(setUpTopTiltleId,$("#"+setUpMainBody));
            //创建上部标题内容
            createSetUpTopTitle(setUpTopTiltleId);
            //创建内容
            createSetUpAndLoadBody($("#"+setUpMainBody));
        }else{
            checkUserInfo();
            //重新设置缓存数据和字体大小写
            var storageSize = getAllLocalStorageDatasSize();
            $(".cacheSize").html(storageSize);
            //字体大小
            var size = getDetailFontSize();
            if(size == "big"){
                $("#fontSizeNow").css("font-size","18px");
                $("#fontSizeNow").html("大字体");
            }else{
                $("#fontSizeNow").css("font-size","16px");
                $("#fontSizeNow").html("小字体");
            }
        }
        //重新计算一下内容区域的高度
        var mainParContentHeight = $("#gw-mobile-main-setUp").height();
        var topTitleHeight = $("#"+setUpTopTiltleId).height();
        $("#"+setUpMainBody).css("height",(mainParContentHeight - topTitleHeight) + "px");
        $("#"+setUpMainBody + " .wrapperStyle").css("height",(mainParContentHeight - topTitleHeight) + "px");

        if(listSetUp){
            listSetUp.refreshDom();
        }
        $(window).resize(function(){
            reSetMainContent();
            if(pageId != "setUpIndex"){
                return;
            }
            $("#gw-mobile-main-setUp").css("height",(bodyHeight - $(".ui-gw-bottomHeader").height())+"px")
            $("#gw-mobile-main-setUp").css("width",bodyWidth);
            var mainParContentHeight = $("#gw-mobile-main-setUp").height();
            var topTitleHeight = $("#"+setUpTopTiltleId).height();
            $("#"+setUpMainBody).css("height",(mainParContentHeight - topTitleHeight) + "px");
            $("#"+setUpMainBody + " .wrapperStyle").css("height",(mainParContentHeight - topTitleHeight) + "px");
            if(listSetUp){
                listSetUp.refreshDom();
            }
        })
    });
}
/**
 * 盘中特供页面内容部分
 * @type {string}
 */
var setUpMainBody = "setUpMainBody";
/**
 * 设置页面的title id
 * @type {string}
 */
var setUpTopTiltleId = "setUpMainTitle";
/**
 * 创建设置页面的抬头
 */
function createSetUpTopTitle(titleId){
    var html = '';
    html += '<div class="ui-gw-header-leftBtn">' +
        '<div class="ui-gw-header-blank">'+ "" +'</div>' +
        '</div>';
    html += '<div class="ui-gw-header-title"><div>设置</div></div>';
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
}
var listSetUp;
/**
 * 创建设置和登录页面
 */
function createSetUpAndLoadBody($container){
    var selfData = createSetUpContent();
    listSetUp = new NewsTitleList.List($container,"",0,function(){},selfData);
    listSetUp.initData("");
    //计算缓存中数据的大小
    var storageSize = getAllLocalStorageDatasSize();
//    setDomHoverColor($('.setUpUl li'));
    $(".cacheSize").html(storageSize);
//    createSetUpBody($containerPar);
    //绑定登录页面事件
    bindLoginButtonEvn();
    //绑定列表中的事件
    bindSetUpUlEvt();
    //检查用户名称是否存在
    checkUserInfo();
    //判断版本是否有更新
    checkIsLatestVision();

}

var wrapperId;
var scrollerId
/**
 * 创建新闻详文的页面
 */
function createSetUpContent(){
    var html = "";
    wrapperId = "wrapper"+(new Date()).getTime();
    scrollerId = "scroller"+(new Date()).getTime();
    var size = getDetailFontSize();
    var fontSizeN = "";
    var fontSizeShow = "";
    if(size == "big"){
        fontSizeN = "大字体";
        fontSizeShow = "18px"
    }else {
        fontSizeN = "小字体";
        fontSizeShow = "16px"
    }
    //创建id为wrapperId的列表
    html += '<div class="wrapperStyle" id="'+ wrapperId + '">' +
        '<div id="'+ scrollerId + '">';
    html +=
        '<div class="ui-gw-setArea-top"></div>'+
        '<div class="ui-gw-setArea">' +
            '<div class="setUpLoadingArea" id="setUpLoadingArea">' +
            ' <div class="setUpLoadStatusArea">' +
            '<div><span id="setUpLoadingStatus">未登录</span></div>' +
            '<div id="setUpLoadingInfo">大智慧账号一键登录</div>' +
            '</div>' +
            '<div class="setUpLoadButton"><button type="submit" id="setUpButton">登录</button></div>' +
            '</div>' +
            '<div class="ui-gw-setUp">' +
            '<div class="ui-gw-setUp-title">系统设置：</div>' +
            '<ul class="setUpUl" >' +
            '<li id="cacheClear"><div class="hbox"><div class="spacer">清除缓存</div><div class="cacheSize">0B</div></div></li>' +
            '<li id="feedback" ><div class="hbox"><div class="spacer">意见反馈</div></div></li>';
    html += ' <li id="fontSizeLi" class=""><div class="hbox"><div class="spacer">字体大小</div><div id="fontSizeNow" style="font-size: '+ fontSizeShow +'">'+ fontSizeN +'</div></div>';
    html += '</li>';
    html +=  '<li id="versionUpdatas"><div class="hbox" ><div class="spacer">版本</div><div class="checkUpdatas">'+ versionNumber +'<span class="updataPoint"></span></div></div></li>' +
        '</ul>' +
        '</div>' +
        '</div>';
    html +='</div>' +
        '</div>';
    var returnData = {};
    returnData.html = html;
    returnData.wrapperId = wrapperId;
    returnData.scrollerId = scrollerId;
    returnData.isOnlyScroll = true;
//    returnData.showScrollBar = false;
    returnData.evnClick = function(){};
    return returnData;
}
var isFontSizeRun = false;
/**
 * 绑定列表的事件
 */
function bindSetUpUlEvt(){
    //清楚缓存
    touchEventWithBackShadow($("#cacheClear"),function(){
        clearAllLocalStorageDatas();
        //将缓存大小设置为0B
        $(".cacheSize").html("0B");
    },"touchedLi");
    touchEventWithBackShadow( $("#fontSizeLi"),function(e){
        if(!isFontSizeRun){
            isFontSizeRun = true;
            //显示选择字体大小
            createFontSizeSelect();
        }
    },"touchedLi");
    //版本更新
    touchEventWithBackShadow( $("#versionUpdatas"),function(){
        checkVersions("setUp",function(result){
            if(result == "最新"){
                toastText("已经是最新版本");
            }
        });
    },"touchedLi");

    //意见反馈
    touchEventWithBackShadow( $("#feedback"),function(){
        goToFeedback();
    },"touchedLi");
}
/**
 * 创建选择字体大小控件
 */
function createFontSizeSelect(){
    var fontSize = getDetailFontSize();
    var bigClass = "";
    var smallClass = "";
    if(fontSize == "big"){
        bigClass = "choosed";
    }else{
        smallClass = "choosed";
    }
    if($(".fontSetBox").length == 0){
        //如果没有的话，创建
        var html = '<div class="fontSetBox">' +
            '<div class="fontSetBox-inner">' +
            '<div class="fontSetBox-title">字体大小</div>' +
            '<div id="smallFontSize" class="fontSetBox-choose '+ smallClass +'"><span class="small-size">小字体</span><i></i></div>' +
            '<div id="bigFontSize" class="fontSetBox-choose '+ bigClass +'"><span class="big-size">大字体</span><i></i></div>' +
            '</div>';
        $(document.body).append(html);
        //绑定点击事件
        _bindFontSizeSelect();
    }else{
        $("#bigFontSize").removeClass("choosed");
        $("#smallFontSize").removeClass("choosed");
        $("#bigFontSize").addClass(bigClass);
        $("#smallFontSize").addClass(smallClass);
        $(".fontSetBox").show();
    }
    //展示选择按钮动画
    $(".fontSetBox-inner").transition({x:"0px",y:"-202px"});
}

function _bindFontSizeSelect(){
    touchEventWithoutMove($(".fontSetBox"),function(e){
        //如果点击的是黑色背景区域
        if($(e.target).hasClass("fontSetBox")){
            $(".fontSetBox-inner").transition({y:0},300,"ease-in-out",function(){
                isFontSizeRun = false;
                //直接隐藏
                $(".fontSetBox").hide();
            });
        }
    });
    touchEventWithBackShadow($("#smallFontSize"),function(e){
        e.preventDefault();
        e.stopPropagation();
        changeFontSize("smallFontSize");
        return false;
    });
    touchEventWithBackShadow($("#bigFontSize"),function(e){
        e.preventDefault();
        e.stopPropagation();
        changeFontSize("bigFontSize");
        return false;
    })
}
function changeFontSize(contentId){
    var chooseId = "";
    var unChooseId = "";
    var fontSize = "";
    if(contentId == "bigFontSize"){
        chooseId = "bigFontSize";
        unChooseId = "smallFontSize";
        fontSize = "big";
        $("#fontSizeNow").css("font-size","18px");
        setTimeout(function(){
            $("#fontSizeNow").html("大字体");
        },10);
    }else{
        chooseId = "smallFontSize";
        unChooseId = "bigFontSize";
        fontSize = "small";
        $("#fontSizeNow").css("font-size","16px");
        setTimeout(function(){
            $("#fontSizeNow").html("小字体");
        },10);
    }
    $("#"+unChooseId).removeClass("choosed");
    $("#"+chooseId).addClass("choosed");
    setDetailFontSize(fontSize);
    setTimeout(function(){
        $(".fontSetBox-inner").transition({y:0},300,"ease-in-out",function(){
            isFontSizeRun = false;
            //直接隐藏
            $(".fontSetBox").hide();
        });
    },50)
}
/**
 * 用户是否登录
 * @type {boolean}
 */
var isUserLoagin = false;
/**
 * 绑定登录事件
 */
function bindLoginButtonEvn(){
    //判断按钮的内容
    if($(".setUpLoadingArea").length>0){
//        $(".setUpLoadingArea").bind("fastClick",function(){
        touchEventWithoutMove($(".setUpLoadingArea"),function(e){
            e.preventDefault();
            e.stopPropagation();
            var text = $("#setUpButton").text();
            if(text == "登录"){
                createLoadingInfo(function(userInfo){
                    if(userInfo != "cancle" && userInfo != "timeout"){
                        var userName = userInfo.split(";")[0];
                        changeLoadingStatus(userName);
                        toastText("√ 已登录");
                    }
                });
                return false;
            } else if(text == "退出"){
                if(!isUserLoagin){
                    toastText("您尚未登录!");
                } else {
                    if(window.plugins){
                        var userInfo = getCurrentUserInfo();
                        var userName = userInfo.split(";")[0];
                        window.plugins.storagePlugin.logout(userName,function(){
                            //改变用户状态
                            changeLoadingStatus("未登录",true);
                            //删除缓存中存储的用户信息
                            clearUserInfoIn();
                            //删除是否同步属性
                            setLocalQuotationProps("isOptionalSynchronized");
                            $("#setUpButton").text("登录");
                            toastText("√ 已退出");
                            if($("#cPlateMainTitle .ui-gw-header-addRemind").length > 0){
                                $("#cPlateMainTitle .ui-gw-header-addRemind").html("添加提醒");
                            }
                            //调用phoneGap接口，退出当前用户
                            window.plugins.storagePlugin.setCurrentUser("",function(){console.log("退出账号成功"),
                                function(){console.log("退出账号失败")}});
                        },function(){
                            toastText("网络服务不给力⊙﹏⊙");
                        });
                    }
                }
                return false;
            }
        });
    }
}
/**
 * 检查缓存中是否存在用户信息
 */
function checkUserInfo(){
    //判断内存中 是否有用户信息
    var userInfo = getCurrentUserInfo();
    if(userInfo != ""){
        //用户名
        var userName = userInfo.split(";")[0];
        changeLoadingStatus(userName);
    }
}
/**
 * 改变用户登录状态
 */
function changeLoadingStatus(name,loginOut){
    //改变登录名称
    var userInfo = "账户 : "+name;
    $("#setUpLoadingInfo").html(userInfo);
    $("#setUpLoadingStatus").html("已登录");
    //改变登录状态和头像
    if(loginOut){
        isUserLoagin = false;
        $("#setUpLoadingStatus").html("未登录");
        $("#setUpLoadingInfo").html("大智慧一键登录");
        $("#setUpLoadButton").text("登录");
    }else {
        isUserLoagin =true;
        $("#setUpButton").text("退出");
    }
}
/**
 *
 * 判断是否是最新版本
 */
function checkIsLatestVision(){
    if(!isLatestVersion){
        $(".updataPoint").html( '•');
    }
}
/**
 * 跳转到意见反馈页面
 */
function goToFeedback(){
    var params = {pageId:"feedback",params:{
        callback:createFeedbackBody
    }}
    changePageByParams(params);
}