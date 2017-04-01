/**
 * 忘记密码页面
 * @author: 李云锋
 * @date: 2014-03-12
 */

//父容器
var forgetPasswordContentId = "forgetPassword-vice-content";

//父容器
var forgetPasswordTopTitle = "forgetPassword-title";
	
var isCanSendForgetPasswordEmail = true;

function createForgetPasswordBody(params){
	pageId = params.pageId;
	enableForgetPassValidateCodeBtn();
    //创建2级页面部分
    createContent(params,forgetPasswordContentId);
	//创建标题区域
    buildBlueHeader(forgetPasswordTopTitle,$("#"+ forgetPasswordContentId));
    //创建标题部分
    createForgetPasswordTitle(forgetPasswordTopTitle);
    animatingFun(params,function(){
        //创建内容部分
    	createForgetPasswordMainBody($("#"+forgetPasswordContentId));
    });
};
	
/**
 * 创建标题
 */
function createForgetPasswordTitle(titleId){
    var html = 
		'<div class="ui-gw-header-leftBtn" id="forgetPasswordHeader"><div class="ui-gw-header-backward"></div></div>'+
		'<div class="ui-gw-header-title">忘记密码</div>';
    //标题设置为空
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
    
    touchEventWithBackShadow($("#forgetPasswordHeader .ui-gw-header-backward"),function(){
    	
    	//如果是在输入新密码页面，则显示上一个页面，而不是登录
    	if($("#forgetPasswordInputPassDiv").is(":visible")){
    		$("#forgetPasswordInputPassDiv").hide();
    		$("#forgetPasswordDiv").show();
    		return;
    	}
    	
        //执行定时任务，判断当前页面的高度是否等于初始页面的高度
        if(isKeyboardHide()){
            //如果键盘是隐藏的 直接返回
            gobackByParams();
            var isLogin = getCurrentUserInfo();
            if(isLogin=="" || isLogin==null){
            	setTimeout(function(){
            		createLoadingInfo(function(userInfo){
            			if(userInfo != "cancle" && userInfo != "timeout"){
            				var userName = userInfo.split(";")[0];
            				changeLoadingStatus(userName);
            				toastText("√ 已登录");
            			}
            		});
            	},500);
            }
        }else{
            //如果键盘没有隐藏，你懂的
            var goToSetUp = setInterval(function(){
                if(isKeyboardHide()){
                    //如果键盘是隐藏的 直接返回
                    gobackByParams();
                    var isLogin = getCurrentUserInfo();
                    if(isLogin=="" || isLogin==null){
                    	createLoadingInfo(function(userInfo){
                    		if(userInfo != "cancle" && userInfo != "timeout"){
                    			var userName = userInfo.split(";")[0];
                    			changeLoadingStatus(userName);
                    			toastText("√ 已登录");
                    		}
                    	});
                    }
                    clearInterval(goToSetUp);
                }
            },200);
        }
    });
}

/**
 * 创建一键注册内容部分
 */
