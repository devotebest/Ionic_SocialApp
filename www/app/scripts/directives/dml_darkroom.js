'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:dmlDarkroom
 * @description
 * # dmlDarkroom
 */
angular.module('starter.directives')
  .directive('dmlDarkroom', function ($timeout) {
    return {
      restrict: 'A',
      template:'<img  ng-src="{{image_dialog.image}}"  style="width:100%;" id="profile_picture_image">',
      link: function postLink(scope, element, attrs) {
        $timeout(function(){
          scope.editor=new Darkroom('#profile_picture_image', {
            // Canvas initialization size
            minWidth: 100,
            minHeight: 100,
            maxWidth: 1000,
            maxHeight: 1000,

            // Plugins options
            plugins: {
              crop: {
                minHeight: 50,
                minWidth: 50,
                ratio: 0
              },
              save:{
                callback:function(){
                  scope.image_dialog.image=this.darkroom.image.toDataURL();
                  scope.buildAndUpload(scope.image_dialog.image);
                  scope.$apply();
                }
              }

            }
          });
        })

        scope.$watch('image_dialog.image',function(v,ov){
          if(v!==ov && element){
            scope.image_dialog.dialog_opened=false;
            $timeout(function(){
              scope.image_dialog.dialog_opened=true;
            })
          }
        })
      }
    };
  });

