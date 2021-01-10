/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

var scrollTo = function(dest) {
    $("body").animate({
        scrollTop: $(dest).offset().top
    }, 1000);
};

// Hack.init() 2017 has ended, we no longer provide user log-in services
// var navbar = new Vue({
//     el: "#navbar-container",
//     data: {
//         loggedIn: false
//     },
//     computed: {
//         language: function() {
//             if (/^\/+$/.test(location.pathname)) {
//                 return "en";
//             } else if (/^\/+zh\/*$/.test(location.pathname)) {
//                 return "zh";
//             }
//         }
//     },
//     mounted: function() {
//         Vue.http.get("/api/usersys/user/current/").then(function(response) {
//             navbar.loggedIn = true;
//         }, function(response) {
//             navbar.loggedIn = false;
//         });
//     },
//     methods: {
//         scrollTo: scrollTo,
//         logoutSuccess: function() {
//             if (navbar.language === "en") {
//                 alertify.success("You're successfully logged out");
//             } else if (navbar.language === "zh") {
//                 alertify.success("您已成功退出");
//             }
//         },
//         logoutError: function() {
//             if (navbar.language === "en") {
//                 alertify.error("Failed to log out current user");
//             } else if (navbar.language === "zh") {
//                 alertify.error("退出失败");
//             }
//         },
//         userLogout: function() {
//             Vue.http.get("/api/usersys/user/logout/").then(function(response) {
//                 navbar.loggedIn = false;
//                 navbar.logoutSuccess();
//             }, function() {
//                 navbar.logoutError();
//             });
//         }
//     }
// });

// Hack.init() 2017 has ended, we no longer provide subscription services
// var banner = new Vue({
//     el: "#banner-container",
//     data: {
//         email: "",
//         cellphone: ""
//     },
//     computed: {
//         language: function() {
//             if (/^\/+$/.test(location.pathname)) {
//                 return "en";
//             } else if (/^\/+zh\/*$/.test(location.pathname)) {
//                 return "zh";
//             }
//         }
//     },
//     methods: {
//         scrollTo: scrollTo,
//         subscribeEmail: function(email) {
//             $("#subscribe-email-btn i").removeClass("fa-envelope").addClass("fa-spinner fa-spin");
//             Vue.http.post("/api/subscription/email/subscribe/", JSON.stringify({ email_address: email })).then(function(response) {
//                 $("#subscribe-email-btn i").removeClass("fa-spinner fa-spin").addClass("fa-envelope");
//                 banner.email = "";
//                 if (banner.language === "en") {
//                     alertify.success("You've successfully subscribed email updates");
//                 } else if (banner.language === "zh") {
//                     alertify.success("您已成功订阅电子邮件更新");
//                 }
//             }, function(response) {
//                 $("#subscribe-email-btn i").removeClass("fa-spinner fa-spin").addClass("fa-envelope");
//                 if (response.body.status == 40) {
//                     if (banner.language === "en") {
//                         alertify.error("Invalid email address");
//                     } else if (banner.language === "zh") {
//                         alertify.error("无效的电子邮件地址");
//                     }
//                 } else if (response.body.status == 41) {
//                     if (banner.language === "en") {
//                         alertify.error("This email address already on our subscription list");
//                     } else if (banner.language === "zh") {
//                         alertify.error("此电子邮件地址已在我们的订阅列表中");
//                     }
//                 }
//             });
//         },
//         subscribeSMS: function() {
//             var telInput = $("#cellphone-input"), cellphone;
//             if (telInput.intlTelInput("isValidNumber")) {
//                 cellphone = telInput.intlTelInput("getNumber");
//             } else {
//                 if (banner.language === "en") {
//                     alertify.error("Invalid cellphone number");
//                 } else if (banner.language === "zh") {
//                     alertify.error("无效的手机号码");
//                 }
//                 return;
//             }
//             $("#subscribe-sms-btn i").removeClass("glyphicon glyphicon-phone").addClass("fa fa-spinner fa-spin");
//             Vue.http.post("/api/subscription/sms/subscribe/", JSON.stringify({ cellphone_number: cellphone })).then(function(response) {
//                 $("#subscribe-sms-btn i").removeClass("fa fa-spinner fa-spin").addClass("glyphicon glyphicon-phone");
//                 banner.cellphone = "";
//                 if (banner.language === "en") {
//                     alertify.success("You've successfully subscribed SMS updates");
//                 } else if (banner.language === "zh") {
//                     alertify.success("您已成功订阅短信更新");
//                 }
//             }, function(response) {
//                 $("#subscribe-sms-btn i").removeClass("fa fa-spinner fa-spin").addClass("glyphicon glyphicon-phone");
//                 if (response.body.status == 40) {
//                     if (banner.language === "en") {
//                         alertify.error("Invalid cellphone number");
//                     } else if (banner.language === "zh") {
//                         alertify.error("无效的手机号码");
//                     }
//                 } else if (response.body.status == 41) {
//                     if (banner.language === "en") {
//                         alertify.error("This cellphone number already on our subscription list");
//                     } else if (banner.language === "zh") {
//                         alertify.error("此手机号码已在我们的订阅列表中");
//                     }
//                 }
//             });
//         }
//     }
// });

var createWayPoint = function(id) {
    $(id).waypoint({
        handler: function() {
            if (!$(this.element).hasClass("countup-animated")) {
                $(this.element).addClass("countup-animated");
                (new CountUp(this.element.id, 0, parseInt(this.element.innerHTML), 0, 2.5, {
                    useEasing: true,
                    useGrouping: true,
                    separator: ",",
                    decimal: ".",
                    prefix: "",
                    suffix: ""
                })).start();
            }
        },
        offset: function() {
            return $(window).height();
        }
    });
};

$(document).ready(function() {
    createWayPoint("#hacker-number");
    createWayPoint("#age-range-lower");
    createWayPoint("#age-range-upper");
    createWayPoint("#hack-hours");

    // Hack.init() 2017 has ended, we no longer provide subscription services
    // var telInput = $("#cellphone-input");
    // telInput.intlTelInput({
    //     dropdownContainer: "body",
    //     preferredCountries: ["cn"],
    //     utilsScript: "/s/lib/intl-tel-input/js/utils.js",
    //     initialCountry: "auto",
    //     nationalMode: true,
    //     geoIpLookup: function(callback) {
    //         $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
    //             var countryCode = (resp && resp.country) ? resp.country : "";
    //             callback(countryCode);
    //         });
    //     }
    // });
});
