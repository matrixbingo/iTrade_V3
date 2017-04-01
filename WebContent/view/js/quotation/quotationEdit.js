/**
 * User: zhen
 * Date: 13-12-18
 * Time: 下午3:30
 */
function createQuotationEditBody(params) {
    pageId = params.pageId;
    if($("#"+quotationEditBody).length == 0){
        //创建主页面
        createContent(params,quotationEditBody);
        buildBlueHeader(quotationEditTitleId,$("#"+quotationEditBody));
        //创建页面布局
        buildQuotationEditContent($("#"+quotationEditBody));
        //绑定事件
        bindQuotationEditEvent();
    }
    refreshQuotationEditData();
    //滚动动画，
    animatingFun(params,function(){
        //将所有的股票代码放到缓存中
//        setTimeout(function(){
//            savaAllStockCodes();
//        },50)
    });
}
var quotationEditBody = "quotationEditBody";
var quotationEditTitleId = "quotationEditTitleId";

/**
 * 构建表格布局
 */
function buildQuotationEditContent($container){
var preHeader =
    '<div class="ui-gw-header-leftBtn"><div class="edit">完成</div></div>' +
    '<div class="ui-gw-header-title">我的自选</div>';
    if($("#"+quotationEditTitleId).length>0){
        $("#"+quotationEditTitleId).html(preHeader);
    }
    var html ='<div class="quotationEditTitle">' +
            '<div class="quotationEdit-span1"></div>'+
            '<div class="quotationEdit-span2">名称代码</div>'+
            '<div class="quotationEdit-span3">提醒</div>'+
            '<div class="quotationEdit-span4">置顶</div>'+
            '<div class="quotationEdit-span5">拖动</div>'+
            '</div>'+
        '<div id="wrapperQuotationEdit" class="wrapperQuotation">'+
        '<div id="scrollerQuotationEdit">'+
            '<ul id="thelistQuotationEdit" class="thelistQuotationEdit"></ul>'+
        '</div>'+
        '</div>';
    $container.html(html);
    var bottom = '<div id="gw-mobile-bottom-header" class="ui-gw-bottomHeader quotationEdit">' +
            '<span class="ui-optional-header-btn quotationEditSelect">' +
                '<span id="selectAll" class="quotationCheckbox quotationAll"></span>全选' +
            '</span>' +
            '<span class="ui-optional-header-btn quotationEditDelete">' +
                '<span class="quotationDel quotationDel-bg"></span><span id="deltext" class="quotationDel-color">删除</span>' +
            '</span>' +
        '</div>';
    $container.append(bottom);
    //设置内容高度
    var bHeight = $("#gw-mobile-bottom-header").outerHeight();
    var titleHeight = $container.find(".quotationEditTitle").outerHeight();
    var tHeight = $container.outerHeight();
    $("#wrapperQuotationEdit").css("height",tHeight - bHeight - titleHeight);
}

var myScrollQuotationEdit;
function bindQuotationEditEvent() {
    myScrollQuotationEdit = new iScroll('wrapperQuotationEdit',{
        hideScrollbar:true,//没有用户操作时，滚动条隐藏
        hScroll:false //隐藏横向滚动条
    });
    setTimeout(function(){myScrollQuotationEdit.refresh()},300);
    //绑定删除事件
    $("#deltext","#gw-mobile-bottom-header").bind("fastClick",function(){
    	if($("#deltext").hasClass("quotationDel-color")) return;
        showConfirm("确认删除？","提示",["确定","取消"],function(r){
	        if(r){
		        if($("#deltext").hasClass("quotationDel-color1")){
		            var dellists = $("span.checkedItem","#thelistQuotationEdit");
		            var data = [];
		            dellists.each(function(){
		                var li = $(this).parents("li");
		                var obj = li.attr("data-value");
		                if(obj && obj.length > 0) data.push(obj);
		            });
		            //删除自选股
		            removeOptionalRemind(data,function(status){
		            	if(!status){
		            		toastText("删除失败，请重试。");
		            		return;
		            	}
		            	removeOptionalData(data,function(data){
		            		if(!data || !data.success){
		            			toastText("删除失败，请重试。");
		            			return;
		            		}
		                    toastText("√ 已删除自选");
				            dellists.each(function(){
				                var li = $(this).parents("li");
				                li.remove();
				            });
				            //重置状态
				            $("#selectAll").removeClass("checkedAll");
				            setDelete();
		                    //若被全部删除则返回自选股首页面
		                    if($("span","#thelistQuotationEdit").size()<=0){
							    var el = $('#thelistQuotation');
							    setNonStockHtml(el);
							    gobackByParams();
		                    }
			            });
		            },false);
		        }
		    }
        });
    });
    //绑定checkbox事件
    $("#selectAll").parent().bind("fastClick",function(){
        if(!$("#selectAll").hasClass("checkedAll")){
            var lists = $("#thelistQuotationEdit").find("span.quotationCheckbox");
            if(lists.size()>0){
                $("#selectAll").addClass("checkedAll");
                lists.each(function(){
                    if(!$(this).hasClass()) $(this).addClass("checkedItem");
                });
            }
        }else{
            $("#selectAll").removeClass("checkedAll");
            $("#thelistQuotationEdit").find("span.checkedItem").removeClass("checkedItem");
        }
        setDelete();
    });
}

