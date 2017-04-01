/*
 * 头部区域（包含回退按钮，标题，图片）
 * 技术研发部---移动终端开发部 齐晓凯 创建日期：2013-12-5
 */
function buildBlueHeader(id,$container){
    if(!id){
        id = "";
    }
    var headerClass = "ui-gw-header ";
    var titleHeight = 46;
    if(platform == "ios" ){
        var versionNum = platformVersion.split(".")[0];
        if(versionNum >= 7){
            headerClass += "ui-gw-header-iPhone";
            titleHeight = 66;
        }
    }
    var html = '<div id="'+ id +'" class="'+ headerClass +'">';
    html += '</div>';
    if($container){
        var oldHeight =  $container.height();
        //如果指定容器，则改变容器内容
        $container.css("height", ''+ (oldHeight-titleHeight) + "px");
        $container.before(html);
    }else {
        var oldHeight =  $("#gw-mobile-content").height();
        //没指定容器的话，
        $("#gw-mobile-content").css("height", ''+ (oldHeight-titleHeight) + "px");
        $("#gw-mobile-content").before(html);
    }
}