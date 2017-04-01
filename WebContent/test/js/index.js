$(function () {

    var initImageView = function () {

        var mainImgPanel = $(".mouseWheelButtons .carousel");
        var customerImgPanel = $(document).find('.sub-thumbnails-img');

        var index = 0;
        var carouselImages = [];
        mainImgPanel.find('.img-file').each(function () {
            var image = $(this).find('img');
            var imageSrc = image.attr('data-normal-src');
            var imageThumbnailSrc = image.attr('src');
            var imageLable = image.attr('alt');
            carouselImages.push({
                title: imageLable,
                href: imageSrc,
                type: 'image/jpeg',
                thumbnail: imageThumbnailSrc
            });
        });
        customerImgPanel.find('.img-file').each(function () {
            var image = $(this).find('img');
            var imageSrc = image.attr('data-normal-src');
            var imageThumbnailSrc = image.attr('src');
            var imageLable = image.attr('alt');
            carouselImages.push({
                title: imageLable,
                href: imageSrc,
                type: 'image/jpeg',
                thumbnail: imageThumbnailSrc
            });
        });
        if (carouselImages.length == 0) {
            var mainView = $(document).find('.main-image-view');
            if ($(document).find('.license-img-view')) {
                $(document).find('.license-img-view').empty();
            }
            if ($(document).find('.customer-license-panel')) {
                $(document).find('.customer-license-panel').empty();
            }
            mainView.empty();
            var nullImage = $('<p>').css('margin', '0 auto').css('text-align', 'center').append('无相关图片附件');
            mainView.append(nullImage);
        }
        else {

            mainImgGallery = blueimp.Gallery(carouselImages, {
                container: '#blueimp-gallery-carousel',
                closeOnSlideClick: false,
                carousel: true,
                slideshowInterval: 1000000000,
                onslideend: function (index, slide) {
                    var licenseTypePanel = $(document).find('.show-license-type');
                    licenseTypePanel.empty();
                    var currentTitle = findSelectedImgAlert(index);
                    licenseTypePanel.append(currentTitle);
                    deleteZoomImg();
                    var panel = slide;
                    $(panel).addClass("zoom");
                    $(panel).zoom();
                    showSelectedImgInfo(index);
                    recoverRotateImg();
                }
            });

            fullScreenGallery = blueimp.Gallery(carouselImages, {
                container: '#full-screen-list',
                closeOnSlideClick: false,
                closeOnEscape: false,
                carousel: true,
                slideshowInterval: 1000000000
            });

            var imageButtons = $('<div>').addClass('image-button-group btn-group button-group');
            //var fullImageButton = $('<button>').addClass('btn btn-default full-image').append("全屏");
            //var rotateImageButton = $('<button>').addClass('btn btn-default rotate-image').append("旋转");
            //imageButtons.append(fullImageButton);
            //imageButtons.append(rotateImageButton);
            var imageButtonControls = $('<div>').addClass('image-button-show-view').append(imageButtons);
            $(document).find('.main-image-view').append(imageButtonControls);
            $(document).find('#full-screen-list').css('display', 'none');

            var closeFullPanel = $('<div>').addClass('close-full-screen').css('display', 'none');
            var closeFullButton = $('<button>').addClass('btn btn-default close-full').append('关闭全屏');
            closeFullPanel.append(closeFullButton);

            $(document).find('#full-screen-list').append(closeFullPanel);

            if ($('.main-thumbnails-img').find('.img-file')) {
                var firstImgDiv = $('.main-thumbnails-img').find('.img-file').first();
                showLicenseInfo(firstImgDiv.find('img'));
            }
            else if ($('.sub-thumbnails-img').find('.img-file')) {
                var firstImgDiv = $('.sub-thumbnails-img').find('.img-file').first();
                showLicenseInfo(firstImgDiv.find('img'));
            }
        }

    }

    var deleteZoomImg = function () {
        $('#blueimp-gallery-carousel').find('.slide').removeClass('zoom');
        $('#blueimp-gallery-carousel').find('.slide').find('.zoomImg').remove();
    }

    var showLicenseInfo = function (currentImg) {
        var modelType = currentImg.attr('data-modal-type');
        var licensePanel = $(document).find('.license-panel');
        licensePanel.empty();
        if (modelType == "license") {
            var licenseId = currentImg.attr('data-license-id');
            var licenseType = currentImg.attr('data-license-type');
            var specialApproval = currentImg.attr('data-special-approval');
            var specialApprovalUser = currentImg.attr('data-special-approval-by');
            var structureInfo = currentImg.attr('data-structure-info');
            var imageIdentical = currentImg.attr('data-image-identical');
            var structureInfoItems = structureInfo.split('|');

            var basedRow = $('<div>').addClass('row');
            var basedInfoParentCell = $('<div>').addClass('col-md-12');
            var specialApprovalCell = $('<div>').addClass('col-md-6').append('<input type="checkbox" ' + specialApproval + ' disabled>' + '是否特批');
            var approvalUserCell = $('<div>').addClass('col-md-6').append('特批人：' + specialApprovalUser);

            $('.show-license-special-approval').empty();
            if (specialApproval == "checked") {
                $('.show-license-special-approval').append('特批' + "&nbsp;&nbsp;" + '特批人：' + specialApprovalUser).addClass();
            }
            basedInfoParentCell.append(specialApprovalCell).append(approvalUserCell);
            basedRow.append(basedInfoParentCell);

            var leftList = $('<ul>');
            var rightList = $('<ul>');
            for (var i = 0; i < structureInfoItems.length; i = i + 2) {
                var leftInfoItem = structureInfoItems[i];
                var leftKeyValue = leftInfoItem.split(':');
                var leftTitleName = leftKeyValue[0];
                var leftValue = leftKeyValue[1];
                var leftInfoCell = $('<li>').append(leftTitleName + '：' + leftValue);
                leftList.append(leftInfoCell);
                if (i + 1 < structureInfoItems.length) {
                    var rightInfoItem = structureInfoItems[i + 1];
                    var rightKeyValue = rightInfoItem.split(':');
                    var rightTitleName = rightKeyValue[0];
                    var rightValue = rightKeyValue[1];
                    var rightInfoCell = $('<li>').append(rightTitleName + '：' + rightValue);
                    rightList.append(rightInfoCell);
                }
            }
            var structureInfoRow = $('<div>').addClass('row');
            var structureInfoParentCell = $('<div>').addClass('col-md-12');
            var leftListCell = $('<div>').addClass('col-md-6').append(leftList);
            var rightListCell = $('<div>').addClass('col-md-6').append(rightList);
            structureInfoParentCell.append(leftListCell).append(rightListCell);
            structureInfoRow.append(structureInfoParentCell);
            licensePanel.append(basedRow);
            licensePanel.append('<hr>');
            licensePanel.append(structureInfoRow);
        }
        else if (modelType == "contract") {
            var basedRow = $('<div>').addClass('row');
            var basedInfoParentCell = $('<div>').addClass('col-md-12').append('协议附件信息');
            basedRow.append(basedInfoParentCell);
            licensePanel.append(basedRow);
        }
    }

    var showSelectedImgInfo = function (index) {
        var selectedImg = null;
        $('.main-thumbnails-img').find('img').each(function () {
            var tempIndex = $(this).attr('data-img-index');
            if (tempIndex == index) {
                selectedImg = $(this);
                showLicenseInfo(selectedImg);
            }
        });
        $('.sub-thumbnails-img').find('img').each(function () {
            var tempIndex = $(this).attr('data-img-index');
            if (tempIndex == index) {
                selectedImg = $(this);
                showLicenseInfo(selectedImg);
            }
        });
    }


    var recoverRotateImg = function () {
        rotateCount = 0;
        $('.slides').find('img').css('-webkit-transform', '');
        $('.slides').find('img').css('-moz-transform', '');
        $('.slides').find('img').css('filter', '');
        $('.slides').find('img').css('max-width', '100%')
    }


    var findSelectedImgAlert = function (index) {
        var selectedImg = null;
        var returnValue = null;
        $('.main-thumbnails-img').find('img').each(function () {
            var tempIndex = $(this).attr('data-img-index');
            if (tempIndex == index) {
                selectedImg = $(this);
                var showValue = getLicenseType(selectedImg)
                if (showValue == "null") {
                    returnValue = "资质名称： " + selectedImg.attr('alt');
                }
                else {
                    returnValue = "资质类型： " + showValue;
                }
            }
        });
        if (returnValue != null) {
            return returnValue;
        }
        $('.sub-thumbnails-img').find('img').each(function () {
            var tempIndex = $(this).attr('data-img-index');
            if (tempIndex == index) {
                selectedImg = $(this);
                var showValue = getLicenseType(selectedImg)
                if (showValue == "null") {
                    returnValue = "资质名称： " + selectedImg.attr('alt');
                }
                else {
                    returnValue = "资质类型： " + showValue;
                }
            }
        });
        return returnValue;
    }


    initImageView();
});
