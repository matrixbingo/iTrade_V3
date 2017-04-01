/*
 * K线 技术研发部---移动终端开发部 齐晓凯 创建日期：2011-6-20
 */

(function($, undefined) {
    $.fn.kLineChart = function(options) {
        var param = {};

        /**
         * 初始运行时所调用的方法
         */
        return this.each(function() {
            $("button").click(function(){
                $("li").each(function(){
                    alert($(this).text())
                });
            });
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