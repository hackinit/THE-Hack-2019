angular.module('reg')
  .controller('AdminUsersCtrl',[
    '$scope',
    '$state',
    '$stateParams',
    'UserService',
    function($scope, $state, $stateParams, UserService){

      $scope.pages = [];
      $scope.users = [];

      // Semantic-UI moves modal content into a dimmer at the top level.
      // While this is usually nice, it means that with our routing will generate
      // multiple modals if you change state. Kill the top level dimmer node on initial load
      // to prevent this.
      $('.ui.dimmer').remove();
      // Populate the size of the modal for when it appears, with an arbitrary user.
      $scope.selectedUser = {};
      $scope.selectedUser.sections = generateSections({status: '', confirmation: {
        dietaryRestrictions: []
      }, profile: ''});

      function updatePage(data){
        $scope.users = data.users;
        updateTables();

        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++){
          p.push(i);
        }
        $scope.pages = p;
      }

      function updateTables() {
        $scope.studentUsers = $scope.users.filter(function (user) {
          return user.profile.profession == "S";
        });

        $scope.workerUsers = $scope.users.filter(function (user) {
          return user.profile.profession == "W";
        });

        $scope.otherUsers = $scope.users.filter(function (user) {
          return user.profile.profession != "S" && user.profile.profession != "W";
        });
      }

      function updateUser(user) {
        for (var i = 0; i < $scope.users.length; i++) {
          var scopeUser = $scope.users[i];

          if (scopeUser._id == user._id) {
            $scope.users[i] = user;
            break;
          }
        }

        updateTables();
      }

      UserService
        .getPage($stateParams.page, $stateParams.size, $stateParams.query)
        .success(function(data){
          updatePage(data);
        });

      $scope.$watch('queryText', function(queryText){
        UserService
          .getPage($stateParams.page, $stateParams.size, queryText)
          .success(function(data){
            updatePage(data);
          });
      });

      $scope.goToPage = function(page){
        $state.go('app.admin.users', {
          page: page,
          size: $stateParams.size || 9000
        });
      };

      $scope.goUser = function($event, user){
        $event.stopPropagation();

        $state.go('app.admin.user', {
          id: user._id
        });
      };

      $scope.toggleCheckIn = function($event, user, index) {
        $event.stopPropagation();

        if (!user.status.checkedIn){
          swal({
            title: "Whoa, wait a minute!",
            text: "You are about to check in " + user.profile.name + "!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, check them in.",
            closeOnConfirm: false
            },
            function(){
              UserService
                .checkIn(user._id)
                .success(function(user){
                  updateUser(user);
                  swal("Accepted", user.profile.name + ' has been checked in.', "success");
                });
            }
          );
        } else {
          UserService
            .checkOut(user._id)
            .success(function(user){
              updateUser(user);
              swal("Accepted", user.profile.name + ' has been checked out.', "success");
            });
        }
      };

      $scope.acceptUser = function($event, user, index) {
        $event.stopPropagation();

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + user.profile.name + "!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, accept them.",
          closeOnConfirm: false
          }, function(){

            swal({
              title: "Are you sure?",
              text: "Your account will be logged as having accepted this user. " +
                "Remember, this power is a privilege.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, accept this user.",
              closeOnConfirm: false
              }, function(){

                UserService
                  .admitUser(user._id)
                  .success(function(user){
                    updateUser(user);
                    swal("Accepted", user.profile.name + ' has been admitted.', "success");
                  });

              });

          });

      };

      $scope.exportCsv = function($event) {
        var users = $scope.users.map(flattenObject);
        var columns = users.map(Object.keys)
                           .reduce(mergeArrays, [])
                           .filter(function (column) {
                             return column.indexOf("$") == -1;
                           });

        var userRows = users.map(function (user) {
          return columns.map(function (column) {
            var value = (user[column] || "").toString().replace(/"/g, "");

            return "\"" + value + "\"";
          });
        });

        var table = [columns].concat(userRows);
        var csv = table.map(function (row) {
                          return row.join(",");
                        })
                        .join("\n");
        
        var url = "data:text/csv;charset=utf-8," + escape(csv);
        var link = document.querySelector("#download-link");

        link.href = url;
        link.download = "users.csv";
      };

      function mergeArrays(a, b) {
        var aClone = [].concat(a);

        for (var i = 0; i < b.length; i++) {
          var item = b[i];

          if (!aClone.includes(item)) {
            aClone.push(item);
          }
        }

        return aClone;
      }

      function flattenObject(obj) {
        var clone = Object.assign({}, obj);
        var properties = Object.keys(clone);

        for (var i = 0; i < properties.length; i++) {
          var propertyName = properties[i];
          var propertyValue = clone[propertyName];

          if (Array.isArray(propertyValue)) {
            clone[propertyName] = propertyValue.join(", ");
          } else if (typeof propertyValue == "object") {
            delete clone[propertyName];

            var flattenedChild = flattenObject(propertyValue);
            
            Object.keys(flattenedChild)
                  .forEach(function (name) {
                    clone[propertyName + "_" + name] = flattenedChild[name];
                  });
          }
        }

        return clone;
      }

      function formatTime(time){
        if (time) {
          return moment(time).format('MMMM Do YYYY, h:mm:ss a');
        }
      }

      $scope.rowClass = function(user) {
        if (user.status.confirmed) {
          return 'positive';
        }
        if (user.status.admitted && !user.status.confirmed) {
          return 'warning';
        }
      };

      function selectUser(user){
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
        $('.long.user.modal')
          .modal('show');
      }

      function generateSections(user){
        var professionFields = [];

        if (user.profile.profession == "S") {
          professionFields = [
            {
              name: "School",
              value: user.profile.study.school,
            },
            {
              name: "Subject",
              value: user.profile.study.subject,
            },
            {
              name: "Year of studies",
              value: user.profile.study.yearOfStudies,
            },
            {
              name: "Graduation year",
              value: user.profile.study.graduationYear,
            },
          ];
        } else if (user.profile.profession == "W") {
          professionFields = [
            {
              name: "Work experience",
              value: user.profile.work.experience + "y",
            },
          ];
        }

        return [
          {
            name: 'Basic Info',
            fields: [
              {
                name: 'Created On',
                value: formatTime(user.timestamp)
              },{
                name: 'Last Updated',
                value: formatTime(user.lastUpdated)
              },{
                name: 'Confirm By',
                value: formatTime(user.status.confirmBy) || 'N/A'
              },{
                name: 'Checked In',
                value: formatTime(user.status.checkInTime) || 'N/A'
              },{
                name: 'Email',
                value: user.email
              },{
                name: 'Team',
                value: user.teamCode || 'None'
              }
            ]
          },{
            name: 'Profile',
            fields: [
              {
                name: 'Name',
                value: user.profile.name
              },{
                name: 'Gender',
                value: user.profile.gender,
                type: "enum",
                enum: {
                  "M": "Male",
                  "F": "Female",
                  "O": "Other",
                  "N": "Didn't answer",
                },
              },{
                name: 'Age',
                value: user.profile.age
              },{
                name: 'Nationality',
                value: user.profile.nationality
              },{
                name: 'City',
                value: user.profile.city
              },{
                name: 'Description',
                value: user.profile.description
              },{
                name: 'LinkedIn',
                value: user.profile.linkedin,
                type: "url",
              },{
                name: 'Github or similar',
                value: user.profile.github,
                type: "url",
              },{
                name: 'Has idea',
                value: user.profile.idea,
                type: "enum",
                enum: {
                  "Y": "Yes",
                  "S": "Somewhat, yes",
                  "N": "No, not yet",
                }
              },{
                name: 'Interested in',
                value: (user.profile.ideaTracks || []).join(", "),
              },{
                name: 'Profession',
                value: user.profile.profession,
                type: "enum",
                enum: {
                  "W": "Working",
                  "S": "Student",
                }
              },
            ]
          },{
            name: "Profession",
            fields: professionFields,
          },{
            name: 'Confirmation',
            fields: [
              {
                name: 'Dietary Restrictions',
                value: user.confirmation.dietaryRestrictions.join(', ')
              },{
                name: 'Shirt Size',
                value: user.confirmation.shirtSize
              },{
                name: 'Needs Hardware',
                value: user.confirmation.wantsHardware,
                type: 'boolean'
              },{
                name: 'Hardware Requested',
                value: user.confirmation.hardware
              }
            ]
          },{
            name: 'Travel',
            fields: [
              {
                name: 'Needs Reimbursement',
                value: user.profile.travelReimbursement == "Y",
                type: 'boolean'
              },{
                name: 'Received Reimbursement',
                value: user.profile.travelReimbursement == "Y" && user.status.reimbursementGiven
              },{
                name: 'Address',
                value: user.confirmation.address ? [
                  user.confirmation.address.line1,
                  user.confirmation.address.line2,
                  user.confirmation.address.city,
                  ',',
                  user.confirmation.address.state,
                  user.confirmation.address.zip,
                  ',',
                  user.confirmation.address.country,
                ].join(' ') : ''
              },{
                name: 'Additional Notes',
                value: user.confirmation.notes
              }
            ]
          }
        ];
      }

      $scope.selectUser = selectUser;

    }]);











































