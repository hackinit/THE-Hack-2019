angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;
      $scope.askReimbursementType = !$scope.user.profile.travelReimbursementType;
      $scope.askMlhTerms = !$scope.user.profile.legal.mlh.terms;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(){
        if ($scope.askReimbursementType || $scope.askMlhTerms) {
          UserService.updateProfile(user._id, user.profile)
            .success(function(data) {
              _updateConfirmation();
            })
            .error(function (res) {
              sweetAlert("Uh oh!", "Something went wrong.", "error");
            });
        } else {
          _updateConfirmation();
        }
      }

      function _updateConfirmation() {
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;

        UserService
          .updateConfirmation(user._id, confirmation)
          .success(function(data){
            sweetAlert({
              title: "Woo!",
              text: "You're confirmed!",
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
        $.fn.form.settings.rules.travelReimbursementAndTypeProvided = function(value) {
          return ($scope.user.profile.travelReimbursement == "Y" && $scope.user.profile.travelReimbursementType) || $scope.user.profile.travelReimbursement == "N";
        };

        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            travelReimbursementType: {
              identifier: 'travel-reimbursement-type',
              rules: [
                {
                  type: 'travelReimbursementAndTypeProvided',
                  prompt: 'Please provide which kind of reimbursement you will need.'
                }
              ]
            },

            mlhTerms: {
              identifier: 'terms',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Please accept the MLH terms.'
                }
              ]
            },

            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          sweetAlert("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);
