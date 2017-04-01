/**
 * User: zhen
 * Date: 13-12-18
 * Time: 下午3:30
 */
//判断是否登录，登录则返回userid
function getUserInfo(){
    var userInfo = getCurrentUserInfo();
    if( userInfo && userInfo != ""){
        //获取userid，并同步自选股信息
        var userName = userInfo.split(";")[0];
        var userId = userInfo.split(";")[1];
        return {userId:userId,userName:userName};
    }
    return null;
}

/**
 * 获取本地自选股信息
 * @returns {{}}
 */
function loadLocalData(){
    var localStr = localStorage.getItem("dzhjpzx_quotationList_local");
    var localData = {};
    //首次访问自动加上上证、创业板指
    if(localStr == null){
        var time = getFullTime();
        localData["自选股"] = ["SH000001.index#"+time,"SZ399006.index#"+time];
        localStorage.setItem("dzhjpzx_quotationList_local",JSON.stringify(localData));
    }else if(localStr!=null && localStr.length>2){
        var localObj = JSON.parse(localStr);
        if(localObj!=null){
            localData["自选股"] = localObj["自选股"];
        }
    }
    return localData;
}

//获取自选股信息,没有登陆则取本地，登陆则取线上数据
function loadOptionalData(callback,isCache){
    var localStorage;
    if(window.localStorage){
        localStorage = window.localStorage;
    }else{
        alert('当前浏览器不支持本地存储，请换个浏览器再试');
        return;
    }
    //判断是否登录
    var user = getUserInfo();
    var serverObj = null;
    if(user != null){
        var userid = user.userName;
        filesGet(userid,function(data){
            //删除本地缓存的线上数据
            localStorage.removeItem("dzhjpzx_quotationList");
            var isOptionalSynchronized = getLocalQuotationProps("isOptionalSynchronized");
            if(data == "timeout"){
                toastText("网络服务不给力⊙﹏⊙");
            }else{
            	serverObj = {};
                if(data && data.length>0){
                    var serverStr = data[0].content;
                    if(serverStr && serverStr.length > 2){
                        serverObj = JSON.parse(serverStr);
                        var str = null;
                        if(serverObj && serverObj["自选股"]){
                            var serverData = {};
                            serverData["自选股"] = serverObj["自选股"];
                            str = JSON.stringify(serverData);
                        }
                        localStorage.setItem("dzhjpzx_quotationList",str);
                    }
                    if(!serverObj){
                        serverObj = {};
                    }
                    var localStr = localStorage.getItem("dzhjpzx_quotationList_local");
                    var servers = serverObj["自选股"];
                    if(!isOptionalSynchronized){
                        servers = synchronizeOptional(userid,serverStr,localStr);
                    }
                    serverObj["自选股"] = servers;
                }
            }
            if(callback){
                callback(serverObj);
            }
        });
    }else{
        var localStr = localStorage.getItem("dzhjpzx_quotationList_local");
        var localData = {};
        //首次访问自动加上上证、创业板指
        if(localStr == null){
            var time = getFullTime();
            localData["自选股"] = ["SH000001.index#"+time,"SZ399006.index#"+time];
            localStorage.setItem("dzhjpzx_quotationList_local",JSON.stringify(localData));
        }else if(localStr!=null && localStr.length>2){
            var localObj = JSON.parse(localStr);
            if(localObj!=null){
                localData["自选股"] = localObj["自选股"];
            }
        }
        if(callback){
            callback(localData);
        }
    }
}

