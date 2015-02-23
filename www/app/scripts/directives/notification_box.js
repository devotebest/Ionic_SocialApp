'use strict';

/**
 * @ngdoc directive
 * @name 2centsApp.directive:notificationBox
 * @description
 * # notificationBox
 */
angular.module('starter.directives')
  .directive('notificationBox', function () {
    return {
      templateUrl:'templates/profile/notification_box.html',
      restrict: 'E',
      scope:{
        notification:'='
      },
      link: function postLink(scope, element, attrs) {
        element.addClass("icu");
      },
      controller:function($scope){
        $scope.delete=function(){}
        $scope.undelete=function(){}
        $scope.mark_as_read=function(){};

        if($scope.notification.type=='QuestionTargeted'){
          $scope.action='app.question({question_id:'+$scope.notification.question_id+'})'
        }
        else if($scope.notification.type=='QuestionUpdated'){
          $scope.action='app.question_stats({question_id:'+$scope.notification.question_id+'})'
        }
        else if($scope.notification.type=='UserFollowed'){
          $scope.action='app.profile({user_id:'+$scope.notification.follower_id+'})'
        }



      }
    };
  });
