angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    'AutocompleteService',
    function($scope, $rootScope, $state, $http, currentUser, Settings, Session, UserService, AutocompleteService){

      // Set up the user
      $scope.user = currentUser.data;
      $scope.travelFormId = $scope.user._id.substr($scope.user._id.length - 7);

      var currentYear = new Date().getFullYear();
      $scope.graduationYears = [];
      for (var i = -1; i <= 10; i++) {
        $scope.graduationYears.push(currentYear + i);
      }


      // <tracks>
      var tracks = [
        "人工智能",
        "物联网",
        "教育",
        "区块链",
        "金融",
        "虚拟现实",
        "自由发挥"
      ];

      $scope.tracks = {};

      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];

        $scope.tracks[track] = $scope.user.profile.ideaTracks.indexOf(track) != -1;
      }
      // </tracks>


      // Populate the school dropdown
      populateSchools();
      populateNations();
      _setupForm();

      $scope.regIsClosed = Date.now() > Settings.data.timeClose || ($scope.user.status && $scope.user.status.admitted);

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){
        AutocompleteService
          .getSchoolDomains()
          .then(function(res){
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]){
              $scope.user.profile.study = $scope.user.profile.study || {};
              $scope.user.profile.study.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        AutocompleteService
          .getOtherSchools()
          .then(function(res){
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for(i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({title: $scope.schools[i]})
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.study.school = result.title.trim();
                }
              })
          });
      }

      function populateNations() {
        AutocompleteService
          .getNationalities()
          .then(function(res){
            $scope.nations = res.data;
          });
      }

      function _updateUser(e){
        // <tracks>
        $scope.user.profile.ideaTracks = [
          "人工智能",
          "物联网",
          "教育",
          "区块链",
          "金融",
          "虚拟现实",
          "自由发挥",
        ].filter(function (track) {
          return $scope.tracks[track];
        });
        // </tracks>

        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .success(function(data){
            $('#uploading-loader').removeClass('active');
            sweetAlert({
              title: "Awesome!",
              text: "Your application has been saved.",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('app.dashboard');
            });
          })
          .error(function(res){
            $('#uploading-loader').removeClass('active');
            sweetAlert("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        $.fn.form.settings.rules.professionSelected = function(value) {
          var profession = $("input[name='profession']:checked").val();

          return profession == "W" || profession == "S";
        };

        $.fn.form.settings.rules.schoolSelectedAndEmpty = function(value) {
          var profession = $("input[name='profession']:checked").val();

          return (profession == "S" && value.length > 0) || profession == "W";
        };

        $.fn.form.settings.rules.workSelectedAndEmpty = function(value) {
          var profession = $("input[name='profession']:checked").val();

          return (profession == "W" && value.length > 0) || profession == "S";
        };

        $.fn.form.settings.rules.workSelectedAndIntegerBetween1And100 = function(value) {
          var profession = $("input[name='profession']:checked").val();

          return (profession == "W" && value >= 1 && value <= 100) || profession == "S";
        };

        $.fn.form.settings.rules.travelReimbursementSelected = function(value) {
          var travelReimbursement = $("input[name='travel-reimbursement']:checked").val();

          return travelReimbursement == "Y" || travelReimbursement == "N";
        };

        $.fn.form.settings.rules.travelReimbursementAndTypeProvided = function(value) {
          return ($scope.user.profile.travelReimbursement == "Y" && $scope.user.profile.travelReimbursementType) || $scope.user.profile.travelReimbursement == "N";
        };

        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: '请填写你的法定全名'
                }
              ]
            },
            age: {
              identifier: 'age',
              rules: [
                {
                  type: 'integer[1..150]',
                  prompt: '请输入你的年龄'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: '请选择你的性别'
                }
              ]
            },
            phoneNum: {
              identifier: 'phoneNum',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入你的手机号码'
                }
              ]
            },
            city: {
              identifier: 'city',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入你的所在城市'
                }
              ]
            },

            profession: {
              identifier: 'profession',
              rules: [
                {
                  type: 'professionSelected',
                  prompt: '请选择你的身份'
                }
              ]
            },

            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: '请输入你的学校名称'
                }
              ]
            },

            subjectOfStudy: {
              identifier: 'subject-of-study',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: '请输入你的专业'
                }
              ]
            },

            yearOfStudies: {
              identifier: 'year-of-studies',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: '请输入你的就读时长'
                }
              ]
            },

            graduationYear: {
              identifier: 'graduation-year',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: '请选择你的毕业年份'
                }
              ]
            },

            workExperience: {
              identifier: 'work-experience',
              rules: [
                {
                  type: 'workSelectedAndIntegerBetween1And100',
                  prompt: '请输入你的工作经验'
                }
              ]
            },

            travelReimbursement: {
              identifier: 'travel-reimbursement',
              rules: [
                {
                  type: 'travelReimbursementSelected',
                  prompt: '请选择你是否需要交通补助'
                }
              ]
            },

            travelReimbursementType: {
              identifier: 'travel-reimbursement-type',
              rules: [
                {
                  type: 'travelReimbursementAndTypeProvided',
                  prompt: '请选择你的出发区域'
                }
              ]
            },

            description: {
              identifier: 'description',
              rules: [
                {
                  type: 'empty',
                  prompt: '请选择你的团队角色'
                }
              ]
            },

            resume: {
              identifier: 'resume',
              rules: [
                {
                  type: 'empty',
                  prompt: '请上传你的简历'
                }
              ]
            },

            interestedField: {
              identifier: 'interestedField',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入你感兴趣的产业'
                }
              ]
            },

            idea: {
              identifier: 'idea',
              rules: [
                {
                  type: 'empty',
                  prompt: '请选择你的项目想法'
                }
              ]
            },

            cocRead: {
              identifier: 'cocRead',
              rules: [
                {
                  type: 'checked',
                  prompt: '请阅读并同意《选手行为守则》'
                }
              ]
            },

            mlhTerms: {
              identifier: 'mlh-terms',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Please accept the MLH terms.'
                }
              ]
            },
          }
        });
      }



      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _uploadResume();
        }
        else{
          sweetAlert("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

      function _uploadResume() {
        var files = $('#resume')[0].files;
        if (files.length == 0) {
          sweetAlert("Uh oh!", "Please Upload Your Resume", "error");
        } else {
          var resume = files[0];
          var formData = new FormData();
          formData.append('upload', resume, resume.name);
          $('#uploading-loader').addClass('active');
          $.ajax({
            type: 'PUT',
            url: 'http://api.thehack.io/s3/upload/resume/hackshanghai/' + $scope.user._id + '_resume' + _getExtension(resume.name),
            data: formData,
            processData: false,
            contentType: false,
          }).done(function(result) {
            var token = result.token;
            _waitForSuccess(token, _updateUser, function() {
              $('#uploading-loader').removeClass('active');
              sweetAlert("Uh oh!", "Something went wrong.", "error");
            });
          }).fail(function(result) {
            $('#uploading-loader').removeClass('active');
            if (result.status == 413) {
              sweetAlert("Uh oh!", "Please reduce file size.", "error");
            } else {
              sweetAlert("Uh oh!", "Something went wrong.", "error");
            }
          });
        }
      }

      function _getExtension(filename) {
        return filename.match(/\.\w+$/)[0];
      }

      function _waitForSuccess(token, success, failed) {
        $http.get('http://api.thehack.io/s3/status/' + token).then(function(response) {
          if (response.data.result === 'success') {
            success();
          } else if (response.data.result === 'failed' || response.data.result === 'null') {
            failed();
          } else {
            setTimeout(function() {
              _waitForSuccess(token, success, failed);
            }, 100);
          }
        });
      }

    }]);
