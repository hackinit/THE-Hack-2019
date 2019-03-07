/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

function getLanguage() {
    if (/^\/+dashboard\/*$/.test(location.pathname)) {
        return "en";
    } else if (/^\/+zh\/+dashboard\/*$/.test(location.pathname)) {
        return "zh";
    }
}

function goToLogin() {
    if (dashboard.language === "en") {
        window.location = "/login";
    } else if (dashboard.language === "zh") {
        window.location = "/zh/login";
    }
}

var navbar = new Vue({
    el: "#navbar-container",
    computed: {
        language: getLanguage
    },
    methods: {
        goToLogin: goToLogin,
        logoutError: function() {
            if (navbar.language === "en") {
                alertify.error("Failed to log out current user");
            } else if (navbar.language === "zh") {
                alertify.error("退出失败");
            }
        },
        userLogout: function() {
            Vue.http.get("/api/usersys/user/logout/").then(function(response) {
                navbar.goToLogin();
            }, function() {
                navbar.logoutError();
            });
        }
    }
});

var dashboard = new Vue({
    el: "#dashboard",
    data: {
        status: "",
        reimbursementCap: null
    },
    computed: {
        language: getLanguage
    },
    mounted: function() {
        Vue.http.get("/api/application/status/").then(function(response) {
            dashboard.status = response.body.application_status;
            dashboard.reimbursementCap = response.body.reimbursement_cap;
            window.setTimeout(function() {
                $(".hide").removeClass("hide");
            }, 50);
        }, function(response) {
            if (response.body.status == 45) {
                dashboard.goToLogin();
            } else {
                dashboard.getStatusError();
            }
        });
    },
    methods: {
        goToLogin: goToLogin,
        getStatusError: function() {
            if (dashboard.language === "en") {
                alertify.error("Failed to fetch application status");
            } else if (dashboard.language === "zh") {
                alertify.error("获取申请状态失败");
            }
        },
        serverError: function() {
            if (dashboard.language === "en") {
                alertify.error("Server error. Please email us at contact@hackinit.org.");
            } else if (dashboard.language === "zh") {
                alertify.error("服务器错误。请通过contact@hackinit.org联系我们。");
            }
        },
        declineCanceledLog: function() {
            if (dashboard.language === "en") {
                alertify.log("Action canceled");
            } else if (dashboard.language === "zh") {
                alertify.log("已取消");
            }
        },
        declineInvitation: function() {
            var lang;
            if (dashboard.language === "en") {
                lang = "Can't make it to <b>hack.init()</b>? If you change your mind, you can always email us at <a href='mailto:contact@hackinit.org'>contact@hackinit.org</a>.";
            } else if (dashboard.language === "zh") {
                lang = "无法参加<b>hack.init()</b>？如果你改变了主意，你可以随时发送包含你的账号邮箱的邮件至<a href='mailto:contact@hackinit.org'>contact@hackinit.org</a>联系我们。";
            }
            alertify.confirm(lang).then(function(resolvedValue) {
                resolvedValue.event.preventDefault();
                if (resolvedValue.buttonClicked == "cancel") {
                    dashboard.declineCanceledLog();
                } else if (resolvedValue.buttonClicked == "ok") {
                    Vue.http.get("/api/application/decline/").then(function(response) {
                        location.reload();
                    }, function(response) {
                        dashboard.serverError();
                    });
                }
            });
        }
    }
});
