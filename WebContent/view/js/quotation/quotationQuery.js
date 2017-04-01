//function dom_init() {
//    createSoftKey();
//    showkeyboard();
//}

var preval;
var myscrollkeybord = null;
var geheight = 0;
var CapsLockValue = 0;
var histroy_yl = "dzhjpzx_quotationQuery_histroy";//历史查询记录
var showhidezt = false;
var BackSpacel = 0;
var lastY = 0;
var height_yl=0;
var queryPageIsShow=false;//键盘宝页面是否显示
function createSoftKey() {
//定义输入模式的状态(0为字母 1为数字)
    var headerClass = "ui-gw-header ";
    if(platform == "ios" ){
        var versionNum = platformVersion.split(".")[0];
        if(versionNum >= 7){
            headerClass += "ui-gw-header-iPhone";
        }
    }
    var softkeyContent = '';

    softkeyContent += '<div align=center id="softkeyboard" name="softkeyboard" class="softkeyboard"><div style="height: 100%;width: 100%;position: relative;">';
    softkeyContent += '<div class="'+headerClass+'"><div class="ui-gw-header-leftBtn"><div class="ui-gw-header-cancel" id="abc-close">取消</div></div><div class="ui-gw-header-title">股票查询</div><div class="ui-gw-header-rightBtn"></div></div>';
    softkeyContent += '<div class="srinputdiv">';
    softkeyContent += '<table  class="searchbox"><tr><td class="buttonclass" id="inputimg1" height="30"></td>' +
        '<td class="buttonclass" id="tdinputid">代码/拼音/首字母</td>' +
        '<td id="inputimgadd" class="buttonclass"></td></tr></table>';
    softkeyContent += '</div>';
    softkeyContent += '<div align=center id="resultnull" class="resultnull" style="display:block;">' +
        '<div  id="wrapperkeybord" class="topnone">' +
        '<div id="scrollerkeybord">' +
        '<ul id="thelistkeybord" class="thelistkeybord"></ul>' +
        '</div>' +
        '</div></div>';
    softkeyContent += '<div id="MyDiv" class="white_content"></div>';

    softkeyContent += '<div class="secondliness_yl"><div class="numbersecondlines_yl"><table class="numbersecondline_yl" ><tr><td rowspan="3" class="nulldiv">' +
        '<div id="parent" class="numberline3_yl"><div id="content">' +
        '<table id="gdtable"><tr><td class="slideTD" style="border: 0px;border-bottom: 1px solid #c4ccdb;">600</td></tr><tr><td class="slideTD" style="border:0px;border-bottom: 1px solid #c4ccdb;">601</td></tr><tr><td class="slideTD" style="border:0px;border-bottom: 1px solid #c4ccdb;">000</td></tr><tr><td  class="slideTD" style="border:0px;border-bottom: 1px solid #c4ccdb;">002</td></tr><tr><td  class="slideTD" style="border: 0px;">300</td></tr></table>' +
        '</div></div></td><td >1</td><td>2</td><td>3</td><td id="buttonBack1" class="buttonclass"><span class="backSpace"></span></td></tr>' +
        '<tr><td>4</td><td >5</td><td>6</td><td class="buttonclass" id="hideLines">隐藏</td></tr>' +
        '<tr><td id="qqqqaaaa">7</td><td>8</td><td>9</td><td class="buttonclass" id="emptyVal"">清空</td></tr>' +
        '<tr><td class="buttonclass" colspan="2" id="qieABC">ABC</td><td>0</td><td class="buttonclass" id="affirmyl-123" colspan="2">搜索</td></tr></table></div>';
    softkeyContent += '<div id="lettersecondline1s" >';

    softkeyContent += '<table class="lettersecondline1_yl"><tr><td>q</td><td>w</td><td>e</td><td>r</td><td>t</td><td>y</td><td>u</td><td>i</td><td>o</td><td>p</td></tr></table>';
    softkeyContent += '<table class="lettersecondline1_yl"><tr><td style="width:5%;" class="nobg"><div></div></td><td>a</td><td>s</td><td>d</td><td>f</td><td>g</td><td>h</td><td>j</td><td>k</td><td>l</td><td style="width:5%;" class="nobg"></td></tr></table>';
    softkeyContent += '<table class="lettersecondline1_yl"><tr><td class="buttonclass" id="capslks" style="width: 17%"><span class="switchSize"></span></td><td>z</td><td>x</td><td>c</td><td>v</td><td>b</td><td>n</td><td>m</td><td id="buttonBack2" class="buttonclass" style="width: 17%;"><span class="backSpace"></span></td></tr></table>';
    softkeyContent += '<table class="lettersecondline1_yl"><tr><td class="buttonclass" id="qie123" style="width:25%;">123</td><td style="width:50%;" class="buttonclass"  id="nullLine"">空格</td><td id="affirmyl-abc" class="buttonclass" style="width:25%;">搜索</td></tr></table>';
    softkeyContent += '</div>';

    softkeyContent += '</div></div></div>';

    $("#gw-mobile-main-content").append(softkeyContent);

    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        CLICK_ENV = hasTouch ? 'fastClick' : 'click';
        CLICK_STA = hasTouch ? 'touchstart' : 'mousedown';
        CLICK_MOE = hasTouch ? 'touchmove' : 'mousemove';
        CLICK_END = hasTouch ? 'touchend' : 'mouseup';

    $("#123-close").bind(CLICK_STA, function () {
        closekeyboard();
        return false;
    });

    $("#abc-close").touchEvent({
        "fastClickStart" : function(event){
            event.preventDefault();
            $(this).css({"opacity":0.6});
        },
        "moving" : function(event){
            event.preventDefault();
            $(this).css({"opacity":1});
        },
        "fastClickEnd" : function(){closekeyboard()}//取消
    });
    $("#softkeyboard td[class!=buttonclass][class!=nulldiv][class!=nobg][class!=slideTD]").each(function(){
        $(this).bind(CLICK_STA, function () {
            lienshow(this);
            return false;
        });
        $(this).bind(CLICK_END, function () {
            lienhide(this);
            return false;
        });
    });
//    $("td[class!=buttonclass][class!=nulldiv][class!=nobg][class!=slideTD]","#softkeyboard").touchEvent({
//        "fastClickStart" : function(event){
//            event.preventDefault();
//            lienshow(this);
//        },
//        "fastClickEnd" : lienhide
//    });


    $("#softkeyboard").find("td[class=slideTD]").bind(CLICK_STA, lienshowTE);//按下显示
    $("#softkeyboard").find("td[class=slideTD]").bind(CLICK_END, lienhideTE);//松开隐藏


    $("#affirmyl-123").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        selectButton();
        return false;
    });//松开搜索事件
    $("#affirmyl-123").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        return false;
    });//松开搜索事件

    $("#affirmyl-abc").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        selectButton();
        return false;
    });//松开搜索事件
    $("#affirmyl-abc").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        return false;
    });//松开搜索事件

    $("#qieABC").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//键盘切换
    $("#qieABC").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        numberLetterlines();
        return false;
    });//键盘切换

    $("#qie123").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//键盘切换
    $("#qie123").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        numberLetterlines();
        return false;
    });//键盘切换
    $("#emptyVal").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//清空
    $("#emptyVal").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        emptyValue();
        return false;
    });//清空

    $("#capslks").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//切换大小写
    $("#capslks").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        capslks();
        return false;
    });//切换大小写

    $("#nullLine").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });////空格
    $("#nullLine").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        nullLine();
        return false;
    });////空格