function createForgetPasswordMainBody($container){
    var html = 
    '<div class="gw-mobile-content" style="height:800px;">'+
	'<div class="reg-block">'+
	'<div id="forgetPassMsg" class="reg-message" style="display:none;border-bottom:0px">'+
		'<div id="forgetPassMsgTitle" class="reg-message-title"><i></i>重置成功！</div>'+
		'<div class="reg-message-detail">'+
			'<div>请牢记：</div><div>大智慧账号:<span id="forgetPassAccountRes"></span></div><div>密码:<span id="forgetPassRes"></span></div>'+
		'</div>'+
		'<div id="forgetPassToLogin" class="reg-confirm-btn" style="margin-top:10px;">登录</div>'+
	'</div>'+ 
	'<div class="reg-confirm" id="forgetPasswordDiv">'+
		'<div class="reg-confirm-phone" style="padding-top:4px;">'+
			'<div class="reg-confirm-phone-fm reg-confirm-mail-i hbox">'+
				'<div class="reg-confirm-phone-i vbox spacer">'+
					'<input id="forgetPasswordPhone" type="text" class="reg-confirm-ipt" maxlength="11" placeholder="手机号" />'+
					'<div class="reg-confirm-phone-hr"></div><input type="hidden" id="forgetPassUname">'+
					'<input type="text" class="reg-confirm-ipt" id="forgetPasswordVerifyCode" placeholder="验证码" maxlength="10"/>'+
				'</div>'+
				'<div class="reg-confirm-phone-s spacer">'+
					'<div id="forgetPasswordvalidateCodeBtn" class="reg-confirm-btn">获取验证码</div>'+
					'<div id="forgetTimeLimit" class="reg-confirm-phone-msg"></div>'+
				'</div>'+
			'</div>'+
			'<div id="forgetValidatePhoneBtn" class="reg-confirm-btn">提交</div>'+
		'</div>'+
		'<div class="reg-confirm-mail" style="padding-top:5px;">'+
			'<div class="reg-confirm-mail-hr"><span>或者</span><div></div></div>'+
			'<div class="reg-confirm-mail-fm">'+
				'<div class="reg-confirm-mail-i vbox">'+
					'<input id="forgetPasswordEmail" type="text" class="reg-confirm-ipt" value="" placeholder="Email地址" />'+
				'</div>'+
				'<div id="forgetPasswordEmailBtn" class="reg-confirm-mail-s"><div class="reg-confirm-btn">发送邮箱认证</div></div>'+
			'</div>'+
		'</div>'+
	'</div>'+
	
	'<div class="reg-confirm" style="display:none;" id="forgetPasswordInputPassDiv">'+
	'<div class="reg-confirm-phone">'+
		'<div class="reg-confirm-phone-fm reg-confirm-mail-i hbox reg-message-detail" style="padding-top:5px;">'+
			'修改大智慧帐号<span id="modAccountSpan"></span>的密码：'+
		'</div>'+
		'<div class="reg-confirm-phone-fm reg-confirm-mail-i hbox">'+
			'<div class="reg-confirm-phone-i vbox spacer">'+
				'<input id="forgetPasswordNewPass" type="password" class="reg-confirm-ipt" maxlength="19" placeholder="新密码" />'+
				'<div class="reg-confirm-phone-hr"></div>'+
				'<input id="forgetPasswordNewPass1" type="password" class="reg-confirm-ipt" maxlength="19" placeholder="确认新密码" />'+
			'</div>'+
		'</div>'+
		'<div id="forgetPassSubmitNewpassBtn" class="reg-confirm-btn">提交</div>'+
	'</div>'+
	'</div>'+
	
	'</div>'+
	'</div>';
    $container.html(html);
    //获取验证码按钮
    touchEventWithBackShadow($("#forgetPasswordvalidateCodeBtn"),function(){
    	forgetPasswordGetVerifyCode();
    });
    //提交按钮
    touchEventWithBackShadow($("#forgetValidatePhoneBtn"),function(){
    	forgetPasswordInputNewPass();
    });
    //邮箱找回密码按钮
    touchEventWithBackShadow($("#forgetPasswordEmailBtn"),function(){
    	forgetPasswordSendEmail();
    });
    //提交新密码
    touchEventWithBackShadow($("#forgetPassSubmitNewpassBtn"),function(){
    	forgetPasswordSubmitNewPass();
    });
	//返回登录页面
    touchEventWithBackShadow($("#forgetPassToLogin"),function(){
    	 gobackByParams();
    	 setTimeout(function(){
    		 createLoadingInfo(function(userInfo){
    			 if(userInfo != "cancle" && userInfo != "timeout"){
    				 var userName = userInfo.split(";")[0];
    				 changeLoadingStatus(userName);
    				 toastText("√ 已登录");
    			 }
    		 });
    	 },500);
    });
}