/**
 * 设置自选股信息,传入数组，设置之前先获取最新数据
 */
 function setOptionalData(data,callback,showTip){
    if(showTip != false) showTip = true;
    loadOptionalData(function(optional){
        var returnVal = {};
        returnVal.success = false;
        var result = null;
        var objs = [];
        var isCreate = false;
        if(optional == null){
        	if(callback) callback(returnVal);
        	return;
        }
        if(optional){
            result = optional["自选股"];
            if(!result) {
            	isCreate = true;
            	result = [];
            }
            for(var j = 0; j < result.length; j ++){
                if(result[j]&&result[j].indexOf("#")>0){
                    objs.push(result[j].split("#")[0]);
                }
            }
        }
        var localStorage;
        if(window.localStorage){
            localStorage = window.localStorage;
        }else{
            toastText('当前浏览器不支持本地存储，请换个浏览器再试');
        }
        //判断是否登录
        var user = getUserInfo();
        if(user != null){
            var userid = user.userName;
            var time = getFullTime();
            result = [];
            for(var i = 0; i < data.length;i++){
//                if(data[i] && objs.indexOf(data[i]) < 0){
                result.push(data+"#"+time);
//                }
            }
            if(result.length > 0){
                var serverObj = {};
                serverObj["自选股"] = result;
                var serverStr = JSON.stringify(serverObj);
                //同步至线上
                if(isCreate){
	                filesCreate(userid,serverStr,function(rtn){
	                    if(rtn == "timeout"){
	                        toastText("网络服务不给力⊙﹏⊙");
	                    }else{
	                        if(showTip){
	                            toastText("√ 已添加自选");
	                        }
	                        returnVal.success = true;
	                        localStorage.setItem("dzhjpzx_quotationList",JSON.stringify(serverObj));
	                        if(callback) callback(returnVal);
	                    }
	                });
                }else{
                	filesAdd(userid,serverStr,function(rtn){
                		var rs;
                		if(typeof rtn == "string"){
                			rs = JSON.parse(rtn);
                		}
	                    if(data == "timeout" || !rs || rs.status != "success"){
	                        toastText("网络服务不给力⊙﹏⊙");
	                    }else{
	                        if(showTip){
	                            toastText("√ 已添加自选");
	                        }
	                        returnVal.success = true;
	                        localStorage.setItem("dzhjpzx_quotationList",JSON.stringify(serverObj));
	                        if(callback) callback(returnVal);
	                    }
	                });
                }
            }
        }else{
            var time = getFullTime();
            for(var i = 0; i < data.length;i++){
                if(data[i] && objs.indexOf(data[i]) < 0){
                    result.push(data+"#"+time);
                }
            }
            optional["自选股"] = result;
            var localStr = JSON.stringify(optional);
            localStorage.setItem("dzhjpzx_quotationList_local",localStr);
            if(showTip){
                toastText("√ 已添加自选");
            }
            returnVal.success = true;
        }
//        }
        returnVal.result = result;
        if(callback) callback(returnVal);
    });
}

/**
 * 设置自选股信息,传入数组，设置之前先获取最新数据
 */
function createOptionalData(optional,callback){
    if(!optional) return;
    var localStorage;
    if(window.localStorage){
        localStorage = window.localStorage;
    }else{
        toastText('当前浏览器不支持本地存储，请换个浏览器再试');
    }
    var result = [];
    var time = getFullTime();
    var data = optional["自选股"];
    if(!data) data = [];
    for(var i = 0; i < data.length;i++){
        if(data[i] && data[i] != ""){
            if(data[i].indexOf("#") > 0){
                data[i] = data[i].split("#")[0];
            }
            data[i] += "#"+time;
            result.push(data[i]);
        }
    }
    optional["自选股"] = result;
    //判断是否登录
    var user = getUserInfo();
    if(user != null && user.userName){
        var userid = user.userName;
        var serverObj = {};
        serverObj["自选股"] = result;
        var serverStr = JSON.stringify(serverObj);
        var optionalStr = JSON.stringify(optional);
        localStorage.setItem("dzhjpzx_quotationList",serverStr);
        //同步至线上
        filesCreate(userid,optionalStr,function(data){
            if(data == "timeout"){
                toastText("网络服务不给力⊙﹏⊙");
                if(callback) callback(false);
            }else{
                if(callback) callback(true);
            }
        });
    }else{
        var localStr = JSON.stringify(optional);
        localStorage.setItem("dzhjpzx_quotationList_local",localStr);
        if(callback) callback(true);
    }
}

/**
 * 设置自选股信息,传入数组，设置之前先获取最新数据
 */