//    $("#scrollerkeybord").bind(CLICK_STA, function () {
//        hideLines();
//        return false;
//    });//隐藏

    $("#hideLines").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//隐藏
    $("#hideLines").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        hideLines();
        return false;
    });//隐藏

    $("#tdinputid").bind(CLICK_ENV, function () {
        showLines();
        return false;
    });//显示

    $("#buttonBack1").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//实现BackSpace键的功能
    $("#buttonBack1").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        setpassvalue();
        return false;
    });//实现BackSpace键的功能

    $("#buttonBack2").bind(CLICK_STA, function () {
        $(this).addClass("touched");
        return false;
    });//实现BackSpace键的功能
    $("#buttonBack2").bind(CLICK_END, function () {
        $(this).removeClass("touched");
        setpassvalue();
        return false;
    });//实现BackSpace键的功能

    $('#inputimgadd').bind(CLICK_ENV, function () {
        emptyValue();
        return false;
    });


    /**
     * 垂直滚动
     */
    var parent = document.getElementById('parent');
    var content = document.getElementById('content'); // 上一次位置
    //geheight = $("#parent").height()/4-($("#parent").height()/4)*2;
    parent.addEventListener('touchstart', function (e) {
        lastY = e.touches[0].pageY;
        geheight = $(this).height() / 4 - ($(this).height() / 4) * 2;
    });
    parent.addEventListener('touchmove', function (e) {
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        //设置top值移动content
        if (contentTop == "") {
            content.style.top = moveY + 'px';
        } else {
            content.style.top = (parseInt(contentTop) + moveY) + 'px';
        }
        lastY = nowY;
        BackSpacel = 1;
    });
    parent.addEventListener('touchend', function (e) {
        var contentTop = content.style.top.replace('px', '');
        if (contentTop > 0) {
            content.style.top = '0px';
        } else if (contentTop < geheight) {
            content.style.top = geheight + 'px';
        }
        BackSpacel = 0;
    });


