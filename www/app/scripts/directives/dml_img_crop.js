'use strict';

/**
 * @ngdoc directive
 * @name wwwApp.directive:dmlDarkroom
 * @description
 * # dmlDarkroom
 */
angular.module('starter.directives')
  .directive('dmlImgCrop', function ($timeout, $window,$q,$ionicGesture) {
    return {
      restrict: 'E',
      replace:true,
      scope:{
        src:'=',
        width:'@',
        ratio:'@',
        onCrop:'=',
        onFinish:'=',
        cropStyle:'@'
      },
      template:[
        ' <div class=""  style="width:100%; height:100%; position:relative; overflow: hidden">',
        '   <img ng-src="{{src}}" ng-style="imageStyles">',
        '   <div class="img-cropper-back-overlay" style="left:0; top:0; background-color:black; opacity:0.6; width:100%; height:100%; position:absolute; z-index:2"></div>',
        '   <div class="" style=" background-color:white; background-repeat: no-repeat; background-image:url(\'{{src}}\');position:absolute; top:50%; z-index:4; left:50%" ng-style="styles"></div>',
        '   <div class="img-cropper-gestures-overlay" style="width:100%; height:100%; left:0; top:0;  position:absolute; z-index:6" on-drag="movePicture($event)" on-touch="getCurrentPosition()" on-tap="zoomIn()"></div>',
        ' </div>',
      ].join(''),
      link: function postLink(scope, element, attrs) {
        scope.imageNode=element.find('img')[0];
        scope.gesturesCapturer=element.find('div')[2];
        scope.croppingBlock=element.find('div')[2];
        scope.elem=element[0];
        scope.imageNode.onload=scope.init;

        scope.addCanvas=function(width,height){
          var m_canvas = document.createElement('canvas');
          m_canvas.width = width;
          m_canvas.height = height;
          return m_canvas;

        };

        scope.crop=function(canvas1,canvas2,dimentions){
          var context1=canvas1.getContext('2d');
          var context2=canvas2.getContext('2d');
          context2.putImageData(context1.getImageData(dimentions.x,dimentions.y,dimentions.w,dimentions.h),0,0);
          return canvas2.toDataURL();
        };

        scope.destroyCanvas=function(canvas){
          angular.element(canvas).remove();
        };

        scope.estimateRegion=function(scale){
          var x=(scope.offsetX-(scope.imageStyles.marginLeft.replace('px','')))/scale;
          var y=(scope.offsetY-(scope.imageStyles.marginTop.replace('px','')))/scale;
          var crop_width=+(scope.styles.width.replace('px',''))/scale;
          var crop_height=+(scope.styles.height.replace('px',''))/scale;
          return {
            x:x,
            y:y,
            w:crop_width,
            h:crop_height
          }
        }

        scope.pingInHandler=$ionicGesture.on('pinchin',function(event){
          if(event){
            event.preventDefault();
            event.stopPropagation()
          }
          scope.zoomOut();
        },angular.element(scope.gesturesCapturer));


        scope.pingOutHandler=$ionicGesture.on('pinchout',function(event){
          if(event){
            event.preventDefault();
            event.stopPropagation()
          }
          scope.zoomIn();
        },angular.element(scope.gesturesCapturer));


      },
      controller:function($scope){
        var initiTimer,
          scale= 1,
          scale_step=0.2,
          left=0,
          top=0,
          offset_top=0,
          offset_left= 0,
          picture_width= 0,
          picture_height=0;
        $scope.styles={};
        $scope.imageStyles={};

        if($scope.cropStyle=='circle'){
          $scope.styles.borderRadius="50%";
        }


        $scope.init=function(){
          scale= 1,
          scale_step=0.2,
          left=0,
          top=0,
          offset_top=0,
          offset_left=0;
          picture_width=$scope.imageNode.offsetWidth;
          picture_height=$scope.imageNode.offsetHeight;

          $scope.imageStyles.width=(picture_width)+'px';
          $scope.imageStyles.height=(picture_height)+'px';


          setLayout()


        }


        function setLayout(){
          var width=$scope.elem.offsetWidth;
          var height=$scope.elem.offsetHeight;
          var ratio=$scope.ratio||1;

          var defer=$q.defer();
          defer.promise.then(setDimensions);

          findDimensions(ratio,width,height*0.8,defer);



        }


        function setDimensions(width){

          var ratio=$scope.ratio||1;
          var height=width*ratio;

          $scope.offsetY=Math.round(($scope.elem.offsetHeight-height)/2);
          $scope.offsetX=Math.round(($scope.elem.offsetWidth-width)/2);


          $scope.styles.marginLeft=['-',Math.floor(width/2),'px'].join('');
          $scope.styles.width=[Math.floor(width),'px'].join('');
          $scope.styles.marginTop=['-',Math.floor(height/2),'px'].join('');
          $scope.styles.height=[Math.floor(height),'px'].join('');
          $scope.styles.backgroundPosition=['-',$scope.offsetX,'px -',$scope.offsetY,'px'].join('')

        }


        function findDimensions(ratio,width,height,defered){
          var rhegight=width*ratio;
          if(rhegight<=height){
            return defered.resolve(width);
          }
          else{
            return $timeout(function(){
              return findDimensions(ratio,(width-10),height,defered);
            })
          }
        }


        $scope.movePicture=function(event){
          var newleft=($scope.left+event.gesture.deltaX);
          var newtop=($scope.top+event.gesture.deltaY);

          if(newleft>$scope.offsetX){
            newleft=$scope.offsetX;
          }

          if(newtop>$scope.offsetY){
            newtop=$scope.offsetY;
          }

          var minleft=(+($scope.imageStyles.width.replace('px',''))-$scope.offsetX-$scope.styles.width.replace('px',''))*-1;
          var mintop=(+($scope.imageStyles.height.replace('px',''))-$scope.offsetY-$scope.styles.height.replace('px',''))*-1;

          if(newleft<minleft){
            newleft=minleft
          }
          if(newtop<mintop){
            newtop=mintop
          }

          $scope.imageStyles.marginLeft=newleft+'px';
          $scope.imageStyles.marginTop=newtop+'px';
          $scope.styles.backgroundPosition=[(newleft-$scope.offsetX),'px ',(newtop-$scope.offsetY),'px'].join('');
          //event.gesture.deltaX
          //event.gesture.deltaY
        }

        $scope.getCurrentPosition=function(){
          $scope.left=+angular.element($scope.imageNode).css('margin-left').replace(/px/,'');
          $scope.top=+angular.element($scope.imageNode).css('margin-top').replace(/px/,'');
        }


        $scope.zoom=function(lscale){
          $scope.styles.backgroundSize=[(picture_width*lscale),'px ',(picture_height*lscale),'px'].join('');
          $scope.imageStyles.width=(picture_width*lscale)+'px';
          $scope.imageStyles.height=(picture_height*lscale)+'px';
          scale=lscale;
        }

        $scope.zoomIn=function(event){

          if(scale>=2){
            return;
          }
          $scope.zoom(scale+scale_step)
        }

        $scope.zoomOut=function(){

          scale=Math.round(scale*10)/10;
          var lscale=scale-scale_step
          if(scale==scale_step || ((picture_width*lscale)<+($scope.styles.width.replace('px',''))) || ((picture_height*lscale)<+($scope.styles.height.replace('px','')))){
            return;
          }
          $scope.zoom(lscale)
        }

        $scope.getCroppedImageData=function(){
            var dimentions=$scope.estimateRegion(scale);
            var pictureCanvas=$scope.addCanvas(picture_width,picture_width);
            var clipCanvas=$scope.addCanvas(dimentions.w,dimentions.h);

          pictureCanvas.getContext('2d').drawImage($scope.imageNode,0,0);


            var dataUrl=$scope.crop(pictureCanvas,clipCanvas,dimentions);
            $scope.destroyCanvas(pictureCanvas);
            $scope.destroyCanvas(clipCanvas);
            $scope.onCrop(dataUrl)

        }


        $scope.$on('zoomImageIn',$scope.zoomIn);
        $scope.$on('zoomImageOut',$scope.zoomOut);
        $scope.$on('getCropSection',$scope.getCroppedImageData);
        $window.onresize=function(){
          $timeout.cancel(initiTimer);
          initiTimer=$timeout(function(){
            $scope.init();
              $timeout(function(){
                $scope.getCurrentPosition();
                $scope.movePicture({gesture:{deltaX:0,deltaY:0}});

              },400)
          },
            400
          );

        }

        $scope.$on('$destroy',function(){
          $ionicGesture.off($scope.pingInHandler);
          $ionicGesture.off($scope.pingOutHandler);
        })

      }
    };
  });
