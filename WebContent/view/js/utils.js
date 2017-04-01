/**
 * Created by wangliang on 2014/9/15
 *
 * 页面操作的公共方法
 * 部分依赖
 *  common/jquery/jquery-1.7.1.min.js
 *
 *  图表 柱状图，折线图
 *  highcharts-4.0.3.js
 *
 *  消息提醒
 *  common/jquery.msg/jquery.msg.css
 *  common/jquery.msg/jquery.msg.js ：
 *
 *  easyui相关
 *  common/jquery-easyui-1.4/easyui.css
 *  common/jquery-easyui-1.4/icon.css
 *  common/jquery-easyui-1.4/jquery.easyui.min.js
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

(function(win){
    var arr = ['_toString', '_remove', '_removeByIndex', '_indexOf', '_max', '_min', '_push', '_distinct', '_sortASC'];
    for(var i = 0; i < arr.length ;i++){
        if(Array.prototype.hasOwnProperty(arr[i])){
            win.error('Utils.js ：Array 对象已含有' + arr[i] + '  属性, 使用请重载，以免冲突 ');
        }
    };
})(window);


Array.prototype._toString = function(a){
    if(a){
        return this.join(a);
    }else{
        return this.join('');
    }
};
//奇偶分组
Array.prototype.oddEve = function(){
   var odd = [] ,eve = [];
    //递归分组
    var pop = function (arr, a, b) {
        arr.length && a.push(arr.shift());
        arr.length && b.push(arr.shift());
        arr.length && pop(arr, a, b);
    }
    pop(arr, odd, eve);

    return {
        odd : odd,
        eve : eve
    };
};
//删除指定元素
Array.prototype._remove = function (obj){
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
            this.splice(i--, 1);
        }
    }
    return this;
};
//删除指定索引
Array.prototype._removeByIndex = function (index){
    this.splice(index, 1);
    return this;
};

Array.prototype._indexOf = function (obj) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] === obj) {
            return i;
        }
    };
    return -1;
};
//添加越界处理
Array.prototype._max = function(){
    var max = -Infinity;
    var QUANTUM = 32768;
    var submin;
    for (var i = 0, len = this.length; i < len; i += QUANTUM) {
        submin = Math.max.apply(null, this.slice(i, Math.min(i + QUANTUM, len)));
        max = Math.max(submin, max);
    }
    return max;
};

//添加越界处理
Array.prototype._min = function(){
    var min = Infinity;
    var QUANTUM = 32768;
    var submin;
    for (var i = 0, len = this.length; i < len; i += QUANTUM) {
        submin = Math.min.apply(null, this.slice(i, Math.min(i + QUANTUM, len)));
        min = Math.min(submin, min);
    }
    return min;
};
//把数组arr加到当前数组后
Array.prototype._push = function (arr){
    Array.prototype.push.apply(this, arr);
    return this;
};
//数组去重复
Array.prototype._distinct = function(){
    var temp = {};
    for (var i = 0; i < this.length; i++)
        temp[this[i]] = true;

    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
};

//正序排序
Array.prototype._sortASC = function(){
    var merge = function (left,right){
        var result=[];
        while(left.length > 0 && right.length > 0){
            if(left[0] < right[0])
                result.push(left.shift());
            else
                result.push(right.shift());
        }
        return result.concat(left).concat(right);
    };

    var mergeSort = function(items)
    {
        if(items.length==1)
        {
            return items;
        }
        var middle=Math.floor(items.length/2);
        var left=items.slice(0,middle);
        var right=items.slice(middle);
        return merge(mergeSort(left),mergeSort(right));
    }

    return mergeSort(this);
};

(function(win){
    var arr = ['_contains', 'Trim', 'isNull', 'isDigit', 'isNumber', 'isCurrency', 'isInteger', 'remove', 'removeBinEnd','replaceAll', 'delSpeStr', 'toArray'];
    for(var i = 0; i < arr.length ;i++){
        if(String.prototype.hasOwnProperty(arr[i])){
            win.console.error('Utils.js ：String 对象已含有' + arr[i] + '  属性, 使用请重载，以免冲突 ');
        }
    };
})(window);

//是否包含
String.prototype._contains = function (a) {
    return !!(~this.indexOf(a));
};
//去空格
String.prototype.Trim = function() {
    if(this != null && typeof(this) != 'undefined' && this.length > 0) {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
};
//功能:判断元素的值是否为空
String.prototype.isNull = function() {
    return (this == null || this.Trim() == '' || typeof(this) == 'undefined' || this.length == 0);
};
// 检查是否由数字组成
String.prototype.isDigit = function() {
    var s = this.Trim();
    return (s.replace(/\d/g, "").length == 0);
};
// 检查是否为数字
String.prototype.isNumber = function() {
    var s = this.Trim();
    return (s.search(/^[+-]?[0-9.]*$/) >= 0);
};
// 检查是否为货币格式
String.prototype.isCurrency = function() {
    var s = this.Trim();
    return (s.search(/^[0-9]+([.]\d{1,2})?$/) >= 0);
};
// 检查是否由整数
String.prototype.isInteger = function(){
    var s = this.Trim();
    var p = /^[-\+]?\d+$/;
    return p.test(s);
};
//删除指定位置的字符,指定个数字符
String.prototype.remove = function(start, length){
    var l = this.slice(0, start);
    var r = this.slice(start+length);
    return l+r;
};
//删除第一个和最后一个字符
String.prototype.removeBinEnd = function(){
    var str  = this.remove(0, 1);
    str = str.remove(str.length - 1, 1);
    return str;
};
String.prototype.replaceAll = function(str1, str2){
    if (this.isNull()) {
        return this;
    }
    return this.split(str1).join(str2);
}
//删除指定字符串
String.prototype.delSpeStr = function(a){
    return this.replaceAll(a,"");
};
String.prototype.toArray = function(a){
    var arr = [];
    if(this._contains(a)){
        arr = this.split(a);
    }else{
        arr.push(this);
    }
    return arr;
};


/****************************  Date bin ****************************/
Date.prototype.addHours = function(h){
    this.setHours(this.getHours() + h);
};

