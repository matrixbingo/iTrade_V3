/**
 * 设置一键注册页面
 * @author: 李云锋
 * @date: 2014-03-12
 */
function createRegisterBody(params){
	enableValidateCodeBtn();
    //创建2级页面部分
    createContent(params,registerContentId);
    //创建标题区域
    buildBlueHeader(registerTopTitle,$("#"+ registerContentId));
    //创建标题部分
    createRegisterTitle(registerTopTitle);
    animatingFun(params,function(){
        //创建内容部分
        createRegMainBody($("#"+registerContentId));
    });
};

//父容器
var registerContentId = "register-vice-content";

//父容器
var registerTopTitle = "register-title"
	
//创建标题
function createRegisterTitle(titleId){
    var html = 
		'<div class="ui-gw-header-leftBtn" id="regHeader"><div class="ui-gw-header-backward"></div></div>'+
		'<div class="ui-gw-header-title"></div>'+
		'<div class="ui-gw-header-rightBtn"><div id="regSkip" class="ui-gw-header-skip" style="display:none;">跳过</div></div>';
    //标题设置为空
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
    
    touchEventWithBackShadow($("#regHeader .ui-gw-header-backward"),function(){
    	if(regSuccessFlag == 1){//注册成功
    		if(isKeyboardHide()){//键盘隐藏
    			gobackByParams();
	    		var userName = getLastLoadingUserName();
	    		changeLoadingStatus(userName, false);
    		}else{//键盘显示
    			var goToSetUp4flag1 = setInterval(function(){
	                if(isKeyboardHide()){
	                    //如果键盘是隐藏的 直接返回
	                    gobackByParams();
	    				var userName = getLastLoadingUserName();
	    				changeLoadingStatus(userName, false);
	                    clearInterval(goToSetUp4flag1);
	                }
	            },200);
    		}
    	}else{//注册失败或者已经注册过了
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
    	}
    });
    //绑定提交按钮事件
    touchEventWithBackShadow($("#regSkip"),function(){
    	gobackByParams();
    	var userName = getLastLoadingUserName();
	    changeLoadingStatus(userName, false);
    });
}
/**
 * 创建一键注册内容部分
 */
function createRegMainBody($container){
    var html = 
    '<div class="gw-mobile-content" style="height:800px;">'+
		'<div class="reg-block">'+
	'<div id="regResMsg" class="reg-message" style="border-bottom:0px;">'+
		'<div id="regResMsgTitle" class="reg-message-title"><i></i>注册成功！</div>'+
		'<div class="reg-message-detail">'+
			'<div id="regMsgDiv">请牢记大智慧账号:<span id="regResAccount"></span>&nbsp;&nbsp;密码:<span id="regResPass"></span>&nbsp;&nbsp;'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div id="regConfirmDiv" class="reg-confirm" style="display:none">'+
		'<div class="reg-confirm-title">绑定手机号/Email，方便找回密码</div>'+
		'<div class="reg-confirm-phone">'+
			'<div class="reg-confirm-phone-fm hbox">'+
				'<div class="reg-confirm-phone-i vbox spacer">'+
					'<input id="regPhone" type="text" class="reg-confirm-ipt" maxlength="11" placeholder="手机号" />'+
					'<div class="reg-confirm-phone-hr"></div>'+
					'<input type="text" class="reg-confirm-ipt" id="validateCode" placeholder="验证码" maxlength="10"/>'+
				'</div>'+
				'<div class="reg-confirm-phone-s spacer">'+
					'<div id="validateCodeBtn" class="reg-confirm-btn">获取验证码</div>'+
					'<div id="timeLimit" class="reg-confirm-phone-msg"></div>'+
				'</div>'+
			'</div>'+
			'<div id="validatePhoneBtn" class="reg-confirm-btn" style="margin-top:6px;">提交验证</div>'+
		'</div>'+
		'<div class="reg-confirm-mail" style="padding-top:4px;">'+
			'<div class="reg-confirm-mail-hr"><span>或者</span><div></div></div>'+
			'<div class="reg-confirm-mail-fm">'+
				'<div class="reg-confirm-mail-i vbox">'+
					'<input id="regEmail" type="text" class="reg-confirm-ipt" value="" placeholder="Email地址" />'+
				'</div>'+
				'<div id="sendEmailBtn" class="reg-confirm-mail-s"><div class="reg-confirm-btn">发送邮箱认证</div></div>'+
				'<div class="reg-confirm-phone-cr" style="padding:0px;"><i class="checked"></i>我已阅读并同意<a id="regRuleA">《用户协议》</a></div>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'</div>'+
	'</div>';
    
    html = html + 
		'<div class="loginBox regRuleBox" style="display:none;" id="regRuleDiv">' +
		    '<div class="loginBox-inner1">' +
			    '<div class="loginBox-close" style="height:40px;"><div class="loginBox-closeBtn" id="regRuleClose" style="margin-right:10px;width:75px;"></div></div>' +
			    '<div class="loginBox-form1" style="height:90%"><iframe src="http://pay.gw.com.cn/rulesregister.jsp" allowtransparency="true" style="background-color=transparent" frameborder="0" width="100%" height="100%"></iframe></div>' +
		    '</div>' +
		    '<div class="loginBox-bg1"></div>' +
	    '</div>';
    
    $container.html(html);
    reg(); //一键注册
    //发送验证码按钮
    touchEventWithBackShadow($("#validateCodeBtn"),function(){
    	regSendPhoneMsg();
    });
    //提交验证按钮
    touchEventWithBackShadow($("#validatePhoneBtn"),function(){
    	regValidatePhone();
    });
    //发送邮箱认证按钮
    touchEventWithBackShadow($("#sendEmailBtn"),function(){
    	regValidateEmail();
    });
    touchEventWithBackShadow($("#regRuleA"),function(){
    	$("#regRuleDiv").show();
    });
    touchEventWithBackShadow($("#regRuleClose"),function(){
    	$("#regRuleDiv").hide();
    });
}

