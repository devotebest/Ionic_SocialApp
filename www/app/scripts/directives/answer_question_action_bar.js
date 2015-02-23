'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:answerQuestionActionBar
 * @description
 * # answerQuestionActionBar
 */
angular.module('starter.directives')
  .directive('answerQuestionActionBar', function ($ionicPopup,$timeout,relationshipsService) {
    return {
      templateUrl:'templates/directives/answer_question_action_bar.html',
      replace:true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.showShare=function(){
          if(scope.moreMenu){
            scope.moreMenu.close();
          }

          $timeout(function(){
            var myPopup = $ionicPopup.show({
              template:[
                '<div class="sharing-bar row">',
                ' <a href="http://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=8943b7fd64cd8b1770ff5affa9a9437b&service=5&title=The%20Hottest%20VC%20No%20One%20Has%20Ever%20Heard%20Of&link=http://www.robgo.org/post/376467064/the-hottest-vc-no-one-has-ever-heard-of&shortener=google&source=Shareaholic" target="_blank" class="col"><span class="icon ion-social-facebook"></span></a>',
                ' <a href="http://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=8943b7fd64cd8b1770ff5affa9a9437b&service=7&title=Share%20API&link=http://www.shareaholic.com/api/&shortener=google&template=Reading:%20${title}%20(${short_link})%20by%20@Shareaholic%20%23api%20%23devtools&source=Shareaholic" target="_blank" class="col"><span class="icon ion-social-twitter"></span></a>',
                ' <a a href="mailto:?Subject=Check%20this%20out&body=http://ionic-test-2cents.herokuapp.com/#app/question/{{question.id}}" target="_top" class="col"><span class="icon ion-ios7-email"></span></a>',
                '</div>'
              ].join(''),
              title: 'Share With',
              scope: scope,
              buttons: [
                {
                  text: 'CLOSE'
                }
              ]
            });
          })

        };





        scope.showMoreMenu=function(){
          scope.moreMenu = $ionicPopup.show({
            scope: scope,
            template:[
              '<button class="button button-full" ng-class="hideMoreMenu" ng-click="showShare();">SHARE</button>',
              '<button class="button button-full" ng-class="hideMoreMenu" ng-click="relations.follow(question.creator_id); moreMenu.close()"  ng-if="!relations.followingHash[question.creator_id]">FOLLOW</button>',
              '<button class="button button-full" ng-class="hideMoreMenu" ng-click="relations.unfollow(question.creator_id); moreMenu.close()"  ng-if="relations.followingHash[question.creator_id]">UNFOLLOW</button>',
              '<button class="button button-full" ng-class="hideMoreMenu" ng-click="showReport();"">REPORT</button>',
            ].join(''),
            buttons: [
              {
                type: 'button-full',
                text: 'CLOSE'
              }
            ]
          });
        }
      },
      controller:function($scope){
        $scope.followed=relationshipsService.followingHash;
        $scope.relations=relationshipsService;
      }
    };
  });