Date.prototype.addDays = function(d){
    this.setDate(this.getDate() + d);
};

Date.prototype.addWeeks = function(w){
    this.addDays(w * 7);
};

Date.prototype.addMonths= function(m){
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};

Date.prototype.addYears = function(year){
    return new Date(this.getFullYear() + year,this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
};
/****************************  Date end  ****************************/


/**
 * 得到当前时间 : yyyy-MM-dd HH:MM:SS
 * @returns {string}
 */
DateUtil.getNowFormatDate = function() {
    var param = DateUtil.getNowFormatDate.arguments[0];
    var date = new Date();
    if(param != null){
        date = param;
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    month = DateUtil.formatDateDouble(month);
    day = DateUtil.formatDateDouble(day);
    hours = DateUtil.formatDateDouble(hours);
    minutes = DateUtil.formatDateDouble(minutes);
    seconds = DateUtil.formatDateDouble(seconds);

    var currentdate = year + seperator1 + month + seperator1 + day
        + " " + hours + seperator2 + minutes
        + seperator2 + seconds;
    return currentdate;
}

/**
 * 格式化日期： 1 -> 01
 * @param time
 * @returns {*}
 */
DateUtil.formatDateDouble = function(time){
    if (time >= 0 && time <= 9) {
        time = "0" + time;
    }
    return time;
}

/**
 * 得到当前日期加减时间：例请两个月等
 * @param data : {year:1;month:1;day:1}
 * @returns {string}
 */
DateUtil.calculateDate = function calculateDate(data){
    var year = 0, month= 0, day = 0;
    if(data.year != null){
        year = data.year;
    }
    if(data.month != null){
        month = data.month;
    }
    if(data.day != null){
        day = data.day;
    }
    var date = new Date();
    date.addYears(year)
    date.addMonths(month);
    date.addDays(day);

    return DateUtil.getNowFormatDate(date).substring(0,10) + ' 00:00:00';
}
/**
 * 得到时间戳
 * @returns {number}
 */
DateUtil.getTimestamp = function (){
    var timestamp = Date.parse(new Date());
    return timestamp;
}

/****************************  DataUtil bin  ****************************/
/**
 * 检测各种具体是对象类型
 */
DataUtil.is ={types : ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"]}
for(var i = 0, c; c = DataUtil.is.types[i ++ ]; ){
    DataUtil.is[c] = (function(type){
        return function(obj){
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    })(c);
}

/**
 * 输入是否整数，清空非整数部分
 * id 可为object 或 string id1,id2,id3
 * @param id
 * @returns {boolean}
 */
DataUtil.isInt = function(id){
    var str = '';
    var obj = null;
    if(id != null && typeof(id) == 'object'){
        obj = id;
        str = id.value;
    }else{
        obj = document.getElementById(id);
        str = document.getElementById(id).value;
    }

    if(!str.isInteger()){
        var val = str.substring(0,str.length-1);
        obj.value = val;
        if(val.length > 0 && !val.isInteger()){
            DataUtil.isInt(id);
        }
        return false;
    }else{
        if(Math.floor(obj.value.Trim()) != '0'){
            obj.value = Math.floor(str.Trim());
        }
    }
    return true;
}

DataUtil.isDouble = function(id){
    var str = '';
    var obj = null;
    if(id != null && typeof(id) == 'object'){
        obj = id;
        str = id.value;
    }else{
        obj = document.getElementById(id);
        str = document.getElementById(id).value;
    }

    if(!str.isCurrency()){
        var val = str.substring(0,str.length-1);
        obj.value = val;
        if(val.length > 0 && !val.isInteger()){
            DataUtil.isDouble(id);
        }
        return false;
    }else{
        if(Math.floor(obj.value.Trim()) != '0'){
            obj.value = Math.floor(str.Trim());
        }
    }
    return true;
}

//批量 ids 可为对象的数组
DataUtil.attachEventByIds = function(ids,events,fun){
    try {
        if(DataUtil.is.Array(ids) ){
            for(var i=0;i<ids.length;i++){
                DataUtil.attachEventById(ids[i],events,fun);
            }
        }
        if(DataUtil.is.String(ids) && ids.indexOf(',') > -1){
            var arr = ids.split(',');
            for(var i=0;i<arr.length;i++){
                DataUtil.attachEventById(arr[i],events,fun);
            }
        }else{
            DataUtil.attachEventById(ids,events,fun);
        }
    } catch(e) {
        throw e;
    }
}

/**
 * 添加监听 id可为obj
 */
DataUtil.attachEventById = function(id,events,fun){
    try{
        var obj = null;
        if(id != null && typeof(id) == 'object'){
            obj = id;
        }else{
            obj = document.getElementById(id);
        }

        if(!obj){
            console.log('utils.DataUtil.attachEventById 报错: ' + id);
            return;
        }

        //绑定函数
        if(events.indexOf(',') > -1){
            var evs = events.split(',');
            for(var j=0;j<evs.length;j++){
                var eve = evs[j];
                if(typeof obj.attachEvent != 'undefined'){
                    // 为 IE 浏览器添加事件绑定
                    obj.attachEvent('on'+eve, function(){fun(id)});
                }else if( typeof obj.addEventListener != 'undefined'){
                    // 兼容 W3C 的事件绑定
                    obj.addEventListener(eve, function(){fun(id)}, true);
                }else{
                    console.log('DataUtil.attachEventById : 你用的浏览器都老掉牙了，换一个吧！');
                }
            }
        }else{
            if(typeof obj.attachEvent != 'undefined'){
                obj.attachEvent('on'+events, function(){fun(id)});
            }else if( typeof obj.addEventListener != 'undefined'){
                obj.addEventListener(events, function(){fun(id)}, true);
            }
        }
    }catch(e){
        throw e;
    }
}

/**
 * formatMoney(s,type)
 * 功能：金额按千位逗号分割
 * 参数：s，需要格式化的金额数值.
 * 参数：type,判断格式化后的金额是否需要小数位.
 * 返回：返回格式化后的数值字符串.
 */
DataUtil.formatMoney = function (s, type) {
    if (/[^0-9\.]/.test(s))
        return "0";
    if (s == null || s == "")
        return "0";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0 && s.contains('.')) {// 如果为0，返回整数部分
        s = s.split(".")[0];
    }
    s = s.replace('.00','');
    return s;
}

/**
 * aja 依赖jquery 根据url发送ajax请求
 * @param url
 * @param data : 参数
 * @param callBack ：回调函数
 */
DataUtil.getAjaxDatas = function (url,data,callBack){
    $.ajax(
        {
            type : "get",
            url:url,
            data:data,
            dataType : "json",
            timeout: 15000,
            beforeSend : FormUtil.progressStart(),
            error : function() {
                FormUtil.progressClose();
                FormUtil.toast('加载异常，网络服务不给力⊙﹏⊙!!!',1500);
                console.error('error 加载异常：' + url);
            },
            success:function(result){
                try{
                    FormUtil.progressClose();
                    callBack(result);
                }catch(e){
                    FormUtil.toast('加载数据异常 ⊙﹏⊙!!',1500);
                    console.error('success 加载异常：' + url);
                }
            },
            complete:function(e,t){
                FormUtil.progressClose();
                if(t && t == "timeout"){
                    FormUtil.toast('加载超时，网络服务不给力⊙﹏⊙!!',1500);
                    console.error('complete 加载异常：' + url);
                    callBack(t);
                }
            }
        }
    )
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
DataUtil.Map = function (){
    /** Map 大小 **/
    var size = 0;
    /** 对象 **/
    var entry = new Object();

    /** 存 **/
    this.put = function (key , value){
        if(!this.containsKey(key)){
            size ++ ;
        }
        entry[key] = value;
    }

    /** 取 **/
    this.get = function (key){
        if( this.containsKey(key) ){
            return entry[key];
        }
        else{
            return null;
        }
    }

    /** 删除 **/
    this.remove = function ( key ){
        if( delete entry[key] ){
            size --;
        }
    }

    /** 是否包含 Key **/
    this.containsKey = function ( key ){
        return (key in entry);
    }

    /** 是否包含 Value **/
    this.containsValue = function ( value ){
        for(var prop in entry){
            if(entry[prop] == value){
                return true;
            }
        }
        return false;
    }

    /** 所有 Value **/
    this.values = function (){
        var values = [];
        for(var prop in entry){
            values.push(entry[prop]);
        }
        return values;
    }

    /** 所有 Key **/
    this.keys = function (){
        var keys = [];
        for(var prop in entry){
            keys.push(prop);
        }
        return keys;
    }

    /** Map Size **/
    this.size = function (){
        return size;
    }

    /** 清空 Map **/
    this.clear = function (){
        entry = new Object();
    }

    /**  判断是否为空 **/
    this.isEmpty = function () {
        return size == 0 ? true : false;
    }
}

/**
 *  转码
 */
DataUtil.encodeURI = function(a){
    return encodeURI(encodeURI(a));
}

/****************************  DataUtil end  ****************************/


/****************************** checkbox bin ******************************/
/**
 * 单个初始化
 * @param id
 * @param ipt_id
 */
FormUtil.initCheckbox = function (id, ipt_id){
    var iptVal = document.getElementById(ipt_id).value;
    var obj = document.getElementById(id);
    if(iptVal == obj.value){
        obj.checked = true;
    }else{
        obj.checked = false;
    }
}

//checkbox设置input
function setCheckBoxVal(id,ipt_id,checked,unchecked){
    var obj = document.getElementById(id);
    if(obj.checked){
        document.getElementById(ipt_id).value = checked;
    }else{
        document.getElementById(ipt_id).value = unchecked;
    }
}
/**
 * 获取得到的所有checkbox值
 * @param checkbox_name
 * @returns {Array}
 */
FormUtil.getChecked = function(checkbox_name) {
    var arr = [];
    var obj = document.getElementsByName(checkbox_name);
    for(var i=0; i < obj.length; i ++){
        obj[i].checked && arr.push(obj[i]["id"]);
    }
    return arr;
}

/**
 * @param checkbox_name
 * @returns 例如得到 ‘grouponActivityDto.needGroupon=1&grouponActivityDto.needGroupon=1&’
 */
FormUtil.getCheckBoxStrByName = function(checkbox_name){
    var arr = '';
    var obj = document.getElementsByName(checkbox_name);
    for(var i=0; i < obj.length; i ++){
        var val = 0;
        if(obj[i].checked){
            val = 1;
        }
        if(i < obj.length - 1){
            arr += obj[i].id + '=' + val + '&';
        }else{
            arr += obj[i].id + '=' + val;
        }
    }
    return arr;
}


/**
 * 批量赋值
 * @param Json
 */
FormUtil.vals = function(Json){
    try{
        for(var id in Json){
            var obj = $('#' + id);
            var clas = obj.attr('class');
            if(clas.indexOf('textbox') > -1){
                obj.textbox('setValue', Json[id]);
            }else if(clas.indexOf('datebox') > -1){
                obj.datebox('setValue', Json[id]);
            }else if(clas.indexOf('numberbox') > -1){
                obj.numberbox('setValue', Json[id]);
            }else if(clas.indexOf('combobox') > -1){
                obj.combobox('setValue', Json[id]);
            }else{
                obj.val(Json[id]);
            }
        }
    }catch(e){
        console.error('FormUtil.vals 方法异常：' + JSON.stringify(Json));
    }
}
/****************************** checkbox end ******************************/
/****************************** 根据传参批量设置 bin ******************************/
/**	type:
 hide - 隐藏
 show - 显示
 readOnly - 只读
 read - 可读
 disabled - 不可用
 able - 可用
 */
FormUtil.setAbles = function (ids, type){
    if(type == 'hide'){
        setHidShow(ids,'hide');
    }else if(type == 'show'){
        setHidShow(ids,'show');
    }else if(type == 'readOnly'){
        setReadOnly(ids,'readOnly');
    }else if(type == 'read'){
        setReadOnly(ids,'read')
    }else if(type == 'disabled'){
        setAbleDis(ids,'disabled');
    }else if(type == 'able'){
        setAbleDis(ids,'able');
    }else{
        console.log('FormUtil.setAbles 参数错误,批量设置，请输入正确的类型');
    }
}

//隐藏，显示
function setHidShow(ids,type){
    var key = ids.indexOf(',');
    if(type == 'hide'){
        if(key > -1){
            var arr = ids.split(',');
            for(i=0;i<arr.length;i++){
                document.getElementById(arr[i]).style.display = 'none';
            }
        }else{
            document.getElementById(ids).style.display = 'none';
        }
    }else if(type == 'show'){
        if(key > -1){
            var arr = ids.split(',');
            for(i=0;i<arr.length;i++){
                document.getElementById(arr[i]).style.display = '';
            }
        }else{
            document.getElementById(ids).style.display = '';
        }
    }
}
//隐藏，显示
function setReadOnly(ids,type){
    var key = ids.indexOf(',');
    if(type == 'readOnly'){
        if(key > -1){
            var arr = ids.split(',');
            for(i=0;i<arr.length;i++){
                document.getElementById(arr[i]).readOnly = true;
            }
        }else{
            document.getElementById(ids).readOnly = true;
        }
    }else if(type == 'read'){
        if(key > -1){
            var arr = ids.split(',');
            for(i=0;i<arr.length;i++){
                document.getElementById(arr[i]).readOnly = false;
            }
        }else{
            document.getElementById(ids).readOnly = false;
        }
    }
}
//可用不可用
function setAbleDis(ids,type){
    var key = ids.indexOf(',');
    //普通元素
    if(type == 'disabled'){
        if(key > -1){
            var arr = ids.split(',');
            for(i=0;i<arr.length;i++){
                if(FormUtil.setAbleDisEasyUI(arr[i], 'disable')){  //esayui元素
                    document.getElementById(arr[i]).disabled = true;
                }
            }
        }else{
            if(FormUtil.setAbleDisEasyUI(ids, 'disable')){  //esayui元素
                document.getElementById(ids).disabled = true;
            }
        }
    }else if(type == 'able'){
        if(key > -1){
            var arr = ids.split(',');
            for(i=0;i<arr.length;i++){
                if(FormUtil.setAbleDisEasyUI(arr[i], 'enable')){     //esayui元素
                    document.getElementById(arr[i]).disabled = false;
                }
            }
        }else{
            if(FormUtil.setAbleDisEasyUI(ids, 'enable')) {  //esayui元素
                document.getElementById(ids).disabled = false;
            }
        }
    }
}
/**
 *
 * @param id
 * @param type : disable ， enable
 */
FormUtil.setAbleDisEasyUI = function(id, type){
    var obj = $('#' + id);
    var clas = obj.attr('class');
    if(clas.indexOf('textbox') > -1){
        obj.textbox(type);
        return false;
    }else if(clas.indexOf('numberbox') > -1){
        obj.numberbox(type);
        return false;
    }
    return true;
}
/****************************** 根据传参批量设置 end ******************************/
/**
 * 得到name对应的对象
 * @param name
 */
FormUtil.getElementByName = function(name){
    var obj = document.getElementsByName(name);
    if(obj){
        return obj;
    }else{
        return null;
    }
}

/**
 * easyui的combobox扩展默认选择第一行 依赖jquery
 */
FormUtil.JqueryExtend = function() {
    $.extend($.fn.combobox.methods, {
        selectedIndex: function (jq, index) {
            if (!index) {
                index = 0;
            }
            $(jq).combobox({
                onLoadSuccess: function () {
                    var opt = $(jq).combobox('options');
                    var data = $(jq).combobox('getData');

                    for (var i = 0; i < data.length; i++) {
                        if (i == index) {
                            $(jq).combobox('setValue', eval('data[index].' + opt.valueField));
                            break;
                        }
                    }
                }
            });
        }
    });
};
/**
 * 初始化select控件
 * var data = [{"id":"50","name":"50"},{"id":"100","name":"100"}];
 * var obj = {'id' : id, 'width' : 100 , 'height': 50, 'editable' : true, 'data' : data, 'value' : 50 }
 */
FormUtil.initSelect = function(obj){
    $('#' + obj.id).combobox({
        width:obj.width,
        panelHeight:obj.height,
        valueField:'id',
        textField:'name',
        editable:true,
        value:obj.value,
        data:obj.data,
        onSelect:function(data){
            //设置input值，方便form serialize值
            $('#' + obj.id).val(data.id);
        }
    });
};

/**
 * 三级联动select通用方法
 * @param id1
 * @param id2
 * @param id3
 * @param url1
 * @param url2
 * @param url3
 */
FormUtil.initThreeCombobox = function(id1,id2,id3,url1,url2,url3){
    //一级分类
    var provinceId = $('#' + id1).combobox({
        width:150,
        panelHeight:150,
        url:url1,
        editable:false,
        valueField:'id',
        textField:'name',
        onSelect:function(record){
            $('#' + id1).val(record.id);
            //刷新数据，重新读取省份下的城市，并清空当前输入的值
            cityId.combobox({
                disabled:false,
                url:url2 + record.id,
                valueField:'id',
                textField:'name'
            }).combobox('clear');
        }
    });
    provinceId.combobox('selectedIndex', 0);
    //二级分类
    var cityId = $('#'+ id2).combobox({
        width:150,
        //panelHeight:80,
        disabled:false,
        url:url3 + provinceId.val(),
        valueField:'id',
        textField:'name',
        onSelect:function(record){
            $('#' + id2).val(record.id);
            //刷新数据，重新读取省份下的城市，并清空当前输入的值
            eareId.combobox({
                disabled:false,
                url:url3 + record.id,
                valueField:'id',
                textField:'name'
            }).combobox('clear');
        }

    });
    cityId.combobox('selectedIndex', 0);
    var eareId = $('#' + id3).combobox({
        width:150,
        //panelHeight:80,
        disabled:false,
        url:url3 + cityId.val(),
        valueField:'id',
        textField:'name',
        onSelect:function(record){
            //设置input值，方便form serialize值
            $('#' + id3).val(record.id);
        }

    });
    eareId.combobox('selectedIndex', 0);
}


/**
 * Highchart 的柱状图 依赖jquery bin
 * var data = {'id': 'hotSele_div','title':'热销省份','subtitle':'团购智能化运营','subtitle':'www.yhd.com','yAxis_title': '元','brandsData':brandsData,'headerFormat': '销售额'};
 * @param data
 */
FormUtil.createBarChart = function (data){
    $('#' + data.id).window('open'); //弹出window
    //画图
    $('#' + data.id).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: data.title
        },
        subtitle: {
            text: data.subtitle
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: data.yAxis_title
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}'
                }
            }
        },
        credits: {//右下角的文本
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">'+ data.headerFormat + '</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
        },

        series: [{
            name: '',
            colorByPoint: true,
            data: data.brandsData
        }]
    });
}
/**
 * 画折线图
 * @param obj : {'id' : 'price_div', 'title' : title, 'times' : times, 'muns' : muns};
 */
