/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

var language = (function() {
    if (/^\/+team\/*$/.test(location.pathname)) {
        return "en";
    } else if (/^\/+zh\/+team\/*$/.test(location.pathname)) {
        return "zh";
    }
})();

function sendMessage(f, message) {
    f(message[language]);
}

function redirectTo(loc) {
    if (language === "en") {
        window.location = loc;
    } else {
        window.location = "/" + language + loc;
    }
}

function logoutError() {
    sendMessage(alertify.error, {
        "en": "Failed to log out current user",
        "zh": "退出失败"
    });
}

function logoutSuccess() {
    sendMessage(alertify.success, {
        "en": "You're successfully logged out",
        "zh": "您已成功退出"
    });
}

// hack.init() has ended. We no longer provide user login services
// var navbar = new Vue({
//     el: "#navbar-container",
//     data: {
//         loggedIn: false
//     },
//     mounted: function() {
//         Vue.http.get("/api/usersys/user/current/").then(function(response) {
//             navbar.loggedIn = true;
//         }, function(response) {
//             navbar.loggedIn = false;
//         });
//     },
//     methods: {
//         userLogout: function() {
//             Vue.http.get("/api/usersys/user/logout/").then(function(response) {
//                 navbar.loggedIn = false;
//                 logoutSuccess();
//             }, function() {
//                 logoutError();
//             });
//         }
//     }
// });
