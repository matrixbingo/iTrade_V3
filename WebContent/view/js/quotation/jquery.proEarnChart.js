(function($) {
	$.businessProEarn = {
		ids:0,//支持同一个页面多次创建
		options :{
			target:null,//canvas生成的目标div
			divId:"",//业务需要
			url:"",
			param:{},
			stockCode:null,//要查询的股票代码
			width:"",//canvas宽度（选填）
			height:"",//canvas高度（选填）
			scale:8,//缩放显示的阀值
			list:[],
			lMargin:30,
			lPadding:10,
			rMargin:30,
			rPadding:10,
			tMargin:30,
			bMargin:60,
			minWidth:10,
			maxWidth:50,
			tlMargin:5,//左边文字边距
			textColor:'#393e45',//文字颜色
			bglineColor:'#EAEEF1',//表格背景线
			rectColor:'#3091D6',//方框颜色
			fColor:'#DC1414',//预测颜色
			rateColor:'#99509F',//增长率颜色
			rateColor1:'#F49926'//行业颜色
		},
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
            param.target = that.options.target.attr("id");
            getAjaxDatas(url,param,function(resp){
            	if(resp=="timeout"){
                    showLoading(that.options.target,true);
                    return;
                }
                if(resp.length <= 0){
                	showErrorLoading( "proEarnChart",this.options.target );
                	return;
                }
                that.options.target = $(document).find("#"+param.target);
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
			_width = that.options.width * 2,_right = that.options.rMargin * 2,
			_height = that.options.height * 2, _bottom = that.options.bMargin * 2,
			_w = that.options.width * 2 - _left,
			_h = that.options.height * 2 - that.options.bMargin * 2;
			var bglineColor = that.options.bglineColor;
			
			//画背景表格横线
			var contentHeight = (that.options.height - that.options.tMargin - that.options.bMargin)*2;
			that._drawline(ctx,_left,_top ,_w,_top,bglineColor);
			that._drawline(ctx,_left,_h,_w,_h,bglineColor);
			that._drawline(ctx,_left,_top +  contentHeight / 2 ,_w,_top +  contentHeight / 2 ,bglineColor);
			that._drawline(ctx,_left,_top +  contentHeight / 4 ,_w,_top +  contentHeight / 4 ,bglineColor);
			that._drawline(ctx,_left,_top +  contentHeight / 4 * 3,_w,_top +  contentHeight / 4 * 3,bglineColor);
			var ob = that._window(that);
			var incomeMax = ob.incomeMax,incomeMin = ob.incomeMin,incomeMid = ob.incomeMid,
			rateMax = ob.rateMax,rateMin = ob.rateMin,
			width = ob.width,unit = ob.unit;
			
			//标注横轴
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
			var beginX = _left + that.options.lPadding + width/4;
			//每个柱状图宽度
			var cwidth = width/2;
			var times = that.data.ts;
			var datas = that.data.ds;
			var ls = that.data.ls;
			var ldy = contentHeight/(incomeMax - incomeMin);
			var hldy = contentHeight/(incomeMid - incomeMin)/2;
			var rdy = contentHeight/(rateMax - rateMin);
			var path = [],path1 = [];
			var pe_ettm2;
			for(var i = 0; i < times.length; i++){
				var time = times[i];
				var data = datas[time];
				var income = (parseFloat(data.pe_ettm)/unit).toFixed(2);
				var type = data.type;
				var name = data.sname;
				if(!pe_ettm2){
					pe_ettm2 = data.pe_ettm2;
				}
				if(income && income!=""){
//					var y = ldy * Math.abs(income-incomeMin);
					var y = (income > incomeMid)?
					ldy * Math.abs(income-incomeMin):hldy * Math.abs(income-incomeMin);
					var loose = false;
					if(type == "0"){
						ctx.fillStyle = "#BABFC3";
					}else if(type=="1"){
						ctx.fillStyle = that.options.rectColor;
						that._tips(ls);
						if(income < 0){//亏损
							loose = true;
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
					}
					if(loose){
//						ctx.lineWidth = 4;
//						ctx.strokeStyle = that.options.rectColor;
//						that._strokeRect(ctx,beginX,_h - y,cwidth,y);
						
					}else{
						that._fillRect(ctx,beginX,_h - y,cwidth,y);
					}
					that._drawTextDiv(that.options.target[0],"times"+that.ids+i,name,(beginX + cwidth/2)/2-30,_h/2+20,{
		                padding : 1,
		                color : that.options.textColor,
		                backgroundColor:"#F2F6F9",
		                "z-index":6
		            });
				}
				beginX += width;
			}
			if(pe_ettm2){
				var income = parseFloat((parseFloat(pe_ettm2)/unit).toFixed(2));
				var y = 0;
				if(income >= parseFloat(incomeMid) && income <= parseFloat(incomeMax)){
					y = _h - ldy * Math.abs(income-parseFloat(incomeMid)) - contentHeight/2;
				}else if(income < parseFloat(incomeMid)){
					y = _h - hldy * Math.abs(income-parseFloat(incomeMin));
				}else{
					y += that.options.tMargin;
				}
				that._drawline(ctx,_left,y ,_w,y,"#F49926");
			}
			
			//画图例
			var list = that.options.list;
			if(list.length > 0){
				//计算每条图例占的宽度
				var cw = _width - _left - _right;
				//添加图例的容器
				var container = $("<div class='legendContainer'></div>");
				for(var i = 0; i < list.length; i++){
					var html = $("<span class='legend"+i+"' " +
							(i==1?"style='border-bottom:solid 1px #F49926'":"") +
							"></span>" +
							"<span class='legendText"+i+"'>"+list[i]+"</span>");
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
			var incomeMax = 0,incomeMin = 0,incomeMid,incomeSecond = 0;
			for(var i = 0; i < years.length; i++){
				var year = years[i];
				var ds = data.ds[year];
				var income = ds.pe_ettm;
				if(income && income != ""){
					income = parseFloat(income);
					if(incomeMax < income){
						incomeSecond = incomeMax;
						incomeMax = income;						
					}
				}
			}
			//计算经营指标的单位
			var len = ("" + parseInt(incomeMax)).length||0;
			var unit = 1;
			var unitStr = "";
			var factor = 1;
			if(incomeMax < 0)factor = -1;
				incomeMax = Math.ceil(Math.abs(incomeMax))*factor;
			if(incomeSecond < 0)factor = -1;
			incomeSecond = Math.ceil(Math.abs(incomeSecond))*factor;
			var incomeMid = ((incomeMax+incomeMin)/2).toFixed(2);
			//启用缩放的阀值为o.options.scale
			if(o.options.scale > 1){
				if(incomeMax/o.options.scale > incomeSecond) incomeMid = incomeSecond.toFixed(2);
			}
			return {
				width : width,
				unit : unit,
				unitStr : unitStr,
				incomeMin : incomeMin.toFixed(2),
				incomeMid : incomeMid,
				incomeMax : incomeMax.toFixed(2)
			}
		},
		
		//读取数据
		_read: function(data){
			var result = {ts:[],ds:{},ls:{}};
			if(data.length > 0){
				var cos = [];
				var datas = {};
				for(var i = 0; i < data.length; i++){
					var array = data[i];
					while(array.length > 0){
						if(i == 0){
							var obj = array.shift();
							var co = obj.co;
							if(co && co!=""){
								datas[co] = obj;
								cos.push(co);
							}
						}
						if(i == 1){
							var obj = array.pop();
							result.ls = obj;
						}
					}
				}
				result.ds = datas;
				result.ts = cos;
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
            cxt.strokeRect(x, y, width, height);
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
        _tips:function(o){
        	var bflag = o.pe_ettm;
        	var type = o.num;
        	var top = o.top;
        	if( parseFloat(bflag) > 0 ){
        var color = 'black';
        if( type == 1 ){
        	color = 'red';
        }else if( type == 2 ){
        	color = 'green';
        }
				var html = '<li class="' +color+ '">' +_getProEarnTitle( type )+ 
				'</li><li class="gray sm">当前值：<span class="light-blue">' +bflag+ 
				'</span>位于行业第<span class="light-blue">' +top+ '</span>位</li>';
				$( "#TTM_div" ).html( html );
			}else{
				var html = '<ul class="text-items fl"><li class="green">亏损</li></ul>';
				$( "#TTM_div" ).html( html );
			}
        },
        _drawHtmlDiv : function(o, html, x, y) {
            var div = html;
            div.css("position","absolute");
            div.css("left",x);
            //减去偏移量
            div.css("top",y - 10);
            $(o).append(div);
            div.show();
        }
		
	}
	$.proEarnChart = function(o){
		$.businessProEarn.init(o);
	}
})(jQuery);