//键盘切换
    function numberLetterlines() {
        if (CapsLockValue == 1) {
            CapsLockValue = 0;
            $('.numbersecondlines_yl').show();
            $('#lettersecondline1s').hide();
        } else {
            CapsLockValue = 1;
            $('#lettersecondline1s').show();
            $('.numbersecondlines_yl').hide();
        }
    }


//给输入的密码框添加新值
    function addValue(newValue) {
        var tdid = $("#tdinputid");
        var val = tdid.text();
        if (val.length < 6) {
            console.log(val);
            tdid.text(val + newValue);
        }else if(val=="代码/拼音/首字母"){
            tdid.text(newValue);
            tdid.css({"color":"#c4dffa"});
            $('#inputimgadd').addClass("inputimg2");
        }
    }

//实现BackSpace键的功能
    function setpassvalue() {
        var tdid = $("#tdinputid");
        if(tdid.text()=="代码/拼音/首字母"){
            return;
        }
        var longnum = tdid.text().length;
        var num = tdid.text().substr(0, longnum - 1);
        tdid.text(num);
        if (longnum == 1) {
            inputPrompt();
            $('#inputimgadd').removeClass("inputimg2");
            showHistroy();
            showLines();
            return;
        }
        inputSelect();
    }


//清空
    function emptyValue() {
        inputPrompt();
        $('#inputimgadd').removeClass("inputimg2");
        showHistroy();
        showLines();
    }





//空格
    function nullLine() {
        addValue(" ");
    }

