'use strict';

/**
 * @ngdoc directive
 * @name 2centsApp.directive:commentsHandler
 * @description
 * # commentsHandler
 */
angular.module('starter.directives')
  .directive('commentsHandler', function ($compile,profileService) {
    return {
      replace:true,
      templateUrl:'templates/directives/question_comments.html',
      scope:{
        comment:'=',
        select:'=',
        active_comment_id:'@activeCommentId'
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          scope.$watch('comment.comment_children.length>0',function(transition){
            if(transition){
              element.append($compile('<div class="padding-left" style="margin-left:20px"><comments-handler ng-repeat="child in comment.comment_children" comment="child" select="select" active-comment-id="{{active_comment_id}}"></comments-handler></div>')(scope));
            }
          })
      },
      controller:function($scope){
        profileService.get_headshot($scope.comment.user_id)
            .then(function(response){
              $scope.comment=angular.extend($scope.comment,response);
        })
      }
    };
  });