function refreshQuotationEditData(){
    if($("#wrapperQuotationEdit").size() <= 0){
        return;
    }
    // Array Object
    loadOptionalData(function(optional){
        var el = $('#thelistQuotationEdit');
        var li;
        var html = "";
        var data = null;
        if(optional){
            data = optional["自选股"];
        }
        if(!data){
            changeToIndex();
        }else{
            myScrollQuotationEdit.enable();
            for(var i = 0; i < data.length; i++){
                if(!data[i]||data[i].indexOf("#") < 0){
                    continue;
                }
                var code = data[i].split("#")[0];
                var scode = code.substring(0,code.indexOf("."));
                if(code){
                    var liHtml = el.find('li[data-value="'+code+'"]').prop("outerHTML");
                    if(liHtml && liHtml != ""){
                        html += liHtml;
                    }else{
                        var stkName = "";
                        var stockInfo = getLocalQuotationProps("stockInfo");
                        if(stockInfo && stockInfo[code]){
                            var stock = stockInfo[code];
                            stkName = stock.stkName;
                        }

                        if(!stkName || stkName == "") stkName = "----";
                        html += '<li class="movelement" data-value="'+code+'" ' +
                            'data-url="../quotation/quotationChart.html?stockCode='+code+'">'+
                            '<div class="quotationEdit-span1"><span class="quotationCheckbox quotationItem"></span></div>'+
                            '<div class="quotationEdit-span2"><span class="char"><span id="stkName">'+stkName+'</span><br><em>'+scode+'</em></span></div>'+
                            '<div class="quotationEdit-span3"><span class="quotationRemind"></span></div>'+
                            '<div class="quotationEdit-span4"><span class="quotationTop"></span></div>'+
                            '<div class="quotationEdit-span5"><span class="quotationSort"></span></div>'+
                            '</li>';
                    }
                }
            }
            el.html(html);
            myScrollQuotationEdit.refresh();
            //判断是否绑定提醒事件
            showAllRemindState();
        }
        //绑定页面事件
        addQuotationEditEvent();
    },true);
}

function showAllRemindState(){
    var user = getUserInfo();
    if(user != null){
        getAllMyRemindList(function(data){
            for(var j = 0; j < data.length; j++){
                var stockCode = data[j].stockCode;
                var li = $('#thelistQuotationEdit').find("li[data-value='"+stockCode+"']");
                if(li.size()>0){
                    if(!li.find(".quotationRemind").hasClass("added")){
                        li.find(".quotationRemind").addClass("added");
                    }
                }
            }
        });
    }
}