function removeOptionalData(data,callback,showTip){
    if(!data || data.length <= 0) return;
    if(showTip != false) showTip = true;
    var returnVal = {};
    returnVal.success = false;
    var optional = {"自选股":data};
    //判断是否登录
    var user = getUserInfo();
    if(user != null && user.userName){
        var userid = user.userName;
        var optionalStr = JSON.stringify(optional);
        //删除线上自选股信息
        filesDel(userid,optionalStr,function(data){
            if(data == "timeout"){
                toastText("网络服务不给力⊙﹏⊙");
            }else{
                returnVal.success = true;
                if(showTip){
                    toastText("√ 已取消自选");
                }
            }
            if(callback) callback(returnVal);
        });
    }else{
        //获取本地自选股信息，删除相应的自选股
        var localData = loadLocalData();
        var localDatas = localData["自选股"];
        var array = [];
        for(var i = 0; i < localDatas.length; i ++){
            if(localDatas[i]){
                if(data.indexOf(localDatas[i].split("#")[0]) < 0){
                    array.push(localDatas[i]);
                }
            }
        }
        localData["自选股"] = array;
        var localStr = JSON.stringify(localData);
        localStorage.setItem("dzhjpzx_quotationList_local",localStr);
        returnVal.success = true;
        if(showTip){
            toastText("√ 已取消自选");
        }
        if(callback) callback(returnVal);
    }
}

//取线上数据
function filesGet(userid,callback){
    var url = getFullUrl("sys/files/get");
    var param = {"Accept":"json","userid":userid,"fileName":"mystock.json"};
    getAjaxDatas(url,param,function(result){
        if(callback){
            callback(result);
        }
    });
}
//创建线上自选股
function filesCreate(userid,localStr,callback){
    var url = getFullUrl("sys/files/create");
    var param = {"Accept":"json","userid":userid,"fileName":"mystock.json","content":localStr};
    getAjaxDatas(url,param,function(result){
        if(callback){
            callback(result);
        }
    });
}
//新增线上自选股
function filesAdd(userid,localStr,callback){
    var url = getFullUrl("sys/files/myadd");
    var param = {"Accept":"json","userid":userid,"fileName":"mystock.json","content":localStr};
    getAjaxDatas(url,param,function(result){
        if(callback){
            callback(result);
        }
    });
}
//删除线上自选股
function filesDel(userid,localStr,callback){
    var url = getFullUrl("sys/files/mydel");
    var param = {"Accept":"json","userid":userid,"fileName":"mystock.json","content":localStr};
    getAjaxDatas(url,param,function(result){
        if(callback){
            callback(result);
        }
    });
}

//同步线上自选股信息
function synchronizeOptional(userid,serverStr,localStr){
    //判断是否需要有提示信息
    if(userid == null){
        return;
    }
    var server = null;
    var localData = null;
    var serverData = null;
    var localObjs = [];
    var serverObjs = [];
    if(localStr && localStr != "{}" ){
        var local = JSON.parse(localStr);
        localData = local["自选股"];
        if(localData){
            for(var i = 0; i < localData.length; i++){
                var obj = localData[i];
                if(obj && obj.indexOf("#") > 0){
                    localObjs.push(obj.split("#")[0]);
                }
            }
        }
    }
    if(serverStr && serverStr.length > 2){
        server = JSON.parse(serverStr);
        serverData = server["自选股"];
        if(serverData){
            var time = getFullTime();
            for(var i = 0; i < serverData.length; i++){
                var obj = serverData[i];
                if(obj && obj.indexOf("#") > 0){
                    serverObjs.push(obj.split("#")[0]);
                }
            }
        }
    }
    var isSynch = false;
    if(localData != null && localData.length > 0){
    	//本地有数据线上无数据
        if(serverData == null || serverData.length <= 0){
            isSynch = true;
        }else{
            for(var i = 0; i < localObjs.length; i++){
                var has = serverObjs.indexOf(localObjs[i]);
                if(has < 0){
                    isSynch = true;
                    break;
                }
            }
        }
    }
    var r = null;
    var isOptionalSynchronized = getLocalQuotationProps("isOptionalSynchronized");
    if(isSynch){
        if(serverData == null){
            serverData = [];
        }
        for(var i = 0; i < localObjs.length; i++){
             if(serverObjs.indexOf(localObjs[i]) < 0){
                 serverData.push(localData[i]);
             }
        }
        if(!server){
            server = {};
        }
        server["自选股"] = serverData;
        serverStr = JSON.stringify(server);
        filesCreate(userid,serverStr,function(result){
            if(result == "timeout"){
                toastText("网络服务不给力⊙﹏⊙");
            }else{
                toastText("√ 已同步自选");
                setLocalQuotationProps("isOptionalSynchronized","1");
            }
        });
    }
    if(serverStr !=null && serverStr.length > 2){
        localStorage.setItem("dzhjpzx_quotationList",serverStr);
    }
    return serverData;
}