var isForgetPasswordCanSendSms = true;
//获取验证码
function forgetPasswordGetVerifyCode(){
	var phone = $("#forgetPasswordPhone");
	var value = phone.val();
	if(value == ""){
		toastText("手机号不能为空！",65);
		return;
	}
	if(!/1\d{10}/.test(value)){
		toastText("手机号格式不正确！",65);
		return;
	}
	if(!isForgetPasswordCanSendSms){
		toastText("获取验证码频繁，请等1分钟后再操作！",65);
		return;
	}
	var url = getFullUrl("AccService/AccServlet.do?method=findunamebykey&keytp=mobile&key="+value);
	console.log(url);
	getAjaxDataByGet(url,{},function(result){
		console.log("根据手机号获取用户信息如下：");
		//1&uname=pztg652829
		console.log(result);
		var flag = 0;
		var res = result.split("&");
		var uname = "";
		for(var i=0;i<res.length;i++){
			var item = res[i].split("=");
			if(item.length==1){
				flag = item;
			}
			if(item[0]=="uname"){
				uname = item[1];
			}
		}
		if(flag == 1){
			$("#forgetPassUname").val(uname);
			$("#modAccountSpan").html(uname);
			forgetPasswordSendSms(value);
		}else {
			toastText("此手机号未注册过！",65);
		}
	});
}

//是否可以发送短信，防止操作频繁
var isCanSendForgetPasswordSms = true;
//定时任务
var forgetPasswordT = null;

//发送短信验证码
function forgetPasswordSendSms(phone){
	if(!isCanSendForgetPasswordSms){
		return;
	}
	$("#forgetPasswordvalidateCodeBtn").unbind("fastClick");
	$("#forgetPasswordvalidateCodeBtn").css('backgroundColor', '#cccccc');
	var c = 59;
	forgetPasswordT = setInterval(function(e){
		--c;
		$("#forgetTimeLimit").html(c+"秒后重发");
		if(c==0){
			clearInterval(forgetPasswordT);
			enableForgetPassValidateCodeBtn();
		}
	},1000);
	
	getRegVerifyCode(phone,function(isSuc,res){
    	//captcha: "978207" message: "ok" status: 1
    	//如果发送成功，则提示成功，如果测试环境有验证码，则提示验证码
    	if(isSuc){
    		toastText("我们已经发送了验证码到你的手机！",65);
    		isCanSendForgetPasswordSms = false;
    	}else{ //如果发送失败，则允许重新输入验证码
    		enableForgetPassValidateCodeBtn();
    		isCanSendForgetPasswordSms = true;
    	}
    });
	
}

//使发送验证码按钮有效
function enableForgetPassValidateCodeBtn(){ 
	if(forgetPasswordT){
		clearInterval(forgetPasswordT);
	}
	isCanSendForgetPasswordSms = true;
	$("#forgetPasswordvalidateCodeBtn").css('backgroundColor', '#2987d2');
	//$("#forgetTimeLimit").html("59秒后重发");
	$("#forgetTimeLimit").html("");
}

//验证输入的验证码是否正确，如果正确则显示输入新密码界面
function forgetPasswordInputNewPass(){
	var phone = $("#forgetPasswordPhone").val();
	var code = $("#forgetPasswordVerifyCode").val();
	if(phone==""){
		toastText("手机号不能为空！",65);
		return;
	}
	if(!/1\d{10}/.test(phone)){
		toastText("手机号格式不正确！",65);
		return;
	}
	if(code==""){
		toastText("验证码不能为空！",65);
		return;
	}
	if(!/\d{6,12}/.test(code)){
		toastText("验证码格式不正确！",65);
    	return;
    }
	
	//验证验证码是否正确
	validateRegVerifyCode(phone, code, function(isSuc){
    	//{status: 1, captcha: "920324", message: "ok"}
    	//如果发送成功，则提示成功，如果测试环境有验证码，则提示验证码
    	if(isSuc){
    		console.log("绑定手机号结果如下：");
    		$("#forgetPasswordDiv").hide();
    		$("#forgetPasswordInputPassDiv").show();
    	}else{ //如果发送失败，则允许重新输入验证码
    		enableValidateCodeBtn();
        	isCanSendSms = true;
    	}
    });
}

