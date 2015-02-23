'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/text
 * @description
 * # questions/types/text
 */
angular.module('starter.directives')
  .directive('newQuestionTypeText', function () {
    return {
      templateUrl: 'templates/directives/question_types/text/builder.html',
      restrict: 'E',
      replace:true,
      link: function postLink(scope, element, attrs) {

      },
      controller:function($scope){
        $scope.buildQuestion=function(){
          return {
            text_type:'freeform',
            image_url:$scope.question.image_url,
            min_characters:0,
            max_characters:255,
            category_id:$scope.question.category_id,
            title:$scope.question.title,
            $$url:$scope.question.$$url
          }
        }

        $scope.validate=function(){
          var value={
            valid:true
          };
          if(!$scope.question.title){
            value={
              error:'You should provide a title for your question'
            }

          }
          else if(!$scope.question.image_url || !/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test($scope.question.image_url)){
            value={
              error:'You should provide an image for your question'
            }

          }
          else if(!$scope.question.category_id){
            value={
              error:'Please select a category by clicking on the "Choose category" button'
            }
          }

          return value;
        }

      }
    };
  });
