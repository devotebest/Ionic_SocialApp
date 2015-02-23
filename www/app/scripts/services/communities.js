'use strict';

/**
 * @ngdoc service
 * @name wwwApp.comments
 * @description
 * # comments
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('communitiesService', function($http,$q,communitiesEndpoints,xhrHandler) {
    var _this=this;
    _this.root='';
    _this.as_ownerList=[];
    _this.as_memberList=[];

    _this.apiCall=function(endpoint,dataObj){
      var url=_this.root+(communitiesEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:communitiesEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,communitiesEndpoints[endpoint])
    }



    this.as_owner=function(user_id){
      var dataObj={};
      if(user_id && user_id!==true){
        dataObj.user_id=user_id;
      }
      else if(user_id===true){
        _this.as_ownerList=[];
      }
      return  _this.apiCall('as_owner',dataObj)
        .then(
        function(response){
          if(!user_id || user_id===true){
            response.data.forEach(function(comm){
              comm.i_am_member=true;
            })
            _this.as_ownerList=_this.as_ownerList.concat(response.data);
          }

          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.as_member=function(user_id){
      var dataObj={};
      if(user_id && user_id!==true){
        dataObj.user_id=user_id;
      }
      else if(user_id===true){
        _this.as_memberList=[];
      }

      return  _this.apiCall('as_member',dataObj)
        .then(
        function(response){
          if(!user_id || user_id===true){
            response.data.forEach(function(comm){
              comm.i_am_member=true;
            })
            _this.as_memberList=_this.as_memberList.concat(response.data);
          }

          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.as_potential_member=function(search_text,per_page,page){
      var dataObj={};
      if(search_text){
        dataObj.search_text=search_text;
      }
      if(per_page){
        dataObj.per_page=per_page;
        dataObj.page=page;
      }
      return  _this.apiCall('as_potential',dataObj)
        .then(
        function(response){
          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.createCommunity=function(communityData){
      if(!communityData){
        return $q.reject({error_msg:'Invalid Community Data'});
      }


      return _this.apiCall('create_community',communityData).
        then(
        function(response){
          _this.as_ownerList.unshift(response.data);
          return response.data
        },
        function(){
          return false;
        }
      );
    }


    this.addMember=function(user_id,community,password){
      var dataObj={
        user_id:user_id,
        community_id:community.id
      };
      if(password && community.private){
        dataObj.password=password;
      }

      return _this.apiCall('add_member',dataObj).
        then(
        function(response){
          return response.data
        }
      );
    }
    this.removeMember=function(user_id,community){
      var dataObj={
        user_id:user_id,
        community_id:community.id
      };

      return _this.apiCall('remove_member',dataObj).
        then(
        function(response){
          return response.data
        }
      );
    }

    this.create=function(){
      _this.as_ownerList=[];
      _this.as_memberList=[];
    }

    /*this.updateComunity=function(msg,parent,question_id){

      return _this.apiCall('communities',{content:msg,parent_id:parent.id,question_id:question_id}).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }

    this.deleteComunity=function(msg,parent,question_id){

      return _this.apiCall('communities',{content:msg,parent_id:parent.id,question_id:question_id}).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }

    this.addMember=function(msg,parent,question_id){

      return _this.apiCall('communities/members',{content:msg,parent_id:parent.id,question_id:question_id}).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }

    this.deleteMember=function(msg,parent,question_id){

      return _this.apiCall('communities/members',{content:msg,parent_id:parent.id,question_id:question_id}).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }
    this.summonMultiple=function(msg,parent,question_id){

      return _this.apiCall('communities/summon_multiple',{content:msg,parent_id:parent.id,question_id:question_id}).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }*/

  });