//提交输入的新密码
function forgetPasswordSubmitNewPass(){
	var pass1 = $("#forgetPasswordNewPass");
	var pass2 = $("#forgetPasswordNewPass1");
    var p1 = pass1.val();
    if(p1 == ""){
    	toastText("新密码不能为空！",54);
        return;
    }
    var p2 = pass2.val();
    if(p2 == ""){
    	toastText("确认密码不能为空！",54);
        return;
    }
    if(p1.length<5){
    	toastText("新密码太短！",54);
    	return;
    }
    if(p1 != p2){
    	toastText("新密码和确认密码不一致！",54);
        return;
    }
    var uname = $("#forgetPassUname").val();
    var url = getFullUrl("AccService/AccServlet.do?method=updpass&uname="+uname+"&upass="+p1);
	console.log(url);
	getAjaxDataByGet(url,{},function(result){
		console.log("更改密码结果如下：");
		//174.58&result=0&uname=pztg602818 
    	console.log(result);
    	var flag = 0;
		var res = result.split("&");
		if(res.length>1){
			flag = 1;
		}
		if(flag == 1){
			$("#forgetPasswordInputPassDiv").hide();
			$("#forgetPassAccountRes").html(uname);
			$("#forgetPassRes").html(p1);
			$("#forgetPassMsg").show();
			//将成功登录的名称存储起来
            setLastLoadingUserName(uname);
		}else {
			toastText("修改密码失败！",54);
		}
    });
}

//发送邮件验证
function forgetPasswordSendEmail(){
    var email = $("#forgetPasswordEmail");
    var value = email.val();
    if(value == ""){
    	toastText("email不能为空！",65);
        return;
    }
    if(!/^[-._A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test(value)){
    	toastText("email格式不正确！",65);
    	return;
    }
    if(!isCanSendForgetPasswordEmail){
    	toastText("您已经请求过邮箱验证，不要重复操作！",65);
    	return;
    }
    //先验证此email是否注册过，如果注册过，则发送验证邮件
    var url = getFullUrl("AccService/AccServlet.do?method=findunamebykey&keytp=email&key="+value);
	console.log(url);
	getAjaxDataByGet(url,{},function(result){
		console.log("根据email获取用户信息如下：");
		//1&uname=pztg652829
    	console.log(result);
    	var flag = 0;
		var res = result.split("&");
		var uname = "";
		for(var i=0;i<res.length;i++){
			var item = res[i].split("=");
			if(item.length==1){
				flag = item;
			}
			if(item[0]=="uname"){
				uname = item[1];
			}
		}
		if(flag != 1){
			toastText("此email未注册过！",65);
			return;
		}
		var myDate = new Date();
		//如果是1,代表以前注册过，则表送邮件
	    var url1 = getFullUrl('AccService/AccServlet.do?method=sendverifymail&__id=4&__mailto=' + value + 
	    		'&__uname=' + uname + 
	    		'&__data={"uname":"' + uname + '"}' +
	    		'&uname=' + uname + 
	    		'&dzhLogoImage=http://app.gw.com.cn/mobile/image/logo.png' + 
	    		'&dzhWebSiteURL=http://www.gw.com.cn/' +
	    		'&year=' + myDate.getFullYear() +
	    		'&month=' + (myDate.getMonth()+1) +
	    		'&date=' + myDate.getDate());
	    console.log(url1);
	    getAjaxDataByGet(url1,{},function(result){
	    	//1&code=3A3756A0616B910070070F2E66A3857C&mail=517051052@qq.com
	    	console.log("发送邮件验证4的结果如下：");
	    	console.log(result);
	    	if(result && result!= "timeout" && result!= "超时" && result!="error"){
	    		var flag = 0;
	    		var res = result.split("&");
	    		for(var i=0;i<res.length;i++){
	    			var item = res[i].split("=");
	    			if(item.length==1){
	    				flag = item;
	    			}
	    		}
	    		if(flag == 1){
	    			toastText("发送验证邮件成功！",65);
	    			isCanSendForgetPasswordEmail = false;
	    		}else {
	    			toastText("发送失败，请检查网络！",65);
	    		}
	    	}
	    });
    });
    
}
