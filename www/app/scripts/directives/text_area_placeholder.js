'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:textAreaPlaceholder
 * @description
 * # textAreaPlaceholder
 */
angular.module('starter.directives')
  .directive('textAreaPlaceholder', function ($timeout) {
    return {
      restrict: 'A',
      require:'ngModel',
      link: function postLink(scope, element, attrs,ngModel) {
        var placeholder,
          first_change=true,
          clearing=false;

        attrs.$observe('textAreaPlaceholder',function(v){
          if(v.length && first_change){
           first_change=false;
            placeholder=v;
          }
        })


        element.bind('keydown',function(){
          if(ngModel.$modelValue===placeholder){
            element.html('');
            element.val('');
            ngModel.$setViewValue('');
            clearing=true;
            scope.$apply();
          }
        });
        element.bind('keyup',function(){
          if(!ngModel.$modelValue && !clearing){
            element.html(placeholder);
            element.val(placeholder);
            ngModel.$setViewValue(placeholder);
            scope.$apply();
          }
          clearing=false;

        })
        element.bind('blur',function(){
          if(!ngModel.$modelValue){
            element.html(placeholder);
            element.val(placeholder);
            ngModel.$setViewValue(placeholder);
            scope.$apply();
          }
        })
      }
    };
  });
