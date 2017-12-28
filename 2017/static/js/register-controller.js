/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

var register = new Vue({
    el: "#register-container",
    data: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    },
    computed: {
        language: function() {
            if (/^\/+register\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+register\/*$/.test(location.pathname)) {
                return "zh";
            }
        }
    },
    mounted: function() {
        Vue.http.get("/api/usersys/user/current/").then(function(response) {
            register.goToHomepage();
        }, function(response) {});
    },
    methods: {
        goToHomepage: function() {
            if (register.language === "en") {
                window.location = "/";
            } else if (register.language === "zh") {
                window.location = "/zh";
            }
        },
        validateRequiredField: function(value, id) {
            if (value === "") {
                $(id).parent().addClass("has-error");
                if ($("#first-name").parent().hasClass("has-error") && $("#last-name").parent().hasClass("has-error")) {
                    $("#name").parent().addClass("has-error");
                }
                return false;
            } else {
                $(id).parent().removeClass("has-error");
                if (!$("#first-name").parent().hasClass("has-error") || !$("#last-name").parent().hasClass("has-error")) {
                    $("#name").parent().removeClass("has-error");
                }
                return true;
            }
        },
        validateEmail: function(value) {
            var emailValidator = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            if (emailValidator.test(value)) {
                if (value.endsWith("@qq.com") || value.endsWith("@foxmail.com")) {
                    $("#email").parent().addClass("has-error");
                    register.tencentEmailError();
                    return false;
                } else {
                    $("#email").parent().removeClass("has-error");
                    return true;
                }
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
        validateConfirmPassword: function() {
            if (register.validatePassword(register.password) && register.password === register.confirmPassword) {
                $("#confirm-password").parent().removeClass("has-error");
                return true;
            } else {
                $("#confirm-password").parent().addClass("has-error");
                return false;
            }
        },
        checkFields: function() {
            var firstError = "";
            if (!register.validateRequiredField(register.firstName, "#first-name")) {
                firstError = firstError || "#first-name";
            }
            if (!register.validateRequiredField(register.lastName, "#last-name")) {
                firstError = firstError || "#last-name";
            }
            if (!register.validateEmail(register.email)) {
                firstError = firstError || "#email";
            }
            if (!register.validatePassword(register.password)) {
                firstError = firstError || "#password";
            }
            if (!register.validateConfirmPassword()) {
                firstError = firstError || "#confirm-password";
            }
            return firstError;
        },
        addRegisterSpinner: function() {
            var originalWidth = $("#register-btn").width(),
                originalHeight = $("#register-btn").height();
            $("#register-btn").width(originalWidth)
                .height(originalHeight)
                .html("")
                .append("<i class='fa fa-spinner fa-spin'></i>");
        },
        removeRegisterSpinner: function() {
            if (register.language === "en") {
                $("#register-btn").empty()
                    .html("Register");
            } else if (register.language === "zh") {
                $("#register-btn").empty()
                    .html("注册");
            }
        },
        serverError: function() {
            if (register.language === "en") {
                alertify.error("Server error. Please email us at contact@hackinit.org.");
            } else if (register.language === "zh") {
                alertify.error("服务器错误。请通过contact@hackinit.org联系我们。");
            }
        },
        fieldError: function() {
            if (register.language === "en") {
                alertify.error("Please fix the incorrect fields");
            } else if (register.language === "zh") {
                alertify.error("请修正错误的信息");
            }
        },
        passwordError: function() {
            if (register.language === "en") {
                alertify.error("The password must contain 8 to 20 characters, at least a lower-case letter, an upper-case letter and a digit");
            } else if (register.language === "zh") {
                alertify.error("密码必须包含8至20个字符，至少一个小写字母、一个大写字母和一个数字");
            }
        },
        userExistsError: function() {
            if (register.language === "en") {
                alertify.error("This email has been used for registering a hack.init() account");
            } else if (register.language === "zh") {
                alertify.error("该邮箱已被用于注册hack.init()账户");
            }
        },
        emailSent: function() {
            if (register.language === "en") {
                alertify.success("Thanks for registering! We just sent you an email to confirm your address.");
            } else if (register.language === "zh") {
                alertify.success("感谢注册hack.init()账户！我们向你发送了一封邮件以验证你的地址。");
            }
        },
        tencentEmailError: function() {
            if (register.language === "en") {
                alertify.error("We are currently experiencing delivery issues with QQ Mail and Foxmail. Please use another email address.");
            } else if (register.language === "zh") {
                alertify.error("我们目前遇到了QQ邮件和Foxmail的接收问题，请使用其他电子邮件注册。");
            }
        },
        clearForm: function() {
            register.firstName = "";
            register.lastName = "";
            register.email = "";
            register.password = "";
            register.confirmPassword = "";
        },
        blurAll: function() {
            $("#first-name").blur();
            $("#last-name").blur();
            $("#email").blur();
            $("#password").blur();
            $("#confirm-password").blur();
        },
        userRegister: function() {
            var firstError = register.checkFields();
            if (firstError === "") {
                register.blurAll();
                register.addRegisterSpinner();
                Vue.http.post("/api/usersys/user/create/", JSON.stringify({
                    email: register.email,
                    password: register.password,
                    first_name: register.firstName,
                    last_name: register.lastName,
                    language: register.language
                })).then(function(response) {
                    register.removeRegisterSpinner();
                    register.clearForm();
                    register.emailSent();
                }, function(response) {
                    register.removeRegisterSpinner();
                    if (response.body.status == 41) {
                        register.userExistsError();
                        $("#email").parent().addClass("has-error");
                        $("#email").focus();
                    } else {
                        register.serverError();
                    }
                });
            } else {
                $(firstError).focus();
                if (firstError === "#password") {
                    register.passwordError();
                } else {
                    register.fieldError();
                }
            }
        },
        firstNameEntered: function() {
            if (register.validateRequiredField(register.firstName, "#first-name")) {
                $("#last-name").focus();
            } else {
                $("#first-name").focus();
                register.fieldError();
            }
        },
        lastNameEntered: function() {
            if (register.validateRequiredField(register.lastName, "#last-name")) {
                $("#email").focus();
            } else {
                $("#last-name").focus();
                register.fieldError();
            }
        },
        emailEntered: function() {
            if (register.validateEmail(register.email)) {
                $("#password").focus();
            } else {
                $("#email").focus();
                register.fieldError();
            }
        },
        passwordEntered: function() {
            if (register.validatePassword(register.password)) {
                $("#confirm-password").focus();
            } else {
                $("#password").focus();
                register.passwordError();
            }
        }
    }
});
