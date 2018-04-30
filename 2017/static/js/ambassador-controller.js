/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

var scrollTo = function(dest) {
    $("body").animate({
        scrollTop: $(dest).offset().top
    }, 1000);
};

var intro = new Vue({
    el: "#intro",
    methods: {
        scrollTo: scrollTo
    }
});

var navbar = new Vue({
    el: "#navbar-container",
    data: {
        loggedIn: false
    },
    computed: {
        language: function() {
            if (/^\/+ambassador\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+ambassador\/*$/.test(location.pathname)) {
                return "zh";
            }
        }
    },
    mounted: function() {
        Vue.http.get("/api/usersys/user/current/").then(function(response) {
            navbar.loggedIn = true;
        }, function(response) {
            navbar.loggedIn = false;
        });
    },
    methods: {
        logoutSuccess: function() {
            if (navbar.language === "en") {
                alertify.success("You're successfully logged out");
            } else if (navbar.language === "zh") {
                alertify.success("您已成功退出");
            }
        },
        logoutError: function() {
            if (navbar.language === "en") {
                alertify.error("Failed to log out current user");
            } else if (navbar.language === "zh") {
                alertify.error("退出失败");
            }
        },
        userLogout: function() {
            Vue.http.get("/api/usersys/user/logout/").then(function(response) {
                navbar.loggedIn = false;
                navbar.logoutSuccess();
            }, function() {
                navbar.logoutError();
            });
        }
    }
});

var form = new Vue({
    el: "#form",
    data: {
        name: "",
        gender: "-",
        school: "",
        grade: "-",
        gradeOther: "",
        city: "",
        province: "",
        email: "",
        mobile: "",
        resume: "",
        howKnowHackinit: "",
        marketingExperience: "",
        hackathonExperience: "",
        hackathonUnderstanding: "",
        promotionPlan: ""
    },
    computed: {
        language: function() {
            if (/^\/+ambassador\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+ambassador\/*$/.test(location.pathname)) {
                return "zh";
            }
        }
    },
    methods: {
        gradeSelected: function(grade) {
            if (grade === "OTHR") {
                $("#grade-other-col").show(400);
                window.setTimeout(function() {
                    $("#grade-other").focus();
                }, 500);
            } else {
                $("#grade-other-col").hide(400);
            }
            form.validateSelectBox(grade, "#grade");
        },
        resumeSelected: function(e) {
            var files = e.target.files;
            if (files.length) {
                form.resume = files[0];
            } else {
                form.resume = null;
            }
        },
        validateRequiredField: function(value, id) {
            if (value === "") {
                $(id).parent().addClass("has-error");
                if ($("#city").parent().hasClass("has-error") && $("#province").parent().hasClass("has-error")) {
                    $("#location").parent().addClass("has-error");
                }
                return false;
            } else {
                $(id).parent().removeClass("has-error");
                if (!$("#city").parent().hasClass("has-error") || !$("#province").parent().hasClass("has-error")) {
                    $("#location").parent().removeClass("has-error");
                }
                return true;
            }
        },
        validateSelectBox: function(value, id) {
            if (value === "-") {
                $(id).parent().addClass("has-error");
                return false;
            } else {
                $(id).parent().removeClass("has-error");
                return true;
            }
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
        validateMobile: function() {
            if ($("#mobile").intlTelInput("isValidNumber")) {
                $("#mobile").parent().parent().removeClass("has-error");
                return true;
            } else {
                $("#mobile").parent().parent().addClass("has-error");
                return false;
            }
        },
        checkFields: function() {
            var firstError = "";
            if (!form.validateRequiredField(form.name, "#name")) {
                firstError = firstError || "#name";
            }
            if (!form.validateSelectBox(form.gender, "#gender")) {
                firstError = firstError || "#gender";
            }
            if (!form.validateRequiredField(form.school, "#school")) {
                firstError = firstError || "#school";
            }
            if (!form.validateSelectBox(form.grade, "#grade")) {
                firstError = firstError || "#grade";
            }
            if (grade === "OTHR" && !form.validateRequiredField(form.gradeOther, "#grade-other")) {
                firstError = firstError || "#grade-other";
            }
            if (!form.validateRequiredField(form.city, "#city")) {
                firstError = firstError || "#city";
            }
            if (!form.validateRequiredField(form.province, "#province")) {
                firstError = firstError || "#province";
            }
            if (!form.validateEmail(form.email)) {
                firstError = firstError || "#email";
            }
            if (!form.validateMobile()) {
                firstError = firstError || "#mobile";
            }
            if (!form.validateRequiredField(form.howKnowHackinit, "#how-know-hackinit")) {
                firstError = firstError || "#how-know-hackinit";
            }
            if (!form.validateRequiredField(form.promotionPlan, "#promotion-plan")) {
                firstError = firstError || "#promotion-plan";
            }
            return firstError;
        },
        clearForm: function() {
            form.name = "";
            form.gender = "-";
            form.school = "";
            form.grade = "-";
            form.gradeOther = "";
            form.city = "";
            form.province = "";
            form.email = "";
            form.mobile = "";
            form.resume = null;
            form.howKnowHackinit = "";
            form.marketingExperience = "";
            form.hackathonExperience = "";
            form.hackathonUnderstanding = "";
            form.promotionPlan = "";
            $("#file").val("");
            $("#grade-other-col").hide(400);
        },
        uploadSuccess: function() {
            if (form.language === "en") {
                alertify.success("Thank you for applying for hack.init()'s Campus Ambassador! We will be in touch shortly.");
            } else if (form.language === "zh") {
                alertify.success("感谢你申请hack.init()校园大使！我们将尽快与你联系。");
            }
        },
        duplicateError: function() {
            if (form.language === "en") {
                alertify.error("You've applied for our Campus Ambassador. We will be in touch shortly!");
            } else if (form.language === "zh") {
                alertify.error("你已经申请了我们的校园大使。我们将尽快联系你！");
            }
        },
        serverError: function() {
            if (form.language === "en") {
                alertify.error("Server error. Please email us at contact@hackinit.org.");
            } else if (form.language === "zh") {
                alertify.error("服务器错误。请通过contact@hackinit.org联系我们。");
            }
        },
        fieldError: function() {
            if (form.language === "en") {
                alertify.error("Please fix the incorrect fields");
            } else if (form.language === "zh") {
                alertify.error("请修正错误的信息");
            }
        },
        addSubmitSpinner: function() {
            var originalWidth = $("#submit-btn").width(), originalHeight = $("#submit-btn").height();
            $("#submit-btn").width(originalWidth).height(originalHeight).html("").append("<i class='fa fa-spinner fa-spin'></i>");
        },
        removeSubmitSpinner: function() {
            if (form.language === "en") {
                $("#submit-btn").empty().html("Submit");
            } else if (form.language === "zh") {
                $("#submit-btn").empty().html("提交");
            }
        },
        postApp: function(resumeFilename) {
            form.addSubmitSpinner();
            Vue.http.post("/api/ambassador/application/upload/", JSON.stringify({
                name: form.name,
                gender: form.gender,
                email: form.email,
                cellphone: $("#mobile").intlTelInput("getNumber"),
                school: form.school,
                city: form.city,
                province: form.province,
                grade: form.grade,
                grade_other: form.gradeOther,
                resume: resumeFilename,
                how_know_hackinit: form.howKnowHackinit,
                marketing_experience: form.marketingExperience,
                hackathon_experience: form.hackathonExperience,
                hackathon_understanding: form.hackathonUnderstanding,
                promotion_plan: form.promotionPlan
            })).then(function(response) {
                form.removeSubmitSpinner();
                form.uploadSuccess();
                scrollTo("body");
                form.clearForm();
            }, function(response) {
                form.removeSubmitSpinner();
                if (response.body.status == 41) {
                    form.duplicateError();
                } else {
                    form.serverError();
                }
            });
        },
        postResume: function() {
            var formData = new FormData();
            formData.append("resume", form.resume, form.resume.name);
            form.addSubmitSpinner();
            $.ajax({
                type: "POST",
                url: "/api/ambassador/resume/upload/",
                data: formData,
                processData: false,
                contentType: false
            }).done(function(result) {
                form.removeSubmitSpinner();
                form.postApp(result.filename);
            }).fail(function() {
                form.removeSubmitSpinner();
                form.serverError();
            });
        },
        submitApp: function() {
            var firstError = form.checkFields();
            if (firstError === "") {
                if (form.resume) {
                    form.postResume();
                } else {
                    form.postApp(undefined);
                }
            } else {
                var dest = $(firstError).parent().parent();
                if (firstError === "#city" || firstError === "#province") {
                    dest = dest.parent().parent();
                }
                $("body").animate({
                    scrollTop: dest.offset().top - 60
                }, 1000);
                $(firstError).focus();
                form.fieldError();
            }
        }
    }
});

$(document).ready(function() {
    var mobileInput = $("#mobile");
    mobileInput.intlTelInput({
        autoPlaceholder: "off",
        dropdownContainer: "body",
        preferredCountries: ["cn"],
        utilsScript: "/s/lib/intl-tel-input/js/utils.js",
        initialCountry: "auto",
        nationalMode: true,
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        }
    });
});
