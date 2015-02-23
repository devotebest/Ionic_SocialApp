'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:imageHandler
 * @description
 * # imageHandler
 */
angular.module('starter.directives')
  .directive('imageHandler', function (globalImages) {
    return {
      templateUrl: function(element,attrs){
          var distro=(attrs.cammeraPosition||'first');
          return 'templates/directives/image_handler/upload_'+distro+'.html';
      },
      replace:true,
      restrict: 'E',
        scope:{
            who:'=',
            property:'@',
            offset:'@',
            list:'@imageType',
            ratio:'@'

        },
      link: function postLink(scope, element, attrs) {

      },
      controller: function($scope){
          var list=$scope.list||'questions';
          var index=+$scope.offset;
          $scope.goNext=function(){
              var new_image=globalImages.getNext(index,list);
              index=new_image.idx;
              $scope.who[$scope.property]=new_image.url;
          }
          $scope.goBack=function(){
              var new_image=globalImages.getBack(index,list);
              index=new_image.idx;
              $scope.who[$scope.property]=new_image.url;
          }
          if($scope.who[$scope.property]){
            index=globalImages.addTemporary($scope.who[$scope.property],list).idx;
          }
        else{
            $scope.goNext();
          }
          $scope.$on('$destroy',function($event){
              globalImages.release(index,list);
          })
          $scope.onUpload=function(url){
            var new_image=globalImages.addTemporary(url,list);
            index=new_image.idx;
            $scope.who[$scope.property]=new_image.url;
          }
      }
    };
  });
