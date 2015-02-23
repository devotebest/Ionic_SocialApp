'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:uploader
 * @description
 * # uploader
 */
angular.module('starter.directives')
  .directive('uploader', function (xhrHandler,$http,$q,$ionicModal,lrFileReader,$timeout) {
    return {
      transclude:true,
      template: '<div on-tap="alert()" style="overflow:hidden; position:relative;"><form style="opacity:0; position:absolute; left:110%; top:110%"><input type="file"  accept="image/*"/></form><div ng-transclude></div></div>',
      restrict: 'E',
      replace:true,
      scope:{
        onUpload:'=',
        onFail:'=',
        ratio:'@',
        cropStyle:'@'
      },
      link: function postLink(scope, element, attrs) {
        var position=element.css('position');
        if(position!='absolute'){
          var position=element.css('position','relative');
        }
        var fileHandler=element.find('input')[0];
        var fileForm=element.find('form')[0];
        angular.element(fileHandler).bind('change',function(){
          if(!fileHandler.files.length){
            return;
          }
          var file=fileHandler.files[0];
          scope.image_dialog.image_type=file.type
          scope.image_dialog.image_name=file.name

          lrFileReader(file)
            .readAsDataURL()
            .then(function (result) {
              scope.image_dialog.image = result;
              scope.openModal();
            });



         /* scope.getSignedUrl()
            .then(function(url){
            scope.uploadFile(file,url);
          });*/
        })

        scope.clearFile=function(){
          fileForm.reset();
        }

        scope.alert=function(){
          fileHandler.click();
        }
      },
      controller:function($scope){
        $scope.image_dialog={};
        $scope.getSignedUrl=function(){
          return xhrHandler.call({url:'s3_urls/generate.json',data:{upload_count:1}},{}).
            then(function(response){
              var data=response.data[0];
             return data;
            }
          )
        }

        $scope.buildAndUpload=function(dataUrl){
          $scope.closeModal();
          var binary = atob(dataUrl.split(',')[1]);
          var array = [];
          for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          var blob=new Blob([new Uint8Array(array)], {type: $scope.image_dialog.image_type});
          $scope.getSignedUrl()
           .then(function(url){
           $scope.uploadFile(blob,url);
           });
        }


        $scope.uploadFile=function(file,data) {
          var url = data.url.scheme + '://' + data.url.host;
          //data['Content-Type'] = file.type;
          delete data.url;
          var form = new FormData();
          for (var i in data) {
            form.append(i, data[i])
          }

          form.append('file', file, ('uploaded_file_'+data.signature +'.'+ $scope.image_dialog.image_name.split('.'[1])));

          $http.post(url, form, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
          })
            .then(
            function (response) {
              var url=response.data.split('<Location>')[1].split('</Location>')[0];
              if(angular.isFunction($scope.onUpload)){
                $scope.onUpload(url);
              }

              console.log(url);
            },
            function (err) {
              console.log(err);
            }
          )
        }


        $ionicModal.fromTemplateUrl('templates/directives/question_image_uploader.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
          $timeout(function(){$scope.image_dialog.dialog_opened=true})
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
          $scope.clearFile();
          $scope.image_dialog.dialog_opened=false;
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });





        }
      }


  });
