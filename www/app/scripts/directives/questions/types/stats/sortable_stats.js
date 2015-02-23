'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/text
 * @description
 * # questions/types/text
 */
angular.module('starter.directives')
  .directive('questionTypeSortableStats', function () {
    return {
      templateUrl: 'templates/directives/question_types/sortable/stats.html',
      restrict: 'E',
      replace:true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