function addQuotationEditEvent(){
    //绑定完成按钮事件
    touchEventWithBackShadow($(".edit","#"+quotationEditTitleId),changeToIndex);
    $("span.quotationItem").parent().touchEvent({
        "fastClickEnd" : function(){
            if(!$(this).find("span.quotationItem").hasClass("checkedItem")){
                $(this).find("span.quotationItem").addClass("checkedItem");
                if($(".quotationItem").size() == $(".checkedItem").size()) $("#selectAll").addClass("checkedAll");
            } else {
                $(this).find("span.quotationItem").removeClass("checkedItem");
                if($("#selectAll").hasClass("checkedAll")) $("#selectAll").removeClass("checkedAll");
            }
            setDelete();
        }
    });
    //绑定置顶事件
    $("div.quotationEdit-span4","#thelistQuotationEdit").touchEvent({
        "fastClickEnd" : function(){
            $("li:first","#thelistQuotationEdit").before($(this).parent());
            //对当前结果排序
            var root =  $("#thelistQuotationEdit");
            sortOptional(root);
        }
    });
    //绑定提醒事件
    $("div.quotationEdit-span3","#thelistQuotationEdit").touchEvent({
        "fastClickEnd" : function(){
            var li = $(this).parent();
            var stockCode = li.attr("data-value");
            var title = li.find("#stkName").html();
            //根据状态选择是添加还是删除
            var that = this;
            var action = "";
            if(!$(this).find("span").hasClass("added")){
                action = "add";
            }else{
                action = "delete";
            }
            if(action == "add"){
                if(stockCode && stockCode.length > 0 && title && title.length > 0){
                    var user = getUserInfo();
                    if(user == null){
                        createLoadingInfo(function(data){
                            if(data == "timeout"){

                            }else{
                                saveOptionalRemind(stockCode,title,function(data){
                                    //更改状态
                                    if(data){
                                        refreshQuotationEditData();
                                    }
                                });
                            }
                        });
                    }else{
                        saveOptionalRemind(stockCode,title,function(data){
                            //更改状态
                            if(data){
                                refreshQuotationEditData();
                            }
                        });
                    }
                }else{
                    //重新刷新页面获取相应数据
                    toastText("页面加载错误，请刷新页面");
                }
            } else if(action == "delete"){
                removeOptionalRemind([stockCode],function(data){
                	if(data) $(that).find("span").removeClass("added");
                },true);
            }
        }
    });
    $("div.quotationEdit-span5","#thelistQuotationEdit").draggable({
        "start" :optionalSortStart,
        "moving" :optionalSortMoving,
        "end" :optionalSortEnd
    });
}

// 设置右下角状态
function setDelete(){
    var size = $("span.checkedItem","#thelistQuotationEdit").size();
    if(size == 0){
        $("#deltext").html("删除");
        $("#deltext").attr("class","quotationDel-color");
        $("#deltext").prev().removeClass("quotationDel-bg1");
        $("#deltext").prev().addClass("quotationDel-bg");
    }else{
        $("#deltext").html("删除("+size+")");
        $("#deltext").attr("class","quotationDel-color1");
        $("#deltext").prev().removeClass("quotationDel-bg");
        $("#deltext").prev().addClass("quotationDel-bg1");
    }
}

function sortOptional(root){
    loadOptionalData(function(optional){
        var data = null;
        if(!optional){
            return;
        }else{
            data = optional["自选股"];
        }
        if(!data) return;
        var oldObjs = [];
        for(var i = 0; i < data.length; i++){
            if(data[i] && data[i].indexOf("#") > 0){
                oldObjs.push(data[i].split("#")[0]);
            }
        }
        //同步排序
        var newData = [];
        //根据当前页面的队列排序
        var li = root.find("li:first");
        while(li!=null&&li.size()>0){
            if(li.attr("id")!="mark"){
                var obj = li.attr("data-value");
                var index = oldObjs.indexOf(obj);
                newData.push(data[index]);
            }
            li = li.next("li");
        }
        optional["自选股"] = newData;
        //同步排序结果
        createOptionalData(optional,function(data){
            if(data) toastText("√ 操作成功");
        });
    });
}

//var isReadyToUse = true;
function optionalSortStart(event){
    //阻止事件冒泡
    event.stopPropagation();
    event.preventDefault();
    myScrollQuotationEdit.disable();
}

