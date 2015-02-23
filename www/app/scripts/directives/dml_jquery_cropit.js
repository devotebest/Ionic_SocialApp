'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:dmlDarkroom
 * @description
 * # dmlDarkroom
 */
angular.module('starter.directives')
  .directive('dmlJqueryCropit', function ($timeout) {
    return {
      restrict: 'A',
      replace:true,
      template:[
        '<div id="image-cropper" style="width:100%; height:100%;">',
      <!-- The preview container is needed for background image to work -->
        ' <div class="cropit-image-preview-container"  style="width:100%; height:100%;">',
        '   <div class="cropit-image-preview"  style="width:80%; height:90%;"></div>',
        ' </div>',

        ' <input type="range" class="cropit-image-zoom-input" />',
        '</div>',
      ].join(''),
      link: function postLink(scope, element, attrs) {
        $timeout(function(){
          $('#image-cropper').cropit({
            imageBackground: true,
            imageState: {
              src: scope.image_dialog.image
            }
          });
        })

      }
    };
  });