var regSuccessFlag = 0;
//正式注册
function reg(){
	var deviceId = getDeviceId();
	if(typeof(deviceId) == "undefined" || deviceId == null){
		console.log("一键注册失败，设备id不存在。");
		$("#regMsgDiv").hide();
        regShowResult("<i></i>一键注册失败，无法得到设备编号。", "******", "******");
		return;
	}
	//deviceId = "dzh011";
	var url = getFullUrl("AccService/AccServlet.do?method=adduserex&prefix=pztg&gen=seq&keytp=ycpdevid&key="+deviceId);
	console.log(url);
	getAjaxDataByGet(url,{},function(result){
		console.log("一键注册结果如下：");
    	console.log(result);
        if(result && result!= "timeout" && result!= "超时" && result!="error"){
        	var flag = 0;
        	var res = result.split("&");
        	var uname = "";
        	var usertid = "";
        	var upass = "";
        	for(var i=0;i<res.length;i++){
        		var item = res[i].split("=");
        		if(item.length==1){
        			flag = item;
        		}
        		if(item[0]=="uname"){
        			uname = item[1];
        		}
        		if(item[0]=="usertid"){
        			usertid = item[1];
        		}
        		if(item[0]=="upass"){
        			upass = item[1];
        		}
        	}
        	regSuccessFlag = flag;
        	//1&uname=pztg602818&usertid=9718360&upass=355125&mobile=15026574110
            if(flag == 1){
            	$("#regResMsg").css("border-bottom","1px");
            	$("#regConfirmDiv").show();
                regShowResult("<i></i>注册成功", uname, upass);
                $("#regResMsg").show();
                $("#regSkip").show();
                //将成功登录的名称存储起来
                setLastLoadingUserName(uname);
                setCurrentUserInfo(uname + ";" + usertid);
                //调用phoneGap接口
                window.plugins.storagePlugin.setCurrentUser(uname,function(){console.log("添加账号成功"),function(){console.log("添加账号失败")}});
            }else if(flag == 2){ //2&uname=pztg602818
                regShowResult("<i></i>本机已经注册过", uname, "******");
                //$("#kefuTel").show();
                $("#regMsgDiv").append("客服:<span id='kefuTel'>400-880-9188</span>");
                $("#regSkip").hide();
                $("#regResMsg").css("border-bottom","0px");
                //$("#regConfirmDiv").show();
            }else {
            	console.log("flag=" + flag + ", 一键注册失败，请检查网络！");
            	toastText("一键注册失败，请检查网络 "+flag, 77);
            	$("#regMsgDiv").hide();
                //$("#regResMsg").css("border-bottom","0px");
                regShowResult("<i></i>注册失败", "******", "******");
            }
        }else{
        	$("#regMsgDiv").hide();
            regShowResult("<i></i>注册失败", "******", "******");
            toastText("一键注册失败，请检查网络 "+flag, 77);
        }
    });
}

//在页面上显示一键注册的结果
function regShowResult(title, name, pass){
	$("#regResMsgTitle").html(title);
	$("#regResAccount").html(name);
    $("#regResPass").html(pass);
}

//是否可以发送短信，防止操作频繁
var isCanSendSms = true;

//注册手机验证码到计时interval
var regT = null;