//加载页面股票数据
function reloadData(data,callback){
    //拼装realCode
    var str = "";
    for(var key in data){
        if(key!=""){
            str += key+",";
        }
    }
    if(str.length>0){
        var url = getFullUrl("mobile/stock/getMarketByObjs");
        str = str.substring(0,str.length-1);
        var datas = {"obj":str};
        getAjaxDatas(url,datas,function(result){
            if(result == "timeout"){
                toastText("网络服务不给力⊙﹏⊙");
                callback(data,false);
            }else if(result&&result.length>0){
                for(var i = 0; i < result.length; i++){
                    var res = result[i];
                    var key = res.obj;
                    var obj = data[key];
                    if(res.price){
                        obj.price = res.price;
                    }
                    if(res.stkName&&res.stkName.length>0){
                        obj.stkName = res.stkName;
                    }
                    var updnratio = res.updnratio;
                    if(res.updnratio!="0.00"){
                        if(parseFloat(updnratio) > 0){
                            obj.updnratio = "+"+res.updnratio+"%";
                        }else if(parseFloat(updnratio) < 0){
                            obj.updnratio = res.updnratio+"%";
                        }
                    }else{
                        obj.updnratio = res.updnratio+"%";
                    }
                    if(res.lastclose){
                        obj.lastclose = res.lastclose;
                    }
                    data[key] = obj;
                }
                callback(data,true);
            }
        });
    }
}

function saveOptionalRemind(stockCode,title,callback){
    if(!stockCode || stockCode == "" || !title || title == ""){
        return;
    }
    //添加之前先同步至自选股
    setOptionalData([stockCode],function(data){
        if(data && data.success){
            //若有则不必重复添加数据
            isOptionalRemind(stockCode,function(result){
                var isAdd = false;
                if(result && result.result){
                    toastText("√ 已添加提醒");
                    isAdd = true;
                    if(callback) callback(isAdd);
                }else{
                    var user = getUserInfo();
                    if(user != null){
                        var userid = user.userName;
                        var array = [];
                        var data = {};
                        data.userId = userid;
                        data.stockCode = stockCode;
                        data.title = title;
                        data.newsCat = "";
                        array.push(data);
                        saveMyRemindList(array,function(status){
                        	if(status=="success"){
                            	isAdd = true;
                        	}
                            if(callback) callback(isAdd);
                        });
                    }else{
                        //        alert("请先登录");
                    }
                }
            });
        }
    },false);
}

function removeOptionalRemind(stockCodes,callback,showTip){
    if(showTip != false) showTip = true;
    if(!stockCodes || stockCodes.length <= 0){
        return;
    }
    var user = getUserInfo();
    if(user != null){
        var userid = user.userName;
        var array = [];
        for(var i = 0; i < stockCodes.length; i ++){
            var data = {};
            data.userId = userid;
            data.stockCode = stockCodes[i];
            data.title = "";
            array.push(data);
        }
        removeMyRemindByTypeAndId(array,function(status){
        	var done = false;
        	if(status == "success")done = true;
        	if(callback) callback(done);
        },showTip);
    }else{
    	if(callback) callback(true);
//        alert("请先登录");
    }
}

/**
 * 未登录时返回结果是null，登录后判断是否已添加自选
 * @param stockCode
 * @param callback
 */
function isOptionalRemind(stockCode,callback){
    var result = null;
    var user = getUserInfo();
    if(user == null){
        if(callback){
            callback(result);
        }
    } else {
        getAllMyRemindList(function(data){
            var userId = user.userName;
            result = {};
            result.result = false;
            result.key = stockCode;
            for(var j = 0; j < data.length; j++){
                var stock = data[j].stockCode;
                var userid = data[j].userId;
                if(stock == stockCode && userid == userId){
                    result.result = true;
                    break;
                }
            }
            if(callback){
                callback(result);
            }
        });
    }
}

