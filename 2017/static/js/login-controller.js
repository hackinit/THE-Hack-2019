/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

function fetchRegisterToken() {
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
            return "/zh/login" + location.search;
        },
        englishPage: function() {
            return "/login" + location.search;
        }
    }
});

var login = new Vue({
    el: "#login-container",
    data: {
        email: "",
        password: ""
    },
    computed: {
        language: function() {
            if (/^\/+login\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+login\/*$/.test(location.pathname)) {
                return "zh";
            }
        }
    },
    mounted: function() {
        function checkLoggedInUser() {
            Vue.http.get("/api/usersys/user/current/").then(function(response) {
                login.checkApplicationExistence();
            }, function(response) {});
        }

        Vue.http.post("/api/usersys/user/confirm/", JSON.stringify({
            token: fetchRegisterToken()
        })).then(function(response) {
            login.confirmSuccess();
            login.email = response.body.email;
            window.setTimeout(function() {
                checkLoggedInUser();
            }, 3000);
        }, function(response) {
            checkLoggedInUser();
        });
    },
    methods: {
        goToApply: function() {
            if (login.language === "en") {
                window.location = "/apply";
            } else if (login.language === "zh") {
                window.location = "/zh/apply";
            }
        },
        goToDashboard: function() {
            if (login.language === "en") {
                window.location = "/dashboard";
            } else if (login.language === "zh") {
                window.location = "/zh/dashboard";
            }
        },
        checkApplicationExistence: function() {
            /*Vue.http.get("/api/application/exist/").then(function(response) {
                login.goToDashboard();
            }, function(response) {
                login.goToApply();
            });*/
            login.goToDashboard();
        },
        validateEmail: function(value) {
            var emailValidator = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            if (emailValidator.test(value)) {
                $("#email").parent().removeClass("has-error");
                return true;
            } else {
                $("#email").parent().addClass("has-error");
                return false;
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
        },
        checkFields: function() {
            var firstError = "";
            if (!login.validateEmail(login.email)) {
                firstError = firstError || "#email";
            }
            if (!login.validatePassword(login.password)) {
                firstError = firstError || "#password";
            }
            return firstError;
        },
        addLoginSpinner: function() {
            var originalWidth = $("#login-btn").width(),
                originalHeight = $("#login-btn").height();
            $("#login-btn").width(originalWidth)
                .height(originalHeight)
                .html("")
                .append("<i class='fa fa-spinner fa-spin'></i>");
        },
        removeLoginSpinner: function() {
            if (login.language === "en") {
                $("#login-btn").empty()
                    .html("Log In");
            } else if (login.language === "zh") {
                $("#login-btn").empty()
                    .html("登录");
            }
        },
        loginError: function() {
            if (login.language === "en") {
                alertify.error("Please enter a correct email and password. Note that both fields may be case-sensitive.");
            } else if (login.language === "zh") {
                alertify.error("请输入正确的邮箱和密码。请注意它们可能是大小写敏感的。");
            }
        },
        serverError: function() {
            if (login.language === "en") {
                alertify.error("Server error. Please email us at contact@hackinit.org.");
            } else if (login.language === "zh") {
                alertify.error("服务器错误。请通过contact@hackinit.org联系我们。");
            }
        },
        fieldError: function() {
            if (login.language === "en") {
                alertify.error("Please fix the incorrect fields");
            } else if (login.language === "zh") {
                alertify.error("请修正错误的信息");
            }
        },
        resetPasswordEmailSent: function() {
            if (login.language === "en") {
                alertify.success("We just sent you an email to reset your password");
            } else if (login.language === "zh") {
                alertify.success("我们向你发送了一封邮件以重置你的密码");
            }
        },
        emailNotExistError: function() {
            if (login.language === "en") {
                alertify.error("Email does not exist");
            } else if (login.language === "zh") {
                alertify.error("邮箱不存在");
            }
        },
        passwordError: function() {
            if (login.language === "en") {
                alertify.error("The password must contain 8 to 20 characters, at least a lower-case letter, an upper-case letter and a digit");
            } else if (login.language === "zh") {
                alertify.error("密码必须包含8至20个字符，至少一个小写字母、一个大写字母和一个数字");
            }
        },
        confirmSuccess: function() {
            if (login.language === "en") {
                alertify.success("Congratulations! Your email has been confirmed.");
            } else if (login.language === "zh") {
                alertify.success("恭喜你！你的邮箱已确认。");
            }
        },
        userLogin: function() {
            var firstError = login.checkFields();
            if (firstError === "") {
                login.addLoginSpinner();
                Vue.http.post("/api/usersys/user/authenticate/", JSON.stringify({
                    email: login.email,
                    password: login.password
                })).then(function(response) {
                    login.removeLoginSpinner();
                    login.checkApplicationExistence();
                }, function(response) {
                    login.removeLoginSpinner();
                    if (response.body.status == 44) {
                        login.loginError();
                    } else {
                        login.serverError();
                    }
                });
            } else {
                $(firstError).focus();
                if (firstError === "#email") {
                    login.fieldError();
                } else if (firstError === "#password") {
                    login.passwordError();
                }
            }
        },
        forgotPassword: function() {
            if (login.validateEmail(login.email)) {
                Vue.http.post("/api/usersys/password/request/", JSON.stringify({
                    email: login.email,
                    language: login.language
                })).then(function(response) {
                    login.resetPasswordEmailSent();
                    $("#email").parent().removeClass("has-error");
                }, function(response) {
                    $("#email").parent().addClass("has-error");
                    $("#email").focus();
                    if (response.body.status == 45) {
                        login.emailNotExistError();
                    } else {
                        login.serverError();
                    }
                });
            } else {
                $("#email").focus();
                login.fieldError();
            }
        },
        emailEntered: function() {
            if (login.validateEmail(login.email)) {
                $("#password").focus();
            } else {
                $("#email").focus();
                login.fieldError();
            }
        }
    }
});
