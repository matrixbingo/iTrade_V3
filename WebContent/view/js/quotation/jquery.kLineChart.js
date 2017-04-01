/*
 * K线 技术研发部---移动终端开发部 齐晓凯 创建日期：2011-6-20
 */

(function($, undefined) {
    $.fn.kLineChart = function(options) {
        var param = {};
        var refreshTime = localStorage.getItem("refreshTime");
        var canvasObj;                      //竖线面板
        var defaults = {
            lineMoveHigh : 100,
            lineMoveColor : '#000',         //竖线颜色
            isOverlays:false ,              //是否显示均线
            btmove : 140 ,                  //向下移动像素
            fxData : {
                up : 1,                     //顶
                dn : -1,                    //底
                isShow : true,             //是否显示
                btMargin  : 1,              //折线上下偏移量
                fxColor : '#000',            //折线颜色
                fxWidth : 4,                 //折线宽
                arrMargin:40,                 //箭头偏移量
                arrUpColor : '#FF0000',
                arrDnColor : '#00FF00'
            },

            kLineCurrent : {
                total : 0,                  //显示K线总数
                ts : [],                    //序号 ：时间
                tsMap : new HashMap(),      //时间 - 序号
                ohlc : [],                  //k线数据
                vol : [],                   //成交量
                overlays : [],              //均线
                indicators : [],            //指标
                fillRectKData : []          //所画k线数据
            },
            quotationType:"1",
            dataType : "day",
            period : '日K',
            stockCode : '',
            accuracy : 2,
            // 数据更新间隔
            interval : refreshTime,
            // 左边距
            lMargin : 12* 2,
            // 右边距
            rMargin : 11* 2,
            // 顶端边距
            tMargin : 1* 2,
            tPadding : 10* 2,
            // 底部边距
            bMargin : 1* 2,
            bPadding : 10* 2,

            vSpacing : 20* 2,
            percent:1.00,
            minheight:200,

            indicatorIndex : 1,  // 默认显示MACD 指标（指标切换）

            // 背景颜色
            background : "#000000",
            //background : "#FFFFFF",
            // 表格线颜色
            lineColor : 'rgba(170,170,170,0.5)',
            focusLine : '#00FFFF',
            minwidth : 8 * 2,    //k线宽
            // 技术指标线颜色
            overlayColors : ['#A21DCE', '#E1D775', '#63CDFD'],
            macd : ['#00FFFF', '#FFFF00', '#aabbcc'],
            // 涨
            riseColor : '#DF0001',
            riseColorUp : '#FF0000',
            // 跌
            fallColor : '#1CAA3A',
            fallColorDn : '#00FF00',
            //平开
            eqColor : '#000000',
            // 十字查询详细信息
            detailCss : 'position:absolute;z-index:9999; border: 2px solid #FF0000; background: #000000;text-align:left;width:60px;height:80px; padding:2px;filter:alpha(Opacity=60);-moz-opacity:0.5;opacity: 0.8;'
        };
        var moveTarget1x = null;
        var moveTarget1y = null;
        var moveTarget2x = null;
        var moveTarget2y = null;
        var moveTarget3x = null;
        var moveTarget3y = null;
        var moveTarget4x = null;
        var	moveTarget4y = null;
        var times = 0;

        var options = $.extend(defaults, options);
        /* 初始化 target:div#chartContent */
        function init(target) {
            this.chartParams = {};
            this.target = target;
            this.canvas = undefined;
            this.overlay = undefined;
            this.overlayout = undefined;
            this.overlayback = undefined;
            if($(this.target).find("canvas[id^=base]").size() > 0){
            	this.canvas = $(this.target).find("canvas[id^=base]")[0];
            }
            if($(this.target).find("canvas[id^=overlay]").size() > 0){
            	this.overlay = $(this.target).find("canvas[id^=overlay]")[0];
            }
            return this;
        };
        /**
         *
         * @returns {*}
         * @private
         */
        function _initCanvas() {
            this.focusXY = undefined;
            this.width = document.body.clientWidth * 2;         //可见区域的宽
            //计算高度
            var clientHeight = document.body.clientHeight;      //div的高
            var top =  this.target.offsetTop;                   //target : div#chartContent
            var height = (clientHeight - top) * 5/10;
            if(height < options.minheight){
                height = options.minheight;
            }

            //定义容器高度
            this.height = height * 2 - 20;
            $(this.target).parent().get(0).height = this.height;
            //

            //k线框的宽高
            this.plotWidth = this.width - (options.lMargin + options.rMargin);
            this.plotHeight = Math.round((this.height - options.tMargin - options.bMargin - options.vSpacing) * 6 / 10);    //k线显示框
            options.btmove = this.height - options.tMargin - this.plotHeight - options.vSpacing - options.bMargin + options.vSpacing/2;          //指标框

            if($(this.target).find("canvas").size()<=0){
                this.canvas = null;
                this.overlay = null;
            }
            if (this.canvas) {
                this.canvas.height = this.height;
                this.canvas.width = this.width;
                this.overlay.height = this.height;
                this.overlay.width = this.width;
            } else {
                this.canvas = _getCanvas("base",this.width, this.height);
                this.overlay = _getCanvas("overlay",this.width, this.height);
                this.overlayout = _getCanvas("overlayout",this.width, this.height*2);
                this.overlayback = _getCanvas("overlayback",this.width, this.height*2);
                if (!this.canvas) {
                    throw "Cannot Initialize canvas";
                }
                this.canvas.tabIndex = 0;
                this.target.appendChild(this.canvas);
                this.target.appendChild(this.overlay);
                this.target.appendChild(this.overlayout);
                this.target.appendChild(this.overlayback);
	            //$(this.canvas).wrap('<div style="display:block;position:absolute;top:0;left:0"></div>');
            }
            this.canvas.plot = this;
            this.overlay.plot = this;
            this.overlayout.plot = this;
            $(this.canvas).css({width:this.width/2,height:this.height/2});
            $(this.overlay).css({width:this.width/2,height:this.height/2});
            $(this.overlayout).css({width:this.width/2,height:this.height});
            $(this.overlayback).css({width:this.width/2,height:this.height});

            removeELs();
            addELs();
            //$(this.canvas).css({"position":"relative","z-index":7});
            $(this.canvas).css({"position":"relative",top:0,left:0,"z-index":6});
            $(this.overlay).css({"position":"absolute",top:0,left:0,"z-index":8});
            $(this.overlayout).css({"position":"absolute",top:0,left:0,"z-index":4});
            $(this.overlayback).css({"position":"absolute",top:0,left:0,"z-index":7});

            //2d画布对象
            this.canvas.backgroundAlpha = 0;
            this.overlay.backgroundAlpha = 0;
            this.overlayout.backgroundAlpha = 0;
            this.overlayback.backgroundAlpha = 1;

            this.ctx = this.canvas.getContext("2d");
            this.overlayCtx = this.overlay.getContext("2d");
            this.overlayoutCtx = this.overlayout.getContext("2d");
            this.overlaybackCtx = this.overlayback.getContext("2d");
            canvasObj = this.overlaybackCtx;
            //this.chartParams = {};

            return this;
        };

        /** 获取canvas */
        function _getCanvas(id,w, h) {
            var canvas = $("<canvas></canvas>");
            var c = canvas.get(0);
            if(!id) id = "";
            c.id = id + Math.round(Math.random() * 100);
            c.width = w;
            c.height = h;
            return c;
        };
        /**
         * 获取精度
         * 10.233 : 3
         */
        function getAccuracy(price){
            price = ''+price;
            var pos = price.indexOf('.');
            if(pos==-1){
                return 2;
            }
            return price.length - price.indexOf('.')-1;
        }
        /**
         * 装载数据
         *
         * data: Array[98]
         * title: Array[7]
         */
        function read(data, done) {
            var errorcode = 0;
            var d = data.data;
            var title = data.title;
            var ShiJianChuo = getTitleIndex("time");
            var KaiPanJia = getTitleIndex("open");
            var ZuiGaoJia = getTitleIndex("high");
            var ZuiDiJia = getTitleIndex("low");
            var ZuiXinJia = getTitleIndex("price");
            var ChengJiaoZongLiang = getTitleIndex("volume");
            var ChengJiaoZongJinE = getTitleIndex("amount");
            var ShouMoBiaoShi = getTitleIndex("ShouMoBiaoShi");
            function getTitleIndex(name){
                for(var i = 0;i<title.length;i++){
                    if(title[i]==name){
                        return i;
                    }
                }
            };
            if (errorcode) {
                if ($.isFunction(done)) {
                    return false;
                    return done.call(this, errorcode);
                } else {
                    return false;
                }
            }

            this.kLineCurrent = {
                ts : [],        //时间
                ohlc : [],      //k线数据
                vol : [],       //成交量
                overlays : [],  //均线
                indicators : [] //指标
            };
            // this.chartParams.label = label;
            var ts = [];
            var ohlc = [];   //open,high,low,price,low[-1]
            var v = [];      //成交量
            if (!d) {
                d = data;
            }
            var lastTime = d[0][0];
            var dLen = d.length;
            for (var i=0;i<dLen;i++) {
                ts[i] = _formatDate(d[i][ShiJianChuo]);
                var lcp = i > 0 ? ohlc[i-1][ZuiXinJia] : parseFloat(d[i][ZuiXinJia]);
                ohlc[i] = [parseFloat(d[i][KaiPanJia]), parseFloat(d[i][ZuiGaoJia]), parseFloat(d[i][ZuiDiJia]), parseFloat(d[i][ZuiXinJia]),lcp];
                if (d[i][ChengJiaoZongLiang]) {
                    v[i] = parseFloat(d[i][ChengJiaoZongLiang]);
                }
            }
            options.accuracy = getAccuracy(data.PREV_CLOSE);
            var rise = ((ohlc[ohlc.length - 1][3]-lcp)*100/lcp).toFixed(options.accuracy);//涨跌幅
            this.chartParams.label = ohlc[ohlc.length - 1][3]+' '+ rise+'%';    //最新价 涨跌幅
            this.chartParams.labelColor = options.eqColor;
            if(rise > 0){
                this.chartParams.labelColor = options.riseColor;
            }else if(rise < 0){
                this.chartParams.labelColor = options.fallColor;
            }
            this.kLineCurrent = {};
            this.kLineCurrent.ohlc = ohlc;  //open,high,low,price,price[-1]
            this.kLineCurrent.ts = ts;      //time
            this.kLineCurrent.vol = v;      //成交量
            this.kLineCurrent.lastTime = lastTime;
            // this.chartParams.end = this.dailydata.ohlc.length;
            // 均线数据
            this.ocoffset = 0;
            if(options.isOverlays){ //是否显示均线
                this.kLineCurrent.overlays = [];
                ma(this.kLineCurrent.ohlc, 5, 'close');
                ma(this.kLineCurrent.ohlc, 10, 'close');
                ma(this.kLineCurrent.ohlc, 30, 'close');
            }
            // macd
            this.kLineCurrent.indicators = [];
            macd(this.kLineCurrent.ohlc, 12, 26, 9);
            // rsi
            rsi(this.kLineCurrent.ohlc, [6, 12, 24]);

            return true;
        };
        /* 均线 */
        function ma(data, period, which) {
            which = which || 'close';
            var o;
            switch (which) {
                case 'close' :
                    o = 3;
                    break;
                case 'high' :
                    o = 1;
                    break;
                case 'low' :
                    o = 2;
                    break;
                default :
                    o = 3;
            }
            // var prop = 'ma' + period + which;
            var prop = period;
            var s_ = [];
            var _sum = 0;
            period = period - 1;
            for (i = 0; i < data.length; i++) {
                if (i < period) {
                    s_[i] = undefined;
                    continue;
                }
                var t = data.slice(i - period, i + 1);
                _sum = 0;
                var tLlen = t.length;
                for (j=0;j<tLlen;j++) {
                    _sum += t[j][o];

                };
                s_[i] = _sum / (period + 1);
            }
            var overlay = {
                type : prop,
                data : s_,
                offset : this.ocoffset
            };
            this.kLineCurrent.overlays.push(overlay);
            this.ocoffset++;
            return this;
        };
        // 平滑异同移动平均线
        function macd(data, p1, p2, signal) {
            var d = [];
            for (var i = 0; i < data.length; d.push(data[i++][3]));
            // 1、首先分别计算出收市价HORT日指数平滑移动平均线与LONG日指数平滑移动平均线，分别记为EMA(SHORT)与EMA(LONG)。
            var ep1 = _ema(d, p1);
            var ep2 = _ema(d, p2);
            // 2、求这两条指数平滑移动平均线的差，即:DIFF=EMA(SHORT)－EMA(LONG)
            for (var i = 0; i < ep1.length; i++) {
                ep1[i] = ep1[i] - ep2[i];
            }
            // 3、再计算DIFF的MID日指数平滑移动平均，记为DEA。
            ep2 = _ema(ep1, signal);
            var m_ = [];
            // 4、最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。
            for (i = 0; i < ep1.length; i++) {
                m_[i] = [ep1[i], ep2[i], (ep1[i] - ep2[i])];
            }
            var i = {
                type : 'macd',
                data : m_
            };
            this.kLineCurrent.indicators.push(i);
            return this;
        };
        // 指数平滑移动平均线
        function _ema(data, period, which) {
            var e_ = [];
            var mult = 2.0 / (period + 1);

            e_[0] = data[0];
            for (var i = 1; i < data.length; i++) {
                if (data[i] === undefined || data[i] === null) {
                    e_[i] = e_[i - 1];
                    continue;
                }
                if (e_[i - 1]) {
                    e_[i] = (data[i] * mult) + (1 - mult) * e_[i - 1];
                } else {
                    e_[i] = data[i];
                }
            }
            return e_;
        };
        // Relative Strength Index
        // RSI（相对强弱指标）=100－100÷（1+RS）
        function rsi(data, lookbacks) {
            var rsis = [];
            for (var j = 0; j < lookbacks.length; j++) {
                var lookback = lookbacks[j];
                var up = 0, down = 0;
                var rs;

                var rsiData = [undefined];
                var prev = data[0][3];
                if (lookback > data.length)
                    lookback = data.length;
                // 上升平均数及下跌平均数
                for (var i = 1; i < lookback; i++) {
                    var diff = data[i][3] - prev;
                    if (diff > 0) {
                        up = up + diff;
                    } else {
                        down = down - diff;
                    }
                    rsiData.push(undefined);
                    prev = data[i][3];
                }
                up /= lookback;
                down /= lookback;
                // RS（相对强度）=N日内收盘价涨数和之均值÷N日内收盘价跌数和之均值
                rs = up / down;
                for (var i = lookback; i < data.length; i++) {
                    var diff = data[i][3] - prev;
                    // RSI（相对强弱指标）=100－100÷（1+RS）
                    rsiData[i] = 100 - 100 / (1 + rs);
                    if (diff >= 0) {
                        up = (up * (lookback - 1) + diff) / lookback;
                        down = down * (lookback - 1) / lookback;
                    } else {
                        down = (down * (lookback - 1) - diff) / lookback;
                        up = up * (lookback - 1) / lookback;
                    };
                    rs = up / down;
                    prev = data[i][3];
                }
                var rsi = {};
                rsi.lookback = lookback;
                rsi.data = rsiData;
                rsis.push(rsi);
            }

            var i = {
                type : 'rsi',
                datas : rsis
            }
            this.kLineCurrent.indicators.push(i);
        };
        // 格式化时间（yyyyMMddHHmmss）
        function _formatDate(str) {
            if(str==undefined) return '';
//            str = str.substring(0,4)+"-"+str.substring(4,6)+"-"+str.substring(6,8);
            str = ""+str.substring(2,4)+'-'+str.substring(4,6)+'-'+str.substring(6,8);
//            console.log(str);
            return str;
        };
        /* 画图 */
        function _drawEmpty(){
        	var _top = options.tMargin, _left = options.lMargin, _right = _left
	                + this.plotWidth, _bottom = _top + this.plotHeight;
            ctx.strokeStyle = options.lineColor;
            ctx.lineWidth = 2;

            //绘制矩形边框 k线框
            _strokeRect(ctx, _left, _top, this.plotWidth, this.plotHeight);
            var h = _bottom;

            //k线矩形的宽度和间隔，单个k线总宽度cwidth

            var vt = options.tMargin + this.plotHeight + options.vSpacing;
            this.bHeight = this.height - vt - options.bMargin;
            var vb = vt + this.bHeight;
            var vl = options.lMargin;
            var vr = options.lMargin + this.plotWidth;
            ctx.strokeStyle = options.lineColor;
            _strokeRect(ctx, vl, vt, this.plotWidth, Math.round(this.bHeight));

            // 开始画背景表格的横线
            //总的显示区域
            var plotContentH = this.plotHeight - options.tPadding - options.bPadding;
            //基线
            var _basicY = h - options.bPadding;
            _drawline(ctx,_left, _basicY-Math.floor(plotContentH/2), _right,_basicY-Math.floor(plotContentH/2),options.lineColor,2);
            _drawline(ctx,_left, _basicY-Math.floor(plotContentH/4), _right,_basicY-Math.floor(plotContentH/4),options.lineColor,2);
            _drawline(ctx,_left, _basicY-Math.floor(plotContentH/4*3), _right,_basicY-Math.floor(plotContentH/4*3),options.lineColor,2);
            _drawline(ctx,_left, options.tMargin + options.tPadding, _right,options.tMargin + options.tPadding,options.lineColor,2);
            _drawline(ctx,_left, _basicY, _right,_basicY,options.lineColor,2);
            
            this.overlayCtx.clearRect(0, 0, this.width, this.height);
            var overlayCtx = this.overlayCtx;
            //根据设备信息的不同选择不同的显示方式
            if($(this.canvas).size()>0){
                this.overlayCtx.drawImage(this.canvas,0,0);
            }
        }
        /*
        *  画图
        *  shift : 0 默认 当前位置移动K线鼠标拖拽数， 向右拖拽正，向左拖拽负
        * */
        function _draw(shift) {
            if(options.isDrawing) return;
            var ctx = this.ctx;
            var dataset = this.kLineCurrent;
            if(dataset == undefined || dataset == null || dataset == ""){
                _drawEmpty();
                return;
            }
            var data = dataset.ohlc;     //k线数据
            var vol = dataset.vol;       //持仓量
            var ts = dataset.ts;         //时间
            var overlays = dataset.overlays || [];     //5，10，30日均线
            var indicators = dataset.indicators;       //指标 macd rsi
            var ob = _window(data, overlays, shift);   //计算宽高范围精度等
            var xmin = ob.xmin, ymin = ob.ymin*options.percent, xmax = ob.xmax, ymax = ob.ymax*(2-options.percent);
            //起始位置的偏移量
            var beginX = ob.beginX;
            this.chartParams.beginX = beginX;
            //总共能显示的个数
            var total = ob.total;
            options.kLineCurrent.total = ob.total;
            options.kLineCurrent.tsMap.clear(); //清空map
            _clear(this,function(){      // this : window
	            var _top = options.tMargin,
                    _left = options.lMargin,
                    _right = _left + this.plotWidth,
                    _bottom = _top + this.plotHeight;
	            ctx.strokeStyle = options.lineColor;
	            ctx.lineWidth = 2;
	
	            //绘制矩形边框
	            _strokeRect(ctx, _left, _top, this.plotWidth, this.plotHeight);
	            var h = _bottom;
	
	            //k线矩形的宽度和间隔，单个k线总宽度cwidth
	            var csize = this.chartParams.cwidth - 2;
	            var cpadding = 1;
	            this.chartParams.csize = csize;
	            this.chartParams.cpadding = cpadding;

                //绘制指标显示框
	            var vt = options.tMargin + this.plotHeight + options.vSpacing;   //指标框的顶点 x
	            this.bHeight = this.height - vt - options.bMargin;               //指标框的高
	            var vl = options.lMargin;                                         //指标框的顶点 y
                ctx.strokeStyle = options.lineColor;
                _strokeRect(ctx, vl, vt, this.plotWidth, Math.round(this.bHeight));

                //画线框背景线
                var vb = vt + this.bHeight;                        //指标框的低
	            var vr = options.lMargin + this.plotWidth;
	            var vymax = _minmax1d(vol.slice(xmin, xmax))[1];    //成交量最值
	            var vymin = 0;
	            var vrange = vymax - vymin;                         //指标差：最大-最小
	            var vscale = this.bHeight / vrange;                //指标像素基数:指标框高度/指标差
	            var vh = vb;
	            var range = ymax - ymin;                            //价格差：最高价-最低价
	            var scale = (this.plotHeight - options.tPadding - options.bPadding) / range; //k线基数:k线显示高度/价格差
	            var prevxy = [];
	            var fit = false;
	            // 开始画背景表格的横线
	            var ystops = _ygrid(ymin, ymax, 4);   //最大值到最小值分4份，5条线
	            for (var i = 0;i < ystops.length;i++) {
	                var logystp = ystops[i];
	                var y1 = (logystp - this.chartParams.ymin*options.percent) * scale + options.bPadding;
	                _drawline(ctx,_left, h - y1, _right,h - y1,options.lineColor,2);
	                if(i == 0 || i == ystops.length-1){
	                    //只标示最大、最小值
	                    var label = ystops[i];
	                    var divId = "leftpos";
	                    var textColor = options.eqColor;
	                    var indexy = h - y1;
	                    if (i == 0) {
	                        textColor = options.fallColor;
	                        indexy -= 14 - options.bPadding;
	                        divId += "min";
	                    }
	                    if(i==ystops.length-1){
	                        textColor = options.riseColor
	                        indexy = options.tMargin + 20;
	                        divId += "max";
	                    }
	                    _drawTextDiv(this.target,divId, label, options.lMargin/2, indexy/2, {
	                        padding : 1,
	                        color : textColor,
	                        backgroundColor:"#F2F6F9",
	                        "z-index":6
	                    });
	                }
	            };
                //画k线数据
                var fill = true;
                var ycl,xline;
                var prevMonth = null;
                var j = 0,k = 0; indexK = 0;

                for (var i = xmin; i < xmax; i++) {
                    var yop = Math.round((data[i][0] - this.chartParams.ymin*options.percent) * scale) + options.bPadding;
                    var yhi = Math.round((data[i][1] - this.chartParams.ymin*options.percent) * scale) + options.bPadding;
                    var ylo = Math.round((data[i][2] - this.chartParams.ymin*options.percent) * scale) + options.bPadding;
                    ycl = Math.round((data[i][3] - this.chartParams.ymin*options.percent) * scale) + options.bPadding;
                    var index = i;

                    var xlo = ((index - xmin) * this.chartParams.cwidth) + cpadding + options.lMargin + beginX;
                    xline = xlo + Math.floor(csize / 2) + 1;
                    //点击时确定坐标位置
//                if (!fit && this.focusXY && (xlo - cpadding) <= this.focusXY.x
//                    && (xlo + csize + cpadding) >= this.focusXY.x) {
//                    fit = true;
//                    this.focusXY.x = xline;
//                    this.focusXY.y = h - ycl;
//                    this.focusXY.xPos = i;
//                }
                    //判断是否为每月的第一日，若是加竖线并提示
                    var time = ts[i];k++;
                    if(time && time != ""){
                        var month = time.substr(3,2);
                        var date = time.substr(0,5);
                        if(prevMonth == null){
                            prevMonth = month;
                        }else if(prevMonth != month){
                            prevMonth = month;
                            //本月第一天竖线标示出
                            _drawline(ctx, xline, options.tMargin, xline, options.tMargin + this.plotHeight, options.lineColor, 2);
                            var bottomTop = options.tMargin + this.plotHeight + options.vSpacing;
                            _drawline(ctx, xline, bottomTop, xline, bottomTop + this.bHeight, options.lineColor, 2);
                            if(k >= 5){
	                            _drawTextDiv(this.target, "yfmonthtext"+j,date, xline/2 - 16, bottomTop/2 - options.vSpacing/2 + 12, {align:'center',"color":"#777575"});
	                            j++;k = 0;
                            }
                        }
                    }
                    //yop 是开盘价 ycl是收盘价
                    /* Open > Close 更改颜色 */
                    if (yop <= ycl) {
                        fill = true;
                        ctx.fillStyle = options.riseColor;
                    } else {
                        fill = true;
                        ctx.fillStyle = options.fallColor;
                        var t = ycl;
                        ycl = yop;
                        yop = t;
                    }
                    //画K线的小矩形
                    if (fill) {
                        _fillRect(ctx, xlo, h - yop, csize, yop - ycl);
                    } else {
                        _strokeRect(ctx, xlo, h - yop, csize, yop - ycl);
                    }
                    if (!(yop - ycl)) {
                        _fillRect(ctx, xlo, h - yop, csize, 1);
                    }

                    /* 交易量 */
                    if (options.indicatorIndex === 0) {
                        if (vol[i]) {
                            var yvol = Math.floor(vol[i] * vscale);
                            var vhf = Math.floor(vh);
                            if (fill) {
                                _fillRect(ctx, xlo, vhf - yvol, csize, yvol);
                            } else {
                                _strokeRect(ctx, xlo, vhf - yvol, csize, yvol);
                            }
                        }
                    }
//                     _drawline(ctx,xline, h-yhi, xline, h-ylo, ctx.fillStyle, 1);
                    // K线的上下两条线
                    var color = fill ? ctx.fillStyle : ctx.strokeStyle;
                    _drawline(ctx, xline, h - yhi, xline, h - ycl, color, 2);           //上
                    _drawline(ctx, xline, h - yop - 1, xline, h - ylo - 1, color, 2);   //下

                    //存储k线图信息
                    //options.kLineCurrent.fillRectKData[indexK] = [fill, xlo, h - yop, csize, yop - ycl, xline, h - yhi, xline, h - ycl, color, 2, xline, h - yop - 1, xline, h - ylo - 1, color, 2];
                    options.kLineCurrent.fillRectKData[indexK] = [fill, xlo, vhf - yvol, csize, yvol, xline, h - yhi, xline, h - ycl, color, 2,  xline, h - yop - 1, xline, h - ylo - 1, color, 2];
                    options.kLineCurrent.ohlc[indexK] = [data[i][0], data[i][1], data[i][2], data[i][3]];
                    options.kLineCurrent.ts[indexK] = time;
                    options.kLineCurrent.tsMap.put(time,indexK);
                    indexK++;
                };

                // 获取十字查询的数据坐标
                // 十字查询详细信息的十字线
                //this.plotWidth 是canvas的宽度
                //此处算出来的xpos应该是指左边第几个K线小矩形
                var xPos = xmax - 1;
//            if (this.focusXY !== undefined) {
//                //超出范围的点击则返回边界
//                if(!fit){
//                    fit = true;
//                    //超出最小边界
//                    if(this.focusXY.x < options.lMargin + beginX){
//                        this.focusXY.x = cpadding + options.lMargin + beginX + Math.round(csize / 2);
//                        ycl = Math.round((data[xmin][3] - this.chartParams.ymin*options.percent)
//                            * scale);
//                        this.focusXY.y = h - ycl;
//                        this.focusXY.xPos = xmin;
//                    }
//                    //大于最大边界
//                    if(this.focusXY.x > ((xmax - xmin) * this.chartParams.cwidth) + options.lMargin + beginX){
//                        var focusmaxX = ((xmax - xmin) * this.chartParams.cwidth) + options.lMargin + beginX
//                            - cpadding - Math.round(csize / 2);
//                        this.focusXY.x = focusmaxX;
//                        ycl = Math.round((data[xmax - 1][3] - this.chartParams.ymin*options.percent)
//                            * scale);
//                        this.focusXY.y = h - ycl;
//                        this.focusXY.xPos = xmax - 1;
//                    }
//                }
//                xPos = this.focusXY.xPos;
//                _drawline(ctx, _left, this.focusXY.y, _left + this.plotWidth,
//                    this.focusXY.y, options.focusLine,0.5);
//                _drawline(ctx, this.focusXY.x, _top, this.focusXY.x, _top
//                    + this.plotHeight, options.focusLine,0.5);
//                _drawline(ctx, this.focusXY.x, h + options.vSpacing,
//                    this.focusXY.x, h + this.bHeight + options.vSpacing,
//                    options.focusLine,0.5);
//            }
                /* 交易量 */
                if (options.indicatorIndex === 0) {
//                _drawTextDiv(this.target,"leftdownpos", Math.round(vymax / 10000) + '万', 2, vt+5, {
//                    align : 'left',
//                    padding : 5
//                });
//                _drawTextDiv(this.target,"leftdownpos1", Math.round(vymax * 2 / 30000) + '万', 2, vt + this.bHeight / 3+5, {
//                    align : 'left',
//                    padding : 5
//                });
//                _drawTextDiv(this.target,"leftdownpos2", Math.round(vymax * 1 / 30000) + '万', 2
//                    , vt + this.bHeight * 2 / 3 +5, {
//                        align : 'left',
//                        padding : 5
//                    });
//                _drawTextDiv(this.target,"leftdownpos3", 0, 2 , vt + this.bHeight, {
//                    align : 'left',
//                    padding : 5
//                });
//                _drawTextDiv(this.target,"leftdownpos4", "量:" + vol[xPos].toFixed(options.accuracy), options.lMargin, vh
//                    + 12, {
//                    align : 'left',
//                    padding : 5
//                });
                }

                //画指标
                if(options.indicatorIndex > 0){
                    _plotIndicator(dataset.indicators[options.indicatorIndex - 1], vt, vt + this.bHeight, vl, 2, xPos);
                }
                _plotIndicator(dataset.indicators[1], vt, vt + this.bHeight, vl, 2, xPos);

                drawFx(ctx);              //画折线
                drawArrows(ctx);           //画箭头

                // 均线,均线的说明 5:8.39
                var k = 0;
                if(options.isOverlays){
                    for (var o=0;o<overlays.length;o++) {
                        var prevxy = [];
                        var o1 = overlays[o].data;
                        var lineColor = options.overlayColors[k % options.overlayColors.length];
                        if(o1[xPos]!=undefined){
//                    _drawTextDiv(this.target,"midpos"+o, overlays[o].type + ":" + o1[xPos].toFixed(options.accuracy), options.lMargin
//                        + k * 80, vt - 2, {
//                        align : 'left',
//                        padding : 5,
//                        color : lineColor
//                    });
                        }
                        /*
                         *卞奕龙修改  调整均线的开始位置
                         */
                        ctx.beginPath();
                        var w = ctx.lineWidth;
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = lineColor;
                        var moveTo = false;
                        for (var j = xmin; j < xmax; j++) {
                            var i = j - xmin;
                            var ycl = Math.round((o1[j] - ymin) * scale)  + options.bPadding;                   //均线 y 坐标
                            overlays[o].offset = k;
                            if (!o1[j]) {
                                continue;
                            }
                            var xlo = (i * this.chartParams.cwidth) + cpadding + options.lMargin + beginX;     //均线 x 坐标
                            var xline = xlo + Math.round(csize / 2);
                            /*
                             * 卞奕龙修改，修改之前这个i最小是4 所以在xmin = 0 时，永远不可能执行movwTo这个方法，导致第一个节点没画出
                             */
                            if (i > 0 && prevxy[0]) { // skip first line
                                if(!moveTo){
                                    ctx.moveTo(prevxy[0], prevxy[1]);
                                    moveTo = true;
                                }
                                //_drawline(ctx,prevxy[0], prevxy[1], xline, h-ycl,lineColor , 1);
                                ctx.lineTo(xline, h - ycl);
                            }
                            prevxy = [xline, h - ycl];
                        }
                        ctx.stroke();
                        k += 1;
                        ctx.lineWidth = w;
                    }
                }

                this.overlayCtx.clearRect(0, 0, this.width, this.height);
                //根据设备信息的不同选择不同的显示方式
                if($(this.canvas).size()>0){
//                    if(devicePlatform && (""+devicePlatform).toLowerCase()=="android"){
//                        setTimeout(function(){
//                            overlayCtx.drawImage(this.canvas,0,0);
//                            options.isDrawing = false;
//                        },20);
//                    }else{
                        this.overlayCtx.drawImage(this.canvas,0,0);
                        options.isDrawing = false;
//                    }
                }
            });
        };

        /** 画折线 **/
        function drawFx(ctx){
            var dataInfoGuides ={
                fx : [
                    ['13-09-02' ,-1],
                    ['13-10-23',  1],
                    ['13-11-07',  -1],
                    ['13-11-20',  1]
                ]
            };
            if(options.fxData.isShow){
                ctx.beginPath();
                var _w = ctx.lineWidth;
                ctx.lineWidth = options.fxData.fxWidth;
                ctx.strokeStyle = options.fxData.fxColor;
                var isMove = false;
                for(var arr in dataInfoGuides.fx){
                    var time = dataInfoGuides.fx[arr][0];
                    var num = options.kLineCurrent.tsMap.get(time);
                    var kdate = options.kLineCurrent.fillRectKData[num];
                    if(kdate){
                        var x2 = kdate[5],
                            y2 = kdate[6],  //顶
                            y3 = kdate[14]; //底
                        var flag = dataInfoGuides.fx[arr][1];
                        if(flag == 1){
                            if(isMove){
                                ctx.moveTo(x2, y2 - options.fxData.btMargin);
                                isMove = false;
                            }
                            ctx.lineTo(x2, y2 - options.fxData.btMargin);
                            //画箭头
                            //drwaArrow(canvasObj, options.fxData.up, x2, y2 - options.fxData.arrMargin, options.fxData.arrDnColor,32, 32);
                        }else{
                            if(isMove){
                                ctx.moveTo(x2, y3 + options.fxData.btMargin);
                                isMove = false;
                            }
                            ctx.lineTo(x2, y3 + options.fxData.btMargin);
                        }
                    }
                }
                ctx.stroke();
                ctx.lineWidth = _w;
            }
        }

        function drawArrows(ctx){
            var dataInfoGuides ={
                fx : [
                    ['13-09-02' ,-1],
                    ['13-10-23',  1],
                    ['13-11-07',  -1],
                    ['13-11-20',  1]
                ]
            };
            if(options.fxData.isShow){
                ctx.beginPath();
                var _w = ctx.lineWidth;
                ctx.lineWidth = options.fxData.fxWidth;
                ctx.strokeStyle = options.fxData.fxColor;
                var isMove = false;
                for(var arr in dataInfoGuides.fx){
                    var time = dataInfoGuides.fx[arr][0];
                    var num = options.kLineCurrent.tsMap.get(time);
                    var kdate = options.kLineCurrent.fillRectKData[num];
                    if(kdate){
                        var x2 = kdate[5],
                            y2 = kdate[6],  //顶
                            y3 = kdate[14]; //底
                        var flag = dataInfoGuides.fx[arr][1];
                        if(flag == 1){
                            //画箭头
                            drwaArrow(ctx, options.fxData.up, x2, y2 - options.fxData.arrMargin, options.fxData.arrUpColor,32, 32);
                        }else{
                            drwaArrow(ctx, options.fxData.dn, x2, y2 - options.fxData.arrMargin, options.fxData.arrDnColor,32, 32);
                        }
                    }
                }
                ctx.stroke();
                ctx.lineWidth = _w;
            }
        }


        /**
         * 获取数据的宽度和最大范围
         * @param data  k线数据
         * @param overlays 均价
         * @param shift
         * @param datelo
         * @param datehi
         * @returns {}
         * @private
         */
        function _window(data, overlays, shift, datelo, datehi) {
            var w = this.plotWidth; //canvas的宽度
            //计算数据开始及结束的位置以及最多显示的条数
            var begin, end, howmany = 0;

            shift = shift || 0;
            this.chartParams.candles = this.chartParams.candles || data.length;
            howmany = data.length;
            if (options.minwidth > 40 * 2) {
                options.minwidth = 40 * 2;
            }
            if (howmany > (w / options.minwidth)) {
                howmany = Math.floor(w / options.minwidth);
            }
            // this.end = this.end || data.length;
            this.chartParams.end = this.chartParams.end || data.length;
            this.chartParams.end -= shift;
            // thies.chartParams.end = this.end - shift;
            if (this.chartParams.end > data.length) {
                this.chartParams.end = data.length;
            }

            this.chartParams.begin = this.chartParams.end - howmany;
            if (this.chartParams.begin <0) {
                this.chartParams.begin = 0;
                this.chartParams.end = this.chartParams.begin + howmany;
            }
            begin = this.chartParams.begin;
            end = this.chartParams.end;
            
            this.chartParams.candles = howmany;
            this.chartParams.cwidth = options.minwidth;
            //计算k线图显示的宽度差，用以填充多余的部分
            var deltaX = w % this.chartParams.cwidth;   //取模，余下的像素点
            //启动时的偏移量
            var beginX = Math.floor(deltaX/2);
            var total = Math.floor(w / this.chartParams.cwidth);

            //计算高低  在显示范围内得到k线最值与均线最值得到最值
            var max, min;
            var d_ = _minmax2d(data.slice(begin, end));
            min = d_[0], max = d_[1];

            if (overlays) {
                for (var j=0;j<overlays.length;j++) {
                    var omax, omin;
                    d_ = _minmax2d(overlays[j].data.slice(begin, begin + howmany));
                    omin = d_[0], omax = d_[1];
                    if (omax > max)
                        max = omax;
                    if (omin < min)
                        min = omin;
                }
            }

            //设置y轴精度 四舍五入保留
            var accuracy = (""+min).slice((""+min).indexOf("."));
            if(accuracy.length >= 4) options.accuracy = 3;


            this.chartParams.ymin = min.toFixed(options.accuracy);
            this.chartParams.ymax = max.toFixed(options.accuracy);
            return {
                xmin : begin,                       //k线开始下标
                xmax : end,                         //k线结束下标
                ymin : this.chartParams.ymin,       //y轴低点
                ymax : this.chartParams.ymax,       //y轴顶点
                beginX : beginX,                    //开始偏移量
                total : total                       //显示总k线条数
            };
        };
        /**
         * 清空画布区域
         * @param ctx
         * @private
         */
        function _clear(o,callback) {
            if(!options.isDrawing){
                options.isDrawing = true;
                var ctx = o.ctx;
                var target = o.target;
                //清楚这个矩形区域的内容
                ctx.clearRect(0, 0, this.width, this.height);
                this.canvas.backgroundAlpha = 0;
                $(this.canvas).css({"position":"relative","z-index":"5"});
                $(target).find("div[id^=yfmonth]").hide();
//                setTimeout(function(){
                    if(callback) callback();
//                },20);
            }
        };
        function _strokeRect(cxt, x, y, width, height) {
            cxt.strokeRect(x - 1, y - 1, width, height);
			//console.log('_strokeRect ---> ' + x + ', ' + y + ', ' + width + ', ' + height);
        };

        function _drawSingleLineDiv(o,id, x, y, width, height,style){
            var div = $(document).find("#"+id);
            if(div.size()<=0){
                div = $("<div id="+id+"></div>");
                $(o).append(div);
            }
            div.css(style);
            div.css("position","absolute");
            div.css("left",x-1);
            div.css("top",y-1);
            div.css("width",width);
            div.css("height",height);
            div.show();
        }

        function _fillRect(cxt, x, y, width, height) {
//            cxt.fillRect(x + 0.5, y + 0.5, width, height);
            cxt.fillRect(x, y, width, height);
			//console.log('_fillRect ---> ' + x + ', ' + y + ', ' + width + ', ' + height);
        };
        /**
         * 画坐标值
         * @param ctx
         * @param text
         * @param x
         * @param y
         * @param style
         * @returns {number}
         * @private
         */
        function _drawText(ctx, text, x, y, style) {
            var color = style.color || '#000000';
            var font = style.font || '8pt sans-serif';
            var padding = style.padding || 2;
            var align = style.align || 'start';
            ctx.font = font;
            ctx.textAlign = align;
            var l = x + 2 * padding + ctx.measureText(text).width;

            ctx.fillStyle = color;
            ctx.fillText(text, x + padding, y);

            return l;
        };

        function _drawTextDiv(o, id, text, x, y, style) {
            var div = $(document).find("#"+id);
            if(div.size()<=0){
                div = $("<div id="+id+"></div>");
                $(o).append(div);
            }else {
	            if($(o).find("#"+id).size()<=0){
	            	$(o).append(div);
	            }
            }
            style.color = style.color || '#000000';
            style.font = style.font || '8pt sans-serif';
            style.textAlign = style.textAlign || 'center';
            div.css(style);
            div.css("position","absolute");
            div.css("left",x);
            //减去偏移量
            div.css("top",y - 10);
            div.html(text);
            div.show();
        };

        /**
         * 载入画虚线的图片
         * @returns {Image}
         */
        function createLinePic(){
            var canvas=document.createElement("canvas");
            var ctx= canvas.getContext("2d");
            canvas.width=6;
            canvas.height=1;
            ctx.fillStyle="#333";
            ctx.fillRect(0,0,3,1);
            ctx.fill();
            var img =new Image();
            img.src=canvas.toDataURL();
            return img;
        }
        var dottedLinePic=createLinePic();

        /*
         *画虚线
         */
        function _drawDottedline(ctx, x1, y1, x2, y2, color, width){
            _drawline(ctx, x1, y1, x2, y2, color, width);
            return;
            color = color || "#111111";
            var width = width || 1.0;

            var w = ctx.lineWidth;
            ctx.lineWidth = width;
//            ctx.strokeStyle = color;
            ctx.strokeStyle = ctx.createPattern(dottedLinePic,"repeat");
            ctx.beginPath();
            ctx.moveTo(x1 - 0.5, y1 + 0.5);
            ctx.lineTo(x2 - 0.5, y2 + 0.5);
//              ctx.moveTo(x1, y1);
//              ctx.lineTo(x2, y2);
            ctx.stroke();
            // ctx.closePath();
            ctx.lineWidth = w;
        }
        /*
         * 画线
         */
        function _drawline(ctx, x1, y1, x2, y2, color, width) {
            //console.log( x1 + ', '+ y1 + ', '+ x2 + ', '+ y2 + ', \''+ color + '\' , '+ width);
            color = color || "#111111";
            var width = width || 2.0;

            var w = ctx.lineWidth;
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1 - 1, y1 + 1);
            ctx.lineTo(x2 - 1, y2 + 1);
            ctx.stroke();
            ctx.lineWidth = w;
        };
        function _drawLegend(label, offset) {
            var y = 20;
            var x = offset * 100 + this.loffset;
            var color = this.cs.overlays[offset % this.cs.overlays.length];
            this._drawText(label, x, y, {
                padding : 0,
                color : color
            });

        };
        /**
         * 画指标
         * @param indicator
         * @param t
         * @param b
         * @param l
         * @param r
         * @param xPos
         * @private
         */
        function _plotIndicator(indicator, t, b, l, r, xPos) {
            var type = indicator.type;
            var ctx = this.ctx;
            var overCtx = this.overlayoutCtx;
            var target = this.target;

            this.overlayoutCtx.clearRect(0, 0, this.width, this.height * 2);
            //绘制第二个指标显示框
            var vt = options.tMargin + this.plotHeight + options.vSpacing;   //指标框的顶点 x
            this.bHeight = this.height - vt - options.bMargin;               //指标框的高
            var vl = options.lMargin;                                         //指标框的顶点 y
            ctx.strokeStyle = options.lineColor;
            options.lineMoveHigh = vt + options.btmove + Math.round(this.bHeight);
            _strokeRect(this.overlayoutCtx, vl, vt + options.btmove, this.plotWidth, Math.round(this.bHeight));

            /*
             *macd的位置计算规则和k线矩形位置计算规则相同，保证对齐
             */
            var begin = this.chartParams.begin;
            var end = this.chartParams.end;
            switch (type) {
                case 'macd' :
                    var data = indicator.data;
                    var d = _minmax2d(data.slice(begin, end));
                    var ymax = d[1], ymin = d[0];
                    var range = (ymax - ymin);
                    ymax = ymax + 0.1 * range;
                    ymin = ymin - 0.1 * range;
                    range = ymax - ymin;
                    var scale = this.bHeight / range;
                    var h = b;
                    prevxy = [];
                    for (var j = begin; j < end; j++) {
                        if (data[j][0] === undefined) {
                            continue;
                        }

                        var xlo = ((j - begin) * this.chartParams.cwidth)
                            + this.chartParams.cpadding + options.lMargin + this.chartParams.beginX;
                        var xline = xlo + Math.round(this.chartParams.csize / 2);
                        var mhi = Math.round((data[j][0] - ymin) * scale);
                        var mlo = Math.round((data[j][1] - ymin) * scale);
                        var mzero = Math.round((0 - ymin) * scale);
                        if (prevxy[0]) { // skip first line
                            // DIF
                            _drawline(ctx, prevxy[0][0], prevxy[0][1], xline, h - mhi, options.macd[0], 1);
                            // DEA
                            _drawline(ctx, prevxy[0][0], prevxy[0][1], xline, h - mhi, options.macd[0], 1);
                            // MACD
                            if (mhi - mlo >= 0) {
                                ctx.fillStyle = options.riseColor;
                                ctx.fillRect(xline - 1, h - mzero - (mhi - mlo), 5,(mhi - mlo));
                            } else {
                                ctx.fillStyle = options.fallColor;
                                ctx.fillRect(xline - 1, h - mzero, 5, (mlo - mhi));
                            }
                        }
                        prevxy = [[xline, h - mhi], [xline, h - mlo]];
                    }

                    break;
                case 'rsi' :
                    var datas = indicator.datas;
                    ymax = 100;
                    ymin = 0;
                    range = ymax - ymin;
                    var scale = this.bHeight / range;
                    var h = b;
                    // ctx.strokeStyle = "#FFFFFF";
                    // ctx.strokeRect(l, t, this.plotWidth, this.bHeigth +
                    // this.lMargin);
                    var dataLen = datas.length;
                    for (var m=0;m<dataLen;m++) {
                        var data = datas[m].data;
                        var prevxy = [];
                        var color = options.overlayColors[m];
//                        if(begin == 0){
//                            begin += 1;
//                        }

                        for (var j = begin; j < end; j++) {
                            if (!data[j]) {
                                continue;
                            }
                            var xlo = ((j - begin) * this.chartParams.cwidth) + this.chartParams.cpadding + options.lMargin + this.chartParams.beginX;
                            var xline = xlo + Math.round(this.chartParams.csize / 2);
                            var rsi = Math.round((data[j] - ymin) * scale);
                            if (prevxy[0]) { // skip first line
                                //if(options.indicatorIndex == 0){
                                //    _drawline(ctx, prevxy[0], prevxy[1], xline, h- rsi, color, 1);                                      //ctx画板
                                //}else{
                                    _drawline(overCtx, prevxy[0], prevxy[1] + options.btmove, xline, h- rsi  + options.btmove, color, 1);//overCtx画板往下移动 options.btmove
                                //}
                            }
                            prevxy = [xline, h - rsi];
                        }
//                        var xPosRsi;
                        if(data[xPos] === undefined ){
                            continue;
                        }
                        // else {
//                            xPosRsi = data[xPos].toFixed(options.accuracy);
//                        }
//                        _drawTextDiv(this.target,"bottompos5"+m, datas[m].lookback + ":"
//                            + data[xPos].toFixed(options.accuracy),
//                            options.lMargin + 60 * m, b + 10, {
//                                align : 'left',
//                                padding : 5,
//                                color : color
//                            });
                    }
//                    _drawTextDiv(this.target,"bottompos6", '0', r, h, {
//                        align : 'left',
//                        padding : 5
//                    });
//                    _drawTextDiv(this.target,"bottompos7", '100', r, h - 95 * scale, {
//                        align : 'left',
//                        padding : 5
//                    });
                    break;
                default :
                    break;
            }

        };
        /**
         * 取k线的最大最小值
         * data : k线数据
         */
        function _minmax2d(data) {
            // 负无穷大
            var max = -Infinity;
            // 正无穷大
            var min = Infinity;

            for (var i in data) {
                if(i!="remove" && data[i]!=undefined){
                    if(data[i].length>1){
                        for (var j in data[i]) {
                            if(j!="remove" && data[j]!= undefined){
                                if (data[i][j] >= max)
                                    max = data[i][j];
                                if (data[i][j] < min)
                                    min = data[i][j];
                            }
                        }
                    }else{
                        if (data[i] >= max)
                            max = data[i];
                        if (data[i] < min)
                            min = data[i];
                    }
                }
            }
            return [min, max];
        };
        /**
         * 计算成交量最值
         */
        function _minmax1d(data) {
            // 负无穷大
            var max = -Infinity;
            // 正无穷大
            var min = Infinity;

            for (var i in data) {
                if (data[i] >= max)
                    max = data[i];
                if (data[i] < min)
                    min = data[i];
            }
            return [min, max];
        };
        /* 获取y轴坐标值 */
        function _ygrid(ymin, ymax, howmany) {
            var approx = (ymax - ymin) / howmany;
            var vals = [];
            for (var i = 0; i < howmany; i++) {
                vals.push((ymin + i * approx));
            }
            vals.push(ymax);

            return vals;
        };
        var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            START_EV = hasTouch ? 'touchstart' : 'mousedown',
            MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
            END_EV = hasTouch ? 'touchend' : 'mouseup',
            CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

        // 注销事件监听
        function removeELs() {
            this.canvas.removeEventListener(START_EV, _beginPanning, false);
            this.canvas.removeEventListener(MOVE_EV, _doPanning, false);
            this.canvas.removeEventListener(END_EV, _endPanning, false);
            this.canvas.removeEventListener(END_EV, _chartClick, false);
//            this.canvas.removeEventListener('gesturestart', _zoomPrepare, false);
//            this.canvas.removeEventListener('gestureend', _zoom, false);
            return this;
        };
        // 加载事件监听
        function addELs() {
            this.overlay.addEventListener(START_EV, _beginPanning, false);
            this.overlay.addEventListener(MOVE_EV, _doPanning, false);
            this.overlay.addEventListener(END_EV, _endPanning, false);
            this.overlay.addEventListener(END_EV, _chartClick, false);
//            gesturestart:当一个手指已经按在屏幕上面另一个手指有触摸屏幕时触发。
//            gesturechange:当触摸屏幕的任何一个手指的位置发生变化时触发。
//            gestureend:当任何一个手指从屏幕上面移开时触发。
//            this.canvas.addEventListener('gesturestart', _zoomPrepare, false);
//            this.canvas.addEventListener('gestureend', _zoom, false);
            this.canvas.tabIndex = 0;
//            $(this.canvas).bind('tap',_dbtap);
            return	this;
        };

        var _chartClick = function(event) {
            // 图形外的点击直接返回
            var touch = hasTouch ? event.changedTouches[0] : event;

            var begin_y = $(this).offset().top;
            var content_x = this.plot.ctx.canvas.width/2;
            var content_y = this.plot.ctx.canvas.height/2;
            var x = touch.pageX;
            var y = touch.pageY;
            var topHeight = this.plot.plotHeight/2 + options.tMargin/2 + options.vSpacing/2;
            if (x < options.lMargin/2
                || x > options.lMargin/2 + this.plot.plotWidth/2)
                return;
//            if ((options.tMargin < y - begin_y) && (y - begin_y < topHeight)) {

//            }
            if( (topHeight <= y - begin_y) && (y - begin_y <= content_y)){
                if (++options.indicatorIndex > this.plot.kLineCurrent.indicators.length) {
                    options.indicatorIndex = 0;
                }
                //_draw(); //点击切换指标
            }
            options.indicatorIndex = 1; //每次点击变更，指标切换
            //console.log('index --->' + options.indicatorIndex)     ;
        };

        function _ElemPageOffsetX(e) {
            var ox = 0;
            do {
                ox += e.offsetLeft;
            } while (e = e.offsetParent);
            return ox;
        };

        function _ElemPageOffsetY(e) {
            var oy = 0;
            do {
                oy += e.offsetTop;
            } while (e = e.offsetParent);
            return oy;
        };
        /*
         *根据初始化方式计算当前坐标所对应的数组下标
         */
        function _getCandle(x, y) {
            var cp = this.chartParams;
            //k线宽度
            var width = cp.cwidth;
            //起始位置偏移量
            var beginX = cp.beginX;
            x -= options.lMargin + beginX;
            var xos = Math.floor(x/width) + cp.begin;
            if(xos >= cp.end) xos = cp.end - 1;
            if(xos < cp.begin) xos = cp.begin;
            return xos;
        };

        var isGetData = false; //是否从服务端获取数据
        /* 开始拖动 */
        var _beginPanning = function(event) {
            event.preventDefault();
            this.plot.focusXY = this.plot.focusXY || {};
            this.style.cursor = 'move';
            var ctx = this.plot.ctx;
            var touch = hasTouch ? event.touches[0] : event;
            this.plot.focusXY.x = touch.pageX;
            this.plot.focusXY.y = touch.pageY;
            ctx.begin_x = _canvasOffsetX(touch.pageX, this);
            ctx.begin_y = _canvasOffsetY(touch.pageY, this);
            ctx.start = true;
        };
        function _canvasOffsetX(x, c) {
            var ox = 0;
            do {
                ox += c.offsetLeft;
            } while (c = c.offsetParent);
            return x - ox;
        };

        function _canvasOffsetY(y, c) {
            var oy = 0;
            do {
                oy += c.offsetTop;
            } while (c = c.offsetParent);
            return y - oy;
        };

        /*
         * 拖动
         */
        var _doPanning = function(event) {
            event.preventDefault();
            if(this.plot.focusXY){
                var p = this.plot;
                var ctx = p.ctx;
                var touch = hasTouch ? event.changedTouches[0] : event;
                if (touch.pageX < options.lMargin/2 || touch.pageX > options.lMargin/2 + this.plot.plotWidth/2)
                    return;
                this.plot.focusXY.x = touch.pageX;
                this.plot.focusXY.y = touch.pageY;
                var myx = _canvasOffsetX(touch.pageX, this);
                var myy = _canvasOffsetY(touch.pageY, this);
                var xo = myx - ctx.begin_x;
                var yo = myy - ctx.begin_y;

                //画移动竖线
                var rect = this.getBoundingClientRect();
                var x1 = (event.clientX - rect.left) * 2;
                var x2 = (event.clientX - rect.left) * 2;
                var y1 = 0;
                var y2 = options.lineMoveHigh;
                var num = parseInt((x1 - options.lMargin) / options.minwidth);

                kLineData = {
                    x1 : x1,
                    y1 : y1,
                    x2 : x2,
                    y2 : y2,
                    num : num
                };

                var flag = (x1 - options.lMargin) % options.minwidth;
                if(flag > 0){
                    num += 1;
                }

                $('#id12').val(num);

                canvasObj.clearRect(0, 0, this.width, this.height * 2);
                //_drawline(canvasObj, x1, y1, x2, y2, options.lineMoveColor, 3);

//                for(var i = 1 ; i < 10 ; i++){
//                    x1 = options.lMargin + options.minwidth *(i-1);
//                    x2 = x1;
//                    _drawline(ooo, x1, y1, x2, y2, '#000', 2);
//                    console.log(i + ' : ' + x1);
//                }
                _showInfo(event, kLineData);  //鼠标跟随信息

                if (ctx.start && !this.plot.ctx.zoom) {
                    /*
                     *卞奕龙修改，判断往右移动时，是否到达数据的最左边（空余大约10个） 如果到到了 则再重新取一次数据，以当前begin之前的某个位置开始
                     * @type {*}
                     */
                    var cp = this.plot.chartParams;
                    var begin = cp.begin;
                    var time = this.plot.kLineCurrent.lastTime;
                    if(Math.abs(xo) >= options.minwidth){
                        var size = Math.floor(xo / options.minwidth) * 2;
                        //往右偏移5个数据，意思是当还剩下30个数据没有显示的时候，就开始去请求数据
                        var  diff = begin - (size + 30);
                        //计算出总的需要的偏移量
                        if(diff <= 0 && xo > 0){
                            if(!isGetData){
                                plot(true,size,time); console.log('_doPanning.plot size : ' + size + "  time :" + time);
                                isGetData = true;
                            }
                        } else {
                            _draw(size); console.log('_doPanning._draw size : ' + size);
                        }
                        ctx.begin_x = myx;
                        ctx.begin_y = myy;
                    }
                }
            }
        };

        /** 画箭头 **/
        function drwaArrow(ctx, type, x, y, color, width, hight){
            color = color || "#111111";
            width = width || 40.0;
            hight = hight || 40.0;
            var w = ctx.lineWidth;
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.beginPath();
            switch (type) {
                case options.fxData.up :  //向上
                    ctx.fillStyle = options.fxData.arrUpColor;;
                    ctx.moveTo(x - width/2, y);
                    ctx.lineTo(x + width/2, y);
                    ctx.lineTo(x, y - hight/2);
                    ctx.fill();
                    ctx.fillRect( x - width/4, y ,width/2, hight/2 );
                    break;

                case options.fxData.dn :
                    ctx.fillStyle = options.fxData.arrDnColor;
                    ctx.moveTo(x - width/2, y);
                    ctx.lineTo(x + width/2, y);
                    ctx.lineTo(x, y + hight/2);
                    ctx.fill();
                    ctx.fillRect( x - width/4, y - hight/2, width/2, hight/2 );
                    break;
            }
            ctx.stroke();
            ctx.lineWidth = w;
        }

        function _showInfo(event, kLineData){
            //画竖线
            var index = kLineData.num;

            //鼠标坐标
            var mouseX = event.clientX + document.body.scrollLeft - document.body.clientLeft + 15;
            var mouseY = event.clientY + document.body.scrollTop - document.body.clientTop + 15;
            var width = $('#massage').width();
            if(document.body.clientWidth - event.clientX < width){
                mouseX -= (width + options.lMargin);
            }

            //画div数据
            var div = $('#massage');
            var time = options.kLineCurrent.ts[index-1],
                open  = options.kLineCurrent.ohlc[index-1][0],
                high  = options.kLineCurrent.ohlc[index-1][1],
                low   = options.kLineCurrent.ohlc[index-1][2],
                close = options.kLineCurrent.ohlc[index-1][3];
            var massage = '&nbsp&nbsp' + time + '<br>&nbsp&nbsp开盘 : ' + open + '  最高 : ' + high + ' <br>&nbsp&nbsp收盘 : ' + close + '  最低 : '+ low;
            div.css({"position":"absolute",top:mouseY,left:mouseX,"z-index":11, width : 150, height:60});
            div.html(massage);

            //在层画选中k线
            var kdate = options.kLineCurrent.fillRectKData[index-1];
            var fill = kdate[0],
                x1 = kdate[1], y1 = kdate[2], w1 = kdate[3], h1 = kdate[4],
                x2 = kdate[5], y2 = kdate[6], _x2 = kdate[7], _y2 = kdate[8], c2 = kdate[9], w2 = kdate[10],
                x3 = kdate[11], y3 = kdate[12], _x3 = kdate[13], _y3 = kdate[14], c3 = kdate[15], w3 = kdate[16];

            //canvasObj.fillStyle = "green";
            canvasObj.beginPath();
            canvasObj.lineWidth   = 2;
            canvasObj.lineHeight  = 2;
            canvasObj.shadowColor = "rgba(0,200,200,0.8)";
            canvasObj.shadowOffsetX = -1;
            canvasObj.shadowOffsetY = -1;
            canvasObj.shadowBlur = 5;
            canvasObj.strokeStyle = options.lineMoveColor;
            var sha = 1;
            if (fill) {
                _fillRect(canvasObj, x1-sha, y1-sha, w1+sha, h1+sha);
            } else {
                _strokeRect(canvasObj, x1-sha, y1-sha, w1+sha, h1+sha);
            }
            if (!h1) {
                _fillRect(canvasObj, x1-sha, y1-sha, w1 +sha, 1);
            }
            _drawline(canvasObj, x2, y2, _x2, _y2, c2, w2);
            _drawline(canvasObj, x3, y3, _x3, _y3, c3, w3);

            //画竖线
            _drawline(canvasObj, kLineData.x1, kLineData.y1, kLineData.x2, kLineData.y2, options.lineMoveColor, 3);

            canvasObj.fill();
            canvasObj.closePath();
        }
        /*
         * 结束拖动
         */
        var _endPanning = function(event) {
            event.preventDefault();
            this.plot.ctx.start = false;
            this.style.cursor = 'default';
        };
        var _zoomPrepare = function(event) {
            event.preventDefault();
            this.plot.ctx.zoom = true;
        };
        var _zoom = function(event) {
            event.preventDefault();
            var scale = event.scale;
            if (scale > 1) {
                if(options.minwidth>=50) return;
                options.minwidth += 2;
            } else {
                if(options.minwidth<=2) return;
                options.minwidth -= 2;
            }
            this.plot.ctx.zoom = false;
            _draw();

        };

        /*
         * 加载数据
         * loading ： true
         * shift : 0
         * time ： 获取time往前取100根
         */
        function plot(loading, shift, time) {
            console.log('plot shift : ' + shift + "  time :" + time);
            var target = this.target;	//div#chartContent
            var url = getFullUrl("mobile/stock/loadStockKlineByID");
            var param = {obj:options.stockCode,time:time,direction:"-1"};
            var objData = [];
            var objDate = "";
            var title= ["time","open","high","low","price","volume","amount"];
            //判断缓存中的存储日期是否是今天
            var isToday =false;
            //判断是否是新数据或历史数据
            var isNewData = true;
            var storageJsonData = getLocalStorageData(options.stockCode);
            if(storageJsonData){
                objData = storageJsonData.objData;	//基本k线数据
                objDate = storageJsonData.objDate;	//缓存中的日期
            }
            if(objDate && objDate != "" && time){
                var diffDate = (parseFloat(time) - parseFloat(objDate))/1000000; //时间差
                if(diffDate>= 0 && diffDate <= 1){  //如果日期相差一天或者刚好是今天
                    isToday = true;
                } else if(diffDate > 1){            //大于今天
                    param.time = objDate;
                    param.direction = 1;             //time往后取默认100根
                } else {                            //小于今天
                    isNewData = false;
                }
            }
            //当时间参数存在，并且需要取所有的值时
            if(!isToday){
                getAjaxDatas(url,param,function(resp){
                    var shiftData = 0;
                    if(resp=="timeout" || !resp.hasOwnProperty("data")){
                        showLoading(quotationKLineId,target,true);
                        return;
                    }
                    var klineData = resp.data;
                    shiftData = shift;
                    if(objData && objData.length>0){    //内存中存在，拖拽时计算
                        if(isNewData){                  //小于今天
                            klineData = objData.concat(klineData);  //数据库数据加在缓存后面
                        } else{
                        	if(this.chartParams){       //如果已经有k线图
	                        	this.chartParams.end += klineData.length;
	                        	this.chartParams.begin += klineData.length;
                        	}
                            klineData = klineData.concat(objData); //缓存数据加在数据库前
                        }
                    }
                    //更新实时数据，设置当天数据
                    if(time == new Date().format("yyyyMMdd000000")){
                        if(options.lastTradeDay && options.currentKLine && options.currentKLine.length > 0){
                        	if(options.currentKLine[1] && parseInt(options.currentKLine[1])>0){
	                            var ct = "";
	                            var cur = options.currentKLine[0].split(" ")[0];
	                            if(cur && cur != ""){
	                                ct = cur.replace(/\-/g,"")+"000000";
	                                options.currentKLine[0] = ct;
	                            }
	                            var lastTradeDay = options.lastTradeDay + "000000";
	                            if(parseInt(ct) > parseInt(lastTradeDay)){  //服务器数据最大日期 > 上个交易日
	                                var last = klineData.pop(); //所取服务器数据最大日期 == 该股数据库最大日期
	                                if(last[0] == ct){
	                                    klineData.push(options.currentKLine);  //更新实时数据
	                                }else if(last[0] <= lastTradeDay){
	                                    klineData.push(last);
	                                    klineData.push(options.currentKLine);  //
	                                    shiftData -= 1;
                                        console.log(' }else if(last[0] <= lastTradeDay){ ');
	                                }else{
                                        klineData.push(last);
                                    }
	                            }
                        	}
                        }
                    }
                    //将数据放到缓存中去
                    setLocalStorageData(options.stockCode,klineData);
                    resp.data = klineData;
                    var r = read(resp, function(d, e) {
//                            Alert(e);
                    });
                    if (!r) {
                        return;
                    }
                    _draw(shiftData);
                    //将请求数据标志位改为false
                    isGetData = false;
                    removeLoading(quotationKLineId,target);
                })
            } else {
                //设置当天数据
                if(options.lastTradeDay && options.currentKLine && options.currentKLine.length >0){
                    if(options.currentKLine[1] && parseInt(options.currentKLine[1])>0){
	                    var ct = "";
	                    var cur = options.currentKLine[0].split(" ")[0];
	                    if(cur && cur != ""){
	                        ct = cur.replace(/\-/g,"")+"000000";
	                        options.currentKLine[0] = ct;
	                    }
	                    var lastTradeDay = options.lastTradeDay + "000000";
	                    if(parseInt(ct) > parseInt(lastTradeDay)){
	                        var last = objData.pop();
	                        if(last[0] == ct){
	                            objData.push(options.currentKLine); //更新实时数据
	                        }else{
                                objData.push(last);
                            }
	                    }
                    }
                }
                var resp={};
                resp.data = objData;
                resp.title = title;
                var r = read(resp, function(d, e) {
//                    Alert(e);
                });
                if (!r) {
                    return;
                }
                _draw(shift);
                isGetData = false;
                removeLoading(quotationKLineId,target);
            }
        }

        /**
         * 取的缓存中的数据
         */
        function getLocalStorageData(stockCode){
            var storageData = "dzhjpzx_quotation_KlineCache";
            //先查看缓存中是否有
            if(localStorage){
                var result = {};
                //拿出存储的数据
                var data = localStorage.getItem(storageData);
                if(data){
                    result = JSON.parse(data);
                }
                if(result.stockCode == stockCode) {
					return result;
				}
            }
            return null;
        }

        /**
         * 重新设置缓存中的数据
         * @param storageData
         */
        function setLocalStorageData(stockCode,klineData){
            if(!klineData) return;
            var data = {stockCode:stockCode,objData:klineData,objDate:new Date().format("yyyyMMdd000000")};
            if(localStorage){
                var storageData = "dzhjpzx_quotation_KlineCache";
                //先清空这个股票的缓存
                localStorage.removeItem(storageData);
                var dataString = localStorage.setItem(storageData,JSON.stringify(data));
                //将id放到缓存id中去
                saveAllStorageIds(storageData);
                console.log('setLocalStorageData stockCode : ' + stockCode + " | klineData : " + klineData);
            }
        }
		//o : div#chartContent
        function initPlot(o){
            showLoading(quotationKLineId,o);
            //_drawEmpty();
        }
        function setIndicatorIndex(index){
            options.indicatorIndex=index;
            _draw();
        }
        function changePeriod(dataType,period){
            options.dataType = dataType;
            options.period = period;
            plot(true);
        }

        function hide(){
            clearInterval(this.interval);
            this.empty();
//            this.unbind("resize");
        }

        /**
         * 初始化数据
         * @param o { currentKLine: Array[7] lastTradeDay: "20140429" }
         */
        function refresh(o){
//            _initCanvas();
            if(options.interval!="-1" && options.interval!=null && this.interval){
                param.interval = window.setInterval(refresh,options.interval);
                $.extend(this, {"interval":param.interval});
            }
            $.extend(options,o);
            var date = new Date().format("yyyyMMdd000000");
            showLoading(quotationKLineId,this.get(0));	//画格子
            plot(true, 0, date);
        }
        param.refresh = refresh;
        param.hide = hide;
        // Public API
        $.extend(this, param);

        // Public API
        $.extend(this, {
            // Methods
            "changePeriod"      : changePeriod,
            "setIndicatorIndex" : setIndicatorIndex
        });
        /**
         * 初始运行时所调用的方法
         */
        return this.each(function() {
            init(this);
            _initCanvas();
            var date = getAppointedDay(new Date(),"",0)+"000000";
            initPlot(this);
            if(refreshTime!="-1" && refreshTime!=null){     //定时刷新
                window.setInterval(refresh,options.interval);
            }
        });
    };
})(jQuery);
var devicePlatform = null;
function myDeviceReadyListener(){
    console.log("设备加载完毕!");
    devicePlatform = device.platform;
}
(function(){
    $(document).ready(function(){
        document.addEventListener("deviceready", myDeviceReadyListener, false);      //设备加载完成回调函数
    });
})();