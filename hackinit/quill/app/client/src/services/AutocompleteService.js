angular.module('reg')
  .factory('AutocompleteService', [
  '$http',
  function($http){

    var base = '/apply/';

    return {
      getSchoolDomains: function(){
        return $http.get(base + 'assets/schools.json');
      },
      getOtherSchools: function (){
        return $http.get(base + 'assets/schools.csv');
      },
      getUserDescriptions: function (){
        return $http.get(base + 'assets/descriptions.csv');
      },
      getNationalities: function (){
        return $http.get(base + 'assets/nationalities.json');
      },
    };
  }
  ]);