function optionalSortMoving(event,data){
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    var touch = hasTouch ? event.touches[0] : event;
    var pageY = touch.pageY;
    var li = this;
    var originY = data.originY;
    var height = li.outerHeight();
    //获取容器信息
    var st = $("#scrollerQuotationEdit").offset().top;
    var sh = $("#scrollerQuotationEdit").height();
    var wt = $("#wrapperQuotationEdit").offset().top;
    var wh = $("#wrapperQuotationEdit").height();
    var wb =  wt + (sh > wh ? wh : sh);
    //计算当前覆盖到的li
    //计算li需要滑动的距离
    var deltaY = 0;
    if(originY < wt){
        if(pageY <= originY + height/2){
            deltaY = 0;
        }else if(pageY >= wb - height/2){
            deltaY = wb - originY - height;
        }else{
            deltaY = pageY - originY - height/2;
        }
    }else if(originY + height > wb){
        if(pageY <= wt + height/2){
            deltaY = wt - originY;
        }else if(pageY >= originY + height/2){
            deltaY = 0;
        }else{
            deltaY = pageY - originY - height/2;
        }
    }else{
        if(pageY <= wt + height/2){
            deltaY = wt - originY;
        }else if(pageY >= wb - height/2){
            deltaY = wb - originY - height;
        }else{
            deltaY = pageY - originY - height/2;
        }
    }
    li.css({"top":deltaY + "px","z-index":"1000"});
//    根据deltaY计算当前覆盖到的li
    //当前li的index
    var index = li.index();
    var size = li.parent().find("li").size();
    if(index >= 0 && index <= size - 1){
        var n = Math.ceil(Math.abs(deltaY/height));
        var nextDeltaY = Math.abs(deltaY) - height * (n - 1);
        if(deltaY < 0){
            n = -n;
        }else{
            nextDeltaY = -nextDeltaY;
        }
        if(n != 0){
            var nextli = li.parent().find("li").get(index + n);
            $(nextli).css({"top":nextDeltaY + "px","z-index":"999"});
            if(!$(nextli).hasClass("transition")){
                //对索引为n值以外的li进行整理
                $("li.transition").each(function(){
                    var i = $(this).index();
                    var delta = 0;
                    if(i != index && i != index + n){
                        if((index < index + n) && (i > index) && (i < index + n)){
                            delta = -height;
                        }
                        if((index > index + n) && (i < index) && (i > index + n)){
                            delta = height;
                        }
                        var round = li.parent().find("li").get(i);
                        $(round).css({"top":delta + "px","z-index":"999"});
                    }
                    $(this).removeClass("transition");
                });
                $(nextli).addClass("transition");
            }
        }
    }
}

function optionalSortEnd(event,data){
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    var touch = hasTouch ? event.changedTouches[0] : event;
    var pageY = touch.pageY;
    var sh = $("#scrollerQuotationEdit").height();
    var wt = $("#wrapperQuotationEdit").offset().top;
    var wh = $("#wrapperQuotationEdit").height();
    var wb =  wt + (sh > wh ? wh : sh);
    var li = this;
    //计算li需要移动的距离及交换位置，在移动过程中阻止下次移动事件发生
    var index = li.index();
    var height = li.outerHeight();
    var top = li.offset().top;
    var originY = data.originY;
    //获取容器信息
    var deltaY = (top - originY)%height;
//    根据deltaY计算当前覆盖到的li
    var n = Math.ceil(Math.abs((top - originY)/height));
    if(n != 0){
        var before = true;
        if(top - originY <= 0){
            n = -n;
            if(pageY >= wt + height/2){
                if(-deltaY < height/2){
                    //上移，未超过交换距离
                    before = false;
                }else{
                    //上移，超过交换距离
                    deltaY = height + deltaY;
                }
            }
        } else {
            if(Math.abs(deltaY) >= height/2 || pageY >= wb - height/2){
                //下移，超过交换距离
                before = false;
                deltaY = deltaY == 0 ? 0 : (deltaY - height);
            }

        }
        var nextli = $(li.parent().find("li").get(index + n));
        nextli.removeClass("transition");
        nextli.addClass("target");
        li.addClass("target");
        nextli.css({"top":-deltaY + "px","z-index":"999"});
        li.css({"top":deltaY + "px","z-index":"1000"});
        li.parent().find("li").each(function(){
            if(!$(this).hasClass("target")){
                $(this).attr("style","");
            }
        });
        if(before){
            nextli.before(li);
        }else{
            nextli.after(li);
        }
        //此处使用css3实现动画，效果不及预期。改为使用animate
        nextli.animate({"top":"0","z-index":"999"}, 300, function() {$(this).attr("style","");$(this).removeClass("target")});
        li.animate({"top":"0","z-index":"1000"}, 300, function() {
            $(this).attr("style","");
            $(this).removeClass("target");
        });
    }
    //恢复iscroll滚动
    myScrollQuotationEdit.enable();
    //更新自选股排序
    var root =  $("#thelistQuotationEdit");
    sortOptional(root);
    console.log("cancel");
}

function changeToIndex(){
    gobackByParams();
    //quotationIndex的方法，用于刷新index页面
    refreshQuotationIndexData();
}
