/**
 * 新闻订制页面
 * @author: 李云锋
 * @date: 2014-03-13
 */

//父容器
var newsSubscribeContentId = "newsSubscribe-vice-content";

//父容器
var newsSubscribeTopTitle = "newsSubscribe-title";

//新闻订制cache唯一标识
var newsSubscribeCache = "newsSubscribeCache";

//语音诊股cache唯一标识
var newsSubscribeVoiceCache = "newsSubscribeVoiceCache";

//是否正在处理新闻订制
var isNowNewsSubscribe = false;
	
function createNewsSubscribeBody(params){
    //创建2级页面部分
    createContent(params,newsSubscribeContentId);
	//创建标题区域
    buildBlueHeader(newsSubscribeTopTitle,$("#"+ newsSubscribeContentId));
    //创建标题部分
    createNewsSubscribeTitle(newsSubscribeTopTitle);
    animatingFun(params,function(){
    	//创建底部
    	createNewsSubscribeBottom($("#"+ newsSubscribeContentId));
        //创建内容部分
    	createNewsSubscribeMainBody($("#"+newsSubscribeContentId));
    });
};
	
/**
 * 创建标题
 */
function createNewsSubscribeTitle(titleId){
    var html = 
		'<div class="ui-gw-header-leftBtn">'+
			'<div class="ui-gw-header-backward" id="newsSubscribeHeader"></div>'+
		'</div>'+
		'<div class="ui-gw-header-title">新闻订制</div>'+
		'<div class="ui-gw-header-rightBtn">'+
			'<div id="newsSubscribeSubmitBtn" class="ui-gw-header-submit" style="cursor:pointer;">提交</div>'+
		'</div>';
    //标题设置为空
    if($("#"+titleId).length>0){
        $("#"+titleId).html(html);
    }
    //左个角返回图标
    touchEventWithBackShadow($("#newsSubscribeHeader"),function(){
    	gobackByParams();
    });
    //提交按钮
    touchEventWithBackShadow($("#newsSubscribeSubmitBtn"),function(){
    	var v = $("#newsSubscribeContent").val();
    	if(v==""){
    		toastText("新闻线索或采访主题不能为空！",70);
    		return;
    	}
    	//var len = v.replace(/[^\x00-\xff]/g,"**").length;
    	var len = v.length;
    	if(len<5){
    		toastText("内容太短，至少输入5个字符！",70);
    		return;
    	}
    	if(len>140){
    		toastText("内容太长，不能超过140个字符！",70);
    		return;
    	}
    	
    	if(isNowNewsSubscribe){ //如果正在发布中，则取消本次操作
    		return;
    	}
    	
    	if(localStorage){
            var saveValue = localStorage.getItem(newsSubscribeCache);
            if(saveValue && saveValue.length>0){
            	var temp = saveValue.split(",");
            	var saveContent = temp[0];
            	var saveTime = temp[1];
            	console.log("上次content="+saveContent+",现content="+v+",saveTime="+saveTime+",now="+new Date().getTime()); 
            	//var m = parseInt(Math.abs(new Date().getTime()-saveTime)/1000/60);
            	if(Math.abs(new Date().getTime() - saveTime) <= 60 * 1000){
            		toastText("操作频繁，请1分钟后再提交！",70);
            		return;
            	}
            }
        }else{
        	return;
        }
    	
    	var mUsername = "";
    	var a = getCurrentUserInfo(); //pztg602818;9718360
    	if(a!=null && a.length>0){
    		mUsername = a.split(";")[0];
    	}
    	
    	var deviceId = "";
    	/*deviceId = "2,e91fc158e65e8a838a65bb871768085eaa78e718e0b329466479d6b9cb3f34be";
		newsSubscribe(deviceId,mUsername,v);
    	return;*/
    	window.plugins.storagePlugin.getPushId(
			function(res){
				//alert("获取pushId成功:" + res);
				console.log("获取pushId成功: " + res);
				deviceId = res;
				isNowNewsSubscribe = true; //将当前状态置为正在操作
				newsSubscribe(deviceId,mUsername,v);
			},
			function(res){
				//alert("获取pushId失败");
				console.error("获取pushId失败");
				console.log(res);
				toastText("发送失败！",70);
			}
    	);
    });
}

//新闻订制
function newsSubscribe(deviceId,mUsername,content){
	//var url = "http://10.15.107.177:9090/txswx/api/addordernews";
	//接口提供者：胡晓丰
	var url = getFullUrl("txswx/api/addordernews");
	//deviceId ： 设备号 mUser ：app中为空  mUsername：如果有登录就是用户名称，没有的话为null content：内容20-3000字内 fromBy ： 来源 - 移动终端:“MAPP
	//var params = {deviceId:getDeviceId(),mUser:"",mUsername:mUsername,content:v,fromBy:"MAPP"};
	var params = {deviceId:deviceId, mUser:"", mUsername:mUsername, content:content, fromBy:"MAPP"};
    console.log("开始新闻订制,url=" + url + ", 参数：");
    console.log(params);
    //{"status":"SUCCESS","msg":null,"result":null}
    getAjaxDataByGet(url,params,function(result){
    	console.log("新闻订制发送结果如下：");
    	console.log(result);
    	if(result && (result== "timeout" || result== "超时")){
    		toastText("发送超时！",70);
    	}else if(result && result== "error"){
    		toastText("发送失败，请检查网络！",70);
    	}else if(result && result.status=="SUCCESS"){
    		console.log("发送[" + content + "]成功 ^_^");
    		doAfterHideKeyBoard(function(){
    			gobackByParams();
        		toastText("提交成功！",70);
        		if(localStorage){
                    localStorage.removeItem(newsSubscribeCache);
                    localStorage.setItem(newsSubscribeCache,(content + "," + new Date().getTime()));
                    saveAllStorageIds(newsSubscribeCache); //将id放到缓存id中去
                }
    		});
    		/*gobackByParams();
    		toastText("提交成功！");
    		if(localStorage){
                localStorage.removeItem(newsSubscribeCache);
                localStorage.setItem(newsSubscribeCache,(content + "," + new Date().getTime()));
                saveAllStorageIds(newsSubscribeCache); //将id放到缓存id中去
            }*/
        }else{
        	toastText("发送失败"+result+"！",70);
        }
    	isNowNewsSubscribe = false; //处理完毕，重置值
    });
}
/**
 * 创建新闻订制内容部分
 */
