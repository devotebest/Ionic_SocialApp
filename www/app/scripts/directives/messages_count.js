'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:messagesCount
 * @description
 * # messagesCount
 */
angular.module('starter.directives')
  .directive('messagesCount', function (messagesService) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.messages=messagesService;
        scope.$watch('messages.data.number_of_unread_messages',function(v){
          element.text(v);
          if(attrs.hideOnNone){
            if(!v){
              element.addClass('ng-hide');
            }
            else{
              element.removeClass('ng-hide');
            }
          }
        })
      }
    };
  });
