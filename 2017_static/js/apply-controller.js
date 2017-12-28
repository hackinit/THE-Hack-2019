/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

function goToLogin() {
    if (form.language === "en") {
        window.location = "/login";
    } else if (form.language === "zh") {
        window.location = "/zh/login";
    }
}

var navbar = new Vue({
    el: "#navbar-container",
    data: {
        loggedIn: false
    },
    computed: {
        language: function() {
            if (/^\/+apply\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+apply\/*$/.test(location.pathname)) {
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
                navbar.loggedIn = false;
                navbar.goToLogin();
            }, function() {
                navbar.logoutError();
            });
        }
    }
});

var form = new Vue({
    el: "#form",
    data: {
        email: "",
        name: "",
        gender: "-",
        birth: "",
        birthYear: null,
        birthMonth: null,
        birthDay: null,
        school: "",
        city: "",
        province: "",
        grade: "-",
        gradeOther: "",
        mobile: "",
        wechat: "",
        linkedin: "",
        github: "",
        devpost: "",
        website: "",
        isCA: "",
        skills: [],
        otherSkills: "",
        isGuru: "",
        hackathonExperience: "",
        projectGuru: "",
        projectHacker: "",
        helpExperience: "",
        howKnowHackinit: "-",
        howKnowHackinitOther: "",
        whyInterestedStem: "",
        techIssue: "",
        resume: null,
        haveTeam: "",
        assignTeam: "",
        numberMember: "",
        captainName: "",
        captainEmail: "",
        members: "",
        checked: false
    },
    computed: {
        language: function() {
            if (/^\/+apply\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+apply\/*$/.test(location.pathname)) {
                return "zh";
            }
        }
    },
    mounted: function() {
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

        $("#birth-input-group").datetimepicker({
            format: "MM/DD/YYYY",
            allowInputToggle: true
        });

        Vue.http.get("/api/application/open/" + location.search).then(function(response) {
            Vue.http.get("/api/usersys/user/current/").then(function(response) {
                form.email = response.body.email
                Vue.http.get("/api/application/exist/").then(function(response) {
                    form.duplicateError();
                    $("#submit-btn, input, select, textarea").attr("disabled", "true");
                    form.submitApp = function() {};
                }, function(response) {});
            }, function(response) {
                form.goToLogin();
            });
        }, function(response) {
            form.applicationClosedError();
            $("#submit-btn, input, select, textarea").attr("disabled", "true");
        });
    },
    methods: {
        goToLogin: goToLogin,
        scrollTo: function(dest) {
            $("body").animate({
                scrollTop: $(dest).offset().top
            }, 1000);
        },
        resumeSelected: function(e) {
            var files = e.target.files;
            if (files.length) {
                form.resume = files[0];
                if (form.isGuru == "true") {
                    $("#file-guru").parent().removeClass("has-error");
                }
            } else {
                form.resume = null;
                if (form.isGuru == "true") {
                    $("#file-guru").parent().addClass("has-error");
                }
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
        validateEmail: function(value, id) {
            var emailValidator = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            if (emailValidator.test(value)) {
                $(id).parent().removeClass("has-error");
                return true;
            } else {
                $(id).parent().addClass("has-error");
                return false;
            }
        },
        validateMobile: function(id) {
            if ($(id).intlTelInput("isValidNumber")) {
                $(id).parent().parent().removeClass("has-error");
                return true;
            } else {
                $(id).parent().parent().addClass("has-error");
                return false;
            }
        },
        validateBirth: function() {
            var dateValidator = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
            var value = $("#birth-input-group").data("DateTimePicker").viewDate().format("MM/DD/YYYY");
            var arr = value.match(dateValidator);
            if (arr === null) {
                $("#birth-input-group").addClass("has-error");
                return false;
            }
            var year = parseInt(arr[3]),
                month = parseInt(arr[1]),
                day = parseInt(arr[2]),
                maxDays;
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
                maxDays = 31;
            } else if ([4, 6, 9, 11].indexOf(month) > -1) {
                maxDays = 30;
            } else if (month == 2) {
                maxDays = (year % 400 == 0 || year % 4 == 0 && year % 100 != 0) ? 29: 28;
            } else {
                $("#birth-input-group").addClass("has-error");
                return false;
            }
            if (year >= 1970 && year <= 2038 && month >= 1 && month <= 12 && day >= 1 && day <= maxDays) {
                $("#birth-input-group").removeClass("has-error");
                form.birthYear = year;
                form.birthMonth = month;
                form.birthDay = day;
                return true;
            } else {
                $("#birth-input-group").addClass("has-error");
                return false;
            }
        },
        validateNumberMember: function() {
            var n = parseInt(form.numberMember);
            if (n > 0 && n < 6) {
                $("#number-member").parent().removeClass("has-error");
                return true;
            } else {
                $("#number-member").parent().addClass("has-error");
                return false;
            }
        },
        validateFile: function(value, id) {
            if (value === null) {
                $(id).parent().addClass("has-error");
                return false;
            } else {
                $(id).parent().removeClass("has-error");
                return true;
            }
        },
        validateRadio: function(value, id) {
            if (value === "true" || value === "false") {
                $(id + "-yes").parent().removeClass("my-has-error");
                $(id + "-no").parent().removeClass("my-has-error");
                return true;
            } else {
                $(id + "-yes").parent().addClass("my-has-error");
                $(id + "-no").parent().addClass("my-has-error");
                return false;
            }
        },
        validateCheckbox: function(value, id) {
            if (value === true) {
                $(id).parent().removeClass("my-has-error");
                return true;
            } else {
                $(id).parent().addClass("my-has-error");
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
            if (!form.validateBirth()) {
                firstError = firstError || "#birth";
            }
            if (!form.validateRequiredField(form.school, "#school")) {
                firstError = firstError || "#school";
            }
            if (!form.validateSelectBox(form.grade, "#grade")) {
                firstError = firstError || "#grade";
            }
            if (form.grade === "OTHR" && !form.validateRequiredField(form.gradeOther, "#grade-other")) {
                firstError = firstError || "#grade-other";
            }
            if (!form.validateRequiredField(form.city, "#city")) {
                firstError = firstError || "#city";
            }
            if (!form.validateRequiredField(form.province, "#province")) {
                firstError = firstError || "#province";
            }
            if (!form.validateMobile("#mobile")) {
                firstError = firstError || "#mobile";
            }
            if (!form.validateRadio(form.isCA, "#is-ca")) {
                firstError = firstError || "#is-ca";
            }
            if (!form.validateRadio(form.isGuru, "#is-guru")) {
                firstError = firstError || "#is-guru";
            }
            if (!form.validateSelectBox(form.howKnowHackinit, "#how-know-hackinit")) {
                firstError = firstError || "#how-know-hackinit";
            }
            if (form.howKnowHackinit === "O" && !form.validateRequiredField(form.howKnowHackinitOther, "#how-know-hackinit-other")) {
                firstError = firstError || "#how-know-hackinit-other";
            }
            if (!form.validateRequiredField(form.hackathonExperience, "#hackathon-experience")) {
                firstError = firstError || "#hackathon-experience";
            }
            if (form.isGuru == "true") {
                if (!form.validateRequiredField(form.helpExperience, "#help-experience")) {
                    firstError = firstError || "#help-experience";
                }
                if (!form.validateRequiredField(form.projectGuru, "#project-guru")) {
                    firstError = firstError || "#project-guru";
                }
                if (!form.validateFile(form.resume, "#file-guru")) {
                    firstError = firstError || "#file-guru";
                }
            } else if (form.isGuru == "false") {
                if (!form.validateRequiredField(form.whyInterestedStem, "#why-interested-stem")) {
                    firstError = firstError || "#why-interested-stem";
                }
                if (!form.validateRequiredField(form.projectHacker, "#project-hacker")) {
                    firstError = firstError || "#project-hacker";
                }
                if (!form.validateRequiredField(form.techIssue, "#tech-issue")) {
                    firstError = firstError || "#tech-issue";
                }
            }
            if (!form.validateRadio(form.haveTeam, "#have-team")) {
                firstError = firstError || "#have-team";
            }
            if (form.haveTeam == "true") {
                if (!form.validateNumberMember()) {
                    firstError = firstError || "#number-member";
                }
                if (!form.validateRequiredField(form.captainName, "#captain-name")) {
                    firstError = firstError || "#captain-name";
                }
                if (!form.validateEmail(form.captainEmail, "#captain-email")) {
                    firstError = firstError || "#captain-email";
                }
                if (!form.validateRequiredField(form.members, "#members")) {
                    firstError = firstError || "#members";
                }
            } else if (form.haveTeam == "false") {
                if (!form.validateRadio(form.assignTeam, "#assign-team")) {
                    firstError = firstError || "#assign-team";
                }
            }
            if (!form.validateCheckbox(form.checked, "#checkbox")) {
                firstError = firstError || "#checkbox";
            }
            return firstError;
        },
        uploadSuccess: function() {
            if (form.language === "en") {
                alertify.success("Thank you for applying for this year's hack.init()! We will be in touch shortly.");
            } else if (form.language === "zh") {
                alertify.success("感谢你申请今年的hack.init()！我们将尽快与你联系。");
            }
        },
        duplicateError: function() {
            if (form.language === "en") {
                alertify.error("You've applied for this year's hack.init(). We will be in touch shortly!");
            } else if (form.language === "zh") {
                alertify.error("你已经申请了今年的hack.init()活动。我们将尽快联系你！");
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
        resumeTooLargeError: function() {
            if (form.language === "en") {
                alertify.error("Please upload a resume within 10MB");
            } else if (form.language === "zh") {
                alertify.error("请上传不超过10MB的简历");
            }
        },
        teamSizeError: function() {
            if (form.language === "en") {
                alertify.error("Team size should be up to 5");
            } else if (form.language === "zh") {
                alertify.error("一个团队最多有五名成员");
            }
        },
        officialRulesError: function() {
            if (form.language === "en") {
                alertify.error("Please read and accept <em>hack.init() Official Rules</em>");
            } else if (form.language === "zh") {
                alertify.error("请阅读并接受《hack.init() 创客马拉松竞赛规则》");
            }
        },
        applicationClosedError: function() {
            if (form.language === "en") {
                alertify.error("Application has been closed");
            } else if (form.language === "zh") {
                alertify.error("申请已关闭");
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
        clearForm: function() {
            form.name = "";
            form.gender = "-";
            form.birth = "";
            form.birthYear = null;
            form.birthMonth = null;
            form.birthDay = null;
            form.school = "";
            form.city = "";
            form.province = "";
            form.grade = "-";
            form.gradeOther = "";
            form.mobile = "";
            form.wechat = "";
            form.linkedin = "";
            form.github = "";
            form.devpost = "";
            form.website = "";
            form.isCA = "";
            form.skills = [];
            form.otherSkills = "";
            form.isGuru = "";
            form.hackathonExperience = "";
            form.projectGuru = "";
            form.projectHacker = "";
            form.helpExperience = "";
            form.howKnowHackinit = "-";
            form.howKnowHackinitOther = "";
            form.whyInterestedStem = "";
            form.techIssue = "";
            form.resume = null;
            form.haveTeam = "";
            form.assignTeam = "";
            form.numberMember = "";
            form.captainName = "";
            form.captainEmail = "";
            form.members = "";
            form.checked = false;
            $("#birth-input-group").data("DateTimePicker").clear();
        },
        postApp: function(resumeFilename) {
            form.addSubmitSpinner();
            Vue.http.post("/api/application/apply/", JSON.stringify({
                email: form.email,
                name: form.name,
                gender: form.gender,
                birth_year: form.birthYear,
                birth_month: form.birthMonth,
                birth_day: form.birthDay,
                school: form.school,
                city: form.city,
                province: form.province,
                grade: form.grade,
                grade_other: form.gradeOther,
                mobile: $("#mobile").intlTelInput("getNumber"),
                wechat: form.wechat,
                linkedin: form.linkedin,
                github: form.github,
                devpost: form.devpost,
                website: form.website,
                skills: form.skills,
                other_skills: form.otherSkills,
                is_guru: form.isGuru == "true",
                is_ca: form.isCA == "true",
                hackathon_experience: form.hackathonExperience,
                project: (form.isGuru == "true") ? form.projectGuru : form.projectHacker,
                how_know_hackinit: form.howKnowHackinit,
                how_know_hackinit_other: form.howKnowHackinitOther,
                resume: resumeFilename,
                help_experience: form.helpExperience,
                why_interested_stem: form.whyInterestedStem,
                tech_issue: form.techIssue,
                have_team: form.haveTeam == "true",
                number_member: parseInt(form.numberMember),
                captain_name: form.captainName,
                captain_email: form.captainEmail,
                members : form.members,
                assign_team : form.assign_team == "true"
            })).then(function(response) {
                form.removeSubmitSpinner();
                form.uploadSuccess();
                form.scrollTo("body");
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
                url: "/api/application/resume/",
                data: formData,
                processData: false,
                contentType: false
            }).done(function(result) {
                form.removeSubmitSpinner();
                form.postApp(result.filename);
            }).fail(function(body) {
                form.removeSubmitSpinner();
                if (body.status == 413) {
                    form.resumeTooLargeError();
                } else {
                    form.serverError();
                }
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
                if (firstError === "#is-ca" || firstError === "#is-guru" || firstError === "#have-team" || firstError === "#assign-team") {
                    firstError += "-yes";
                }
                var dest = $(firstError).parent().parent();
                if (firstError === "#city" || firstError === "#province" || firstError === "#is-ca-yes" || firstError === "#is-guru-yes" || firstError === "#have-team-yes" || firstError === "#assign-team-yes") {
                    dest = dest.parent().parent();
                }
                $("body").animate({
                    scrollTop: dest.offset().top - 60
                }, 1000);
                $(firstError).focus();
                if (firstError === "#number-member") {
                    form.teamSizeError();
                } else if (firstError === "#checkbox") {
                    form.officialRulesError();
                } else {
                    form.fieldError();
                }
            }
        }
    }
});
