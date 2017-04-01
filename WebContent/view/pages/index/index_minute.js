
var stockCode = "EURUSD";       //无用
var base_url = 'ea'; //iTrade_V3/stock
function creat_k_chart(binTime,period){
    var lastTradeDay = "20140101";
    var timeStr = "";
    //var urlmobile = 'mobile/stock/getMarketByObjs';
    var urlmobile = base_url + '/getMarketByObjs';
    //初始化
    kLineChart = $('#chartContent'+timeStr).kLineChart({
        stockCode : stockCode,
        period : period
    });
    var url = getFullUrl(urlmobile);

    var datas = { "obj":stockCode , "time" : binTime, period:period };
    getAjaxDatas(url, datas, function(result){
        $('#refreshBtnDetail').attr("class","ui-gw-header-refresh");
        if(result == "timeout"){
            if(timeLineChart != null){
                //showLoading(quotationTimeLineId,$('#chartContent'+timeStr).get(0),true);
            }
            if(kLineChart != null){
                //showLoading(quotationKLineId,$('#chartContent'+timeStr).get(0),true);
            }
            return;
        }
        if(result && result.length>0){
            var res = result[0];
            var sh = null;
            if(result.length >= 2){
                sh = result[1];
            }
            if(res && res.obj != stockCode){
                if(result.length >= 2){
                    res = result[1];
                    sh = result[0];
                }else{
                    res = null;
                }
            }

            if(res){
                var obj = stockCode;
                var time = res.time;
                var open = res.open;
                var high = res.high;
                var low = res.low;
                var volume = 0;
                var amount = 0;
                var price = res.close;
                var currentKLine = null;
                var k = 0;
                var d = 0;
                if(res.updnratio != "--"){
                    currentKLine = [time,open,high,low,price,volume,k,d];
                }
                if(kLineChart!=null){
                    kLineChart.refresh({
                        period : period,
                        lastTradeDay:lastTradeDay,
                        currentKLine : currentKLine,
                        binTime : binTime,
                        maxTime : 20120202070100,
                        minTime : 20120102070100
                    });
                }
            }else{

                if(kLineChart != null){
                    //showLoading(quotationKLineId,$('#chartContent'+timeStr).get(0),true);
                }
            }
        }
    });
}

//注册键盘事件
var isShowTraLine = false;       //横线显示
$(document).keydown(function(event){
    switch(event.keyCode){
        case 37 : doMove(0);         //左方面键
            break;
        case 39 : doMove(1);
            break;
        case 38 : isShowTraLine = !isShowTraLine;     //上
            break;
    }
});


function loadStart(){
    $('#massage').hide();
    initTable();
    initDataPage();
    refreshCache();
}

/**
 * 重新设置缓存数据和字体大小写
 */
function refreshCache(){
    var storageSize = getAllLocalStorageDatasSize();
    $("#cacheSize").html(storageSize);
}

/** 初始化参数 **/
function initDataPage(){
    var url = getFullUrl(base_url + '/getInitData');
    var param = {period:period};
    getAjaxDatas(url,param,function(resp) {
        if(resp=="timeout" || !resp.hasOwnProperty("data")){
            return;
        }
        $('#fx_step01').val(resp.data[0]);
        $('#fx_step02').val(resp.data[1]);
        $('#fx_step03').val(resp.data[2]);
        $('#fx_step04').val(resp.data[3]);
        $('#binTime').val(resp.data[4]);
        binTime = resp.data[4];
        creat_k_chart(binTime, period);
    });
}

function clearAllCahe(){
    clearAllLocalStorageDatas(); // 清空缓存
    if(kLineChart){
        kLineChart.clearAllCahe();
    }
    //将缓存大小设置为0B
    $("#cacheSize").html("0B");
}

function creatFx(){
    if(kLineChart){
        kLineChart.drawFx();
        kLineChart.drawArrows();

    }
}
function doMove(type){
    if(kLineChart){
        var num = $('#move_id').val();
        kLineChart.doMove(type, num);
    }
}

function switchTab(n){
    for(var i = 1; i <= 5; i++){
        document.getElementById("tab_" + i).className = "";
    }
    document.getElementById("tab_" + n).className = "on";

    binTime = $('#binTime').val();
    switch(n){
        case 1 : creat_k_chart(binTime,5); break;
        case 2 : creat_k_chart(binTime,10); break;
        case 3 : creat_k_chart(binTime,30); break;
        case 4 : creat_k_chart(binTime,60); break;
        case 5 : creat_k_chart(binTime,240); break;
    }

}
