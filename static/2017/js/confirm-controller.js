/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

var language = (function() {
    if (/^\/+confirm\/*$/.test(location.pathname)) {
        return "en";
    } else if (/^\/+zh\/+confirm\/*$/.test(location.pathname)) {
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

function addError(dest) {
    $(dest).parent().addClass("has-error");
}

function removeError(dest) {
    $(dest).parent().removeClass("has-error");
}

function logoutError() {
    sendMessage(alertify.error, {
        "en": "Failed to log out current user",
        "zh": "退出失败"
    });
}

function serverError() {
    sendMessage(alertify.error, {
        "en": "Server error. Please email us at <a href='mailto:contact@hackinit.org'>contact@hackinit.org</a>.",
        "zh": "服务器错误。请通过<a href='mailto:contact@hackinit.org'>contact@hackinit.org</a>联系我们。"
    });
}

function fieldError(){
    sendMessage(alertify.error, {
        "en": "Please fix the incorrect fields",
        "zh": "请修正错误的信息"
    });
}

function resumeTooLargeError() {
    sendMessage(alertify.error, {
        "en": "Please upload a resume within 10MB",
        "zh": "请上传不超过10MB的简历"
    });
}

function declineCanceledLog() {
    sendMessage(alertify.log, {
        "en": "Action canceled",
        "zh": "已取消"
    });
}

function addSubmitSpinner() {
    var originalWidth = $("#confirm-btn").width(),
        originalHeight = $("#confirm-btn").height();
    $("#confirm-btn")
        .width(originalWidth)
        .height(originalHeight)
        .html("")
        .append("<i class='fa fa-spinner fa-spin'></i>");
}

function removeSubmitSpinner() {
    if (language === "en") {
        $("#confirm-btn")
            .empty()
            .html("Confirm & Submit");
    } else if (language === "zh") {
        $("#confirm-btn")
            .empty()
            .html("确认并提交");
    }
}

var navbar = new Vue({
    el: "#navbar-container",
    methods: {
        userLogout: function() {
            Vue.http.get("/api/usersys/user/logout/").then(function(response) {
                redirectTo("/login");
            }, function() {
                logoutError();
            });
        }
    }
});

var confirmation = new Vue({
    el: "#confirm",
    data: {
        reimbursementCap: null,
        acceptOrDecline: "",
        name: "",
        idType: "-",
        idNumber: "",
        resume: null,
        tshirt: "-",
        healthy: "",
        dietary: [],
        dietaryOther: "",
        allergy: "",
        medicalCondition: "",
        medication: "",
        workshops: []
    },
    mounted: function() {
        Vue.http.get("/api/application/status/").then(function(response) {
            if (response.body.application_status == "A") {
                confirmation.reimbursementCap = response.body.reimbursement_cap;
            } else {
                redirectTo("/dashboard");
            }
        })
    },
    methods: {
        resumeSelected: function(e) {
            var files = e.target.files;
            if (files.length) {
                confirmation.resume = files[0];
                removeError("#resume");
            } else {
                addError("#resume");
            }
        },
        validateRequiredField: function(value, id) {
            if (value === "") {
                addError(id);
                return false;
            } else {
                removeError(id);
                return true;
            }
        },
        validateSelectBox: function(value, id) {
            if (value === "-") {
                addError(id);
                return false;
            } else {
                removeError(id);
                return true;
            }
        },
        validateFile: function(value, id) {
            if (value === null) {
                addError(id);
                return false;
            } else {
                removeError(id);
                return true;
            }
        },
        validateRadio: function(value, id) {
            if (value === "true" || value === "false") {
                removeError(id + "-yes");
                removeError(id + "-no");
                return true;
            } else {
                addError(id + "-yes");
                addError(id + "-no");
                return false;
            }
        },
        checkFields: function() {
            var firstError = "";
            var checkField = function(f, value, id) {
                if (!f(value, id)) {
                    firstError = firstError || id;
                }
            };
            checkField(confirmation.validateRadio, confirmation.acceptOrDecline, "#accept-decline");
            if (confirmation.acceptOrDecline === "true") {
                checkField(confirmation.validateRequiredField, confirmation.name, "#name");
                checkField(confirmation.validateSelectBox, confirmation.idType, "#id-type");
                checkField(confirmation.validateRequiredField, confirmation.idNumber, "#id-number");
                checkField(confirmation.validateFile, confirmation.resume, "#resume");
                checkField(confirmation.validateSelectBox, confirmation.tshirt, "#tshirt");
                checkField(confirmation.validateRadio, confirmation.healthy, "#healthy");
                checkField(confirmation.validateRequiredField, confirmation.dietaryOther, "#dietary-other");
                checkField(confirmation.validateRequiredField, confirmation.allergy, "#allergy");
                checkField(confirmation.validateRequiredField, confirmation.medicalCondition, "#medical-condition");
                checkField(confirmation.validateRequiredField, confirmation.medication, "#medication");
            }
            return firstError;
        },
        clearForm: function() {
            confirmation.reimbursementCap = null;
            confirmation.acceptOrDecline = "";
            confirmation.name = "";
            confirmation.idType = "-";
            confirmation.idNumber = "";
            confirmation.resume = null;
            confirmation.tshirt = "-";
            confirmation.healthy = "";
            confirmation.dietary = [];
            confirmation.dietaryOther = "";
            confirmation.allergy = "";
            confirmation.medicalCondition = "";
            confirmation.medication = "";
            confirmation.workshops = [];
        },
        postConfirmation: function(filename) {
            addSubmitSpinner();
            Vue.http.post("/api/confirmation/confirm/", JSON.stringify({
                name: confirmation.name,
                id_type: confirmation.idType,
                id_number: confirmation.idNumber,
                resume: filename,
                tshirt: confirmation.tshirt,
                healthy: confirmation.healthy,
                dietary: confirmation.dietary,
                dietary_other: confirmation.dietaryOther,
                allergy: confirmation.allergy,
                medical_condition: confirmation.medicalCondition,
                medication: confirmation.medication,
                workshops: confirmation.workshops
            })).then(function(response) {
                removeSubmitSpinner();
                redirectTo("/dashboard");
            }, function(response) {
                removeSubmitSpinner();
                if (response.body.status == 41) {
                    duplicateError();
                } else {
                    serverError();
                }
            });
        },
        postResume: function() {
            var formData = new FormData();
            formData.append("resume", confirmation.resume, confirmation.resume.name);
            addSubmitSpinner();
            $.ajax({
                type: "POST",
                url: "/api/confirmation/resume/",
                data: formData,
                processData: false,
                contentType: false
            }).done(function(result) {
                removeSubmitSpinner();
                confirmation.postConfirmation(result.filename);
            }).fail(function(body) {
                removeSubmitSpinner();
                if (body.status == 413) {
                    resumeTooLargeError();
                } else {
                    serverError();
                }
            });
        },
        declineInvitation: function() {
            var lang = (function () {
                if (language === "en") {
                    return "Can't make it to <b>hack.init()</b>? If you change your mind, you can always email us at <a href='mailto:contact@hackinit.org'>contact@hackinit.org</a>.";
                } else if (language === "zh") {
                    return "无法参加<b>hack.init()</b>？如果你改变了主意，你可以随时发送包含你的账号邮箱的邮件至<a href='mailto:contact@hackinit.org'>contact@hackinit.org</a>联系我们。";
                }
            })();
            alertify.confirm(lang).then(function(resolvedValue) {
                resolvedValue.event.preventDefault();
                if (resolvedValue.buttonClicked == "cancel") {
                    declineCanceledLog();
                } else if (resolvedValue.buttonClicked == "ok") {
                    Vue.http.get("/api/application/decline/").then(function(response) {
                        redirectTo("/dashboard");
                    }, function(response) {
                        serverError();
                    });
                }
            });
        },
        confirmParticipation: function() {
            var firstError = confirmation.checkFields();
            if (firstError === "") {
                if (confirmation.acceptOrDecline === "true") {
                    confirmation.postResume();
                } else if (confirmation.acceptOrDecline === "false") {
                    confirmation.declineInvitation();
                }
            } else {
                var dest;
                if (["#accept-decline", "#healthy"].indexOf(firstError) > -1) {
                    dest = $(firstError + "-yes").parent().parent().parent().parent();
                } else {
                    dest = $(firstError).parent().parent();
                }
                $("body").animate({
                    scrollTop: dest.offset().top - 60
                }, 1000);
                $(firstError).focus();
                fieldError();
            }
        }
    }
});
