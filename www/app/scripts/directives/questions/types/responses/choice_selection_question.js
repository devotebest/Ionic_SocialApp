'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/simpleChoice
 * @description
 * # questions/types/simpleChoice
 */
angular.module('starter.directives')
  .directive('questionTypeSingleChoice', function () {
    return {
        templateUrl: 'templates/directives/question_types/select_choice/answer.html',
        restrict: 'E',
        replace:true,
      link: function postLink(scope, element, attrs) {
            scope.single=true;
      },
      controller:'ChoiceResponseCtrl'
    };
  })
  .directive('questionTypeMultiChoice', function () {
    return {
        templateUrl: 'templates/directives/question_types/select_choice/answer.html',
        restrict: 'E',
        replace:true,
      link: function postLink(scope, element, attrs) {},
      controller:'ChoiceResponseCtrl'
    };
  });
