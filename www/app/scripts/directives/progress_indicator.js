'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:progressIndicator
 * @description
 * # progressIndicator
 */
angular.module('starter.directives')
  .directive('progressIndicator', function ($timeout) {
    return {
      template: '<div class="row dml-progress-bar"><div class="button {{size}} button-{{progress_class}}" ng-style="{width:(progress+\'%\')}"></div><div class="button {{size}} button-{{base_class}}" ng-style="{width:((100-progress)+\'%\')}"></div><h3 class="progress-bar-title">{{title}}</h3><h3 class="progress-indicator" ng-class="{\'with-title\':title}">{{progress}}%</h3></div>',
      restrict: 'E',
      replace:true,
      scope:{
        title:'@',
        progress_class:'@progressClass',
        base_class:'@baseClass',
        value:'@',
        max:'@'

      },
      link: function postLink(scope, element, attrs) {

        scope.size=(/large|small/).test(attrs.size)?('button-'+attrs.size):'';
        scope.progress=0;
        scope.limit=100;

        scope.$watch('value',function(v){
          if(+v){
            $timeout(function(){
              scope.progress=Math.round((+v/(+scope.limit))*100);
            },700)

          }
        });

        scope.$watch('max',function(v){
          if(v){
            $timeout(function(){
              scope.progress=Math.round((+scope.value/(+v))*100);
            },1000)
          }
        });


      }
    };
  });
