/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

function fetchResetToken() {
    var arr = location.search.match(/\?t=(.*)/);
    if (arr === null) {
        return "";
    } else {
        return arr[1];
    }
}

var navbar = new Vue({
    el: "#navbar-container",
    computed: {
        simplifiedChinesePage: function() {
            return "/zh/reset" + location.search;
        },
        englishPage: function() {
            return "/reset" + location.search;
        }
    }
});

var reset = new Vue({
    el: "#reset-container",
    data: {
        password: "",
        confirmPassword: ""
    },
    computed: {
        language: function() {
            if (/^\/+reset\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+reset\/*$/.test(location.pathname)) {
                return "zh";
            }
        },
        resetToken: fetchResetToken
    },
    mounted: function() {
        if (fetchResetToken() === "") {
            reset.goToHomepage();
        }
        Vue.http.post("/api/usersys/password/token/", JSON.stringify({
            token: fetchResetToken()
        })).then(function(response) {}, function(response) {
            reset.goToHomepage();
        });
    },
    methods: {
        goToHomepage: function() {
            if (reset.language === "en") {
                window.location = "/";
            } else if (reset.language === "zh") {
                window.location = "/zh";
            }
        },
        goToLogin: function() {
            if (reset.language === "en") {
                window.location = "/login";
            } else if (reset.language === "zh") {
                window.location = "/zh/login";
            }
        },
        validatePassword: function(value) {
            var passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/;
            if (passwordValidator.test(value)) {
                $("#password").parent().removeClass("has-error");
                return true;
            } else {
                $("#password").parent().addClass("has-error");
                return false;
            }
            reset.validateConfirmPassword();
        },
        validateConfirmPassword: function() {
            if (reset.validatePassword(reset.password) && reset.password === reset.confirmPassword) {
                $("#confirm-password").parent().removeClass("has-error");
                return true;
            } else {
                $("#confirm-password").parent().addClass("has-error");
                return false;
            }
        },
        checkFields: function() {
            var firstError = "";
            if (!reset.validatePassword(reset.password)) {
                firstError = firstError || "#password";
            }
            if (!reset.validateConfirmPassword()) {
                firstError = firstError || "#confirm-password";
            }
            return firstError;
        },
        addResetSpinner: function() {
            var originalWidth = $("#reset-btn").width(),
                originalHeight = $("#reset-btn").height();
            $("#reset-btn").width(originalWidth)
                .height(originalHeight)
                .html("")
                .append("<i class='fa fa-spinner fa-spin'></i>");
        },
        removeResetSpinner: function() {
            if (reset.language === "en") {
                $("#reset-btn").empty()
                    .html("Reset");
            } else if (reset.language === "zh") {
                $("#reset-btn").empty()
                    .html("重置");
            }
        },
        serverError: function() {
            if (reset.language === "en") {
                alertify.error("Server error. Please email us at contact@hackinit.org.");
            } else if (reset.language === "zh") {
                alertify.error("服务器错误。请通过contact@hackinit.org联系我们。");
            }
        },
        fieldError: function() {
            if (reset.language === "en") {
                alertify.error("Please fix the incorrect fields");
            } else if (reset.language === "zh") {
                alertify.error("请修正错误的信息");
            }
        },
        passwordError: function() {
            if (reset.language === "en") {
                alertify.error("The password must contain 8 to 20 characters, at least a lower-case letter, an upper-case letter and a digit");
            } else if (reset.language === "zh") {
                alertify.error("密码必须包含8至20个字符，至少一个小写字母、一个大写字母和一个数字");
            }
        },
        tokenError: function() {
            if (reset.language === "en") {
                alertify.error("This link has become invalid");
            } else if (reset.language === "zh") {
                alertify.error("该链接已失效");
            }
        },
        passwordReset: function() {
            if (reset.language === "en") {
                alertify.success("Your password successfully reset");
            } else if (reset.language === "zh") {
                alertify.success("您已成功重置密码");
            }
        },
        resetPassword: function() {
            var firstError = reset.checkFields();
            if (firstError === "") {
                reset.addResetSpinner();
                Vue.http.post("/api/usersys/password/reset/", JSON.stringify({
                    token: reset.resetToken,
                    password: reset.password
                })).then(function(response) {
                    reset.removeResetSpinner();
                    reset.passwordReset();
                    window.setTimeout(function() {
                        reset.goToLogin();
                    }, 3000);
                }, function(response) {
                    reset.removeResetSpinner();
                    if (response.body.status == 45) {
                        reset.tokenError();
                    } else {
                        reset.serverError();
                    }
                });
            } else {
                $(firstError).focus();
                if (firstError === "#password") {
                    reset.passwordError();
                } else {
                    reset.fieldError();
                }
            }
        },
        passwordEntered: function() {
            if (reset.validatePassword(reset.password)) {
                $("#confirm-password").focus();
            } else {
                $("#password").focus();
                reset.passwordError();
            }
        }
    }
});
