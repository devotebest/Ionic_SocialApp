'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/text
 * @description
 * # questions/types/sortable
 */
angular.module('starter.directives')
  .directive('questionTypeSortable', function () {
    return {
      templateUrl: 'templates/directives/question_types/sortable/answer.html',
      restrict: 'E',
      replace:true,
      link: function postLink(scope, element, attrs) {
      },
      controller:function($scope){
        $scope.moveItem = function(item, fromIndex, toIndex) {
          //Move the item in the array
          $scope.question.choices.splice(fromIndex, 1);
          $scope.question.choices.splice(toIndex, 0, item);
        };

        $scope.validate=function(){
          return true;
        }

        $scope.buildQuestion=function(question){
          var newQuestion={
            title:question.title,
            rotate:false,
            choices:question.choices,
            'choices[title]':[],
            'choices[rotate]':[],
            'choices[image_url]':[],
            $$url:question.$$url,
            category_id:question.category_id,
            description:question.description
          }

          if(question.min_responses || question.min_responses===0){
            newQuestion.min_responses=question.min_responses;
          }

          question.choices.forEach(function(choice){
            choice.title=choice.text;
            choice.rotate=false;
            newQuestion['choices[title]'].push(choice.text);
            newQuestion['choices[rotate]'].push(false);
            newQuestion['choices[image_url]'].push(choice.image_url);
          })


          return newQuestion;
        }

        $scope.buildAnswer=function(question){
          return {
            choice_ids:question.choices.slice()
          }
        }

      }
    };
  });