//切换大小写
    function capslks() {
        var tds1 = $(".lettersecondline1_yl td");
        var regExpX = /[a-z]/;
        var regExpD = /[A-Z]/;
        $.each(tds1, function (i, val) {
            if (regExpX.test($(val).text())) {
                $(val).text($(val).text().toUpperCase());
                $(val).addClass("uppercase");
            } else if (regExpD.test($(val).text())) {
                $(val).text($(val).text().toLowerCase());
                $(val).removeClass("uppercase");
            }
        });
    }

    function selectButton() {
        inputSelect();
    }

    function lienshowTE() {
        $(this).addClass("touched");
        $('#MyDiv').text($(this).text());
        $('#MyDiv').show();
    }

    function lienhideTE() {
        $('#MyDiv').hide();
        if (BackSpacel == 0) {
            addValue($(this).text());
            inputSelect();
        }
        $(this).removeClass("touched");
    }
    var addtime;
    //添加值，样式
    function lienshow(end) {
        $(end).addClass("touched");
        $('#MyDiv').text($(end).text());
        $('#MyDiv').css({"display":"block"});
        clearTimeout(addtime);
    }

    //删除值，样式
    function lienhide(end) {
        if (BackSpacel == 0) {
            addValue($(end).text());
        }
        $(end).removeClass("touched");
        addtime = setTimeout(function(){
            $('#MyDiv').css({"display":"none"});
            inputSelect();
        }, 500);
    }



    //输入搜索
    function inputSelect() {
        //$("#wrapperkeybord").css("height", height_yl-91);
        $("div", "#resultnull").unbind(CLICK_ENV);
        preval = $("#tdinputid").text();
        var url = getFullUrl("sys/key");
        var param = {"Accept": "json", "language": 1, "typelv1":'1,2,4',"typelv2":'1,5,41', "delist": 1, "num":20, "input": preval.toUpperCase()};
        $.ajax({
            url: url,
            data: param,
            dataType: "jsonp",
            timeout: 3000,
            complete:function(e,t){
                if(t && t == "timeout"){
                    toastText("网络服务不给力⊙﹏⊙");
                }
            }
        }).done(function (data) {
                console.log("Sample of data:", data);
                if (data && data.length > 0) {
                    //判断是否登录
                    var userid = getUserInfo();
                    var optional = [];
                    loadOptionalData(function(optional) {
                        var html = "";
                        for (var i = 0; i < data.length; i++) {
                            var obj = data[i];
                            var isStock = false;
                            var stockCode = obj.OBJ;
                            html += '<li class="Histroys" data-value="' + stockCode + '" data-url="' + stockCode + '">';
                            html += '<div class="char"><span class="first">' + obj.NAME + '</span><em class="second">' + obj.INNERCODE.substring(2, obj.INNERCODE.length) + '</em></div>'
                            //判断是否自选股
                            var mark = '<div class="addStock"><span>+</span></div>';
                            if (optional && optional["自选股"]) {
                                var result = optional["自选股"];
                                if (!result) result = [];
                                for (var j = 0; j < result.length; j++) {
                                    if (result[j] && result[j].indexOf("#") > 0) {
                                        var key = result[j].split("#")[0];
                                        if (key == obj.INNERCODE + ".stk") {
                                            mark = '<div  class="added"><span>已添加</span></div>';
                                            break;
                                        }
                                    }
                                }
                            }
                            html += '<div class="last">' + mark + '</span></div>';
                            html += iscode(obj.INNERCODE.substring(0,2));
                            html += '</li>';
                        }
                        $("#resultnull").find("#thelistkeybord").html(html);
                        venderkeybord();

                        $("li","#resultnull").touchEvent({
                            "fastClickStart" : function(event){
                                event.preventDefault();
                                $(this).addClass("HistroystouchedLi");
                                hideLines();
                            },
                            "moving" : function(event){
                                event.preventDefault();
                                if($(this).hasClass("HistroystouchedLi")){
                                    $(this).removeClass("HistroystouchedLi");
                                }
                            },
                            "fastClickEnd" : quotationChart_yl,//跳股票详情页面
                            "longClickEnd" : function(event){
                                event.preventDefault();
                                if($(this).hasClass("HistroystouchedLi")){
                                    $(this).removeClass("HistroystouchedLi");
                                }
                            }
                        });

                        $("div[class=last]", "#resultnull").touchEvent({
                            "fastClickStart": function (event) {
                                event.stopPropagation();
                            },
                            "fastClickEnd": function (e) {
                                var stockCode = $(this).parent().attr("data-value");
                                //根据状态判断是否添加自选股
                                var status = $(this).find("span").attr("class");
                                if ($(this).parent().find("div").hasClass("addStock")) {
                                    var obj = [];
                                    obj.push(stockCode);
                                    setOptionalData(obj);
                                    $(this).html('<div  class="added"><span>已添加</span></div>');
                                }
                            }
                        });
                    },true)
                } else {
                    $("#resultnull").find("#thelistkeybord").html("查询结果为空");
                    if(myscrollkeybord){
                        myscrollkeybord.disable();
                        $("#wrapperkeybord").css("height", 50);
                    }
                }
            });
        if (preval == "") {
            $("#resultnull").find("#thelistkeybord").html("查询结果为空");
            $("#wrapperkeybord").css("height", 50);
            showLines();
            return;
        }
    }
    hideLines();
    initShow();
    $(window).resize(function () {
        initShow();
    });
}


