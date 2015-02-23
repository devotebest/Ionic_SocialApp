'use strict';

/**
 * @ngdoc service
 * @name wwwApp.comments
 * @description
 * # comments
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('relationshipsService', function($http,$q,relationshipsEndpoints,xhrHandler,profileService) {
    var _this=this;
    _this.root='relationships/';
    _this.followersList=[];
    _this.followersHash={};
    _this.followingList=[];
    _this.followingHash={};
    _this.followableList=[];

    _this.apiCall=function(endpoint,dataObj){
      dataObj=dataObj||{};
      if(!dataObj.user_id){
        delete dataObj.user_id;
      }
      var url=_this.root+(relationshipsEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:relationshipsEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,relationshipsEndpoints[endpoint]).
        then(function(response){
          if(!angular.isArray(response.data)){
            return response;
          }
          response.data.forEach(function(person){
            profileService.get_headshot(person.id)
              .then(function(response){
                person=angular.extend(person,response);
              })
          })
          return response;
        })
    }



    this.followers=function(user_id){
      return  _this.apiCall('followers',{user_id:user_id})
        .then(
        function(response){
          if(!user_id){
            _this.followersList.splice(0,_this.followersList.length);
            _this.followersList=_this.followersList.concat(response.data);
            _this.followersHash= _this.followersList.reduce(function(hash,follower){
              hash[follower.id]=follower;
              return hash;
            },{})
            return _this.followersList;
          }
          else{
            return response.data;
          }

        },
        function(){
          return _this.followersList;
        }
      )
    };



    this.following=function(user_id){
      return  _this.apiCall('following',{user_id:user_id})
        .then(
        function(response){
          if(!user_id){
            _this.followingList.splice(0,_this.followingList.length);
            _this.followingList=_this.followingList.concat(response.data);

            _this.followingHash= _this.followingList.reduce(function(hash,followed){
              hash[followed.id]=followed;
              return hash;
            },{})

            return _this.followingList;
          }
          else{
            return response.data;
          }

        },
        function(){
          return _this.followingList;
        }
      )
    };



    this.followable=function(text,items_page,page){
      var callData={};
      if(text){
        callData.search_text=text;
      }
      if(items_page){
        callData.page=page||1;
        callData.per_page=items_page;
      }
      return  _this.apiCall('followable',callData)
        .then(
        function(response){
          return response.data;
        },
        function(){
          return [];
        }
      )
    };


    this.follow=function(user_id){
      if(!user_id){
        return $q.reject(new Error('missing user_id'));
      }
      return  _this.apiCall('follow',{user_id:user_id})
        .then(function(response){
          _this.followingList.push(response.data);
          _this.followingHash[user_id]=response.data;
        })
    }

    this.unfollow=function(user_id){
      if(!user_id){
        return $q.reject(new Error('missing user_id'));
      }
      return  _this.apiCall('unfollow',{user_id:user_id})
        .then(function(response){
          var idx=_this.followingList.indexOf(_this.followingHash[user_id]);
          _this.followingList.splice(idx,1);
          delete _this.followingHash[user_id];
        })
    }

    this.clear=function(){
      _this.followersList=[];
      _this.followersHash={};
      _this.followingList=[];
      _this.followingHash={};
      _this.followableList=[];

    }
  });
