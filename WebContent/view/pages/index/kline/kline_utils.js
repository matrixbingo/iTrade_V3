/**
 * Created by WL on 15/5/4.
 * 辅助工具 K线的参数或
 */
/**
 * 对日期操作的公共方法
 */
var DateUtil = DateUtil || {};
/**
 * 对数据操作的公共方法
 */
var DataUtil = DataUtil || {};
/**
 * 对页面元素操作的公共方法
 */
var FormUtil = FormUtil || {};
/**
 * 坐标相关的公共方法
 */
var codnUtil = codnUtil || {};

DataUtil.param = {
    storageData     : 'iTrade_V3_quotation_KlineCache',
    allStorageId    : "iTrade_V3_storageIds",               //所有缓存名称集合的id
    options         : {},
    cacheSizeId     : 'cacheSize'                           //显示内存用量的控件ID
};

DataUtil.init = function(options){
    this.param.options = options;
}
/**
 *  获取y轴坐标值
 */
codnUtil.ygrid = function (ymin, ymax, howmany) {
    var approx = (ymax - ymin) / howmany;
    var vals = [];
    for (var i = 0; i < howmany; i++) {
        vals.push((ymin + i * approx));
    }
    vals.push(ymax);
    return vals;
}


/**
 *  格式化时间（yyyyMMddHHmmss）
 */
DateUtil.formatDate = function(str) {
    if (str == undefined) return '';
    str = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + ':' + str.substring(10, 12);
    return str;
};
/**
 * 格式化时间
 * 2010-10-11 12:12:12 --> 20101011121212
 */
DateUtil.formatTime = function(str) {
    if (str == undefined) return '';
    str = str.replace(/\-/g, "") + "00";
    str = str.replace(/\:/g, "");
    str = str.replace(/\ /g, "");
    return str;
};


/**
 * 取k线的最大最小值
 * data : k线数据
 */