//关闭软键盘
function closekeyboard(keyboard_yl) {
    queryPageIsShow=false;
    $('#softkeyboard').transition({y:0},200,"linear",function(){
        refreshQuotationIndexData();
        if(keyboard_yl){
            return;
        }
        inputPrompt();
        $('#inputimgadd').removeClass("inputimg2");
        $("#resultnull").find("#thelistkeybord").html("");
        hideLines();
    });
    $("#abc-close").css({"opacity":1});
}
//显示软键盘
function showkeyboard() {
    queryPageIsShow=true;
    var ht = $('#softkeyboard').height();
    showHistroy();
    $('#softkeyboard').transition({y:-ht},500,"ease-in-out",function(){
        showLines();debugger;
    });
    height_yl = $("body").height();
}
//隐藏
function hideLines() {
    if (CapsLockValue == 0) {
        $('.numbersecondlines_yl').hide();
    } else {
        $('#lettersecondline1s').hide();
    }
    showhidezt = true;
}


function initShow() {
    var width = $("#gw-mobile-content").width();
    height_yl = $("body").height();
    $('#softkeyboard').css({"top":height_yl});//键盘top
    $("#lettersecondline1s").css({"width": width, "height": height_yl * 0.5});//键盘高
    $(".numbersecondlines_yl").css({"width": width, "height": height_yl * 0.5});//键盘高
    $(".lettersecondline1_yl").css({"height": Math.ceil((height_yl * 0.5)/4)-1});//键盘英文一行的高度
    //$('#parent').css({"height": Math.ceil((height * 0.5))-Math.ceil((height * 0.5)/4)-25});//键盘左边数字键高度
    $("#wrapperkeybord").css("height", height_yl - 91);
}

function venderkeybord() {
    if (myscrollkeybord == null) {
        myscrollkeybord = new iScroll('wrapperkeybord', {
            hideScrollbar: true//没有用户操作时，滚动条隐藏
        });
        setTimeout(function () {
            myscrollkeybord.refresh();
        }, 300);
    } else {
        $("#wrapperkeybord").css("height", height_yl-97);
            myscrollkeybord.enable();
            myscrollkeybord.refresh();
    }
    if(myscrollkeybord.scrollerH<(height_yl-91)){
        $("#wrapperkeybord").css("height", myscrollkeybord.scrollerH);
        myscrollkeybord.refresh();
    }
    myscrollkeybord.scrollTo(0,0);
}

