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
        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++){
          p.push(i);
        }
        $scope.pages = p;
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
          size: $stateParams.size || 50
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
                  $scope.users[index] = user;
                  swal("Accepted", user.profile.name + ' has been checked in.', "success");
                });
            }
          );
        } else {
          UserService
            .checkOut(user._id)
            .success(function(user){
              $scope.users[index] = user;
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
                    $scope.users[index] = user;
                    swal("Accepted", user.profile.name + ' has been admitted.', "success");
                  });

              });

          });

      };

      $scope.toggleAdmin = function($event, user, index) {
        $event.stopPropagation();

        if (!user.admin){
          swal({
            title: "Whoa, wait a minute!",
            text: "You are about make " + user.profile.name + " and admin!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, make them an admin.",
            closeOnConfirm: false
            },
            function(){
              UserService
                .makeAdmin(user._id)
                .success(function(user){
                  $scope.users[index] = user;
                  swal("Made", user.profile.name + ' an admin.', "success");
                });
            }
          );
        } else {
          UserService
            .removeAdmin(user._id)
            .success(function(user){
              $scope.users[index] = user;
              swal("Removed", user.profile.name + ' as admin', "success");
            });
        }
      };


      function formatTime(time){
        if (time) {
          return moment(time).format('MMMM Do YYYY, h:mm:ss a');
        }
      }

      $scope.rowClass = function(user) {
        if (user.admin){
          return 'admin';
        }
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

        if (user.profile.group == "S") {
          professionFields = [
            {
              name: "Subject",
              value: user.profile.hackshanghai.subject,
            },
            {
              name: "Year of studies",
              value: user.profile.hackshanghai.yearOfStudies,
            },
            {
              name: "Graduation year",
              value: user.profile.hackshanghai.graduationYear,
            },
            {
              name: "Tech Stack",
              value: user.profile.hackshanghai.techStack,
            },
          ];
        } else if (user.profile.group == "I") {
          professionFields = [
            {
              name: "Work experience",
              value: user.profile.hackinit.pastExperience,
            },
            {
              name: "Tech Stack",
              value: user.profile.hackinit.currentIssue,
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
                name: 'Phone Number',
                value: user.profile.phoneNum
              },{
                name: 'Age',
                value: user.profile.age
              },{
                name: 'City',
                value: user.profile.city
              },{
                name: 'Description',
                value: user.profile.description
              },{
                name: 'WeChat',
                value: user.profile.wechat
              },{
                name: 'LinkedIn',
                value: user.profile.linkedin
              },{
                name: 'Website',
                value: user.profile.website
              },{
                name: 'Github',
                value: user.profile.github
              },{
                name: 'Has idea',
                value: user.profile.idea
              },{
                name: 'Interested in',
                value: (user.profile.ideaTracks || []).join(", "),
              },{
                name: 'Profession',
                value: user.profile.group
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
