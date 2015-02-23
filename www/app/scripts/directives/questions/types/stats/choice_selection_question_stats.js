'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/simpleChoice
 * @description
 * # questions/types/simpleChoice
 */
angular.module('starter.directives')
  .directive('questionTypeSingleChoiceStats', function () {
    return {
        templateUrl: 'templates/directives/question_types/select_choice/stats.html',
        restrict: 'E',
        replace:true,
      link: function postLink(scope, element, attrs) {}
    };
  })
  .directive('questionTypeMultiChoiceStats', function () {
    return {
        templateUrl: 'templates/directives/question_types/select_choice/stats.html',
        restrict: 'E',
        replace:true,
      link: function postLink(scope, element, attrs) {}
    };
  });
