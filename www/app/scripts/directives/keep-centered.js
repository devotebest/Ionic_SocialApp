'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:keepCentered
 * @description
 * # keepCentered
 */
angular.module('starter.directives')
  .directive('keepCentered', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch(function(){ return element[0].offsetHeight;},function(v){
          if(attrs.vertical==='true'){
            element.css('position','absolute');
            element.css('top','50%');
            element.css('margin-top',('-'+(Math.floor(v/2))+'px'));
          }
        })
      }
    };
  });
