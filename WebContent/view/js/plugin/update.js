/*
 * qixiaokai@gw.com.cn;2014-1-21 phonegap plugin,版本更新用到的打开文件等操作。
 * 
 */
var Update = function(){};

Update.prototype.openFile = function(fullPath,onSuccess, onFail){
    cordova.exec(onSuccess, onFail, 'update', 'openFile', [fullPath]);
};
Update.prototype.openApp = function(packageName,onSuccess, onFail){
    cordova.exec(onSuccess, onFail, 'update', 'openApp', [packageName]);
};
cordova.addConstructor(function() {
			if (!window.plugins) {
				window.plugins = {};
			}
			window.plugins.updatePlugin = new Update(); // addPlugin方法取消后用这种方式创建插件
		});