//下发短信验证码
function regSendPhoneMsg(){
	var phone = $("#regPhone").val();
    if(phone == ""){
    	toastText("手机号不能为空！",77);
        return;
    }
    if(!/1\d{10}/.test(phone)){
    	toastText("手机号格式不正确！",77);
    	return;
    }
    if(!isCanSendSms){
    	return;
    }
    $("#validateCodeBtn").unbind("fastClick");
    $("#validateCodeBtn").css('backgroundColor', '#cccccc');
    var c = 59;
    regT = setInterval(function(e){
    	--c;
        $("#timeLimit").html(c+"秒后重发");
        if(c==0){
        	enableValidateCodeBtn();
        	isCanSendSms = true;
        }
    },1000);
    
    getRegVerifyCode(phone,function(isSuc,res){
    	//captcha: "978207" message: "ok" status: 1
    	//如果发送成功，则提示成功，如果测试环境有验证码，则提示验证码
    	if(isSuc){
    		toastText("我们已经发送了验证码到你的手机！",77);
    		isCanSendSms = false;
    	}else{ //如果发送失败，则允许重新输入验证码
    		enableValidateCodeBtn();
        	isCanSendSms = true;
    	}
    });
}

//使发送验证码按钮有效
function enableValidateCodeBtn(){ 
	if(regT){
		clearInterval(regT);
	}
	isCanSendSms = true;
	$("#validateCodeBtn").css('backgroundColor', '#2987d2');
	//$("#timeLimit").html("59秒后重新发送");
	$("#timeLimit").html("");
	$("#validateCodeBtn").bind("fastClick",function(){
    	regSendPhoneMsg();
    });
}

//绑定手机号
function regValidatePhone(){
	var phone = $("#regPhone").val();
	var code = $("#validateCode").val();
	if(phone == ""){
		toastText("手机号不能为空！",77);
        return;
    }
    if(!/1\d{10}/.test(phone)){
    	toastText("手机号格式不正确！",77);
    	return;
    }
    if(code == ""){
    	toastText("验证码不能为空！",77);
        return;
    }
    if(!/\d{6,12}/.test(code)){
    	toastText("验证码格式不正确！",77);
    	return;
    }
    
    validateRegVerifyCode(phone,code,function(isSuc){
    	//{status: 1, captcha: "920324", message: "ok"}
    	//如果发送成功，则提示成功，如果测试环境有验证码，则提示验证码
    	if(isSuc){
    		var account = $("#regResAccount").text();
    	    var url = getFullUrl("AccService/AccServlet.do?method=userkeybind&uname="+account+"&key=mobile="+phone);
    		console.log(url);
    		getAjaxDataByGet(url,{},function(result){
    			console.log("绑定手机号结果如下：");
    			//1&uname=pztg652829&mobile=15026574121
    	    	console.log(result);
    	        if(result && result!= "timeout" && result!= "超时" && result!="error"){
    	        	if(result==-230){
    	        		toastText("验证失败，此手机号已被绑定过，不能重复绑定！", 77);
    	        		return;
    	        	}
    	        	toastText("恭喜您，验证通过！",77);
    	        	isCanSendSms = false;
    	        	if(regT){
    	        		clearInterval(regT);
    	        	}
    	        }else{
    	        	toastText("验证手机验证码失败，请检查网络！",77);
    	        }
    	    });
    	}else{ //如果发送失败，则允许重新输入验证码
    		enableValidateCodeBtn();
        	isCanSendSms = true;
    	}
    });
}

var isCanSendEmail = true;
//发送邮件验证
function regValidateEmail(){
    var email = $("#regEmail");
    var value = email.val();
    if(value == ""){
    	toastText("email不能为空！",77);
        return;
    }
    if(!/^[-._A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test(value)){
    	toastText("email格式不正确！",77);
    	return;
    }
    if(!isCanSendEmail){
    	toastText("您已经发送过邮箱验证，请不要重复发送！",77);
    	return;
    }
    var account = $("#regResAccount").text();
    var myDate = new Date();
    var url = getFullUrl('AccService/AccServlet.do?method=sendverifymail&__id=6&__mailto=' + value +
    //var url = "http://10.15.112.239:8080/AccService/AccServlet.do?method=sendverifymail&__id=6&__mailto=" + value +
    		'&__uname=' + account +
    		'&__data={"uname":"' + account + '"}' +
    		'&year=' + myDate.getFullYear() +
    		'&month=' + (myDate.getMonth()+1) +
    		'&date=' + myDate.getDate());
    console.log(url);
    getAjaxDataByGet(url,{},function(result){
    	//1&code=3A3756A0616B910070070F2E66A3857C&mail=517051052@qq.com
    	console.log("发送邮件验证的结果如下：");
    	console.log(result);
    	if(result && result!= "timeout" && result!= "超时" && result!="error"){
    		var flag = 0;
    		var res = result.split("&");
    		var code = "";
    		var mail = "";
    		for(var i=0;i<res.length;i++){
    			var item = res[i].split("=");
    			if(item.length==1){
    				flag = item;
    			}
    			if(item[0]=="code"){
    				code = item[1];
    			}
    			if(item[0]=="mail"){
    				mail = item[1];
    			}
    		}
    		if(flag == 1){
    			toastText("发送验证邮件成功！",77);
    			isCanSendEmail = false;
    		}else {
    			console.log("发送失败，请检查网络！");
    			toastText(flag + ", 发送失败，请检查网络！",77);
    		}
    	}
    });
}
