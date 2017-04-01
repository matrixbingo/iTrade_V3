/**
 * 陈真
 * 绑定某元素滑动事件，支持左右划动，长按事件，PC、手机均支持
 */

(function($) {
    $.fn.draggable = function(options){
        var defaults = {
            start : null,
            moving : null,
            end : null
        }
        var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            START_EV = hasTouch ? 'touchstart' : 'mousedown',
            MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
            END_EV = hasTouch ? 'touchend' : 'mouseup',
            CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

        function init(target){
            //防止一个页面内多次绑定该事件
            options.events = $.extend(defaults, options);
            target.removeEventListener(START_EV,handleEvent,false);
            target.addEventListener(START_EV,handleEvent,false);

        }

        function _begining(event){
            event.preventDefault();
            var touch = hasTouch ? event.touches[0] : event;
            //若为PC则判断是否为左键点击事件
            if(!hasTouch && event.button!=0){
                event.stopPropagation();
                 return;
            }
            //初始化事件参数
            var param = {};
            param.touching = true;
            param.pageX = touch.pageX;
            param.pageY = touch.pageY;
            $.extend(options.eventParam,param);
            document.body.addEventListener(MOVE_EV,handleEvent,false);
            document.body.addEventListener(END_EV,handleEvent,false);
            document.body.addEventListener(CANCEL_EV,handleEvent,false);
            _trigger("start",event);
        }

        function _moving(event){
            //移动事件
            event.preventDefault();
            var touchParam = options.eventParam;
            if(touchParam&&touchParam.touching){
                _trigger("moving",event);
            }
        }

        function _ending(event){
            //删除绑定在该元素上的数据
            var touchParam = options.eventParam;
            if(touchParam != null&&touchParam.touching){
                _trigger("end",event);
            }
            _cancel(event);
        }

        function _cancel(event){
            //删除绑定在该元素上的数据
            options.eventParam = null;
            document.body.removeEventListener(MOVE_EV,handleEvent,false);
            document.body.removeEventListener(END_EV,handleEvent,false);
            document.body.removeEventListener(CANCEL_EV,handleEvent,false);
            console.log("cancel!");
        }

        function handleEvent(event){
            //设置点击事件作用的目标元素
            if(event.type == START_EV){
                if(!options.eventParam){
                    options.eventParam = {};
                }
                //根据实际项目需要设置目标元素
                options.eventParam.target = $(this).parents("li");
                options.eventParam.originY = $(this).parents("li").offset().top;
            }
            switch (event.type){
                case START_EV : _begining(event); break;
                case MOVE_EV : _moving(event); break;
                case END_EV : _ending(event); break;
                case CANCEL_EV : _cancel(event); break;
            }
        }

        function _trigger(type,event){
            if(options.eventParam && options.eventParam.target){
                var target = options.eventParam.target;
                //便利绑定点击事件的元素，获得符合条件的元素
                var events = options.events;
                switch(type){
                    case "start" :
                        if(events.start){
                            events.start.call(target,event,options.eventParam);
                        }
                        break;
                    case "moving" :
                        if(events.moving){
                            events.moving.call(target,event,options.eventParam);
                        }
                        break;
                    case "end" :
                        if(events.end){
                            events.end.call(target,event,options.eventParam);
                        }
                        break;
                    default : break;
                }
            }
        }
        return $(this).each(function(){
            init(this);
        })
    }
})(jQuery);