'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/text
 * @description
 * # questions/types/text
 */
angular.module('starter.directives')
  .directive('questionTypeText', function () {
    return {
      templateUrl: 'templates/directives/question_types/text/answer.html',
      restrict: 'E',
      replace:true,
      link: function postLink(scope, element, attrs) {
      },
      controller:function($scope){
        $scope.validate=function(){
          return $scope.question.answer.text && (!$scope.question.min_characters || $scope.question.answer.text.length>=$scope.question.min_characters )&& (!$scope.question.max_characters || $scope.question.answer.text.length<=$scope.question.max_characters);
        }

        $scope.buildAnswer=function(){
          return {
            text:$scope.question.answer.text
          }
        }

        $scope.buildQuestion=function(question){


          var newQuestion={
            title:question.title,
            image_url:question.image_url,
            $$url:question.$$url,
            category_id:question.category_id,
            description:question.description,
            min_characters:question.min_characters,
            max_characters:question.max_characters,
            text_type:'freeform'
          }

          if(question.min_responses || question.min_responses===0){
            newQuestion.min_responses=question.min_responses;
          }

          return newQuestion;
        }



      }
    };
  });
