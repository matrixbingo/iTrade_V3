/*
 * qixiaokai@gw.com.cn;2014-1-16 phonegap plugin,通过js将数据存储到操作系统的本地存储中。
 * 
 */
storagePlugin = function() {
};

storagePlugin.prototype.addRemind = function(value, resultHandler,
		errorHandler) {
	cordova.exec(resultHandler, errorHandler, "storage",
			'addRemind', value);
}

storagePlugin.prototype.getAllReminds = function(resultHandler,errorHandler) {
	var currentUser = getCurrentUser();
	cordova.exec(resultHandler, errorHandler, "storage",
			'getAllReminds', [currentUser
					]);
};
storagePlugin.prototype.deleteRemind = function(value,resultHandler,errorHandler) {
	cordova.exec(resultHandler, errorHandler, "storage",
			'deleteRemind',value);
};
storagePlugin.prototype.setCurrentUser = function(value,resultHandler,errorHandler) {
	var currentUser = getCurrentUser();
	cordova.exec(resultHandler, errorHandler, "storage","setCurrentUser",[currentUser]);
};
storagePlugin.prototype.getPushId = function(resultHandler,errorHandler) {
	cordova.exec(resultHandler, errorHandler, "storage","getPushId", []);
};
storagePlugin.prototype.loadCfg = function(resultHandler,errorHandler) {
    cordova.exec(resultHandler, errorHandler, "storage","loadCfg", []);
};
storagePlugin.prototype.login = function(value,resultHandler,errorHandler) {
    cordova.exec(resultHandler, errorHandler, "storage","login", [value]);
};
storagePlugin.prototype.logout = function(value,resultHandler,errorHandler) {
    cordova.exec(resultHandler, errorHandler, "storage","logout",[value]);
};
cordova.addConstructor(function() {
			if (!window.plugins) {
				window.plugins = {};
			}
			window.plugins.storagePlugin = new storagePlugin(); // addPlugin方法取消后用这种方式创建插件
		});
