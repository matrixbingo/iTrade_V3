 var oldUrl = $(".url").val();
 var url = "../fileCloud/upload/file";
 var nut = $(".nut").val();
 var sign = $(".sign").val();
 var defaultOpt = {
    el:$("#picture-container"),
    edit:false,
    progress: false
 };
 var _mix = function (receiver, supplier) {
  var c;
  for (c in supplier) {
    receiver[c] = supplier[c];
  }
  return receiver;
};

var transform = function ($el, deg, times){
    $el.css("-webkit-transform", 'scale('+ times + ',' + times +')' + ' ' + 'rotate('+ deg + 'deg)');
    $el.css("-moz-transform", 'scale('+ times + ',' + times +')' + ' ' + 'rotate('+ deg + 'deg)');
    $el.css("transform", 'scale('+ times + ',' + times +')' + ' ' + 'rotate('+ deg + 'deg)');
};

var getWinHeight = function() {
     //reference: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
     return window.innerHeight || document.documentElement.clientHeight;
 };


var getWinWidth = function() {
     return window.innerWidth || document.documentElement.clientWidth;
 };

var getWidth = function($el){
     return $el.width();
 };

var getHeight = function($el){
     return $el.height();
 };


 function Picture (opt) {
     this.opt = _mix(defaultOpt, opt);
     this.init();
 }

Picture.prototype.resetProgress = function () {
    var _this = this;
   _this.$progress.css('width', '0%');
};

Picture.prototype.uploadProgress = function () {
    var _this = this;
    var precentage = 0;
    precentage = (_this.counter/_this.len) * 100 + "%";
    _this.$progress.css('width', precentage);
};

 Picture.prototype.createPopbox = function () {
    var _this = this;
     var liNode = document.createElement("li");
     var imgNode = document.createElement("img");
     var closeNode = document.createElement("i");
     var roateNode = document.createElement("i");
     var removeNode = document.createElement("i");
     var zoomInNode = document.createElement("i");
     var zoomOutNode = document.createElement("i");
     var divNode = document.createElement('div');
     liNode.appendChild(imgNode);
     $(imgNode).addClass('image');
     $(liNode).addClass('pop-box Hide');
     $(closeNode).addClass('close-btn glyphicon glyphicon-remove');
     $(roateNode).addClass('rotate glyphicon glyphicon-repeat');
     $(removeNode).addClass('remove glyphicon glyphicon-trash');
     $(zoomInNode).addClass('zoom-in glyphicon glyphicon-zoom-in');
     $(zoomOutNode).addClass('zoom-out glyphicon glyphicon-zoom-out');
     $(divNode).addClass('control-picture');
     divNode.appendChild(roateNode);
     divNode.appendChild(zoomInNode);
     divNode.appendChild(zoomOutNode);
     _this.edit && divNode.appendChild(removeNode);
    divNode.appendChild(closeNode);
     liNode.appendChild(divNode);
     _this.el.append(liNode);
};

 Picture.prototype.showPopbox = function () {
    var _this = this;
    var $li = _this.$CurLi;
    var fileId = $li.attr("fileId");
    var imgNode = _this.$popBox.find('img')[0];
    var thumbUrl = $li.attr("data-url");
    imgNode.src = thumbUrl;

     $li.attr("data-fileId", fileId);
     _this.$mask.removeClass("Hide");
     _this.$popBox.removeClass('Hide');
    _this.setCenter(_this.$popImg);
};

 Picture.prototype.bindEvent = function () {
     var _this = this;
     _this.$file.on('click', function () {
        _this.progress && _this.resetProgress();
     });
     _this.$file.on('change', function () {
         _this.change();
     });
     _this.$imageList.on("click", "li", function () {
         var $li = $(this);
         _this.$CurLi = $li;
         _this.showPopbox();
         return;
     });

     //只有可编辑的时候才能删除图片，不可编辑只能查看
     if (_this.edit) {
         _this.$popBox.on('click', '.remove', function () {
             _this.$popBox.addClass('Hide');
             _this.$mask.addClass("Hide");
             var fileId = _this.$CurLi.attr("data-fileid");
             _this.$CurLi.remove();
             _this.attachments = _.filter(_this.attachments, function(attach){
                     return attach.fileId  !== fileId; }
             );
             _this.$file.val("");
             return false;
         });
     }

     _this.$popBox.on('click', '.rotate', function () {
        _this.deg += 90;
        if (360 == _this.deg) {
            _this.deg = 0;
        }
        transform(_this.$popImg, _this.deg, _this.times);
         return false;
     });

     _this.$popBox.on('click', '.close-btn', function () {
         _this.$popBox.addClass('Hide');
         _this.$mask.addClass("Hide");
         return false;
     });

     _this.$popBox.on('click', '.zoom-out', function () {
        _this.times = _this.times == 0.5 ? 0.5: _this.times - 0.5;
        transform(_this.$popImg,_this.deg,_this.times);
        _this.setCenter(_this.$popImg);
        return false;
     });

      _this.$popBox.on('click', '.zoom-in', function () {
        _this.times = _this.times == 10 ? 10 : _this.times + 0.5;
        transform(_this.$popImg,_this.deg,_this.times);
        _this.setCenter(_this.$popImg);
        return false;
     });
     // _this.$popBox.on('click', function () {
     //     _this.$popBox.addClass('Hide');
     //     _this.$mask.addClass("Hide");
     //     return false;
     // });
 };

 Picture.prototype.setCenter = function($el){
     var top = (getWinHeight() - getHeight($el))/2;
     var left = (getWinWidth() - getWidth($el))/2;
     if (top < 0) {
        top = 10;
     }
     $el.css({"top":top + 'px', "left":left + 'px'});
 };

 Picture.prototype.html5Reader = function (file) {
     var _this = this;
     var files = file.files;
     _this.len = files.length;
     _this.counter = 0;
     _.each(files, _.bind(function(file, index){
         var reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = function(e){
             // _this.uploadCloud(this.result);
             _this.uploadFile(this.result);
         };
     },_this));
 };

 Picture.prototype.change = function () {
     var _this = this;
     var pic = document.getElementById("preview");
     var file = this.$file[0];
     var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
     // gif在IE浏览器暂时无法显示
     if(ext!='png'&&ext!='jpg'&&ext!='jpeg'){
         alert("文件必须为图片！"); return;
     }
     // IE浏览器
     if (document.all) {

         file.select();
         var reallocalpath = document.selection.createRange().text;
         var ie6 = /msie 6/i.test(navigator.userAgent);
         // IE6浏览器设置img的src为本地路径可以直接显示图片
         if (ie6) pic.src = reallocalpath;
         else {
             // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
             pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
             // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
             pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
         }
     }else{
         _this.html5Reader(file);
     }
 };

