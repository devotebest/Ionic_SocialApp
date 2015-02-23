'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/types/simpleChoice
 * @description
 * # questions/types/simpleChoice
 */
angular.module('starter.directives')
  .directive('newQuestionTypeSortable', function (globalImagesList) {
    return {
        templateUrl: 'templates/directives/question_types/sortable/builder.html',
        restrict: 'E',
        replace:true,
      link: function postLink(scope, element, attrs) {

      },
      controller:function($scope){
          $scope.default_url=globalImagesList.choices[0];
          $scope.min_choices=2;
          $scope.addOption=function(){
              $scope.question.choices.push(
                  {
                      text:'Option '+($scope.question.choices.length+1)
                  }
              )
            $timeout($ionicScrollDelegate.resize);

          };

          $scope.removeOption=function(idx){
              $scope.question.choices.splice(idx,1);
            $timeout($ionicScrollDelegate.resize);

          }

          $scope.validate=function(){
            var value={
              valid:true
            };
            if(!$scope.question.title){
              value={
                error:'You should provide a title for your question',
              }

            }
            else if(!$scope.question.category_id){
              value={
                error:'Please select a category by clicking on the "Choose category" button'
              }
            }
            else if(!$scope.question.choices || $scope.question.choices.length<2){
              value={
                error:'Your question must have at least 2 options'
              }
            }
            else{
              var all_valid=$scope.question.choices.reduce(function(result,choice){
                return [
                    (result[0] && choice.text),
                  (result[1] && choice.image_url && /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(choice.image_url))
                ];
              },[true])
              if(!all_valid[0]){
                value={
                  error:'verify your options title'
                }
              }
              else if(!all_valid[0]){
                value={
                  error:'verify your options images urls'
                }
              }

            }

              return value;
          }
      }

    };
  });

