"use strict";

(function () {
    var mod = angular.module("dashboard", []);
    mod.controller("BilibiliController", ["$scope", "$http", function (sp, $http) {
        //        return;
        $http({
            method: 'POST',
            url: 'http://www.bilibili.com/index/index-bangumi-timeline.json'
        }).success(function (data) {
            console.log(data);
            sp.list = data.bangumi.list.slice(0, 12);
        });

        $.ajax({
            url: "http://api.bilibili.com/x/feed/pull?callback=jQuery172012482593708340728_1467951111108&jsonp=jsonp&ps=5&type=0&pn=1&_=1467951142692",
            method: 'POST',
            cache: false,
            crossDomain: true,
            headers: {
                //                Cookie:`pgv_pvi=400365568; fts=1449846121; LIVE_BUVID=48ebccc2effb35499472ee7ca2ab613b; LIVE_BUVID__ckMd5=51d99e5b2387c641; loveplus=1; DedeID=4898071; DedeUserID=4011356; DedeUserID__ckMd5=3dcd62c1c2ac5f2d; SESSDATA=b8956a7e%2C1468580244%2C5908d4b8; sid=d3huokqd; pgv_si=s9533590528; time_tracker=20160625; LIVE_LOGIN_DATA=20c41418858ee32eed97278aa608cc60a60b2671; LIVE_LOGIN_DATA__ckMd5=5e9019e6d0109ed2; rlc_time=1467945673466; _dfcaptcha=8e1b86f58fd696f91dbd1528998953e3; _cnt_pm=0; _cnt_notify=13; uTZ=-480; _cnt_dyn=0; _cnt_dyn__ckMd5=42c5c8dec5428373`,
            },
            success: function success(data) {
                console.log("feed", data);
            }
        });
    }]);

    mod.controller("GamerskyController", ["$scope", "$http", function (sp, $http) {

        //        return;

        $http({
            method: 'POST',
            url: 'http://www.gamersky.com/'
        }).success(function (data) {
            data = data.replace(/src=/g, "aa=");
            var $data = $(data).find(".Ptxt.block");
            //            console.log($data);

            $("[data-code=\"gamersky\"]").append($data.eq(0));
        });
    }]);
    mod.controller("ZhihuController", ["$scope", "$http", function (sp, $http) {

        //        data=jQuery.param(data,true)
        function getTopic(id) {
            var data = {
                method: "next",
                params: JSON.stringify({
                    "offset": 0,
                    "topic_id": id,
                    "feed_type": "smart_feed"
                })
            };
            var $wrap = $("<div></div>", {
                class: "topic-wrap"
            });
            $.ajax({
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                url: "http://www.zhihu.com/node/TopicFeedList",
                method: "post",
                data: data
            }).done(function (data) {
                //            console.log(1,data);
                data.msg.forEach(function (v, i) {
                    //                console.log(v);
                    var $dom = $(v);
                    $dom.find("a").each(function () {
                        $(this).attr("href", function (i, v) {
                            if (v.match(/^http/)) {
                                return v;
                            } else {
                                return "https://www.zhihu.com" + v;
                            }
                        }).attr("target", "_blank");
                    });
                    $wrap.append($dom);
                });
            });
            return $wrap;
        }
        $("[data-code=\"zhihu\"]").append(getTopic(769));
        $("[data-code=\"zhihu\"]").append(getTopic(369));
        $("[data-code=\"zhihu\"]").append(getTopic(2462));

        //        $http.post('http://www.zhihu.com/node/TopicFeedList', {data:xsrf}).success(function (data) {
        //            console.log(data);
        //        })
    }]);
    mod.config(function ($sceProvider) {
        $sceProvider.enabled(false);
    });
    mod.controller("RootController", ["$scope", function (sp) {
        sp.showBilibiliFeed = true;

        sp.bilibiliSite = "http://www.bilibili.com";
    }]);
    //    https://www.zhihu.com/node/TopicFeedList
})();