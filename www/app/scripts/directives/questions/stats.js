'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/response
 * @description
 * # questions/response
 */
angular.module('starter.directives')
  .directive('questionStats', function ($compile,questionTypeTranslator) {
    return {
      restrict: 'E',
      scope:{
          question:'='
      },
      link: function postLink(scope, element, attrs) {
        scope.choices_type=(scope.question.choices && scope.question.choices.length && !scope.question.choices[0].image_url)?'plain':'image';
          var real_type=questionTypeTranslator[scope.question.type]||scope.question.type;
            var content=[
                '<form name="answer" class="answer-submit-form" style="margin-bottom:0;">',
                    '<question-type-',real_type,'-stats question="question"></question-type-',real_type,'-stats>',
                '</form>'
            ];
          element.append($compile(content.join(''))(scope));

      },
      controller:function($scope){
        $scope.real_count=0;
        if($scope.question.summary.choices){
          $scope.real_count=$scope.question.summary.choices.reduce(function(prev,choice){
            return prev+choice.response_ratio;
          },0)
        }

        $scope.percent=function(number){
          if(!$scope.real_count){
            return 0;
          }

          return Number((number/$scope.real_count)*100).toFixed(2)
        }
      }
    };
  });
