/**
 * 陈真
 * 绑定某元素滑动事件，支持左右划动，长按事件，PC、手机均支持
 * 不支持手机多点触控
 */

(function($) {
    $.fn.touchEvent = function(options){
        var defaults = {
            moving : null,
            moveLeft: null,
            moveRight : null,
            moveTop : null,
            moveDown : null,
            fastClickStart : null,
            fastClickEnd : null,
            longClickStart : null,
            longClickMoving : null,
            longClickEnd : null
        }
        var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            START_EV = hasTouch ? 'touchstart' : 'mousedown',
            MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
            END_EV = hasTouch ? 'touchend' : 'mouseup',
            CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
            longClickTime = 1000;

        function init(target){
            options.events = $.extend(defaults, options);
            target.removeEventListener(START_EV,handleEvent,false);
            target.addEventListener(START_EV,handleEvent,false);
        }

        function _begining(event){
//            console.log("begining button:"+event.button);
//            debugger;
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
            param.isMoving = false;
            param.leftMoving = false;
            param.rightMoving = false;
            param.topMoving = false;
            param.downMoving = false;
            param.longClicking = false;
            param.longClickTimeout = null;
            param.pageX = touch.pageX;
            param.pageY = touch.pageY;
            param.longClickTimeout = setTimeout(function(){
                if(options && options.eventParam){
//                    console.log("longClickStart");
                    //触发longClick事件
                    options.eventParam.longClicking = true;
                    _trigger("longClickStart",event);
                }
            },longClickTime);
            $.extend(options.eventParam,param);
            _trigger("fastClickStart",event);
            document.body.addEventListener(MOVE_EV,handleEvent,false);
            document.body.addEventListener(END_EV,handleEvent,false);
            document.body.addEventListener(CANCEL_EV,handleEvent,false);
        }

        function _moving(event){
            //移动事件
            event.preventDefault();
            var touchParam = options.eventParam;
            if(touchParam&&touchParam.touching){
                var touch = hasTouch ? event.changedTouches[0] : event;
                if(touchParam.longClicking){
                    _trigger("longClickMoving",event);
                }else{
                    _trigger("moving",event);
                }
                //若为longClick事件则屏蔽滑动事件
                if(!touchParam.longClicking && !touchParam.isMoving){
                    //判断移动方向，获取点击节点
                    var currentX = touch.pageX;
                    var currentY = touch.pageY;
                    var deltaX = currentX - touchParam.pageX;
                    var deltaY = currentY - touchParam.pageY;
                    //在10x10范围内移动，认为没有移动
                    if((Math.abs(deltaX) > Math.abs(deltaY)) && Math.abs(deltaX)>10){
                        options.eventParam.isMoving = true;
                        //右移
                        if(deltaX < 0){
                            if(!options.eventParam.leftMoving){
//                                console.log("left");
                                options.eventParam.leftMoving = true;
                                _trigger("moveLeft",event);
                            }
                        } else {
                            //左移
                            if(!options.eventParam.rightMoving){
//                                console.log("right");
                                options.eventParam.rightMoving = true;
                                _trigger("moveRight",event);
                            }
                        }
                    }else if((Math.abs(deltaX) < Math.abs(deltaY)) && Math.abs(deltaY)>10){
                        options.eventParam.isMoving = true;
                        //上移
                        if(deltaY < 0){
                            if(!options.eventParam.upMoving){
//                                console.log("top");
                                options.eventParam.upMoving = true;
                                _trigger("moveTop",event);
                            }
                        } else {
                            //下移
                            if(!options.eventParam.downMoving){
//                                console.log("down");
                                options.eventParam.downMoving = true;
                                _trigger("moveDown",event);
                            }
                        }
                    }
                }
            }
        }

        function _ending(event){
//            debugger;
            var touch = hasTouch ? event.touches[0]:event;
            //删除绑定在该元素上的数据
            var touchParam = options.eventParam;
            if(touchParam != null&&touchParam.touching){
                if(touchParam.longClicking){
                    _trigger("longClickEnd",event);
                }
                //非longClick且非moving，则认为是点击事件
                if(!touchParam.longClicking && !touchParam.isMoving){
                    _trigger("fastClickEnd",event);
                }
            }
            _cancel(event);
        }

        function _cancel(event){
            //删除绑定在该元素上的数据
            options.eventParam = null;
            document.body.removeEventListener(MOVE_EV,handleEvent,false);
            document.body.removeEventListener(END_EV,handleEvent,false);
            document.body.removeEventListener(CANCEL_EV,handleEvent,false);
//            console.log("cancel!");
        }

        function handleEvent(event){
            //若页面上不含点击目标则返回
//            debugger;
            if(event.type != START_EV && options.eventParam){
                //清除判断longClick的定时方法
                if(options.eventParam.longClickTimeout!=null){
                    clearTimeout(options.eventParam.longClickTimeout);
                    options.eventParam.longClickTimeout = null;
                }
            }
            //设置点击事件作用的目标元素
            if(event.type == START_EV){
                if(!options.eventParam){
                    options.eventParam = {};
                }
                options.eventParam.target = this;
            }
            switch (event.type){
                case START_EV : _begining(event); break;
                case MOVE_EV : _moving(event); break;
                case END_EV : _ending(event); break;
                case CANCEL_EV : _cancel(event); break;
            }
//          }
        }

        function _trigger(type,event){
            if(options.eventParam && options.eventParam.target){
                var target = options.eventParam.target;
                //便利绑定点击事件的元素，获得符合条件的元素
                var events = options.events;
//                console.log("trigger:"+type);
                switch(type){
                    case "moving" :
                        if(events.moving){
                            events.moving.call(target,event);
                        }
                        break;
                    case "moveLeft" :
                        if(events.moveLeft){
                            events.moveLeft.call(target,event);
                        }
                        break;
                    case "moveRight" :
                        if(events.moveRight){
                            events.moveRight.call(target,event);
                        }
                        break;
                    case "moveTop" :
                        if(events.moveTop){
                            events.moveTop.call(target,event);
                        }
                        break;
                    case "moveDown" :
                        if(events.moveDown){
                            events.moveDown.call(target,event);
                        }
                        break;
                    case "fastClickStart" :
                        if(events.fastClickStart){
                            events.fastClickStart.call(target,event);
                        }
                        break;
                    case "fastClickEnd" :
                        if(events.fastClickEnd){
                            events.fastClickEnd.call(target,event);
                        }
                        break;
                    case "longClickStart" :
                        if(events.longClickStart){
                            events.longClickStart.call(target,event);
                        }
                        break;
                    case "longClickMoving" :
                        if(events.longClickMoving){
                            events.longClickMoving.call(target,event);
                        }
                        break;
                    case "longClickEnd" :
                        if(events.longClickEnd){
                            events.longClickEnd.call(target,event);
                        }
                        break;
                    default : break;
                }
            }
        }
//        debugger;
        return $(this).each(function(){
//            debugger;
            init(this);
        })
    }
})(jQuery);