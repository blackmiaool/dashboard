"use strict";

(function () {
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
    function getObj(name) {
        var def = arguments.length <= 1 || arguments[1] === undefined ? "{}" : arguments[1];

        return JSON.parse(localStorage.getItem(name) || def);
    }
    function setObj(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }
    var configs = getObj("config", "[]");
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
        $iframe.attr("src", cropingUrl);
        hideTable();
        console.log(url);
    }
    $(".add-site-table .submit").on("click", function () {
        var url = $(".add-site-table .url").val();
        cropUrl(url);
    });
    cropUrl("http://bilibili.com");
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
    var testConfig = {
        height: 462,
        left: 1121,
        right: 402,
        sx: 1920,
        sy: 678,
        top: 10,
        url: "http://bilibili.com"
    };
    addConfig(testConfig);
    function addConfig() {
        configs.push(configs);
        setObj("config", configs);
    }
    $iframeWrap.find(".submit").on("click", function () {
        var config = {
            top: parseInt($cropFrame.css("top")),
            height: $cropFrame.height(),
            right: parseInt($cropFrame.css("right")),
            left: parseInt($cropFrame.css("left")),
            url: cropingUrl,
            sx: $iframeWrap.width(),
            sy: $iframeWrap.height()
        };
        addConfig(config);
    });
    $(".crop-frame .border").on("mousedown", function () {
        var direction = $(this).data("pos");
        movingDirection = direction;
    });

    //    let mod = angular.module("dashboard", []);
    //    mod.controller("BilibiliController", ["$scope", "$http", function (sp, $http) {
    ////        return;
    //        $http({
    //            method: 'POST',
    //            url: 'http://www.bilibili.com/index/index-bangumi-timeline.json',
    //        }).success(function (data) {
    //            console.log(data);
    //            sp.list = data.bangumi.list.slice(0, 12);
    //        })
    //
    //        $.ajax({
    //            url: `http://api.bilibili.com/x/feed/pull?callback=jQuery172012482593708340728_1467951111108&jsonp=jsonp&ps=5&type=0&pn=1&_=1467951142692`,
    //            method: 'POST',
    //            cache: false,
    //            crossDomain: true,
    //            headers: {
    //                //                Cookie:`pgv_pvi=400365568; fts=1449846121; LIVE_BUVID=48ebccc2effb35499472ee7ca2ab613b; LIVE_BUVID__ckMd5=51d99e5b2387c641; loveplus=1; DedeID=4898071; DedeUserID=4011356; DedeUserID__ckMd5=3dcd62c1c2ac5f2d; SESSDATA=b8956a7e%2C1468580244%2C5908d4b8; sid=d3huokqd; pgv_si=s9533590528; time_tracker=20160625; LIVE_LOGIN_DATA=20c41418858ee32eed97278aa608cc60a60b2671; LIVE_LOGIN_DATA__ckMd5=5e9019e6d0109ed2; rlc_time=1467945673466; _dfcaptcha=8e1b86f58fd696f91dbd1528998953e3; _cnt_pm=0; _cnt_notify=13; uTZ=-480; _cnt_dyn=0; _cnt_dyn__ckMd5=42c5c8dec5428373`,
    //            },
    //            success: function (data) {
    //                console.log("feed", data);
    //            }
    //        })
    //    }]);
    //
    //    mod.controller("GamerskyController", ["$scope", "$http", function (sp, $http) {
    //
    ////        return;
    //
    //        $http({
    //            method: 'POST',
    //            url: 'http://www.gamersky.com/'
    //        }).success(function (data) {
    //            data = data.replace(/src=/g, "aa=");
    //            let $data = $(data).find(".Ptxt.block");
    //            //            console.log($data);
    //
    //            $(`[data-code="gamersky"]`).append($data.eq(0));
    //        })
    //    }]);
    //    mod.controller("ZhihuController", ["$scope", "$http", function (sp, $http) {
    //
    //
    //        //        data=jQuery.param(data,true)
    //        function getTopic(id) {
    //            let data = {
    //                method: "next",
    //                params: JSON.stringify({
    //                    "offset": 0,
    //                    "topic_id": id,
    //                    "feed_type": "smart_feed"
    //                })
    //            };
    //            let $wrap = $("<div></div>", {
    //                class : "topic-wrap",
    //            });
    //            $.ajax({
    //                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    //                url: "http://www.zhihu.com/node/TopicFeedList",
    //                method: "post",
    //                data,
    //            }).done(function (data) {
    //                //            console.log(1,data);
    //                data.msg.forEach(function (v, i) {
    //                    //                console.log(v);
    //                    let $dom = $(v);
    //                    $dom.find("a").each(function () {
    //                        $(this).attr("href", function (i, v) {
    //                            if (v.match(/^http/)) {
    //                                return v;
    //                            } else {
    //                                return "https://www.zhihu.com" + v;
    //                            }
    //                        }).attr("target", "_blank")
    //
    //
    //                    })
    //                    $wrap.append($dom);
    //                })
    //            })
    //            return $wrap;
    //        }
    //        $(`[data-code="zhihu"]`).append(getTopic(769));
    //        $(`[data-code="zhihu"]`).append(getTopic(369));
    //        $(`[data-code="zhihu"]`).append(getTopic(2462));
    //
    //
    //        //        $http.post('http://www.zhihu.com/node/TopicFeedList', {data:xsrf}).success(function (data) {
    //        //            console.log(data);
    //        //        })
    //    }]);
    //    mod.config(function ($sceProvider) {
    //        $sceProvider.enabled(false);
    //
    //    })
    //    mod.controller("RootController", ["$scope", function (sp) {
    //            sp.showBilibiliFeed = true;
    //           
    //            sp.bilibiliSite = "http://www.bilibili.com";
    //    }])
    //    https://www.zhihu.com/node/TopicFeedList
})();