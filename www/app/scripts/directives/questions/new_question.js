'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/response
 * @description
 * # questions/response
 */
angular.module('starter.directives')
  .directive('questionBuilder', function ($compile,$timeout,User,$ionicScrollDelegate) {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.question.avatar_url=User.profile.data.avatar_url;
            var content=[
                '<form name="factory" class="answer-submit-form" style="padding-bottom:20px;">',
                    '<new-question-type-',scope.question.$$type,' question="question"></new-question-type-',scope.question.$$type,'>',
                    '<button class="col col-80 col-offset-10 button button-outline button-energized button-icon ion-chevron-down icon-right button-category dark-border" ng-click="show_categories=!show_categories" style="border-color:#bbb; border-radius:4px; text-align:left; font-weight:bolder; font-size:1.3rem;">&nbsp;{{category_name}}</button>',
                '</form>'
            ];
          element.append($compile(content.join(''))(scope.$parent));
          scope.question.creator_name=User.profile.data.username;
          scope.question.created_at=new Date(Date.now());
          $timeout(function(){
            $ionicScrollDelegate.resize();
          },10000)

      }
    };
  });
