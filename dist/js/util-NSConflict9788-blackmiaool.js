"use strict";

$.fn.hide = function () {
    this.addClass("hide");
    return this;
};
$.fn.show = function () {
    this.removeClass("hide");
    return this;
};
$.fn.isShown = function () {
    return !this.hasClass("hide");
};
$.fn.toggleShow = function () {
    if (this.hasClass("hide")) {
        this.removeClass("hide");
    } else {
        this.addClass("hide");
    }
};
$.fn.active = function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    this.addClass("active");
    return this;
};
$.fn.inactive = function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];


    this.removeClass("active");
    return this;
};
$.fn.isActive = function () {
    return this.hasClass("active");
};
var $mask = $("#wrap>.mask");
var $cropFrame = $(".crop-frame");
var $iframeWrap = $(".iframe-wrap");
var $iframe = $iframeWrap.find('iframe');
var configs = getObj("config", "[]");

function getObj(name) {
    var def = arguments.length <= 1 || arguments[1] === undefined ? "{}" : arguments[1];

    return JSON.parse(localStorage.getItem(name) || def);
}

function setObj(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function showTable(tableSelector) {

    var $table = $(tableSelector);
    $mask.show();
    $table.show();
    setTimeout(function () {
        $mask.active();
        $table.show().active();
    });
}

function hideTable() {
    $mask.inactive().hide();
    $("#wrap>.form").inactive().hide();
}
$mask.on("click", hideTable);

$(".add-site").on("click", function () {
    showTable(".add-site-table");
});
var cropingUrl = void 0;

function cropUrl(url) {

    if (!url) {
        url = $(".add-site-table .url").val();
    }

    if (!url.match(/^http/)) {
        url = "http://" + url;
    }
    cropingUrl = url;
    $iframeWrap.active();
    $iframe.attr("src", cropingUrl);
    hideTable();
    console.log(url);
}
$(".add-site-table .submit").on("click", function () {
    var url = $(".add-site-table .url").val();
    cropUrl(url);
});
var movingDirection = void 0;

$iframeWrap.on("mousemove", function (e) {
    var x = e.clientX;
    var y = e.clientY;
    if (movingDirection) {
        if (movingDirection == "top") {
            $cropFrame.css("top", y);
        } else if (movingDirection == "left") {
            $cropFrame.css("left", x);
        } else if (movingDirection == "right") {
            $cropFrame.css("right", document.body.clientWidth - x);
        } else if (movingDirection == "bottom") {
            $cropFrame.css("bottom", $iframeWrap.height() - y);
        }
    }
    return false;
});
$iframeWrap.on("mouseup", function (e) {
    movingDirection = undefined;
});
$iframeWrap.find(".enable-website").on("change", function () {
    var enable = $(this).prop("checked");
    if (enable) {
        $iframe.active();
        $iframeWrap.find(".border").hide();
    } else {
        $iframe.inactive();
        $iframeWrap.find(".border").show();
    }
    console.log();
});
function updateView() {
    $("#content-wrap").empty();
    configs.forEach(function (v, i) {
        var component = $("<div class=\"component-wrap\">\n                <div class=\"component\" style=\"width:" + v.width + ";height:" + v.height + ";\">\n                    <iframe class=\"cropped-iframe\" scrolling=\"no\"  src=\"" + v.url + "\" frameborder=\"0\" style=\"width:" + v.sx + ";height:" + v.sy + ";left:-" + v.left + ";top:-" + v.top + ";\"></iframe>\n                </div>\n                <div class=\"tool-bar\">\n                \n                </div>\n            </div>\n        ");
        $("#content-wrap").append($(component));
    });
}
function addConfig(config) {
    configs.push(config);
    setObj("config", configs);
    updateView();
    $iframe.attr("src", "");
}
$iframeWrap.find(".submit").on("click", function () {
    var left = parseInt($cropFrame.css("left"));
    var right = parseInt($cropFrame.css("right"));
    var width = $iframeWrap.width() - left - right;
    var config = {
        top: $cropFrame.css("top"),
        height: $cropFrame.height() + "px",
        width: width + "px",
        left: left + "px",
        url: cropingUrl,
        sx: $iframeWrap.width() + "px",
        sy: $iframeWrap.height() + "px"
    };
    $iframeWrap.inactive();
    addConfig(config);
});
$(".crop-frame .border").on("mousedown", function () {
    var direction = $(this).data("pos");
    movingDirection = direction;
});
$(".actions .export-config").on("click", function () {
    showTable(".export-config-form");
    $(".export-config textarea").val(JSON.stringify(configs));
});
$(".import-config").on("click", function () {
    showTable(".import-config.form");
});