Picture.prototype.renderItem = function (item) {
    var _this = this;
    var liNode = document.createElement("li");
    var imgNode = document.createElement("img");
    imgNode.src = item.thumbUrl;
    liNode.appendChild(imgNode);
    $(liNode).attr("data-fileId", item.fileId);
    $(liNode).attr("data-url", item.url);
    _this.$imageList.append(liNode);
    _this.attachments.push({fileId:item.fileId});
};

Picture.prototype.render = function (data) {
    var _this = this;
    _.each(data, function (item) {
        _this.counter += 1;
        if (!_.findWhere(_this.attachments, {fileId:item.fileId})){
            _this.renderItem(item);
        }else {
            console.log('图片已存在!');
        }
        _this.progress && _this.uploadProgress();
    });
};

Picture.prototype.uploadFile = function (src) {
     var fileBase64 = src.split(",")[1]
     var _this = this;
     var data = [{
         base64: fileBase64
     }];
     $.ajax({
         type: "POST",
         url: url,
         data: JSON.stringify({data:data}),
         dataType: "json",
         contentType: "application/json",
         success: function(data){
             if (200 == data.code && data.msg.attachments && data.msg.attachments.length) {
                _this.render(data.msg.attachments);
             }
         },
         error: function(err){
             console.log(err);
         }
     });
};
 Picture.prototype.uploadCloud = function (src) {
     var fileBase64 = src.split(",")[1]
     var _this = this;
     var data = {
         nut: nut,
         sign: sign,
         fileBase64: fileBase64
     };
     $.ajax({
         type: "POST",
         url: oldUrl,
         data: data,
         dataType: "json",
         success: function(data){
             var fileId = data.key;
             if (200 == data.code && !_.findWhere(_this.attachments, {fileId:fileId})) {
                 var liNode = document.createElement("li");
                 var imgNode = document.createElement("img");
                 imgNode.src = src;
                 liNode.appendChild(imgNode);
                 $(liNode).attr("data-fileId", fileId);
                 _this.$imageList.append(liNode);
                 _this.attachments.push({fileId:fileId});
             }else {
                 alert('图片已存在!');
             }
         },
         error: function(err){
             console.log(err);
         }
     });
 };

 Picture.prototype.cache = function () {
     var _this = this;
     _this.edit = _this.opt.edit;
     _this.progress = _this.opt.progress;
     _this.$file = _this.el.find('#f');
     _this.$imageList = this.el.find(".images-list");
     _this.$progress = _this.progress?this.el.find('.progress-bar'):[];
     _this.attachments = _this.getAttachments() || [];
     _this.$mask = _this.el.find('.mask');
       _this.createPopbox();
     _this.$popBox = _this.el.find('.pop-box');
     _this.$popImg = $(_this.el.find('.pop-box').find('.image'));
      !_this.edit && _this.el.find('form').css('display','none');
      _this.deg = 0;
      _this.times = 1;
 };

 Picture.prototype.init = function () {
     var _this = this;
      _this.el = _this.opt.el;
     var divNode = document.createElement("div");
     $(divNode).addClass('mask Hide');
     _this.el.append(divNode);
      _this.cache();
      _this.bindEvent();
 };

 Picture.prototype.getAttachments = function () {
    var _this = this;
    var $lis = _this.$imageList.find("li");
    var fileId = "";
    _this.attachments = [];
    $lis.length &&  _.each($lis, function(li) {
        fileId = $(li).attr('data-fileId');
        _this.attachments.push({fileId:fileId});
    });
    return _this.attachments;
 };

 Picture.prototype.showView = function(attachs){
     var _this = this;
     _this.attachments = attachs;
     _.each(attachs, function(attach) {
         var liNode = document.createElement("li");
         var imgNode = document.createElement("img");
         imgNode.src = attach.thumbUrl;
         $(liNode).attr("data-fileId", attach.fileId);
         liNode.appendChild(imgNode);
         _this.$imageList.append(liNode);
     });
 };

