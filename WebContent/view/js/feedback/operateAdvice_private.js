/**
 * 操作建议页面
 * @author: 李云锋
 * @date: 2014-04-08
 */

//父容器
var operateAdviceContentId = "operateAdvice-vice-content";

//父容器
var operateAdviceTopTitle = "operateAdvice-title";

function createOperateAdviceBody(params){
    //创建2级页面部分
    createContent(params,operateAdviceContentId);
	//创建标题区域
    buildBlueHeader(operateAdviceTopTitle,$("#"+ operateAdviceContentId));
    //创建标题部分
    createOperateAdviceTitle(operateAdviceTopTitle);
    animatingFun(params,function(){
        //创建内容部分
    	createOperateAdviceMainBody($("#"+operateAdviceContentId));
    });
};
	
/**
 * 创建标题
 */
function createOperateAdviceTitle(titleId){
    var html = 
		'<div class="ui-gw-header-leftBtn"><div class="ui-gw-header-backward" id="operateAdviceHeader"></div></div>'+
        '<div class="ui-gw-header-title">操作建议</div>'+
        '<div class="ui-gw-header-rightBtn"></div>';
    //标题设置为空
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
    //左个角返回图标
    touchEventWithBackShadow($("#operateAdviceHeader"),function(){
    	gobackByParams();
    });
}

/**
 * 创建操作建议内容部分
 */
function createOperateAdviceMainBody($container){
    var html = 
    	'<div class="gw-mobile-content" style="height:800px;">'+
    		'<div class="operate-advice">'+
    			'<div class="operate-advice-title">我们将尽快把操作建议给到您</div>'+
    			'<div class="operate-advice-fm hbox">'+
    				'<div class="operate-advice-i spacer">'+
    					'<input type="tel" placeholder="请输入手机号码" id="operateAdvicePhone" value="" maxlength="11" class="operate-advice-ipt">'+
    				'</div>'+
    				'<div class="operate-advice-s spacer">'+
    					'<div id="operateAdviceSubmitBtn" class="operate-advice-btn">获 取</div>'+
    				'</div>'+
    			'</div>'+
		'</div>';
    $container.html(html);
	//提交按钮
    touchEventWithBackShadow($("#operateAdviceSubmitBtn"),function(){
    	var phone = $("#operateAdvicePhone").val();
    	if(phone == ""){
    		toastText("手机号不能为空！",70);
            return;
        }
        if(!/1\d{10}/.test(phone)){
        	toastText("手机号格式不正确！",70);
        	return;
        }
        var param = {memo:"盘中特供",toMobileNo:phone,activityCode:58,activitySource:80};
        var url = getFullUrl("smsNew/smsAdCRM.html");
        console.log("开始提交操作建议,url=" + url + ", 参数：");
        console.log(param);
        getAjaxDataByGet(url,param,function(result){
        	console.log("操作建议接口返回结果：" + result);
        	if(result && (result== "timeout" || result== "超时")){
        		toastText("发送超时！",70);
        	}else if(result && result== "error"){
        		toastText("发送失败，请检查网络！",70);
        	}else if(result && result>0){
        		console.log("操作建议提交成功 ^_^");
        		doAfterHideKeyBoard(function(){
        			gobackByParams();
        			toastText("发送成功！",70);
        		});
            }else{
            	toastText("发送失败"+result+"！",70);
            }
        });
    });

}