function createNewsSubscribeMainBody($container){
    var html = 
	    '<div class="gw-mobile-content" style="height:800px;">'+
	        '<div class="newsCustom">'+
		'<div class="newsCustom-top"></div>'+
		'<div class="newsCustom-tx">'+
			'<textarea rows="5" id="newsSubscribeContent" placeholder="输入新闻线索或采访主题" maxlength="280"></textarea>'+
		'</div>'+
		'<div class="newsCustom-tips-1">您想看什么新闻，告诉我们。</div>'+
		'<div class="newsCustom-tips-2">大智慧通讯社有200个记者为您去采访，量身订制的新闻一旦写成，将会通知到您的手机。</div>'+
	'</div>'+
	'</div>';
    $container.html(html);
    //注册newsSubscribeContent获取焦点事件和失去焦点事件
    $("#newsSubscribeContent").bind("focus", function(){
    	//$(".one-to-one-diagnosis").css("display", "none");
    	$(".one-to-one-diagnosis").css("position", "absolute");
    	$(".one-to-one-diagnosis").css("left", "0");
    	$(".one-to-one-diagnosis").css("bottom", "0");
    });
    $("#newsSubscribeContent").bind("blur", function(){
    	//$(".one-to-one-diagnosis").css("display", "block");
    	$(".one-to-one-diagnosis").css("position", "fixed");
    });
    //订制语音诊股按钮
    touchEventWithBackShadow($("#newsSubscribeVoiceDiv"),function(){
    	var phone = $("#newsSubscribePhone").val();
    	if(phone == ""){
    		toastText("手机号不能为空！",70);
            return;
        }
        if(!/1\d{10}/.test(phone)){
        	toastText("手机号格式不正确！",70);
        	return;
        }
        
        if(localStorage){
            var saveValue = localStorage.getItem(newsSubscribeVoiceCache);
            if(saveValue && saveValue.length>0){
            	var temp = saveValue.split(",");
            	var savePhone = temp[0];
            	var saveTime = temp[1];
            	console.log("上次手机号savePhone="+savePhone+",现phone="+phone+",saveTime="+saveTime+",now="+new Date().getTime()); 
            	/*if(savePhone==phone){
            		toastText("同一手机号不能重复订制！");
            		return;
            	}*/
            	var m = parseInt(Math.abs(new Date().getTime()-saveTime)/1000/60);
            	if(m<=1){
            		toastText("操作频繁，请1分钟后再提交！",70);
            		return;
            	}
            }
        }else{
        	return;
        }
        
        //测试环境 http:// 10.15.89.236:8080/smsNew/smsAdCRM.html
        //生产环境 http://cz.gw.com.cn/smsNew/smsAdCRM.html
        var param = {memo:"盘中特供",toMobileNo:phone,activityCode:58,activitySource:80};
        var url = getFullUrl("smsNew/smsAdCRM.html");
        console.log("开始订制语音诊股,url=" + url + ", 参数：");
        console.log(param);
        getAjaxDataByGet(url,param,function(result){
        	console.log("订制语音诊股发接口返回结果：" + result);
        	if(result && (result== "timeout" || result== "超时")){
        		toastText("发送超时！",70);
        	}else if(result && result== "error"){
        		toastText("发送失败，请检查网络！",70);
        	}else if(result && result>0){
        		console.log("订制语音诊股成功 ^_^");
        		doAfterHideKeyBoard(function(){
        			gobackByParams();
        			toastText("发送成功！",70);
            		if(localStorage){
                        localStorage.removeItem(newsSubscribeVoiceCache);
                        localStorage.setItem(newsSubscribeVoiceCache,(phone + "," + new Date().getTime()));
                        saveAllStorageIds(newsSubscribeVoiceCache); //将id放到缓存id中去
                    }
        		});
            }else{
            	toastText("发送失败"+result+"！",70);
            }
        });
    });

}

/**
 * 创建底部
 */
function createNewsSubscribeBottom($container){
    var html =  
    	'<div class="one-to-one-diagnosis">'+
		'<div class="one-to-one-diagnosis-inner">'+
			'<div class="one-to-one-diagnosis-title">一对一诊股</div>'+
			'<div class="one-to-one-diagnosis-form hbox" style="padding-bottom:10px;">'+
				'<div class="one-to-one-diagnosis-i spacer">'+
					'<input type="text" id="newsSubscribePhone" class="one-to-one-diagnosis-ipt" placeholder="请输入您手机号码" maxlength="11"/>'+
				'</div>'+
				'<div class="one-to-one-diagnosis-s spacer">'+
					'<div class="one-to-one-diagnosis-sub" id="newsSubscribeVoiceDiv" style="cursor:pointer;">订制语音诊股</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>';

    $container.after(html);
    var oldHeight = $container.height();
    $container.css("height",oldHeight-42);
}
