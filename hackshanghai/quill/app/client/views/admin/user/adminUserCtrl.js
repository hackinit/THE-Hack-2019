angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();

      getUserResume();

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }

      function getUserResume() {
        var id = $scope.selectedUser._id;
        var prefix = 'upload/resume/' + id + '_resume';
        $http
          .get('https://api.thehack.org.cn/s3/prefix/' + prefix)
          .then(function(res) {
            if (res.data.result != "None") {
              var url = "https://s3.cn-north-1.amazonaws.com.cn/thehack/" + res.data.result;
              $scope.selectedUser.profile.resume = url;
            }
          });
        var prefix2 = 'upload/resume/hackshanghai/' + id + '_resume';
        $http
          .get('https://api.thehack.org.cn/s3/prefix/' + prefix2)
          .then(function(res) {
            if (res.data.result != "None") {
              var url = "https://s3.cn-north-1.amazonaws.com.cn/thehack/" + res.data.result;
              $scope.selectedUser.profile.resume = url;
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
