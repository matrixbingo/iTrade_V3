(function($) {
	$.businessIndicator = {
		ids:0,//支持同一个页面多次创建
		init : function(params) {
			console.log("current id:"+this.ids);
			if(params){
				this.options = $.extend(this.options,params,true);
			}
			//设置初始化canvas
			if(!this.options.target) {
				this.options.target = $("<div id='indicatorTarget"+this.ids+"'></div>");
				$(document.body).append(this.options.target);
			}else{
				this.options.target.html("");
			}
            //计算高度
			var width = $(document.body).width();
			var height = $(document.body).height() / 5 * 2;
			this.options.target.css({
				"position":"relative",
				"width":width+"px",
				"height":height+"px"
			});
			this.options.target.empty();
			if(!this.options.width || this.options.width == ""){
				this.options.width = this.options.target.width();	
			}
			if(!this.options.height || this.options.height == ""){
				this.options.height = this.options.target.height();
			}
			var id = Math.round(Math.random()*100);
			this.baseCanvas = $("<canvas id='baseCanvas"+id+"' width='"+width*2+"' height='"+height*2+"'></canvas>")[0];
			this.canvas = $("<canvas id='canvas"+id+"' width='"+width*2+"' height='"+height*2+"'></canvas>")[0];
			this.options.target.append($(this.baseCanvas));
            this.options.target.append($(this.canvas));
			this.canvas.backgroundAlpha = 0;
            $(this.baseCanvas).css({"position":"relative","z-index":0,"width":width,"height":height,"display":"none"});
            $(this.baseCanvas).wrap('<div style="display:none;"></div>');
            $(this.canvas).css({"position":"absolute",top:0,left:0,"z-index":3,"width":width,"height":height,"display":"none"});
            this.baseCtx = this.baseCanvas.getContext("2d");
            this.ctx = this.canvas.getContext("2d");
//            showLoading(this.options.target[0],false);
            this._plot.call(this,this);
//			return this;
		},
		_plot : function(o){
			var that = this;
			var url = that.options.url;
            var param = that.options.param;
            getAjaxDatas(url,param,function(resp){
            	if(resp=="timeout"){
                    showLoading(that.options.target,true);
                    return;
                }
                if(resp.length <= 0){
                	showErrorLoading( "businessIndicator",this.options.target );
                	return;
                }
                var array = [];
                if(resp[0] instanceof  Array){
                	array = resp;
                }else{
                	array.push(resp); 
                }
                var r = that._read(array);
                that.data = r;
                that._draw(that);
                
            });
		},
		
		_draw: function(o){
			var that = o;
			var ctx = that.baseCtx;
//			var ctx = that.ctx;
			var _top = that.options.tMargin * 2,_left = that.options.lMargin * 2,
			_right = that.options.rMargin * 2,_width = that.options.width * 2,
			_height = that.options.height * 2, _bottom = that.options.bMargin * 2,
			_w = _width - _right,
			_h = _height - _bottom;
			var bglineColor = that.options.bglineColor;
			
			//画背景表格横线
			var contentHeight = (that.options.height - that.options.tMargin - that.options.bMargin)*2;
			that._drawline(ctx,_left,_top ,_w,_top,bglineColor);
			that._drawline(ctx,_left,_h,_w,_h,bglineColor);
			that._drawline(ctx,_left,_top +  contentHeight / 2 ,_w,_top +  contentHeight / 2 ,bglineColor);
			that._drawline(ctx,_left,_top +  contentHeight / 4 ,_w,_top +  contentHeight / 4 ,bglineColor);
			that._drawline(ctx,_left,_top +  contentHeight / 4 * 3,_w,_top +  contentHeight / 4 * 3,bglineColor);
			var ob = that._window(that);
			var incomeMax = ob.incomeMax,incomeMin = ob.incomeMin,
			incomeMid = ((parseFloat(incomeMax)+parseFloat(incomeMin))/2).toFixed(2),
			rateMax = ob.rateMax,rateMin = ob.rateMin,
			rateMid = ((parseFloat(rateMax)+parseFloat(rateMin))/2).toFixed(2),
			width = ob.width,unit = ob.unit,unitStr = ob.unitStr;
			
			//标注左横轴
			that._drawTextDiv(that.options.target[0],"lymax"+that.ids,incomeMax,that.options.tlMargin,_top/2,{
                padding : 1,
                color : that.options.textColor,
                backgroundColor:"#F2F6F9",
                "z-index":6
            });
			that._drawTextDiv(that.options.target[0],"lymid"+that.ids,incomeMid,that.options.tlMargin,(_top +  contentHeight / 2)/2,{
                padding : 1,
                color : that.options.textColor,
                backgroundColor:"#F2F6F9",
                "z-index":6
            });  
            that._drawTextDiv(that.options.target[0],"lymin"+that.ids,incomeMin,that.options.tlMargin,_h/2,{
                padding : 1,
                color : that.options.textColor,
                backgroundColor:"#F2F6F9",
                "z-index":6
            });
            //标注右横轴
			that._drawTextDiv(that.options.target[0],"rymax"+that.ids,rateMax + "%",that.options.width - that.options.trMargin,_top/2,{
                padding : 1,
                color : that.options.textColor,
                backgroundColor:"#F2F6F9",
                "z-index":6
            });
			that._drawTextDiv(that.options.target[0],"rymid"+that.ids,rateMid + "%",that.options.width - that.options.trMargin,(_top +  contentHeight / 2)/2,{
                padding : 1,
                color : that.options.textColor,
                backgroundColor:"#F2F6F9",
                "z-index":6
            });  
            that._drawTextDiv(that.options.target[0],"rymin"+that.ids,rateMin + "%",that.options.width - that.options.trMargin,_h/2,{
                padding : 1,
                color : that.options.textColor,
                backgroundColor:"#F2F6F9",
                "z-index":6
            });
			var beginX = _left + that.options.lPadding + width/4;
			//每个柱状图宽度
			var cwidth = width/2;
			var times = that.data.ts;
			var datas = that.data.ds;
			var ldy = contentHeight/(incomeMax - incomeMin);
			var rdy = contentHeight/(rateMax - rateMin);
			var path = [],path1 = [],last = [],last1 = [];
			for(var i = 0; i < times.length; i++){
				var time = times[i];
				var data = datas[time];
				var income = (parseFloat(data.income)/unit).toFixed(2);
				var type = data.type;
				if(income && income!=""){
					if(income >= 0){
						var y = ldy * Math.abs(income - incomeMin);
						if(type == "0"){
							ctx.fillStyle = that.options.rectColor;
						}
						if(type == "1"){
							ctx.fillStyle = "#DC1414";
						}
						that._fillRect(ctx,beginX,_h - y,cwidth,y);
					}else{
						var recthtml = $("<div>&nbsp;</div>");
						var rectW = cwidth/2;
						var rectH = _h*0.6/2;
						recthtml.css({
							"width":rectW,
							"height":rectH,
							"border":"dashed 1px "+that.options.rectColor,
							"position":"absolute",
							"display":"border"
							
						});
						that._drawHtmlDiv(that.options.target[0],recthtml,beginX/2,_h/2-rectH+10);
						var html = $("<div class='img_deficit'>&nbsp;</div>");
						that._drawHtmlDiv(that.options.target[0],html,(beginX + cwidth/2)/2-40,_h/2-rectH+10);
					}
					that._drawTextDiv(that.options.target[0],"times"+that.ids+i,time,(beginX + cwidth/2)/2-16,_h/2+20,{
		                padding : 1,
		                color : that.options.textColor,
		                backgroundColor:"#F2F6F9",
		                "z-index":6
		            });
				}
				var income_rate = data.income_rate;
				if(income_rate && income_rate!=""){
					var rateX = beginX + cwidth/2;
					var rateY = _h - rdy * Math.abs(income_rate - rateMin);
					if(type == "0"){
						path.push([rateX,rateY]);
					}else{
						last = [rateX,rateY];
					}
				}
				var income_rate1 = data.income_rate1;
				if(income_rate1 && income_rate1!=""){
					var rateX = beginX + cwidth/2;
					var rateY = _h - rdy * Math.abs(income_rate1 - rateMin);
					if(type == "0"){
						path1.push([rateX,rateY]);
					}else{
						last1 = [rateX,rateY];
					}
				}
				beginX += width;
			}
			//画线
			if(path.length > 0){
				ctx.beginPath();
	            ctx.lineWidth = 4;
	            ctx.strokeStyle = that.options.rateColor;
	            var moveTo = false;		
				for(var i = 0; i < path.length; i++){
					if(!moveTo){
	                    ctx.moveTo(path[i][0], path[i][1]);
	                    moveTo = true;
	                }
	                ctx.lineTo(path[i][0], path[i][1]);
				}
				ctx.stroke();
				//画虚线
				if(last.length > 0){
					var prev = path[path.length - 1];
					that._drawDashes(ctx,prev[0],prev[1],last[0],last[1],that.options.rateColor,4);
				}
			}
			//画线
			if(path1.length > 0){
				ctx.beginPath();
	            ctx.lineWidth = 4;
	            ctx.strokeStyle = that.options.rateColor1;
				var moveTo = false;	
				for(var i = 0; i < path1.length; i++){
					if(!moveTo){
	                    ctx.moveTo(path1[i][0], path1[i][1]);
	                    moveTo = true;
	                }
	                ctx.lineTo(path1[i][0], path1[i][1]);
				}
				ctx.stroke();
				//画虚线
				if(last1.length > 0){
					var prev = path1[path1.length - 1];
					that._drawDottedline(ctx,prev[0],prev[1],last1[0],last1[1],that.options.rateColor,4);
				}
			}
			//画圆
			for(var i = 0; i < path.length; i++){
				that._fillArc(ctx,path[i][0],path[i][1],10,that.options.rateColor);
			}
			//画空心圆
			if(last.length > 0){
				that._fillArc(ctx,last[0],last[1],16,that.options.rateColor);
				that._fillArc(ctx,last[0],last[1],10,"#FFFFFF");
			}
			//画圆
			for(var i = 0; i < path1.length; i++){
				that._fillArc(ctx,path1[i][0],path1[i][1],10,that.options.rateColor1);
			}
			//画空心圆
			if(last1.length > 0){
				that._fillArc(ctx,last1[0],last1[1],16,that.options.rateColor1);
				that._fillArc(ctx,last1[0],last1[1],10,"#FFFFFF");
			}
			
			//画图例
			var list = that.options.list;
			if(list.length > 0){
				//计算每条图例占的宽度
				var cw = _width - _left - _right;
				//添加图例的容器
				var container = $("<div class='legendContainer'></div>");
				for(var i = 0; i < list.length; i++){
					var text = list[i];
					if(i == 0 && unitStr!=""){
						text += "("+unitStr+")";
					}
					var html = $("<span class='legend"+i+"'></span><span class='legendText"+i+"'>"+text+"</span>");
					container.append(html);
				}
				that._drawHtmlDiv(that.options.target[0],container,0,_height/2 - 20);
			}
			
			that.ctx.drawImage(that.baseCanvas,0,0);
			$(that.canvas).show();
			
			removeLoading(that.options.target[0]);
			
			//业务需要
			if(that.options.divId && that.options.divId!=""){
				$("#"+that.options.divId).show();	
			}
		},
		
		//获得canvas显示数据的区间，格式化营业收入
		_window: function(o){
			//计算横轴坐标参数
			var _left = o.options.lMargin * 2,_right = o.options.rMargin,
			_lPadding = o.options.lPadding * 2,_rPadding = o.options.rPadding * 2,
			_width = o.options.width * 2,
			_contentWidth = _width - _right - _left - _lPadding - _rPadding;
			var data = o.data;
			var years = data.ts;
			var num = years.length;
			//默认取一半为柱状图宽度
			var width = Math.floor(_contentWidth/num);
			//计算纵轴最大、最小值
			var incomeMax = 0,incomeMin = 0,rateMax,rateMin;
			for(var i = 0; i < years.length; i++){
				var year = years[i];
				var ds = data.ds[year];
				var income = ds.income;
				var income_rate = ds.income_rate;
				var income_rate1 = ds.income_rate1;
				if(income && income != ""){
					income = parseFloat(income);
					if(incomeMax < income){
						incomeMax = income;						
					}
//					if(incomeMin > income){
//						incomeMin = income;
//					}
				}
				if(i == 0){
					if(income_rate && income_rate!=""){
						rateMax = parseFloat(income_rate);
						rateMin = parseFloat(income_rate);
					}
					if(income_rate1 && income_rate1 != ""){
						if(!rateMax || (parseFloat(income_rate1) > rateMax)){
							rateMax = parseFloat(income_rate1);
						}
						if(!rateMin || (parseFloat(income_rate1) < rateMin)){
							rateMin = parseFloat(income_rate1);
						}
					}
				}else{
					if(income_rate && income_rate != ""){
						if(!rateMax || (parseFloat(income_rate) > rateMax)){
							rateMax = parseFloat(income_rate);
						}
						if(!rateMin || (parseFloat(income_rate) < rateMin)){
							rateMin = parseFloat(income_rate);
						}
					}
					if(income_rate1 && income_rate1 != ""){
						if(!rateMax || (parseFloat(income_rate1) > rateMax)){
							rateMax = parseFloat(income_rate1);
						}
						if(!rateMin || (parseFloat(income_rate1) < rateMin)){
							rateMin = parseFloat(income_rate1);
						}
					}
				}	
			}
			//计算经营指标的单位
			var len = ("" + parseInt(incomeMax)).length||0;
			var unit = 1;
			var unitStr = "";
			if(len > 4 && len < 8){
				unit = 10000;
				unitStr = "万";
			} else if(len >= 8 && len < 10){
				unit = 1000000;
				unitStr = "百万";
			}else if(len >= 10 && len < 12){
				unit = 100000000;
				unitStr = "亿";
			} else if(len >= 12){
				unit = 10000000000;
				unitStr = "百亿";	
			}
			var factor = 1;
			if(incomeMax < 0)factor = -1;
			if(Math.abs(incomeMax) >= 10){
				incomeMax = parseFloat(incomeMax / unit).toFixed(2);
				incomeMax = Math.ceil(Math.abs(incomeMax)/10)*10*factor;
			} else if(Math.abs(incomeMax) > 1){
				incomeMax = Math.ceil(Math.abs(incomeMax))*factor;
			}
			factor = 1;
			if(rateMax < 0)factor = -1;
			if(Math.abs(rateMax) >= 10){
				rateMax = Math.ceil(Math.abs(rateMax)/10)*10*factor;
			}else if(Math.abs(rateMax) > 1){
				rateMax = Math.ceil(Math.abs(rateMax))*factor;
			}
			if(incomeMin < 0){
				if(Math.abs(incomeMin)>10){
					incomeMin = Math.ceil(Math.abs(incomeMin)/10)*-10;
				}else if(Math.abs(incomeMin) > 1){
					incomeMin = Math.ceil(Math.abs(incomeMin))*-1;
				}
			}
			if(rateMin >= 0){
				rateMin = 0;
			}else{
				if(Math.abs(rateMin)>10){
					rateMin = Math.ceil(Math.abs(rateMin)/10)*-10;
				}else if(Math.abs(rateMin) > 1){
					rateMin = Math.ceil(Math.abs(rateMin))*-1;
				}
			}
			return {
				width : width,
				unit : unit,
				unitStr : unitStr,
				incomeMin : incomeMin.toFixed(2),
				incomeMax : incomeMax.toFixed(2),
				rateMin : rateMin.toFixed(2),
				rateMax : rateMax.toFixed(2)
			}
		},
		
		//读取数据
		_read: function(data){
			var result = {ts:[],ds:{}};
			if(data.length > 0){
				var times = [];
				var datas = {};
				for(var i = 0; i < data.length; i++){
					var array = data[i];
					while(array.length > 0){
						if(i == 0){
							var obj = array.pop();
							var year = obj.year;
							if(year && year!=""){
								datas[year] = obj;
								times.push(year);
							}
						}
						if(i == 1){
							var obj = array.pop();
							var year = obj.year;
							var income_rate = obj.income_rate;
							if(year && year!="" && income_rate && income_rate!=""){
								var r = datas[year];
								if(!r) r = {year:year};
								r.income_rate1 = income_rate;
								datas[year] = r;
							}
						}
					}
				}
				result.ds = datas;
				result.ts = times;
			}
			return result;
		},
		/**
		 * 填充圆形
		 */
		_fillArc : function(cxt, x, y, radius,color) {
			color = color || "#111111";
            cxt.beginPath();
            cxt.fillStyle = color;
			cxt.arc(x,y,radius,0,Math.PI*2);
			cxt.closePath();
			cxt.fill();
        },
		/**
		 * 填充矩形
		 */
		_fillRect : function(cxt, x, y, width, height) {
            cxt.fillRect(x, y, width, height);
        },
		/**
		 * 画矩形
		 */
		_strokeRect : function(cxt, x, y, width, height) {
            cxt.strokeRect(x - 1, y - 1, width, height);
        },
		/*
         * 画线
         */
        _drawline : function(ctx, x1, y1, x2, y2, color, width) {
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
        },
		_drawTextDiv : function(o, id, text, x, y, style) {
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
        },
        _drawHtmlDiv : function(o, html, x, y) {
            var div = html;
            div.css("position","absolute");
            div.css("left",x);
            //减去偏移量
            div.css("top",y - 10);
            $(o).append(div);
            div.show();
        },
        _drawDashes : function(ctx,x,y,x1,y1,dashGapArray,color,width){
          var dashGapArray = [10,20,5,20];
		  ctx.lineWidth = width;
		  ctx.strokeStyle = color
		  ctx.lineCap = "round";
		  ctx.beginPath();
		  ctx.dashedLine( x, y, x1, y1, dashGapArray );
		  ctx.closePath();
		  ctx.stroke();
		}
		
	}
	function initOptions(){
		return {
			target:null,//canvas生成的目标div
			divId:"",//业务需要
			url:"",
			param:{},
			stockCode:null,//要查询的股票代码
			list:[],
			width:"",//canvas宽度（选填）
			height:"",//canvas高度（选填）
			lMargin:30,
			lPadding:10,
			rMargin:40,
			rPadding:10,
			tMargin:30,
			bMargin:60,
			minWidth:10,
			maxWidth:50,
			tlMargin:5,//左边文字边距
			trMargin:50,//右边文字边距
			textColor:'#393e45',//文字颜色
			bglineColor:'#EAEEF1',//表格背景线
			rectColor:'#3091D6',//方框颜色
			fColor:'#DC1414',//预测颜色
			rateColor:'#99509F',//增长率颜色
			rateColor1:'#F49926'//行业颜色
		}
	}
	$.indicatorChart = function(o){
		var chart = {};
		$.businessIndicator.ids++;
		chart = $.extend(chart,$.businessIndicator,true);
		chart.options = initOptions();
		chart.init(o);
	}
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