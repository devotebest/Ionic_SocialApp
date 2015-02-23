'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:questions/response
 * @description
 * # questions/response
 */
angular.module('starter.directives',[])
  .directive('questionResponse', function ($compile,questionTypeTranslator,$state, questionsService) {
    return {
      restrict: 'E',
      scope:{
          question:'='
      },
      link: function postLink(scope, element, attrs) {
          scope.choices_type=(scope.question.choices && scope.question.choices.length && !scope.question.choices[0].image_url)?'plain':'image';
          var real_type=questionTypeTranslator[scope.question.type]||scope.question.type;
            var content=[
                '<form name="answer" class="answer-submit-form">',
                    '<question-type-',real_type,' question="question"></question-type-',real_type,'>',
                '</form>'
            ];
          element.append($compile(content.join(''))(scope));

      },
      controller:function($scope){
        $scope.question.answer={};

        $scope.create=function(){
          $scope.question.$$buildedQuestion=$scope.buildQuestion($scope.question);
          $state.go('app.question_target',{question_id:$scope.question.id});
        }

        $scope.skip=function(){

          questionsService.skip($scope.question)
            .then(
            function(question_id){
              $state.go('app.question',{question_id:question_id});
            },
            function(){
              $state.go('app.questions');
            }
          )
        }
        $scope.respond=function(){
          if(!$scope.validate()){
            return;
          }

          var answer=$scope.buildAnswer($scope.question);
          answer.question_id=$scope.question.id;
          answer.comment=$scope.question.answer.comment;

          questionsService.respond(answer,$scope.question)
            .then(function(){
              questionsService.offFlow($scope.question)
              $state.go('app.question_stats',{question_id:$scope.question.id});
            })

        };

        $scope.edit=function(){
          $state.go('app.question_builder',{question_type:$scope.question.id});
        }

        $scope.$on('submitResponse',$scope.respond);
        $scope.$on('editQuestion',$scope.edit);
        $scope.$on('createQuestion',$scope.create);
        $scope.$on('skipQuestion',$scope.skip);
      }
    };
  });
