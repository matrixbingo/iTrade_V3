/**
 * 设置和登陆页面
 */
function createFeedbackBody(params){
    //记录当前页面id
    pageId = params.pageId;
    //创建2级页面部分
    createContent(params,feedbackContentId);
    //创建新闻详细的标题区域
    buildBlueHeader(feedbackTopTitle,$("#"+ feedbackContentId));
    //创建意见反馈标题部分
    createFeedbackTitle(feedbackTopTitle);
    animatingFun(params,function(){
        //创建意见反馈的内容部分
        createFeedbackTextarea($("#"+feedbackContentId));
    });
};
/**
 * 意见反馈的父容器
 * @type {string}
 */
var feedbackContentId = "feedback-vice-content";
/**
 * 意见反馈的父容器
 * @type {string}
 */
var feedbackTopTitle = "feedback-title"
/**
 * 创建意见反馈标题
 */
function createFeedbackTitle(titleId){
    var title = "意见反馈" ;
    var html = '';
    html += '<div class="ui-gw-header-leftBtn"><div class="ui-gw-header-backward"></div></div>' +
        '<div class="ui-gw-header-title">'+ title +'</div>' +
        '<div class="ui-gw-header-rightBtn">' +
        '<div class="ui-gw-header-submit">提交</div>' +
        '</div>';
    //标题设置为空
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
    //绑定回退事件
    touchEventWithBackShadow($("#"+feedbackTopTitle+" .ui-gw-header-backward"),function(){
        if($("#feedbackText").length > 0){
            $("#feedbackText").blur();
            $("#feedbackText").html("");
        }
        if($(".gw-feedback").length > 0){
            $(".gw-feedback").remove();
        }
        //执行定时任务，判断当前页面的高度是否等于初始页面的高度
        if(isKeyboardHide()){
            //如果键盘是隐藏的 直接返回
            gobackByParams();
        }else{
            //如果键盘没有隐藏
            var isGoingBack =false;
            var goToSetUp = setInterval(function(){
                if(isKeyboardHide()){
                    if(isGoingBack){
                        return ;
                    }
                    isGoingBack = true;
                    //如果输入法隐藏了
                    gobackByParams();
                    clearInterval(goToSetUp);
                }
            },200);
        }
    });
    //绑定提交按钮事件
    touchEventWithBackShadow($("#"+feedbackTopTitle+" .ui-gw-header-rightBtn"),submitMsg);
}


/**
 * 创建意见反馈的内容部分
 */
function createFeedbackTextarea($container){
    var html = "";
    html += '<div class="gw-feedback">' +
        '<div class="gw-feedback-inner">' +
        '<textarea id="feedbackText" rows="8" placeholder="请输入您的宝贵建议"></textarea>' +
        '</div>' +
        '</div>';
    $container.html(html);
    setTimeout(function(){
        var isFocus = $("#feedbackText").is(":focus")
        if(!isFocus){
            $("#feedbackText").focus();
        }
    },500);
}
/**
 * 提交填写信息
 */
function submitMsg(){
    //首先判断意见区域有没有值
    var textareaObj = $("#feedbackText");
    var value = textareaObj.val();
    if(value == ""){
        toastText("意见不能为空！请输入意见",50);
        setTimeout(function(){
            $("#feedbackText").focus();
        },200);
    }else {
        sendFeedbackToService(value);
    }
}
/**
 * 将意见发送到后台服务器
 * @param msg
 */
function sendFeedbackToService(msg){
//    var url = "http://10.15.107.156:9289/mobile/opinion/sendMail";
    var url = getFullUrl("mobile/opinion/sendMail");
    var title = "意见反馈";
    var datas = {
        title:title,
        txt:msg
    };
    showNewsLoading($("#"+ feedbackContentId));
    getAjaxDatas(url,datas,function(result){
        hideNewsLoading();
        if(result&&result != "timeout"&& result!="error"){
            if(result == "发送成功"){
                toastText("提交成功，谢谢您的宝贵意见。",50);
                //返回到设置页面
                gobackByParams();
                $("#feedbackText").val("");
                $("#feedbackText").blur();
            }else {
                toastText("发送失败，请检查网络！",50);
                $("#feedbackText").focus();
            }
        }
    });
}