FormUtil.createLineChart = function(obj){
    var price_div = obj.id;
    $('#' + price_div).window('open'); //弹出window,图形画在弹出框
    $('#' + price_div).highcharts({
        title: {//走势图标题
            text: obj.title,
            x: 20
            //style:{display:"none"}可隐藏
        },
        subtitle: {//走势图来源
            text: 'Source: www.xwcms.net',
            x: 20,
            style:{display:"none"}//可隐藏
        },
        xAxis: {//X轴分类
            //name: '日期',
            categories: obj.times
            //categories: ['2013-11-06', '2013-11-07', '2013-11-08', '2013-11-09', '2013-11-10']
        },
        yAxis: {//Y轴会根据series的data数值自动分格并划分上下限
            title: {
                text: '元'//Y轴表示的文本
                //style:{display:"none"}可隐藏
            },

            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '(元)',//数据的后辍
            crosshairs: true
        },
        legend:{//线条所表示的品种分类
            enabled:0,//0为隐藏1为显示
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        credits:{//制作人；可作为本站水印
            text:"www.yhd.com",
            href:"http://www.yhd.com",
            position:{x:-250,y:-180},
            style:{"z-index":"999"}
        },
        series: [{//可以为多个品种
            name: '价格',
            data: obj.muns
            //data:    [4200, 4300, 4400, 4350, 4550]
        }]
    });
}
/**
 * 打开一个全屏的window,全屏显示
 * @param url
 */
FormUtil.OpenfullScreenWindow = function(url,title){
    newwindow = window.open("",title,"fullscreen=1,location=0");
    if (document.all){
        newwindow.moveTo(0,0)
        newwindow.resizeTo(screen.width,screen.height);
    }
    newwindow.location = url;
};

/**
 * 被 FormUtil.alert 调用
 */
FormUtil.alertDiv = function (content) {
    var div = '<div id=\"FormUtil_alertDiv\" class=\"panel window messager-window\" style=\"display: block;  z-index: 9012;  margin-left: 0 ; bottom: 0; position: relative\">'
        + '<div class=\"panel-header panel-header-noborder window-header\" style=\"width: 288px;\">'
        + '<div class=\"panel-title22\">提示</div>'
        + '<div class=\"panel-tool\">'
        + '</div>'
        + '</div>'
        + '<div class=\"messager-body panel-body panel-body-noborder window-body\" title=\"\" style=\"width: 266px;\">'
        + '<div>' + content + '</div>'
        + '<div style=\"clear:both;\"></div>'
        + '<div class=\"messager-button\">'
        + '<a href=\"javascript:void(0)\" class=\"l-btn l-btn-small\" group=\"\" id=\"formUtil_alert\" style=\"margin-left: 10px;\">'
        + '<span class=\"l-btn-left\"><span class=\"l-btn-text\">确定</span></span></a>'
        + '</div>'
        + '</div>'
        + '</div>';
    return div;
};

/**
 * 被 FormUtil.toast 调用
 */
FormUtil.msgDiv = function (content, zIndex) {
    var div = '<div id=\"FormUtil_msgDiv\" class=\"panel window messager-window\" style=\"display: block;  z-index: ' + zIndex + ';  margin-left: 0 ; bottom: 0; position: relative\">'
        +   '<div class=\"panel-header panel-header-noborder window-header\" style=\"width: 288px;\">'
        +       '<div class=\"panel-title22\">提示</div>'
        +   '<div class=\"panel-tool\">'
        +   '</div>'
        +   '</div>'
        +       '<div class=\"messager-body panel-body panel-body-noborder window-body\" title=\"\" style=\"width: 266px;\">'
        +       '<div>' + content + '</div>'
        +       '<div style=\"clear:both;\"></div>'
        +   '</div>'
        + '</div>';
    return div;
}

/**
 * 提示框，自动关闭,一次执行一个提示
 * 参数1：内容
 * 参数2：时间
 */
FormUtil.toast = function () {
    var div = $('#FormUtil_msgDiv')[0];
    if(div){
        return;
    }
    var content = '';
    var fadeOut = 600;
    var arr = [];
    var numargs = arguments.length;
    switch (numargs) {
        case 1 :
            content = arguments[0];
            break;
        case 2 :
            content = arguments[0];
            fadeOut = arguments[1];
            break;
    }
    if (numargs > 2) {
        content = arguments[0];
        fadeOut = arguments[1];
    }
    //var zIndex = this.getMaxZIndex() + 1;
    var msg = FormUtil.msgDiv(content, 9900);
    $.msg({
        fadeIn: 200,
        fadeOut: fadeOut,
        timeOut: 1000,
        klass: 'white-on-black',
        autoUnblock: true,
        clickUnblock: true,
        content: msg
    });
};

/**
 * 定制的alert
 */
FormUtil.alert = function (msg) {
    var div = $('#FormUtil_alertDiv')[0];
    if(div){
        $.messager.alert('提示',msg);
        return;
    }
    var content = FormUtil.alertDiv(msg);
    $.msg({
        autoUnblock: false,
        clickUnblock: false,
        klass: 'white-on-black',
        content: content,
        afterBlock: function () {
            var self = this;
            $('#formUtil_alert').bind('click', function () {
                self.unblock();
            });
        }
    });
};

/**
 * 开启数据加载滚动样式
 */
FormUtil.progressStart = function(){
    var win = $.messager.progress({
        title:'',
        //msg:'Loading data11...',
        text:'数据加载中,请稍候...',
        interval:200
    });
};
/**
 * 关闭
 */
FormUtil.progressClose = function(){
    $.messager.progress('close');
};

/**
 * 设置元素无边框
 * @param id
 */
FormUtil.noBorder = function(id){
    var arr = id.toArray(',');
    $.each(arr, function(index,eid){
        $('#' + eid).css({'background-color':'transparent','border': '0px'});
    });
    return this;
};

/**
 * 设置宽，高
 * @param id
 */
FormUtil.setWidHeght = function(id, width, height){
    var arr = id.toArray(',');
    $.each(arr, function(index,eid){
        $('#' + eid).width(width).height(height);
    });
    return this;
};

/**
 * 得到元素的高宽 （图片等）
 * @param url
 */
FormUtil.getImgWH = function(id){
    var obj = $("#" + id);
    if(!obj){
        console.log('FormUtil.getImgWH : ' + id + '  元素未找到!');
    }

    FormUtil.wh = {
        width  : obj.width(),
        height : obj.height()
    };
    return this;
};

/**
 * 获取radio选中值
 * @param name
 * @returns {FormUtil}
 */
FormUtil.getRadio = function(name){
    FormUtil.radio = {
        value  :  $("input[name="+ name + "]:checked").val()
    };
    return this;
};
/**
 * 监听：赋值radio选中值给id的元素
 * @param name
 * @param id
 */
FormUtil.setValByRadio = function(name, id){
    $("input[name='" + name + "']").bind('click',function(){
        $('#' + id).val($("input[name="+ name + "]:checked").val());
    });
    return this;
};
/**
 * 根据val设置勾选
 * @param id
 * @param name
 */
FormUtil.initRadioByVal = function(name, id){
    var val = document.getElementById(id).value;
    $("input[name='" + name + "']").each(function(){
        if(this.value == val){
            this.checked = true;
        }
    });
    return this;
};

/**
 * 得到iframe 父页面Jquery对象
 * @param param
 * @returns {*|jQuery|HTMLElement}
 */
FormUtil.$parent = function(param){
    return $(param, parent.document);
};

/**
 * 获取图片原始大小
 * @param id
 */
FormUtil.getImgSize = function(id, url){
    var newImg = new Image();
    if(url){
        newImg.src = url;
    }else{
        var obj =  $("#" + id);
        newImg.src = obj.attr('src');

    };

    newImg.onload = function (){
        return {
            width  : newImg.width,
            height : newImg.height
        };
    }
};

/**
 * 设置一个遮罩层
 */
FormUtil.showOverlay = function(type){
    if(!$('#FormUtil_showOverlay')[0]){
        var obj = $('<div id=\"FormUtil_showOverlay\"></div>').appendTo('body').css({
            'position' : 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'z-index': '9002',
            'background': '#000',
            'opacity': '0.5',
            'display': 'none'
        });
    };

    switch(type){
        case 'show' : $('#FormUtil_showOverlay').css('display', 'block');
            break;
        case 'hide' : $('#FormUtil_showOverlay').css('display', 'none');
            break;
    };
};

/**
 * 复制内容到剪贴板
 * 依赖 ZeroClipboard.js， ZeroClipboard.swf
 * @returns {FormUtil}
 */
FormUtil.copy2Clipboard = function (content, id){
    if(!FormUtil.clip){
        FormUtil.clip = new ZeroClipboard.Client();
    };
    FormUtil.clip.setText(content);
    FormUtil.clip.glue(id);
    return this;
};
/**
 * 对象自适应
 */
FormUtil.resize = function(){
    //window.addEventListener('resize', recalcOffsetValues, false);
};


/**
 * 创建圆角DIV提示框
 * 依赖 jquery 和 jquery.corner.js
 * @param params
 * var css = { position:'relative', top : 100, left : 100, width:'350px', height:'200px', 'background-color': '#6af', 'text-align':'center', 'vertical-align': 'middle', display: 'table-cell'};
 * var params = {css : css, text : 'text'};
 */
FormUtil.toollip = function (params){

    var obj = null, objects = [];

    this.create = function (){
        obj = $('<div></div>').prependTo('body').css(params.css).html(params.text).corner(),
            this.addObject();
        return this;
    }

    this.addObject =  function (){
        if(obj){
            objects.push(obj);
        }
    };

    this.remove = function(obj){
        if(objects.length > 0){
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] === obj) {
                    objects.splice(i--, 1);
                    break;
                }
            }
        }
    };

    this.removeAll = function (){
        obj.remove();
        $.each(objects, function(i, item){
            item.remove();;
        });
        objects = [];
    };

    this.fadeOut = function(time){
        obj = null;
        $.each(objects, function(i, item){
            item.fadeOut(time);
        });
        objects = [];
    };

    this.move = function(x, y){
        if(obj){
            obj.css({
                top         :   y,
                left        :   x
            });
        }
    };

    this.getObj = function(){
        return obj;
    }

    return this;

};

/**
 * 得到当前页面的最大z-index
 * @returns {Number|*}
 */
FormUtil.getMaxZIndex = function(){
    // 负无穷大
    var highest = -Infinity;
    $("*").each(function() {
        var current = parseInt($(this).css("z-index"), 10);
        if(current && highest < current){
            highest = current;
        };
    });
    return highest;
};