//显示历史查询记录
function showHistroy() {
    var optional = [];
    loadOptionalData(function(optional){
        //$("#wrapperkeybord").css("height", height-91);
        var histroyStrdate = null;
        var histroyStr = localStorage.getItem(histroy_yl);
        if (histroyStr != null) {
            histroyStrdate = histroyStr.split(";");
            var html = "";
            html += "<li style='height: 25px;'><div class='thelistkeybord-title'>以下为历史查询记录</div></li>";
            for (var i = 0; i < histroyStrdate.length; i++) {
                var obj = JSON.parse(histroyStrdate[i]);
                var stockCode = obj.obj;
                html += '<li class="Histroys" data-value="' + stockCode + '" data-url="' + stockCode + '">';
                html += '<div class="char"><span class="first">' + obj.stkName + '</span><em class="second">' + obj.code + '</em></div>'
                //判断是否自选股
                var mark = '<div class="addStock"><span>+</span></div>';
                if (optional && optional["自选股"]) {
                    var result = optional["自选股"];
                    if (!result) result = [];
                    for (var j = 0; j < result.length; j++) {
                        if (result[j] && result[j].indexOf("#") > 0) {
                            var key = result[j].split("#")[0];
                            if (key == stockCode) {
                                mark = '<div  class="added"><span>已添加</span></div>';
                                break;
                            }
                        }
                    }
                }
                html += '<div class="last">' + mark + '</div>';
                html += iscode(stockCode.substring(0,2));
                html += '</li>';
            }
            html += "<li class='clearHistroy'><div class='clearhistory'><span><i class='ico_clear'></i>清除搜索历史记录</span></div></li>";
            $("#resultnull").find("#thelistkeybord").html(html);
            venderkeybord();

            $("li[class=clearHistroy]","#resultnull").touchEvent({
                "fastClickStart" : function(event){
                    event.preventDefault();
                    $(this).addClass("HistroystouchedLi");
                },
                "moving" : function(event){
                    event.preventDefault();
                    if($(this).hasClass("HistroystouchedLi")){
                        $(this).removeClass("HistroystouchedLi");
                    }
                },
                "fastClickEnd" : function(){
                    clearHistroy();
                    $("#resultnull").find("#thelistkeybord").html("");
                    if(myscrollkeybord){
                        myscrollkeybord.disable();
                        $("#wrapperkeybord").css("height", 50);
                    }
                    showLines();
                },////清除历史搜索记录
                "longClickEnd" : function(event){
                    event.preventDefault();
                    if($(this).hasClass("HistroystouchedLi")){
                        $(this).removeClass("HistroystouchedLi");
                    }
                }
            });


            $("li[class=Histroys]","#resultnull").touchEvent({
                "fastClickStart" : function(event){
                    event.preventDefault();
                    $(this).addClass("HistroystouchedLi");
                    hideLines();
                },
                "moving" : function(event){
                    event.preventDefault();
                    if($(this).hasClass("HistroystouchedLi")){
                        $(this).removeClass("HistroystouchedLi");
                    }
                },
                "fastClickEnd" : quotationChart_yl,//跳股票详情页面
                "longClickEnd" : function(event){
                    event.preventDefault();
                    if($(this).hasClass("HistroystouchedLi")){
                        $(this).removeClass("HistroystouchedLi");
                    }
                }
            });

            $("div[class=last]", "#resultnull").touchEvent({
                "fastClickStart": function (event) {
                    event.stopPropagation();
                },
                "fastClickEnd": function (e) {
                    var stockCode = $(this).parent().attr("data-value");
                    //根据状态判断是否添加自选股
                    if ($(this).parent().find("div").hasClass("addStock")) {
                        var obj = [];
                        obj.push(stockCode);
                        setOptionalData(obj);
                        $(this).html('<div class="added"><span>已添加</span></div>');
                    }
                }
            });
        } else {
            $("#resultnull").find("#thelistkeybord").html("");
            if(myscrollkeybord){
                myscrollkeybord.disable();
                $("#wrapperkeybord").css("height", 50);
            }
        }
    },true);
//    showLines();
}

//跳股票详情页面
function quotationChart_yl(){
    if($(this).hasClass("HistroystouchedLi")){
        $(this).removeClass("HistroystouchedLi");
    }
    var url = $(this).attr("data-url");
    if (url && url.length > 0) {
        //股票详情页面
        var chartParams = {pageId:"quotationChart",params:{
            "stockCode" : url,
            callback:createQuotationDetailBody//,
            //"showkeyboard":true
        }};
        changePageByParams(chartParams);
        addHistroy(this);
    }
}

//添加查询历史记录
function addHistroy(liz) {
    var stockCode = $(liz).attr("data-value");
    var obj = {};
    obj["obj"] = stockCode;
    obj["stkName"] = $(liz).find(".first").html();
    obj["code"] = $(liz).find(".second").html();

    var histroyStr = localStorage.getItem(histroy_yl);
    if (histroyStr == null) {
        localStorage.setItem(histroy_yl, JSON.stringify(obj));
    } else {
        var histroyStrdate = histroyStr.split(";");
        for (var i = 0; i < histroyStrdate.length; i++) {
            if (JSON.parse(histroyStrdate[i]).obj == stockCode) {
                return;
            }
        }
        histroyStr += ";" + JSON.stringify(obj);
        localStorage.setItem(histroy_yl, histroyStr);
    }
}
//清空历史记录
function clearHistroy() {
    localStorage.removeItem(histroy_yl);
}

function iscode(code){
    var html="";
    if(code=='HK'){
        html +='<i class="stock_ico">'+code+'</i>';
    }
    return html;
}

//显示
function showLines() {
    if (showhidezt) {
        if (CapsLockValue == 0) {
            $('.numbersecondlines_yl').slideDown(100);
        } else {
            $('#lettersecondline1s').slideDown(100);
        }
        showhidezt = false;
    }
}
//显示输入框提示文字
function inputPrompt(){
    var inputtext  = $("#tdinputid");
    inputtext.css({"color":"#548FD3"});
    inputtext.text("代码/拼音/首字母");
}