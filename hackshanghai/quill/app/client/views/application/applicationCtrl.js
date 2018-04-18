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
        "Digital Journalism",
        "Security",
        "Smart Society",
        "E-Health",
        "Free Choice",
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
          "Digital Journalism",
          "Security",
          "Smart Society",
          "E-Health",
          "Free Choice",
        ].filter(function (track) {
          return $scope.tracks[track];
        });
        // </tracks>

        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .success(function(data){
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
                  prompt: 'Please enter your name.'
                }
              ]
            },
            age: {
              identifier: 'age',
              rules: [
                {
                  type: 'integer[1..150]',
                  prompt: 'Please enter your age.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            nationality: {
              identifier: 'nationality',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your nationality.'
                }
              ]
            },

            profession: {
              identifier: 'profession',
              rules: [
                {
                  type: 'professionSelected',
                  prompt: 'Please select your profession.'
                }
              ]
            },

            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },

            subjectOfStudy: {
              identifier: 'subject-of-study',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please enter your subject of studies.'
                }
              ]
            },

            yearOfStudies: {
              identifier: 'year-of-studies',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please select your year of studies.'
                }
              ]
            },

            graduationYear: {
              identifier: 'graduation-year',
              rules: [
                {
                  type: 'schoolSelectedAndEmpty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },

            workExperience: {
              identifier: 'work-experience',
              rules: [
                {
                  type: 'workSelectedAndIntegerBetween1And100',
                  prompt: 'Please enter your work experience.'
                }
              ]
            },

            travelReimbursement: {
              identifier: 'travel-reimbursement',
              rules: [
                {
                  type: 'travelReimbursementSelected',
                  prompt: 'Please select whether you need travel reimbursement.'
                }
              ]
            },

            travelReimbursementType: {
              identifier: 'travel-reimbursement-type',
              rules: [
                {
                  type: 'travelReimbursementAndTypeProvided',
                  prompt: 'Please provide which kind of reimbursement you will need.'
                }
              ]
            },

            description: {
              identifier: 'description',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please describe yourself.'
                }
              ]
            },

            idea: {
              identifier: 'idea',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select whether you have an idea yet.'
                }
              ]
            },

            mlhCoc: {
              identifier: 'mlh-coc',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Please accept the MLH code of conduct.'
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
          _updateUser();
        }
        else{
          sweetAlert("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);