function getFullTime(){
    return new Date().format("yyyyMMddHHmmss") + "000000";
}

/**
 * 获得指定长度的字符串，中文算两个字符
 * @param str
 * @param num
 */
function getStrByNum(str,num){
    if(!str) return "";
    var numstr = "";
    var numlength = 0;
    //先把id的大小放进去
    for(var i = 0; i < str.length && numlength < num*2; i++){
        if(str.charCodeAt(i) > 255){
            numlength += 2;
        }else {
            numlength++;
        }
        numstr += str.charAt(i);
    }
    return numstr;
}

/**
 * 设置事件的点击效果、传入jquery对象及class
 */
function addTouchedStyle(el,style){
    if(el && el.size() > 0 && style && style != ""){
        var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            START_EV = hasTouch ? 'touchstart' : 'mousedown',
            MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
            END_EV = hasTouch ? 'touchend' : 'mouseup';
        el.bind(START_EV,function(){
            $(this).addClass(style);
        });
        el.bind(MOVE_EV,function(){
            if($(this).hasClass(style)){
                $(this).removeClass(style);
            }
        });
        el.bind(END_EV,function(){
            if($(this).hasClass(style)){
                $(this).removeClass(style);
            }
        });
    }
}

/**
 * 获取市场信息及交易信息（是否为交易日、当前是否为交易时间、上一交易日时间）
 */
function getCurrentMarketInfo(callback){
    //默认都为true
    var result = {"isIntime" : true,"isTradeDay":true};
    var date = new Date();
    var time = "1"+date.format("HHmm");
    if(parseInt(time) < parseInt("10930") || (parseInt(time) > parseInt("11129") &&
        parseInt(time) < parseInt("11300")) || parseInt(time) > parseInt("11500")){
        result.isIntime = false;
    }
    var boo = true;
    if(!callback) boo = false;
    var ld = getLastTradeDay(boo,function(lastDay){
        if(lastDay) result.lastTradeDay = lastDay;
        var info = getLocalQuotationProps("marketInfo");
        if(info != null){
            var day = date.format("yyyyMMdd");
            if(day == info.queryDay && info.isTradeDay == false){
                result.isTradeDay = false;
            }
            //若当前数据不为当天查询的新数据则删除
            if(day != info.queryDay){
                setLocalQuotationProps("marketInfo");
            }
        }
        if(callback){
            callback(result);
        }
    });
    result.lastTradeDay = ld;
    return result;
}

/**
 * 获取前一交易日信息
 */
function getLastTradeDay(boo,callback){
    var info = getLocalQuotationProps("marketInfo");
    var infoObj = {};
    var date = new Date();
    var day = date.format("yyyyMMdd");
    if(info){
        var lastDay = info["lastTradeDay"];
        var qDay = info["queryDay"];
        if(lastDay && qDay && day == qDay && lastDay != ""){
            if(callback){
                callback(lastDay);
            }
            return lastDay;
        }
    }
    if(boo){
        var url = getFullUrl("mobile/stock/loadStockKlineByID");
        var param = {obj:"SH000001.index",time:day+"000000",direction:"-1",size:1};
        getAjaxDatas(url,param,function(resp){
            if(resp == "timeout"){
                if(callback){
                    callback(null);
                    return;
                }
            }
            if(!resp || resp=="" || !resp.data || resp.data.length <1){
                if(callback){
                    callback(null);
                    return;
                }
            }
            var time = resp.data[0][0];
            if(!time || time == ""){
                if(callback){
                    callback(null);
                    return;
                }
            }
            time = time.substring(0,8);
            infoObj.lastTradeDay = time;
            infoObj.queryDay = day;
            setLocalQuotationProps("marketInfo",infoObj);
            if(callback){
                callback(time);
            }
        },true);
    }
}

