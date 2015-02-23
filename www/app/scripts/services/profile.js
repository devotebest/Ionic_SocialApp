'use strict';

/**
 * @ngdoc service
 * @name wwwApp.comments
 * @description
 * # comments
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('profileService', function($http,$q,profileEndpoints,xhrHandler,Configs) {
    var _this=this;
    _this.root='';
    _this.data={}
    _this.otherProfileData={}
    _this.apiCall=function(endpoint,dataObj){
      dataObj=dataObj||{}
      var url=_this.root+(profileEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:profileEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,profileEndpoints[endpoint])
    }

    _this.get_headshot=function(user_id){
      var dataObj={};
      if(user_id){
        dataObj.user_id=user_id;
      }
      return  _this.apiCall('get_headshot',dataObj)
        .then(
        function(response){
          return response.data;
        },
        function(){
          return {};
        }
      )
    }

    _this.set_headshot=function(url){
      var dataObj={
        image_url:url
      };


      return  _this.apiCall('set_headshot',dataObj);
    }

    _this.get=function(user_id){
      var dataObj={};
      if(user_id && user_id!==true){
        dataObj.user_id=user_id;
        for(var i in _this.otherProfileData){
          delete _this.otherProfileData[i];
        }
      }
      else{
        user_id=null;
        _this.data={}
      }

       var profilePromises=[];
      profilePromises.push(_this.apiCall('profile',dataObj)
        .then(
        function(response){
          var obj=(user_id && user_id!==true)?_this.otherProfileData:_this.data;
          obj=angular.extend(obj,response.data.profile)
          return response.data.profile;

        },
        function(){
          return [];
        }
      ));

      if(!Configs.anonymous_user){
        profilePromises.push(_this.get_headshot(user_id)
            .then(function(data){
              var obj=user_id?_this.otherProfileData:_this.data;
              obj=angular.extend(obj,data);
              return obj;
            })
        );
      }


      return $q.all(profilePromises)
        .then(function(){
          return _this.data;
        })



    }

    _this.clear=function(){
      _this.data={}
      _this.otherProfileData={}
    }

  });
