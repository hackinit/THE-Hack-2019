angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    'AutocompleteService',
    function($scope, $http, User, UserService, AutocompleteService){
      $scope.selectedUser = User.data;

      var currentYear = new Date().getFullYear();
      $scope.graduationYears = [];
      for (var i = -1; i <= 10; i++) {
        $scope.graduationYears.push(currentYear + i);
      }


      // Populate the school dropdown
      populateSchools();

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){

        AutocompleteService
          .getSchoolDomains()
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .success(function(data){
            $selectedUser = data;
            swal("Updated!", "Profile updated.", "success");
          })
          .error(function(){
            swal("Oops, you forgot something.");
          });
      };

    }]);
