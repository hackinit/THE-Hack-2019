angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    '$http',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      $scope.reimbursementAcc = user.confirmation.reimbursementAmount;

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        '素食者': false,
        '素食主义者': false,
        '清真': false,
        '洁食': false,
        '坚果过敏': false
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

      function _updateUser(e){
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
              title: "欢迎参赛！",
              text: "我们等不及在7月见到你",
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
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: '请告知我们你的衣服大小'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: '请输入你的手机号码'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          // _updateUser();
          _uploadResume();
        }
      };

      function _uploadResume() {
        var files = $('#resume')[0].files;
        if (files.length == 0) {
          sweetAlert("请检查你的信息", "请上传你的简历", "error");
        } else {
          var resume = files[0];
          var formData = new FormData();
          formData.append('upload', resume, resume.name);
          $('#uploading-loader').addClass('active');
          $.ajax({
            type: 'PUT',
            url: 'https://api.thehack.org.cn/s3/upload/confirmation/hackshanghai/' + $scope.user._id + '_resume' + _getExtension(resume.name),
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
              sweetAlert("请检查你的信息", "请缩小文件大小", "error");
            } else {
              sweetAlert("Uh oh!", "Something went wrong.", "error");
            }
          });
        }
      }

      function _getExtension(filename) {
        var matches = filename.match(/\.\w+$/);
        return (matches === null) ? '' : matches[0];
      }

      function _waitForSuccess(token, success, failed) {
        $http.get('https://api.thehack.org.cn/s3/status/' + token).then(function(response) {
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