DataUtil.minmax2d = function(data) {
    // 负无穷大
    var max = -Infinity;
    // 正无穷大
    var min = Infinity;

    for (var i in data) {
        if (i != "remove" && data[i] != undefined){
            if (data[i].length > 1) {
                for (var j in data[i]) {
                    if (j != "remove" && data[j] != undefined) {
                        if (data[i][j] >= max)
                            max = data[i][j];
                        if (data[i][j] < min)
                            min = data[i][j];
                    }
                }
            } else {
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
 * 计算成交量最值 - 暂不使用
 */
DataUtil.minmax1d = function(data) {
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
/**
 * 获取精度位数
 * 10.233 : 3
 */
DataUtil.getAccuracy = function(price) {
    price = '' + price;
    var pos = price.indexOf('.');
    if (pos == -1) {
        return 2;
    }
    return price.length - price.indexOf('.') - 1;
}

/**
 *  获取canvas
 * */
FormUtil.getCanvas = function(id, w, h) {
    var canvas = $("<canvas></canvas>");
    var c = canvas.get(0);
    if (!id) id = "";
    c.id = id + Math.round(Math.random() * 100);
    c.width = w;
    c.height = h;
    return c;
};

/**
 *  Js 实现类似Java中的Map对象
 *  put(key , value) : 存
 *  get(key) ：取
 *  remove(key) : 删除
 *  containsKey(key) ：是否包含 Key
 *  containsValue(obj) : 是否包含 value
 *  values() : 获取所有Value return Array
 *  keys() : 获取所有key  return Array
 *  size()
 *  clear() : 清空 Map
 *  isEmpty() :判断是否为空
 */
DataUtil.Map = function () {
    /** Map 大小 **/
    var size = 0;
    /** 对象 **/
    var entry = new Object();

    /** 存 **/
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            size++;
        }
        entry[key] = value;
    }

    /** 取 **/
    this.get = function (key) {
        if (this.containsKey(key)) {
            return entry[key];
        }
        else {
            return null;
        }
    }

    /** 删除 **/
    this.remove = function (key) {
        if (delete entry[key]) {
            size--;
        }
    }

    /** 是否包含 Key **/
    this.containsKey = function (key) {
        return (key in entry);
    }

    /** 是否包含 Value **/
    this.containsValue = function (value) {
        for (var prop in entry) {
            if (entry[prop] == value) {
                return true;
            }
        }
        return false;
    }

    /** 所有 Value **/
    this.values = function () {
        var values = [];
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    }

    /** 所有 Key **/
    this.keys = function () {
        var keys = [];
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    }

    /** Map Size **/
    this.size = function () {
        return size;
    }

    /** 清空 Map **/
    this.clear = function () {
        entry = new Object();
    }

    /**  判断是否为空 **/
    this.isEmpty = function () {
        return size == 0;
    }
}

/**
 * 取的缓存中的数据
 */
DataUtil.getLocalStorageData = function (stockCode) {
    stockCode = stockCode + '_' + DataUtil.param.options.period;
    var storageData = DataUtil.param.storageData + '_' + DataUtil.param.options.period;
    //先查看缓存中是否有
    if (localStorage) {
        var result = {};
        //拿出存储的数据
        var data = localStorage.getItem(storageData);
        if (data) {
            result = JSON.parse(data);
        }
        if (result.stockCode == stockCode) {
            return result;
        }
    }
    return null;
};

/**
 * 重新设置缓存中的数据
 * @param storageData
 */
DataUtil.setLocalStorageData = function (stockCode, klineData) {
    stockCode = stockCode + '_' + DataUtil.param.options.period;
    if (!klineData || klineData.length == 0) return;
    //置换最大最小时间
    var maxTime = klineData[klineData.length - 1][1];//取最大时间
    var minTime = klineData[0][1];//取最小时间
    var storageJsonData = DataUtil.getLocalStorageData(DataUtil.param.options.stockCode);
    if (storageJsonData) {
        var maxTimeChe = storageJsonData.objDate;
        var minTimeChe = storageJsonData.minTime;
        if (parseFloat(maxTime) < parseFloat(maxTimeChe)) {
            maxTime = maxTimeChe;
        }
        if (parseFloat(minTimeChe) < parseFloat(minTime)) {
            minTime = minTimeChe;
        }
    }

    var data = {stockCode: stockCode, objData: klineData, objDate: maxTime, minTime: minTime};
    //var data = {stockCode:stockCode,objData:klineData,objDate:new Date().format("yyyyMMdd000000")};   //001
    if (localStorage) {
        var storageData = DataUtil.param.storageData + '_' + DataUtil.param.options.period;
        //先清空这个股票的缓存
        localStorage.removeItem(storageData);
        var dataString = localStorage.setItem(storageData, JSON.stringify(data));
        //将id放到缓存id中去
        DataUtil.saveAllStorageIds(storageData);
        //console.log('setLocalStorageData stockCode : ' + stockCode + " | klineData : " + klineData);
    }

    //刷新显示
    var storageSize = DataUtil.getAllLocalStorageDatasSize();
    $("#" + DataUtil.param.cacheSizeId).html(storageSize);
};


/**
 * 将所有的缓存的id 放到缓存中
 * 已经有的直接return，没有的加到缓存中去
 * @param storageId
 */
DataUtil.saveAllStorageIds = function (storageId) {
    if (storageId == "") {
        return;
    }
    var newAllStorageIds = "";
    if (localStorage) {
        var storageStr = localStorage.getItem(DataUtil.param.allStorageId);
        var isAlreadeHas = false;
        if (storageStr) {
            var storageArr = storageStr.split(";");
            for (var i = 0, len = storageArr.length; i < len; i++) {
                var tempStr = storageArr[i];
                if (storageId == tempStr) {
                    isAlreadeHas = true;
                    break;
                }
            }
            newAllStorageIds += storageStr;
        }
        //如果没有，则加到缓存中去
        if (!isAlreadeHas) {
            if (storageStr) {
                newAllStorageIds += ";"
            }
            newAllStorageIds += storageId;
        }
        localStorage.removeItem(allStorageId);
        localStorage.setItem(allStorageId, newAllStorageIds);
    }
}

/**
 * 获取缓存中数据的大小
 */
DataUtil.getAllLocalStorageDatasSize = function () {
    var storageSize = 0;
    if (localStorage) {
        var tempIdsStr = localStorage.getItem(DataUtil.param.allStorageId);
        //先把id的大小放进去
        if (tempIdsStr) {
            for (var i = 0, len = tempIdsStr.length; i < len; i++) {
                if (tempIdsStr.charCodeAt(i) > 255) {
                    storageSize += 2;
                } else {
                    storageSize++;
                }
            }
            var tempIdsArr = tempIdsStr.split(";");
            //循环遍历所有的id，取出所有字节的大小
            for (var j = 0, len = tempIdsArr.length; j < len; j++) {
                var itemAtr = localStorage.getItem(tempIdsArr[j]);
                if (itemAtr) {
                    for (var k = 0; k < itemAtr.length; k++) {
                        if (itemAtr.charCodeAt(k) > 255) {
                            storageSize += 2;
                        } else {
                            storageSize++;
                        }
                    }
                }
            }
        }
    }
    var storageSizeStr = '';
    if (storageSize < 1024) {
        storageSizeStr += '' + storageSize + "B";
    } else if (storageSize < (1024 * 1024)) {
        storageSizeStr += handleRawData("keep2Fields", storageSize / 1024) + "KB";
    } else {
        storageSizeStr += handleRawData("keep2Fields", storageSize / (1024 * 1024)) + "MB";
    }
    return storageSizeStr;
};

