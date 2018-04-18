angular.module('reg')
  .controller('AdminStatsCtrl',[
    '$scope',
    'UserService',
    function($scope, UserService){

      UserService
        .getStats()
        .success(function(stats){
          $scope.stats = stats;
          
          $scope.estimatedReimbursementSum = stats.reimbursementNeeds.map(function (need) {
            switch (need.name) {
              case "Bavaria":
                return 25 * need.count;

              case "Germany":
                return 40 * need.count;

              case "Europe":
                return 75 * need.count;

              default:
                return 0;
            }
          }).reduce(function (a, b) { return a + b; }, 0);

          $scope.missingReimbursementTypes = stats.reimbursementNeeds.filter(function (need) {
            return need.name == "not answered";
          })[0].count;
          
          $scope.loading = false;
        });

      $scope.fromNow = function(date){
        return moment(date).fromNow();
      };

    }]);
