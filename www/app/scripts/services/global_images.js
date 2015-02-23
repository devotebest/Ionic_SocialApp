'use strict';

/**
 * @ngdoc service
 * @name wwwApp.globalImages
 * @description
 * # globalImages
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('globalImages', function globalImages(globalImagesList) {
    var _this=this;

      _this.releaseAll=function(){
          angular.forEach(globalImagesList,function(list){
              angular,forEach(list,function(item){
                  item.taken=false;
              });
          });
      }
      
        _this.release=function(idx,list){
            globalImagesList[list][idx].taken=false;
            for(var i=0; i<globalImagesList[list].length;i++){
                if(globalImagesList[list].$temporary){
                    globalImagesList[list].splice(i,globalImagesList[list].length);
                    break;
                }
            }
        }
        _this.getNext=function(idx,list){
            var current_global_image_item=globalImagesList[list][idx];
            for(var i=idx;i<globalImagesList[list].length;i++){
                var next_global_image_item=globalImagesList[list][i];
                if(!next_global_image_item.taken){
                    current_global_image_item.taken=false;
                    next_global_image_item.taken=true;
                    next_global_image_item.idx=i;
                    return next_global_image_item;
                }
            }
            for(var i=0;i<idx+1;i++){
                var next_global_image_item=globalImagesList[list][i];
                if(!next_global_image_item.taken){
                    current_global_image_item.taken=false;
                    next_global_image_item.taken=true;
                    next_global_image_item.idx=i;
                    return next_global_image_item;
                }
            }
            return current_global_image_item;

        }
        _this.getBack=function(idx,list){
            var current_global_image_item=globalImagesList[list][idx];
            for(var i=idx;i>=0;i--){
                var next_global_image_item=globalImagesList[list][i];
                if(!next_global_image_item.taken){
                    current_global_image_item.taken=false;
                    next_global_image_item.taken=true;
                    next_global_image_item.idx=i;
                    return next_global_image_item;
                }
            }
            for(var i=(globalImagesList[list].length-1);i>idx;i--){
                var next_global_image_item=globalImagesList[list][i];
                if(!next_global_image_item.taken){
                    current_global_image_item.taken=false;
                    next_global_image_item.taken=true;
                    next_global_image_item.idx=i;
                    return next_global_image_item;
                }
            }
            return current_global_image_item;
        }
        _this.addTemporary=function(url,list){
            var obj={
                url:url,
                idx:globalImagesList[list].length
            }
            globalImagesList[list].push(obj);
            return obj;

        }
  });
