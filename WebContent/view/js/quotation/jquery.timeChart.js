/*
 * 时间图 
 * 技术研发部---移动终端开发部 齐晓凯 
 * 创建日期：2011-7-17
 */
(function($, undefined) {
    var param = {};
	$.fn.timeChart = function(options) {
		var refreshTime = localStorage.getItem("refreshTime");
		var defaults = {
            afterInit : null,
			quotationType : 1,
            dataType : "day",
            period : '日K',
			stockCode : '',
            prevClose : '',
			accuracy : 2,
			//数据更新间隔
			interval : refreshTime,
			//左边距
	        lMargin : 13* 2,
	        //右边距
	        rMargin : 13* 2,
			//顶端边距
	        tMargin : 1* 2,
            tPadding : 10* 2,
	        //底部边距
	        bMargin : 1* 2,
            bPadding : 10* 2,
	        vSpacing: 5* 2,
	        percent:0.995,
	        indicatorIndex : 0,
            minheight:200,
            //是否显示逐笔交易
            isTradeInfo : true,
            //是否最终显示
            isFinalShow : true,
	        
	        //背景颜色
//	        background : "#EEF1F6",
            background : "#FFFFFF",
	        //表格线颜色
	        lineColor : 'rgba(170,170,170,0.5)',
	        focusLine : '#00FFFF',
	        minwidth : 8* 2,
            // 涨
            riseColor : '#A73202',
            // 跌
            fallColor : '#287312',
			//平开
			eqColor : '#000000',
        	//十字查询详细信息
        	detailCss: 'position:absolute; border: 2px solid #FF0000; background: #000000;text-align:left;width:82px;height:70px; padding:2px;filter:alpha(Opacity=60);-moz-opacity:0.5;opacity: 0.8;'
		};
		var deleteTarget = true;
		var options = $.extend(defaults, options);
		/* 初始化 */  
        function init(target) {
        	this.chartParams = {};
            this.target = target;
            this.canvas = undefined;
            this.overlay = undefined;
            if($(this.target).find("canvas[id^=base]").size() > 0){
            	this.canvas = $(this.target).find("canvas[id^=base]")[0];
            }
            if($(this.target).find("canvas[id^=overlay]").size() > 0){
            	this.overlay = $(this.target).find("canvas[id^=overlay]")[0];
            }
//            this.infodiv = document.createElement('div');
//            this.infodiv.id = 'info';
//            this.infodiv.zIndex = "1000";
//            this.target.appendChild(this.infodiv);
            if(options.isTradeInfo){
            	if($(this.target).find("#tradeinfodiv").size()>0){
            		this.tradeinfodiv = document.getElementById("tradeinfodiv");
            	}else{
	                //逐笔交易信息层
	                this.tradeinfodiv = document.createElement('div');
	                this.target.appendChild(this.tradeinfodiv);
            	}
                this.tradeinfodiv.id = 'tradeinfodiv';
                this.tradeinfodiv.zIndex = "1000";
            }
//            $(window).resize(function(){
//            	_initCanvas();
//            	_draw();
//            });
			return this;
        };
		function _initCanvas(){
			this.focusXY = undefined;
			this.width = document.body.clientWidth * 2;
            //计算高度
            var clientHeight = document.body.clientHeight;
            var top =  this.target.offsetTop;
			var height = clientHeight*2/5;
            if(height < options.minheight){
                height = options.minheight;
            }
            this.height = height * 2 - 20;
            //定义容器高度
            $(this.target).parent().get(0).height = this.height;
            if(options.isTradeInfo){
                this.plotWidth = Math.round((this.width-(options.lMargin + options.rMargin))*2/3);
            }else{
                this.plotWidth = this.width-(options.lMargin + options.rMargin);
            }
            this.plotHeight = Math.round((this.height-options.tMargin-options.bMargin-options.vSpacing)*3/4);
            if($(this.target).find("canvas").size()<=0){
                this.canvas = null;
                this.overlay = null;
            }
			if(this.canvas) {
                this.canvas.height = this.height;
                this.canvas.width = this.width;
                this.overlay.height = this.height;
                this.overlay.width = this.width;
            } else {
                this.canvas = _getCanvas("base",this.width, this.height);
                this.overlay = _getCanvas("overlay",this.width, this.height);
                if (!this.canvas) { 
                    throw "Cannot Initialize canvas";
                }
                this.canvas.tabIndex = 0;
                this.target.appendChild(this.canvas);
                this.target.appendChild(this.overlay);
            	$(this.canvas).wrap('<div style="display:none;"></div>');
            }
            this.canvas.plot = this;
            this.overlay.plot = this;
            removeELs();
            addELs();
            $(this.canvas).css({width:this.width/2,height:this.height/2});
            $(this.overlay).css({width:this.width/2,height:this.height/2});
            this.canvas.backgroundAlpha = 0;
            $(this.canvas).css({"position":"relative","z-index":0});
            $(this.overlay).css({"position":"absolute",top:0,left:0,"z-index":5});
            this.ctx = this.canvas.getContext("2d");
            this.overlayCtx = this.overlay.getContext("2d");
            //隐藏详细信息层
//            this.infodiv.style.display = "none";
            if(options.isTradeInfo){
//                this.tradeinfodiv.style.display = "none";
            }
            return this;
		};
		 /* 获取canvas */ 
	    function _getCanvas (id, w, h) {
	        var c = document.createElement('canvas');
	        if(!id) id = "";
	        c.id = id + Math.round(Math.random()*100);
	        c.width = w;
	        c.height = h;
	        return c; 
	    };
	    function getAccuracy(price){
	    	var pos = price.indexOf('.');
	    	if(pos==-1){
	    	 	return 0;
	    	}
	        return price.length - price.indexOf('.')-1;
		}
		//字符串转时间
	    function parseDate(dateStr) {
			if(dateStr==undefined) return '';
            var y = dateStr.substring(0,4);
            var m = (dateStr.length>=6)?(parseInt(dateStr.substring(4,6))-1):"00";
            var d = (dateStr.length>=8)?dateStr.substring(6,8):"00";
            var h = (dateStr.length>=10)?dateStr.substring(8,10):"00";
            var mm = (dateStr.length>=12)?dateStr.substring(10,12):"00";
		    return new Date(y,m,d,h,mm);
		}
	    /* 
         * 装载数据*/
        function read(data, done) {
        	if(data.data==null || data.data=="" || data.data==undefined){
        		this.PREV_CLOSE = data.PREV_CLOSE;
        	   return true;
        	}
            var errorcode = 0;
            var d = data.data;
            var title = data.title;
            function getTitleIndex(name){
            	for(var i = 0;i<title.length;i++){
            	if(title[i]==name){
            	return i;
            	}
            	}
            };
            if (errorcode) {
                if ($.isFunction(done)) {
                    return done.call(this, errorcode);
                } else {
                    return false;
                }
            }
            var tradeTime = data.tradeTime;

            this.timeLineCurrent = { ts: [], ohlc:[], vol:[], lcp:0};
            //this.chartParams.label = label;
            var ts = [];
            var ohlc = [];
            var v = []; 
            if (!d) { 
                var d = data;
            }
            var last = null;
            var offset = null;
            var dLen = d.length;
            var ShiJianChuo = getTitleIndex("time");
            var KaiPanJia = getTitleIndex("open");
            var ZuiGaoJia = getTitleIndex("high");
            var ZuiDiJia = getTitleIndex("low");
            var ZuiXinJia = getTitleIndex("price");
            var ChengJiaoZongLiang = getTitleIndex("volume");
            var ChengJiaoZongJinE = getTitleIndex("amount");
            var ShouMoBiaoShi = getTitleIndex("ShouMoBiaoShi");
            var JunJia = getTitleIndex("JunJia");
            for(var i=0;i<dLen;i++) {
            	i = parseInt(i);
            	var cur = d[i];
            	if(parseFloat(d[i][ZuiXinJia]) == 0){
            		d[i][ZuiXinJia] = this.PREV_CLOSE;
            		d[i][KaiPanJia] = this.PREV_CLOSE;
            		d[i][ZuiGaoJia] = this.PREV_CLOSE;
            		d[i][ZuiDiJia] = this.PREV_CLOSE;
            	}
            	if(last != null){
            		var thisTime = parseDate(d[i][ShiJianChuo]).getTime();
            		var lastTime = parseDate(last).getTime();
            		
            		var interval = (thisTime - lastTime)/60000; 
        			for(var m = 0 ;m<tradeTime.length;m=m+2){
	        			if(thisTime>parseDate(tradeTime[m]).getTime() && thisTime<=parseDate(tradeTime[m+1]).getTime()&& lastTime<parseDate(tradeTime[m+1]).getTime() && lastTime>=parseDate(tradeTime[m]).getTime()){
	        				for(var j = 1;j < interval;j++){
		            			offset++;
		            			ts[i-1+offset] = d[i-1][ShiJianChuo];
		                		ohlc[i-1+offset] = [parseFloat(d[i-1][KaiPanJia]) + (parseFloat(d[i][KaiPanJia]) - parseFloat(d[i-1][KaiPanJia]))*j/interval,
		                		                    parseFloat(d[i-1][ZuiGaoJia]) + (parseFloat(d[i][ZuiGaoJia]) - parseFloat(d[i-1][ZuiGaoJia]))*j/interval, 
		                		                    parseFloat(d[i-1][ZuiXinJia]) + (parseFloat(d[i][ZuiXinJia]) - parseFloat(d[i-1][ZuiXinJia]))*j/interval,  
		                		                    parseFloat(d[i-1][JunJia]) +  (parseFloat(d[i][JunJia]) - parseFloat(d[i-1][JunJia]))*j/interval,"buwei"];
		                		v[i-1+offset] = 0;
	            		}
	            			}else if(thisTime>=parseDate(tradeTime[m+1]).getTime() && lastTime<=parseDate(tradeTime[m+1]).getTime() && tradeTime[m+2]!=undefined && thisTime>=parseDate(tradeTime[m+2]).getTime() && lastTime<=parseDate(tradeTime[m+2]).getTime()){
	            				interval = (parseDate(tradeTime[m+1]).getTime()-lastTime + thisTime - parseDate(tradeTime[m+2]))/60000;
				            		for(var j=1;j<interval;j++){
				            			offset++;
				            			ts[i-1+offset] = d[i-1][ShiJianChuo];
				                		ohlc[i-1+offset] = [parseFloat(d[i-1][KaiPanJia]) + (parseFloat(d[i][KaiPanJia]) - parseFloat(d[i-1][KaiPanJia]))*j/interval,
				                		                    parseFloat(d[i-1][ZuiGaoJia]) + (parseFloat(d[i][ZuiGaoJia]) - parseFloat(d[i-1][ZuiGaoJia]))*j/interval, 
				                		                    parseFloat(d[i-1][ZuiXinJia]) + (parseFloat(d[i][ZuiXinJia]) - parseFloat(d[i-1][ZuiXinJia]))*j/interval,  
				                		                    parseFloat(d[i-1][JunJia]) +  (parseFloat(d[i][JunJia]) - parseFloat(d[i-1][JunJia]))*j/interval,"buwei"];
				                		v[i-1+offset] = 0;
				            		}
	            			}
	            			}
            	}
            	else{
            		var thisTime = parseDate(d[0][ShiJianChuo]).getTime();
            		var tempLength = 0;
            		var allTime = null;
            		for(var m = 0;m<tradeTime.length;m=m+2){
            			if(thisTime>=parseDate(tradeTime[m]).getTime() && thisTime <= parseDate(tradeTime[m+1]).getTime()){
            				tempLength = m;
            				break;
            			}
            		}
            		for(var n =0;n<tempLength;n=n+2){
            			allTime = allTime + parseDate(tradeTime[n+1]).getTime() - parseDate(tradeTime[n]).getTime();
            		}
            		allTime = allTime + thisTime - parseDate(tradeTime[tempLength]).getTime();
            		var interval = allTime/60000;
            		if(interval!=0){
            			for(var j =1;j<interval;j++){
            				offset++;
            				ts[i-1+offset] = tradeTime[0];
		                		ohlc[i-1+offset] = [0,0,0,0,"buwei"];
		                		v[i-1+offset] = 0;
            			}
            		}
            	}
            	last = d[i][ShiJianChuo];
                ts[i+offset] = d[i][ShiJianChuo];
                ohlc[i+offset] = [parseFloat(d[i][KaiPanJia]), parseFloat(d[i][ZuiGaoJia]), parseFloat(d[i][ZuiXinJia]), parseFloat(d[i][JunJia])];
                v[i+offset] = parseFloat(d[i][ChengJiaoZongLiang]);
            }
            var lcp= 1;
            if(data.PREV_CLOSE){
            	options.accuracy = getAccuracy(data.PREV_CLOSE);
            	lcp = parseFloat(data.PREV_CLOSE);
            }
            var rise = ((ohlc[ohlc.length - 1][2]-lcp)*100/lcp).toFixed(options.accuracy);
//			this.chartParams.label = ohlc[ohlc.length - 1][2]+' '+ rise+'%';
//			this.chartParams.labelColor = options.eqColor;
//			if(rise > 0){
//				this.chartParams.labelColor = options.riseColor;
//			}else if(rise < 0){
//				this.chartParams.labelColor = options.fallColor;
//			}
   
            this.timeLineCurrent.ohlc = ohlc;
            this.timeLineCurrent.ts = ts;
            this.timeLineCurrent.vol = v;
            this.timeLineCurrent.lcp = lcp;
            this.timeLineCurrent.tradeTime = tradeTime;
            
            return true;   
        };
        /* 时间格式统一为：yyyyMMddHHmmss */
	    function _formatDate(str) {
	    	if(str==undefined) return '';
	        var hour = str.substring(8,10);
	        var second = str.substring(10,12);
	        return hour+":"+second;
	    };
	    /* 画图 */
        function _drowEmpty(PREV_CLOSE){
            var ctx = this.ctx;
            var originWidth = ctx.lineWidth;
            _clear(this);

            var _top = options.tMargin, _left = options.lMargin, _right = _left + this.plotWidth, _bottom = _top + this.plotHeight;
            ctx.strokeStyle = options.lineColor;
            ctx.lineWidth = 1*2;
            _strokeRect(ctx,options.lMargin, options.tMargin, this.plotWidth, this.plotHeight);
            var h = _bottom;
            
            var vt = options.tMargin + this.plotHeight + options.vSpacing;
            this.bHeight=this.height-vt-options.bMargin;
            var vb = vt + this.bHeight;
            var vl = options.lMargin;
            var vr = options.lMargin + this.plotWidth;
            var vh = vb;
            
            var prevxy = [];
            var fit = false;

            ctx.strokeStyle = options.lineColor;
            _strokeRect(ctx,vl, vt, this.plotWidth, this.bHeight);


            //分时图，填充
//            var gradient = ctx.createLinearGradient(options.lMargin/2, options.tMargin/2,options.tMargin/2,options.tMargin/2+this.plotHeight/2);
//            gradient.addColorStop(0,'#FF8C00');
//            gradient.addColorStop(1,'#800080');
//            ctx.fillStyle = gradient;
//            ctx.fill();
            //画线
            var offset = 0;
            //开始画背景表格的横线
            //总的显示区域
            var plotContentH = this.plotHeight - options.tPadding - options.bPadding;
            //基线
            var _basicY = h - options.bPadding;
            _drawDottedline(ctx, _left, _basicY-Math.floor(plotContentH/2), _right, _basicY-Math.floor(plotContentH/2), "rgba(170,170,170,0.5)", 2);
            _drawline(ctx, _left, _basicY-Math.floor(plotContentH/4), _right, _basicY-Math.floor(plotContentH/4), options.lineColor, 2);
            _drawline(ctx, _left, _basicY-Math.floor(plotContentH/4*3), _right, _basicY-Math.floor(plotContentH/4*3), options.lineColor, 2);
            _drawline(ctx, _left, options.tMargin + options.tPadding, _right, options.tMargin + options.tPadding, options.lineColor, 2);
            _drawline(ctx, _left, _basicY, _right, _basicY, options.lineColor, 2);
            //初始化逐笔交易明细层
            _drawTradeInfo(this);
            
            this.overlayCtx.clearRect(0, 0, this.width, this.height);
            var overlayCtx = this.overlayCtx;
            //根据设备信息的不同选择不同的显示方式
            if($(this.canvas).size()>0){
                this.overlayCtx.drawImage(this.canvas,0,0);
            }
        };
        //初始化逐笔交易明细层
        function _drawTradeInfo(o){
            var getMax = function (array){
                var max = 0;
                if(array){
                    for(var i = 0; i < array.length; i++){
                        var item = array[i];
                        if(item && item.split(".").length == 2){
                            var len = item.split(".")[1].length;
                            if(len > max) max = len;
                        }
                    }
                }
                return max;
            }
            var realtimeTrade = $(o.tradeinfodiv);
            if(realtimeTrade){
                realtimeTrade.html("");
                realtimeTrade.hide();
                var tradeWidth = (o.width - o.plotWidth - options.lMargin - options.rMargin)/2;
                var tradeHeight = (o.height - options.tMargin - options.bMargin)/2;
                var x = options.lMargin/2 + o.plotWidth/2 - 5;
                var y = options.tMargin/2;
                var style = {
                    "top":y,
                    "left":x,
                    "width":tradeWidth,
                    "height":tradeHeight,
                    "z-index":100
                };
                var itemHeight = tradeHeight/10;
                var itemWidth = tradeWidth/3 - 0.5;
                realtimeTrade.addClass("ui-gw-trade");
                realtimeTrade.css(style);
                var array = new Array();
                var sellPrice = null;
                if(options.sellPrice){
                    sellPrice =  options.sellPrice.split(";");
                    array = sellPrice.concat();
                }
                var buyPrice = null;
                if(options.buyPrice){
                    buyPrice =  options.buyPrice.split(";");
                    array = array.concat(buyPrice);
                }
                var sellVolume = null;
                if(options.sellVolume){
                    sellVolume =  options.sellVolume.split(";");
                }
                var buyVolume = null;
                if(options.buyVolume){
                    buyVolume =  options.buyVolume.split(";");
                }
//                debugger;
                var html = '';
                var max = getMax(array);

                for(var i = 0;i < 10;i++){
                    var key = "卖"+(5 - i);
                    var price = null;
                    var volume = null;
                    var color = "";
                    if(i >= 5){
                        key = "买" + (i - 4);
                        if(buyPrice){
                            price = buyPrice[i - 5];
                        }
                        if(buyVolume){
                            volume = buyVolume[i - 5]
                        }
                    }else{
                        if(sellPrice){
                            price = sellPrice[4 - i];
                        }
                        if(sellVolume){
                            volume = sellVolume[4 - i]
                        }
                    }
                    if(price && price != ""){
                        if(price > options.prevClose){
                            color = " ui-gw-trade-rise";
                        } else if(price < options.prevClose){
                            color = " ui-gw-trade-fall";
                        }
                        price = parseFloat(price).toFixed(max);
                    }
                    html += '<div>' +
                        '<span class="left">'+key+'</span>' +
                        '<span class="mid'+color+'">'+(price?price:'--')+'</span>' +
                        '<span class="right">'+(volume?volume:'--')+'</span>' +
                        '</div>';
                    if(i == 4) html += '<p class="ui-gw-line"></p>';
                }
                realtimeTrade.append(html);
                //设置宽高
                realtimeTrade.find("div").css({"height":itemHeight,"width":"100%"});
                realtimeTrade.show();
            }
        }
        function _draw(shift) {
            var ctx = this.ctx;
            var dataset = this.timeLineCurrent;
            if(dataset == undefined || dataset == null || dataset == ""){
                _drowEmpty(this.PREV_CLOSE);
            }else{
                var data = dataset.ohlc;
                var tradeTime = dataset.tradeTime;
                var vol = dataset.vol;
                var overlays = dataset.overlays;
                var indicators =dataset.indicators;
                var allWidth = null;
                for(var i=0;i<tradeTime.length;i=i+2){
                    allWidth = allWidth + parseDate(tradeTime[i+1]).getTime() - parseDate(tradeTime[i]).getTime();
                }
                allWidth = allWidth/60000;
                var remainder = this.plotWidth;
                var tempData = [];
                var tempTs = [];
                if(allWidth>remainder && deleteTarget == true){
                    var length = allWidth - remainder;//如果一天的数据全的话该去的点数
                    var ts = dataset.ts;
                    var time = ts[ts.length-1];
                    var times = null;
                    var allTimes = null;
                    for(var i=0;i<tradeTime.length;i=i+2){
                        if(parseDate(time).getTime()>=parseDate(tradeTime[i]).getTime() && parseDate(time).getTime()<=parseDate(tradeTime[i+1]).getTime()){
                            times = parseDate(time).getTime() - parseDate(tradeTime[i]).getTime();
                            for(var j=0;j<i;j=j+2){
                                times = times + parseDate(tradeTime[j+1]).getTime() - parseDate(tradeTime[j]).getTime();
                            }
                        }
                        allTimes = allTimes + parseDate(tradeTime[i+1]).getTime() - parseDate(tradeTime[i]).getTime();
                    }
                    var realLength = parseInt(times/allTimes*length)+1;//现在数据该去的点
//            	var realLenght = parseInt(data.length/allWidth*length)+1;//现有的数据该去的点数
                    var deleteLength = parseInt(data.length/realLength);
                    var m =0;
                    for(var i=0;i<data.length;i++){
                        if(i==0){
                            tempData[m] = data[i];
                            tempTs[m] = ts[i];
                            m++;
                        }else{
                            if(i%deleteLength!=0){
                                tempData[m] = data[i];
                                tempTs[m] = ts[i];
                                m++;
                            }
                        }
                    }
                    data = tempData;
                    dataset.ts = tempTs;
                    dataset.ohlc = data;
                }
                _clear(this);

                var ob = _window(dataset, overlays, shift);
                var xmin = ob.xmin, ymin = ob.ymin, xmax = ob.xmax, ymax = ob.ymax;
                var firtTs = (parseDate(dataset.ts[xmin])- parseDate(tradeTime[0]))/60000;
                //xmin += firtTs;
                //xmax += firtTs;

                var _top = options.tMargin, _left = options.lMargin, _right = _left + this.plotWidth, _bottom = _top + this.plotHeight;
                ctx.strokeStyle = options.lineColor;
                ctx.lineWidth = 2;
                _strokeRect(ctx,_left, _top, this.plotWidth, this.plotHeight);
                var _topDiv = options.tMargin/ 2,_leftDiv = options.lMargin/ 2;
                var h = _bottom;

                //var c = Math.round(this.chartParams.cwidth/2);
                var c = firtTs;
                //var csize = Math.round(this.chartParams.cwidth/1.6);
                var csize = 1;

                var vt = options.tMargin + this.plotHeight + options.vSpacing;
                this.bHeight=this.height-vt-options.bMargin;
                var vb = vt + this.bHeight;
                var vl = options.lMargin;
                var vr = options.lMargin + this.plotWidth;
                var vymax = _minmax1d(vol.slice(0,xmax))[1];
                var vymin = 0;
                var vrange = vymax - vymin;
                var vscale = this.bHeight/vrange;
                var vh = vb;
                ctx.strokeStyle = options.lineColor;
                _strokeRect(ctx,vl, vt, this.plotWidth, this.bHeight);
                var range = ymax - ymin;
                var scale = (this.plotHeight - options.tPadding - options.bPadding)/range;
                var scaleDiv = scale/2;
                var prevxy = [];
                var fit = false;

                //开始画背景表格的横线
                //总的显示区域
	            var plotContentH = this.plotHeight - options.tPadding - options.bPadding;
	            //基线
	            var _basicY = h - options.bPadding;
	            _drawDottedline(ctx, _left, _basicY-Math.floor(plotContentH/2), _right, _basicY-Math.floor(plotContentH/2), "rgba(170,170,170,0.5)", 2);
	            _drawline(ctx, _left, _basicY-Math.floor(plotContentH/4), _right, _basicY-Math.floor(plotContentH/4), options.lineColor, 2);
	            _drawline(ctx, _left, _basicY-Math.floor(plotContentH/4*3), _right, _basicY-Math.floor(plotContentH/4*3), options.lineColor, 2);
	            _drawline(ctx, _left, options.tMargin + options.tPadding, _right, options.tMargin + options.tPadding, options.lineColor, 2);
	            _drawline(ctx, _left, _basicY, _right, _basicY, options.lineColor, 2);
                
                
                var ystops = _ygrid(ymin,ymax, 4);
                var yLen = ystops.length;
                for(var i=0;i<yLen;i++) {
                    var logystp = ystops[i];
                    var y1 = Math.round((logystp - this.chartParams.ymin.toFixed(options.accuracy))*scaleDiv)+options.bPadding/2;
                    var label = ystops[i];
                    var ratio = "";
                    if(label&&options.prevClose){
                        ratio = (((parseFloat(label) - parseFloat(options.prevClose))/parseFloat(options.prevClose))*100).toFixed(2);
                    }
                    var textColor = options.eqColor;
                    if(i>2){
                        textColor=options.riseColor;
                    }else if(i<2){
                        textColor=options.fallColor;
                    }
                    if(i==yLen-1){
                        y1=h/2-options.tMargin/2 - 7;
                    }
                    var indexx = options.lMargin/2;
                    var divId = "leftpos";
                    var ratioId = "rightpos";
                    var ratioWidth = this.plotWidth/2 + options.lMargin/2;
                    var indexy = h/2 - y1;
                    if (i == 0) {
                        indexy -= 6 - options.bPadding/2;
                        divId += "min";
                        ratioId += "min";
                    }
                    if(i==ystops.length-1){
                        indexy = options.tMargin/2 + 11;
                        divId += "max";
                        ratioId += "max";
                    }
                    if(i == 0 || i == yLen - 1){
                        _drawTextDiv(this.target, divId,label, indexx, indexy, {"z-index":6,padding:1,color : textColor,backgroundColor:"rgba(242, 246, 249, 0.5)"});
                        if(ratio!=""){
                            ratioWidth -= ((ratio.length+1)*6 + 2);
                            _drawTextDiv(this.target, ratioId,ratio+"%", ratioWidth, indexy, {"z-index":6,padding:1,color : textColor,backgroundColor:"rgba(242, 246, 249, 0.5)"});
                        }
                    }
                };

//                var ystop = Math.round(this.bHeight/3);
//                _drawline(ctx, options.lMargin, vt + ystop, options.lMargin+this.plotWidth, vt + ystop, options.lineColor, 1);
//                _drawline(ctx, options.lMargin, vt + ystop*2, options.lMargin+this.plotWidth, vt + ystop*2, options.lineColor, 1);

                //开始画背景表格的竖线
                var timeTotal = 0;
                var widPercent = 0;
                for(var i=0;i<tradeTime.length;i=i+2){
                    var time1 = tradeTime[i].substr(0,tradeTime[i].length-2);
                    var time2 = tradeTime[i+1].substr(0,tradeTime[i+1].length-2);
                    var timeReal = parseInt(parseDate(time2).getTime()) - parseInt(parseDate(time1).getTime());
                    timeTotal =parseInt(timeTotal) + parseInt(timeReal);
                }
                if(tradeTime.length>2){
                    for(var i = 0; i < tradeTime.length;i=i+2) {
                        var time1 = tradeTime[i].substr(0,tradeTime[i].length-2);
                        var times1 = parseDate(time1).getTime();
                        var time2 = tradeTime[i+1].substr(0,tradeTime[i+1].length-2);
                        var times2 = parseDate(time2).getTime();
                        var times = parseFloat(times2)-parseFloat(times1);
                        widPercent = parseFloat(widPercent) + parseInt(times)/parseInt(timeTotal);
                        if(tradeTime.length==4){
                            var times12 =parseFloat(parseDate(tradeTime[0].substr(0,tradeTime[0].length-2)).getTime())+ parseFloat(((parseDate(tradeTime[1].substr(0,tradeTime[1].length-2)).getTime()-parseDate(tradeTime[0].substr(0,tradeTime[0].length-2)).getTime())/2).toFixed(0));
                            var date12 = new Date(times12);
                            var nowTime12 = date12.format("yyyyMMddHHmmss");
                            var times22 =parseFloat(parseDate(tradeTime[2].substr(0,tradeTime[2].length-2)).getTime())+ parseFloat(((parseDate(tradeTime[3].substr(0,tradeTime[3].length-2)).getTime()-parseDate(tradeTime[2].substr(0,tradeTime[2].length-2)).getTime())/2).toFixed(0));
                            var date22 = new Date(times22);
                            var nowTime22 = date22.format("yyyyMMddHHmmss");
                            var xline = Math.round(options.lMargin+this.plotWidth*(widPercent-0.25));
                            //日期横轴文字偏移量
//                            var deltaW = 16;
//                            _drawTextDiv(this.target, "downpos0",_formatDate(nowTime12), options.lMargin+this.plotWidth/4 - deltaW, vh+12, {align:'center'});
//                            _drawTextDiv(this.target, "downpos1",_formatDate(nowTime22), options.lMargin+this.plotWidth*3/4 - deltaW, vh+12, {align:'center'});
                            _drawline(ctx, xline,options.tMargin,  xline,h,options.lineColor,2);
                            _drawline(ctx, xline,h+options.vSpacing,  xline, h+this.bHeight + options.vSpacing,  options.lineColor,2);
                        }
                        if(i==0){
                            var xline = Math.round(options.lMargin+this.plotWidth*widPercent);
                            //_drawline(ctx, xline, h+bHeight + options.vSpacing, xline, options.tMargin, options.lineColor);
    //                        _drawline(ctx, xline,options.tMargin,  xline,h,options.lineColor,0.5);
                            _drawline(ctx, xline,options.tMargin,  xline,h,options.lineColor,2);
                            _drawline(ctx, xline,h+options.vSpacing,  xline,h+this.bHeight + options.vSpacing,options.lineColor,2);
                        }
//                       if(i==0){
//                            _drawTextDiv(this.target, "downpos2",_formatDate(tradeTime[0]), options.lMargin - deltaW, vh+12, {align:'left'});
//                            _drawTextDiv(this.target, "downpos3",_formatDate(tradeTime[1])+"/"+_formatDate(tradeTime[2]), options.lMargin+this.plotWidth*widPercent - deltaW - 20, vh+12, {align:'center'});
//
//                        }else if(i==tradeTime.length-2){
//                            _drawTextDiv(this.target, "downpos4",_formatDate(tradeTime[i+1]), options.lMargin+this.plotWidth*widPercent - deltaW - 16, vh+12, {align:'right'});
//                        }else{
//                            _drawTextDiv(this.target, "downpos5",_formatDate(tradeTime[i+1]), options.lMargin+this.plotWidth*widPercent - deltaW, vh+12, {align:'center'});
//                        }
                    }

                }else{
                    for(var i = 1; i <= 4; i++) {
                        var times = parseDate(tradeTime[0].substr(0,tradeTime[0].length-2)).getTime();
                        var nexTimes = parseFloat(times) + timeTotal/4*i.toFixed(0);
                        var date = new Date(nexTimes);
                        var nowTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+".0";
//                        if(i==1){
//                            _drawTextDiv(this.target, "downpos6",_formatDate(tradeTime[0]), options.lMargin+this.plotWidth*0 - deltaW, vh+12, {align:'left'});
//                            _drawTextDiv(this.target, "downpos7",_formatDate(nowTime), options.lMargin+(this.plotWidth/4)*i - deltaW, vh+12, {align:'center'});
//                        }else if(i==4){
//                            _drawTextDiv(this.target, "downpos8",_formatDate(nowTime), options.lMargin+(this.plotWidth/4)*i - deltaW, vh+12, {align:'right'});
//                        }else{
//                            _drawTextDiv(this.target, "downpos9",_formatDate(nowTime), options.lMargin+(this.plotWidth/4)*i - deltaW, vh+12, {align:'center'});
//                        }
                        var xline = options.lMargin+(this.plotWidth/4)*i;
                        //_drawline(ctx, xline, h+bHeight + options.vSpacing, xline, options.tMargin, options.lineColor);
                        _drawline(ctx, xline,options.tMargin,  xline,h,options.lineColor,2);
                        _drawline(ctx, xline,h+options.vSpacing,  xline, h+this.bHeight + options.vSpacing,options.lineColor,2);
                    }
                }

                //分时图为充满屏幕补的空位
                var offsets = [];
                var tempLength = allWidth;
                if(remainder<=allWidth){
                    tempLength = remainder;
                }

                for(var i = 1;i < tempLength,remainder>0;i++){
                    var interval = Math.round(tempLength/i);
                    if(interval < 1) break;
                    var spaceNum = Math.floor(remainder/interval);
                    remainder = remainder - interval * spaceNum;
                    if(i===1){
                        spaceNum = spaceNum - 1;
                    }
                    if(spaceNum > 0){
                        //alert(spaceNum);
                        var datas = [i,spaceNum];
                        offsets.push(datas);
                    }
                    if(remainder <= 0) break;
                }
                var offset = 0;
                var offsetsLen = offsets.length;
                for(var i = xmin; i < xmax; i++) {
                    var yop = Math.round((data[i][0]-this.chartParams.ymin)*scale);
                    var ynew = Math.round((data[i][2]-this.chartParams.ymin)*scale);
                    if(i > xmin){
                        for(var m = 0;m < offsetsLen;m++){
                            var datas = offsets[m];
                            if(i%datas[0]===0){
                                offset=offset+datas[1];
                            }
                        }
                    }
                    var index = i + offset;

                    var xlo = (c + (index)*this.chartParams.cwidth) - csize + options.lMargin;
                    var xline = xlo + Math.round(csize/2);
                    if(!fit && this.focusXY && xline >= this.focusXY.x && data[i][4]!="buwei"){
                        this.chartParams.pos = i;
                        fit = true;
                        this.focusXY.x = xline;
                        this.focusXY.y = h-options.bPadding-ynew;
                    }
//                    if ( i-xmin > 0 && data[i][2]!=0 && data[i-1][2]!=0) {
//                        ctx.lineTo(xline+0.5, h-ynew+0.5);
//                        if(xmax-i ==1){
//                            ctx.lineTo(xline+0.5,options.tMargin+0.5 + this.plotHeight);
//                        }
//                    }else{
//                        ctx.beginPath();
//                        ctx.moveTo(xline+0.5,h+0.5);
//                        ctx.lineTo(xline+0.5, h-ynew+0.5);
//                    }
                    if ( i-xmin > 0 && data[i][2]!=0 && data[i-1][2]!=0) {
                        ctx.lineTo(xline, h-options.bPadding-ynew);
                        if(xmax-i ==1){
                            ctx.lineTo(xline,options.tMargin + this.plotHeight);
                        }
                    }else{
                        ctx.beginPath();
                        ctx.moveTo(xline,h);
                        ctx.lineTo(xline, h-options.bPadding-ynew);
                    }
                    prevxy = [xline, h-options.bPadding-ynew];


                };
                //分时图，填充
                var gradient = ctx.createLinearGradient(options.lMargin, options.tMargin,options.tMargin,options.tMargin+this.plotHeight);
                gradient.addColorStop(0,'#DDE5F0');
                gradient.addColorStop(1,'#DDE5F0');
                ctx.fillStyle = gradient;
                ctx.globalAlpha=0.5;
                ctx.fill();
                ctx.globalAlpha=1;
                //画线
                offset = 0;

                for(var i = xmin; i < xmax; i++) {

                    var yop = Math.round((data[i][0]-this.chartParams.ymin)*scale);
                    var ynew = Math.round((data[i][2]-this.chartParams.ymin)*scale);
                    var yavg = Math.round((data[i][3]-this.chartParams.ymin)*scale);
                    if(i > xmin){
                        for(var m = 0;m < offsetsLen;m++){
                            var datas = offsets[m];
                            if(i%datas[0]===0){
                                offset=offset+datas[1];
                            }
                        }
                    }
                    var index = i + offset;
                    var xlo = (c + (index)*this.chartParams.cwidth) - csize + options.lMargin;
                    var xline = xlo + Math.round(csize/2);
                    var prevxyAvg = [];
                    if(i!=0 && data[i-1][4]=="buwei" && data[i-1][2]==0){
                        prevxy = [xline, h-options.bPadding-ynew];
                        prevxyAvg = [xline, h-options.bPadding-yavg];
                    }
                    if(i==(xmax-1)){
                        this.chartParams.lastPos = xline;
                    }
                    if ( i-xmin > 0 && data[i][2]!=0) {
                        _drawline(ctx,prevxy[0], prevxy[1], xline, h-options.bPadding-ynew, '#2292DE', 2);
//                        var x1 = prevxy[0],y1 = prevxy[1],x2 = xline,y2 = h-options.bPadding-ynew;
//                        //直接使用原生划线工具展示效果不好，改为直接操作像素点画图
//                        var imageData = ctx.getImageData(x1, y1, x2, y2);debugger;
//                        var imageArray = imageData.data;
//                        Bresenham_drawLine(imageArray,Math.abs(x2-x1),Math.abs(y2-y1),x1,y1,x2,y2,0,0,0);
//                        imageData.data = imageArray;
//                        ctx.putImageData(imageData, x1, y1);
                        if(options.quotationType!=0){
                            _drawline(ctx,prevxyAvg[0], prevxyAvg[1], xline, h-options.bPadding-yavg, '#FFFF00', 2);
                        }
                    }
                    prevxy = [xline, h-options.bPadding-ynew];
                    prevxyAvg = [xline, h-options.bPadding-yavg];
                    /* 交易量 */
                    if(vol[i]) {
                        var yvol = vol[i] * vscale;
                        _drawline(ctx,xlo + 1,vh-yvol,xlo + 1,vh,'#898989',2);
                        var x1 = xlo + 1,y1 = vh-yvol,x2 = xlo + 1,y2 = vh;
//                        Bresenham_drawLine(imageArray,this.canvas.width,this.canvas.height,x1,y1,x2,y2,255,233,255);
                    }
                }


                //获取十字查询的数据坐标
                //十字查询详细信息的十字线
                var xPos=xmax-1;
                if(this.focusXY !== undefined){
                    var x = this.focusXY.x - options.lMargin;
                    var cp = this.chartParams;
                    var pc = this.plotWidth/(cp.end - cp.begin);
                    //xPos = Math.round(x/pc) + cp.begin;
                    xPos = this.chartParams.pos;
                    _drawline(ctx,_left, this.focusXY.y, _left+this.plotWidth, this.focusXY.y, options.focusLine);
                    _drawline(ctx,this.focusXY.x, _top, this.focusXY.x, _top+this.plotHeight, options.focusLine);
                    _drawline(ctx,this.focusXY.x, h+options.vSpacing, this.focusXY.x, h+this.bHeight + options.vSpacing, options.focusLine);
                }
                //逐笔明细
                _drawTradeInfo(this);
                /* 交易量 */
//                _drawTextDiv(this.target, "leftdpos0",formatVol(vymax), 2, vt+5, {align:'left', padding:2});
//                _drawTextDiv(this.target, "leftdpos1",formatVol(vymax*2/3), 2, vt+this.bHeight/3+5, {align:'left', padding:2});
//                _drawTextDiv(this.target, "leftdpos2",formatVol(vymax/3), 2, vt+this.bHeight*2/3+5, {align:'left', padding:2});
//                _drawTextDiv(this.target, "leftdpos3",0, 2, vt+this.bHeight, {align:'left', padding:2});
//                _drawTextDiv(this.target, "leftdpos4","量:"+formatVol(vol[xPos]), options.lMargin+this.plotWidth-65, vt-2, {align:'left', padding:5});
//
                if(options.beforeShow){
                    var flag = options.beforeShow.call(this);
                    if(!flag) options.isFinalShow = false;
                }
                if(options.isFinalShow && $(this.canvas).size()>0){
                    this.overlayCtx.clearRect(0, 0, this.width, this.height);
	                var overlayCtx = this.overlayCtx;
	                //根据设备信息的不同选择不同的显示方式
	                if($(this.canvas).size()>0){
                        this.overlayCtx.drawImage(this.canvas,0,0);
	                }
                }else{
                    options.isFinalShow = true;
                }
            }
        };

        function setPixel(imageData, W, H, x, y, r, g, b)
        {
            var i = (y*W+x)*4;
            imageData[i] = r;
            imageData[i+1] = g;
            imageData[i+2] = b;
        }

        function formatVol(vol){
            return vol > 10000 ? (vol/10000).toFixed(2)+'万' : Math.round(vol);
        }

        function _window(dataset, overlays, shift, datelo, datehi) {
        	var data = dataset.ohlc;
            var w = this.plotWidth;
            var begin, end, howmany = 0;

            shift = shift || 0; 
            this.chartParams.candles = this.chartParams.candles || data.length;
        	howmany = data.length;
        	options.minwidth=1;
            end = data.length;
            end -= shift;
            if (end > data.length) {
                end = data.length;
            }
            begin = end - howmany;
            if (begin < 0) {
                begin = 0;
                end = begin + howmany;
            }
            this.chartParams.begin = begin;
            this.chartParams.end = end;
            
            this.chartParams.candles = howmany;
//            this.chartParams.cwidth = Math.floor((w)/this.chartParams.candles);console.log("this.chartParams.cwidth:"+this.chartParams.cwidth);
            this.chartParams.cwidth = options.minwidth;
            if (this.chartParams.cwidth > 40) {
                this.chartParams.cwidth = 40;
            }
            if(this.chartParams.cwidth < options.minwidth){
                this.chartParams.cwidth = options.minwidth
            }

            var max, min;
            var d_ = _minmax2d(data.slice(begin, end),dataset.lcp);
            min = d_[0], max = d_[1];

            this.chartParams.ymin = min;
            this.chartParams.ymax = max;
            
            return { xmin : begin, xmax: end, ymin : this.chartParams.ymin, ymax : this.chartParams.ymax};
        };
        function _clear(o) {
            var ctx = o.ctx;
            ctx.clearRect(0,0, this.width, this.height);
            this.canvas.backgroundAlpha = 0;
            $(this.canvas).css({"position":"relative","z-index":"5"});
//	        $(this.canvas).hide();
//            ctx.fillStyle = options.background;
//            ctx.fillRect(options.lMargin, options.tMargin, o.plotWidth, this.height - options.tMargin - options.bMargin);
        };
        function _strokeRect(cxt,x,y,width,height){
        	cxt.strokeRect(x-1,y+1,width,height);
//            cxt.strokeRect(x,y,width,height);
        };

        function _fillRect(cxt,x,y,width,height){
//        	cxt.fillRect(x+0.5,y+0.5,width,height);
            cxt.fillRect(x,y,width,height);
        };
        function _drawText(ctx,text, x, y, style) {
            var color = style.color || '#000000';
            var font = style.font || '8pt sans-serif';
            var padding = style.padding || 2;
            var align = style.align || 'start';

            ctx.font = font;
            ctx.textAlign = align;
            var l = x + 2*padding + ctx.measureText(text).width;

            ctx.fillStyle = color;
            ctx.fillText(text, x+padding, y);

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
        function _drawDottedline(ctx, x1, y1, x2, y2, color, width){
            color = color || "#111111";
            var width = width || 1.0;
            var dashGapArray = [10,20,10,20];
            var w = ctx.lineWidth;
			ctx.lineWidth = width;
			ctx.strokeStyle = color
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.dashedLine( x1 - 1, y1 + 1, x2 - 1, y2 + 1, dashGapArray );
			ctx.closePath();
			ctx.stroke();
            ctx.lineWidth = w;
        }

        /*
	     * 画线
	     */
	    function _drawline(ctx, x1, y1, x2, y2, color, width) {
	        color = color || "#111111";
	        var width = width || 1.0;
	
	        var w = ctx.lineWidth;
	        ctx.lineWidth = width;
	        ctx.strokeStyle = color;
	        ctx.beginPath();
	        ctx.moveTo(x1-1,y1+1);
	        ctx.lineTo(x2-1,y2+1);
	        ctx.stroke();
	        ctx.lineWidth = w;
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

        function _drawLegend(label, offset) {
            var y = 20;
            var x = offset*100 + this.loffset;
            var color = this.cs.overlays[offset%this.cs.overlays.length];
            _drawText(label, x, y, {padding:0, color:color});

        };

        function _minmax2d(data,base) {
	    	//负无穷大
	        var max = -Infinity;
	        //正无穷大
	        var min = Infinity;
	        
	        for(var i in data) {
	        	if(data[i][4]!="buwei"){
	        		for (j in data[i]) {
	                if (data[i][j] >= max)  max = data[i][j];
	                if (data[i][j] < min) min = data[i][j]; 
	            }
	        	}
	        }
	        //分时图，中线是昨日收盘价
	        var rise = max - base;
	        var fall = base - min;
	        if(rise > fall){
	        	min = base - rise;
	        }else{
	        	max = base + fall;
	        }
	        return [min, max];
	    };
	
	    function _minmax1d(data) {
	    	//负无穷大
	        var max = -Infinity;
	        //正无穷大
	        var min = Infinity;
	        
	        for(var i in data) {
	           if (data[i] >= max)  max = data[i];
	           if (data[i] < min) min = data[i]; 
	        }
	        return [min, max];
	    };
	    /* 获取y轴坐标值 */ 
        function _ygrid(ymin, ymax, howmany) {
            var approx = (ymax - ymin)/howmany;
            vals = [];
            for(var i = 0; i <= howmany; i++) { 
                vals.push((ymin + i * approx).toFixed(options.accuracy));
            }

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
//            this.canvas.removeEventListener(START_EV, _chartClick, false);
//            this.canvas.removeEventListener(MOVE_EV, _touchMove, false);
//            return this.canvas;
        };
        //加载事件监听
        function addELs() {
//            this.canvas.addEventListener(START_EV, _chartClick, false);
//            this.canvas.addEventListener(MOVE_EV, _touchMove, false);
//            return this.canvas;
        };
        var _chartClick = function(event) {//alert(this.plot.chartParams.lastPos);
            var touch = hasTouch ? event.touches[0]:event;
            //图形外的点击直接返回
            //if(touch.pageX < options.lMargin || touch.pageX > this.plot.chartParams.lastPos) return;
            _showDetail(event);
        };
        /*
         * 高开低收详细信息
         */
        var _showDetail = function(event) {
            event.preventDefault();
            var touch = hasTouch ? event.touches[0]:event;
            this.focusXY = this.focusXY || {};
            //左右图形外的点击重置为图形左右边界的点击
            var pageX = "";
            if(touch.pageX < options.lMargin){
                pageX = options.lMargin;
            }else if(touch.pageX > this.canvas.plot.chartParams.lastPos){
                pageX = this.canvas.plot.chartParams.lastPos;
            }else{
                pageX = touch.pageX;
            }
            var pageY = touch.pageY;
            this.focusXY.x = pageX;
            this.focusXY.y = pageY;
            //draw();
            _draw();
            var myx = pageX - _ElemPageOffsetX(this.canvas);
            var myy = pageY - _ElemPageOffsetY(this.canvas);
            var cdl = _getCandle(myx, myy);
            if (cdl!=null) {
                var x = _ElemPageOffsetX(this.canvas)+options.lMargin;
                var y = _ElemPageOffsetX(this.canvas)+options.tMargin;
                if(myx<(this.canvas.plot.plotWidth/2+options.lMargin)){
                    x = options.lMargin+this.plotWidth-88;
                }
                _showInfo(cdl, x,y );
            } else {
                this.infodiv.style.display = 'none';
            }
        };
        function _showInfo(o, x, y) {
            var data = this.timeLineCurrent.ohlc;
            var op = data[o][0];
            var hp = data[o][1];
            //var lp = data[o][3];
            var cp = data[o][2];
            var lcp = this.timeLineCurrent.lcp;
            var rise = ((cp-lcp)*100/lcp).toFixed(options.accuracy);
            var s = this.infodiv.style;
            s.cssText = options.detailCss;
            s.left = x + 'px';
            s.top = y + 'px';
            //html =  "<span class='ui-eq-label'>"+'时间:'+_formatDate(this.current.ts[o])+"<br> </span>";
            var html = "<span class='ui-eq-label'>时间:</span>" + "<span class='ui-eq-label'>" + _formatDate(this.timeLineCurrent.ts[o]) + "</span><br>";
            var css = 'ui-eq-label';
            if(cp > lcp){
                css = 'ui-rise-label';
            }else if(cp < lcp){
                css = 'ui-fall-label';
            }else{
                css = 'ui-eq-label';
            }
            html += "<span class='ui-eq-label'>价格:</span>" + "<span class='"+css+"'>" + cp.toFixed(options.accuracy) + "</span><br>";

            if(op > lcp){
                css = 'ui-rise-label';
            }else if(op < lcp){
                css = 'ui-fall-label';
            }else{
                css = 'ui-eq-label';
            }
            html += "<span class='ui-eq-label'>开盘:</span>" + "<span class='"+css+"'>" + op.toFixed(options.accuracy) + "</span><br>";

            css = 'ui-eq-label';
            html += "<span class='ui-eq-label'>昨收:</span>" + "<span class='"+css+"'>" + lcp.toFixed(options.accuracy) + "</span><br>";

            if(rise > 0){
                css = 'ui-rise-label';
            }else if(rise < 0){
                css = 'ui-fall-label';
            }else{
                css = 'ui-eq-label';
            }
            html += "<span class='ui-eq-label'>涨幅:</span>" + "<span class='"+css+"'>" + rise + "%</span><br>";
            this.infodiv.innerHTML = html;
        };
        function _ElemPageOffsetX(e) {
            var ox = 0;
            do {
                ox += e.offsetLeft;
            } while (e = e.offsetParent) ;
            return ox;
        };

        function _ElemPageOffsetY(e) {
            var oy = 0;
            do {
                oy += e.offsetTop;
            } while (e = e.offsetParent) ;
            return oy;
        };
        function _getCandle(x,y) {
            x = x - options.lMargin;
            y = y - options.tMargin;
            var cp = this.chartParams;

            //var pc = this.plotWidth/(cp.end - cp.begin);
            var xos = this.chartParams.pos + cp.begin;
            if ((xos < cp.end) && (xos >= cp.begin)) {
                return xos;
                /*var candle = this.current.ohlc[xos];
                 var chi = candle[1];
                 var clo = candle[2];
                 pc = this.plotheight / (cp.ymax - cp.ymin);
                 var yos = cp.ymax - Math.round(y/pc);
                 if((chi > yos) && (clo < yos)) {
                 return xos;
                 }*/
            }
            return null;
        };
        /*
         * 无具体功能仅仅是为了屏蔽手指移动时浏览器的移动
         */
        var _touchMove = function(event) {
            event.preventDefault();
        };

		function plot(callback) {
            var target = this.target;
            if(!options.timeline){
                if(options.prevClose != ""){
                    loadAllTimeLine()
                } else {
                    showLoading(quotationTimeLineId,target,true);
                }
                return;
            }
            var timeline = options.timeline;
            var last = timeline.TIMELINE_CURRENT_LAST;
            if(last&&last!=null){
                if(last.substr(-6,6)=="150000"){
                    removeLoading(quotationTimeLineId,target);
                    return;
                }
                var url = getFullUrl("mobile/stock/appStockMinutesKLineData");
                var param = {obj:options.stockCode,time:""+last};
                getAjaxDatas(url,param,function(data){
                    //处理超时
                    if(data){
                        if(data == "timeout"){
                            showLoading(quotationTimeLineId,target,true);
                            return;
                        }
                        if(data.data && data.data.length > 0){
                            var hasChanged = false;
                            var times = this.timeLineCurrent.ts;
                            for(var i = 0; i < data.data.length; i ++){
                                if(times.indexOf(data.data[i][0]) < 0){
                                    timeline.data.push(data.data[i]);
                                    hasChanged = true;
                                }
                            }
                            if(hasChanged){
                                timeline.TIMELINE_CURRENT_LAST = data.data[data.data.length - 1][0];
                                var r = read(timeline, function(d, e) {});
                                if (!r) {
                                    return;
                                }
                                deleteTarget = true;
                                _draw();
                                deleteTarget = false;
                                options.timeline = timeline;
                            }
                        }
                        removeLoading(quotationTimeLineId,target);
                    }
                });
            }
		};
        function initPlot(o){
            _drowEmpty();
            showLoading(quotationTimeLineId,o);
            if(options.afterInit){
                options.afterInit();
            }
        }
        //全量查询
        function loadAllTimeLine(){
            var target = this.target;
            var url = getFullUrl("mobile/stock/getStockBoundary");
            var param = {obj:options.stockCode};
            //首次加载全量查询
            getAjaxDatas(url,param,function(resp){
                //处理超时
                if(resp){
                    if(resp == "timeout"){
                        showLoading(quotationTimeLineId,target,true);
                        return;
                    }
                    var date = "";
                    if(resp.data && resp.data.length>0){
                        resp.PREV_CLOSE = options.prevClose;
                        var array = [];
                        var tradeTime = [];
                        for(var i = 0;i < resp.data.length; i++){
                            var obj = resp.data[i];
                            var time = obj[0];
                            //获取日期
                            if(date == "" && time!=""){
                                date = time.substr(0,8);
                                tradeTime.push(date+"093000");
                                tradeTime.push(date+"113000");
                                tradeTime.push(date+"130000");
                                tradeTime.push(date+"150000");
                            }
                            //判断是否在交易区间
                            if(date == time.substr(0,8) && ((parseFloat(time)>=parseFloat(tradeTime[0])&&
                                parseFloat(time)<parseFloat(tradeTime[1]))||(parseFloat(time)>=parseFloat(tradeTime[2])
                                &&parseFloat(time)<=parseFloat(tradeTime[3])))){
                                array.push(obj);
                            }
                        }
                        if(array.length>0){
                            resp.data = array;
                            resp.tradeTime = tradeTime;
                            //得到当前数组的最后一个时间节点
                            var last = array[array.length-1][0];
                            resp.TIMELINE_CURRENT_LAST = last;
                            options.timeline = resp;
                            var r = read(resp, function(d, e) {});
                            if (!r) {
                                return;
                            }
                            deleteTarget = true;
                            _draw();
                            deleteTarget = false;
                        }
                        //
                    }
                    removeLoading(quotationTimeLineId,target);
                }else{
                    showLoading(quotationTimeLineId,target,true);
                }
            });
        }
        function hide(){
            clearInterval(this.interval);
            $(this).empty();
            $(this).html("");
//            $(window).unbind("resize");
        }
        function refresh(o){
//            _initCanvas();
            if(options.interval != "-1" && options.interval!=null && this.interval){
                param.interval = window.setInterval(plot,options.interval);
                $.extend(this, {"interval":param.interval});
            }
//            if(o && o.prevClose){
//                options.prevClose = o.prevClose;
//            }
            $.extend(options,o);
            showLoading(quotationTimeLineId,this.get(0));
            plot(true);
        }
        if(options.interval!="-1" && options.interval!=null){
            param.interval = window.setInterval(plot,options.interval);
        }
        param.refresh = refresh;
        param.hide = hide;
        $.extend(this, param);
		return this.each(function() {
			init(this);
            _initCanvas();
            if(options.interval!="-1" && options.interval!=null && this.interval){
                param.interval = window.setInterval(plot,options.interval);
                $.extend(this, {"interval":param.interval});
            }
            initPlot(this);
		});
	};
})(jQuery);
(function(){
	if (window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype.lineTo &&
	!CanvasRenderingContext2D.prototype.dashedLine){
	  	CanvasRenderingContext2D.prototype.dashedLine = function(x,y,x2,y2,dashArray){
	       if (!dashArray) dashArray=[10,5];
	       var dashCount = dashArray.length;
	       this.moveTo(x, y);
	       var dx = (x2-x), dy = (y2-y);
	       var slope = dy/dx;
	       var distRemaining = Math.sqrt( dx*dx + dy*dy );
	       var dashIndex=0, draw=true;
	       while (distRemaining>=0.1 && dashIndex<10000){
	            var dashLength = dashArray[dashIndex++%dashCount];
	            if (dashLength==0) dashLength = 0.001; // Hack for Safari
	            if (dashLength > distRemaining) dashLength = distRemaining;
	            var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
	            x += xStep
	            y += slope*xStep;
	            this[draw ? 'lineTo' : 'moveTo'](x,y);
	                distRemaining -= dashLength;
	                draw = !draw;
	           }
	           this.moveTo(0,0);
	      }
	 }
})()