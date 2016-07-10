$.fn.hide = function () {
    this.addClass("hide");
    return this;
}
$.fn.show = function () {
    this.removeClass("hide");
    return this;
}
$.fn.isShown = function () {
    return !this.hasClass("hide");
}
$.fn.toggleShow = function () {
    if (this.hasClass("hide")) {
        this.removeClass("hide");
    } else {
        this.addClass("hide");
    }
}
$.fn.active = function (state = true) {
    this.addClass("active");
    return this;
}
$.fn.inactive = function (state = true) {

    this.removeClass("active");
    return this;
}
$.fn.isActive = function () {
    return this.hasClass("active");
}
let $mask = $("#wrap>.mask");
let $cropFrame = $(".crop-frame");
let $iframeWrap = $(".iframe-wrap");
let $iframe = $iframeWrap.find('iframe');
let configs = getObj("config", "[]");

function getObj(name, def = "{}") {
    return JSON.parse(localStorage.getItem(name) || def);
}

function setObj(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function showTable(tableSelector) {

    let $table = $(tableSelector);
    $mask.show();
    $table.show();
    setTimeout(function () {
        $mask.active();
        $table.show().active();
    })

}

function hideTable() {
    $mask.inactive().hide();
    $("#wrap>.form").inactive().hide();
}
$mask.on("click", hideTable);

$(".add-site").on("click", function () {
    showTable(".add-site-table")
});
let cropingUrl;

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
    let url = $(".add-site-table .url").val();
    cropUrl(url);
});
let movingDirection;

$iframeWrap.on("mousemove", function (e) {
    let x = e.clientX;
    let y = e.clientY;
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
    let enable = $(this).prop("checked");
    if (enable) {
        $iframe.active();
        $iframeWrap.find(".border").hide();
    } else {
        $iframe.inactive();
        $iframeWrap.find(".border").show();
    }
    console.log()
})
function updateView(){
    $("#content-wrap").empty();
    configs.forEach(function(v,i){
        let component=$(`<div class="component-wrap">
                <div class="component" style="width:${v.width};height:${v.height};">
                    <iframe class="cropped-iframe" scrolling="no"  src="${v.url}" frameborder="0" style="width:${v.sx};height:${v.sy};left:-${v.left};top:-${v.top};"></iframe>
                </div>
                <div class="tool-bar">
                
                </div>
            </div>
        `)
        $("#content-wrap").append($(component));
    })
}
function addConfig(config) {
    configs.push(config);
    setObj("config", configs);
    updateView();
    $iframe.attr("src","");
}
$iframeWrap.find(".submit").on("click", function () {
    let left=parseInt($cropFrame.css("left"));
    let right=parseInt($cropFrame.css("right"));
    let width=$iframeWrap.width()-left-right;
    let config = {
        top: $cropFrame.css("top"),
        height: $cropFrame.height()+"px",
        width:width+"px" ,
        left: left+"px",
        url: cropingUrl,
        sx: $iframeWrap.width()+"px",
        sy: $iframeWrap.height()+"px",
    }
    $iframeWrap.inactive();
    addConfig(config);
})
$(".crop-frame .border").on("mousedown", function () {
    let direction = $(this).data("pos");
    movingDirection = direction;

})
$(".actions .export-config").on("click",function(){
    showTable(".export-config")
    $(".export-config textarea").val(JSON.stringify(configs));
})















