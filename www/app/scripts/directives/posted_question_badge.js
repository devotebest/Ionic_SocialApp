'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:userBatch
 * @description
 * # userBatch
 */
angular.module('starter.directives')
  .directive('questionPostedBadge', function (categoriesList,profileService,$state) {
    return {
      templateUrl: 'templates/directives/posted_question_badge.html',
      restrict: 'E',
      scope:{
        question:'&',
        show_icon:'@showIcon'

      },
      link: function postLink(scope, element, attrs) {
        scope.follow_link=!(attrs.followLink==='false');
        scope.q=scope.question();
        scope.category=categoriesList.getDetails(scope.q.category.id);
        scope.goToProfile=function(){
          if(!scope.follow_link){
            return;
          }
          var user=scope.q.creator_id;
          if(profileService.data.user_id==user){
            user='';
          }
          $state.go('app.profile',{user_id:user});
        }
      }
    };
  });