function getLocalQuotationProps(key){
    var obj = null;
    var str = localStorage.getItem("dzhjpzx_quotation_props");
    if(str == null || str.length <= 2){
        return obj;
    }
    var propsObj = JSON.parse(str);
    if(propsObj[key]){
        obj = propsObj[key];
    }
    return obj;
}

//当value为null时表示删除
function setLocalQuotationProps(key,value){
    if(typeof key == "undefined"){
        return;
    }
    if(value == undefined) value = null;
    var str = localStorage.getItem("dzhjpzx_quotation_props");
    if(str == null || str.length <= 2 || key == null){
        str = "{}";
    }
    var obj = JSON.parse(str);
    if(!obj){
        obj = {};
    }
    if(value == null){
        delete obj[key];
        localStorage.setItem("dzhjpzx_quotation_props",JSON.stringify(obj));
        return;
    }
    var val = obj[key];
    if(!val || typeof val != "object"){
        val = value;
    }else{
        val = $.extend(val , value);
    }
    obj[key] = val;
    localStorage.setItem("dzhjpzx_quotation_props",JSON.stringify(obj));
}

//图标中的加载提示
function showLoading(id,o,error){
	if(!id||id=="")return;
	var target = $(o).find("#"+id);
    var errorHtml = '<div id="errorTips" class="loading-tips">'+
    '<div class="loading-tips-inner">'+
    '<i class="loading-tips-icon error"></i><div class="loading-tips-txt">暂时无法获取数据</div>'+
    '</div>'+
    '</div>';


    var loadingHtml = '<div id="loadingTips" class="loading-tips">'+
    '<div class="loading-tips-inner">'+
    '<i class="loading-tips-icon loading"></i><div class="loading-tips-txt">数据加载中...</div>'+
    '</div>'+
    '</div>';
    if(!error){
		if(target.size()<=0){
			target = $("<div id="+id+"></div>");
			$(o).append(target);
		}
    	if(target.find("#errorTips").size()>0){
        	target.find("#errorTips").remove();
    	}
    	if(target.find("#loadingTips").size()<=0){
        	target.append(loadingHtml);
    	}
    }else{
    	if(target.size()<=0)return;
        if(target.find("#loadingTips").size()>0){
        	target.find("#loadingTips").remove();
    	}
    	if(target.find("#errorTips").size()<=0){
        	target.append(errorHtml);
    	}
    }
}
function showErrorLoading(id,o){
	if(!id||id=="")return;
	if($(o).find("#"+id).size()<=0){
		$(o).append("<div id="+id+"></div>");
	}
	var target = $(o).find("#"+id);
    var errorHtml = '<div id="errorTips" class="loading-tips">'+
    '<div class="loading-tips-inner">'+
    '<i class="loading-tips-icon error"></i><div class="loading-tips-txt">暂时无法获取数据</div>'+
    '</div>'+
    '</div>';
    if(target.find("#loadingTips").size()>0){
    	target.find("#loadingTips").remove();
	}
	if(target.find("#errorTips").size()<=0){
    	target.append(errorHtml);
	}
}
function removeLoading(id,o){
    $(o).find("#"+id).remove();
}

// 显示一个定制的确认对话框 
function showConfirm(content,title,buttons,callback) {
	if(!content || !title || !buttons || !callback) return;
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    if(hasTouch){
    	var onConfirm = function(button){
    		var r = false;
		    if(button==1) r = true;
		    if(callback){
		    	callback(r);
		    }
    	}
		navigator.notification.confirm( 
			content,  // 显示信息 
			onConfirm,   // 按下按钮后触发的回调函数，返回按下按钮的索引 
			title,       // 标题 
			buttons    // 按钮标签 
		);
	}else{
		var r = confirm(content);
		if(callback){
			callback(r);
		}
	}
}

// 显示一个定制的弹出提示框 
function showAlert(content,title,buttons,callback) {
	if(!content) return;
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    if(hasTouch){
    	var alertDismissed = function(){
		    if(callback){
		    	callback();
		    }
    	}
		navigator.notification.alert( 
			content,  // 显示信息 
			alertDismissed,   // 警告被忽视的回调函数 
			title,       // 标题 
			buttons    // 按钮标签 
		);
	}else{
		alert(content);
	}
}

