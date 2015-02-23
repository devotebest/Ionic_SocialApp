'use strict';

/**
 * @ngdoc service
 * @name wwwApp.comments
 * @description
 * # comments
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('groupsService', function($http,$q,groupsEndpoints,xhrHandler) {
    var _this=this;
    _this.root='groups/';
    _this.list=[];
    _this.groupsHash={}
    _this.apiCall=function(endpoint,dataObj){
      var url=_this.root+(groupsEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:groupsEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,groupsEndpoints[endpoint])
    }



    this.get=function(user_id){
      var dataObj={};
      if(user_id && user_id!==true){
        dataObj.user_id=user_id;
      }
      else if(user_id===true){
        _this.list=[];
        _this.groupsHash={};
      }


      if(_this.list.length){
        return $q.resolve(_this.list)
      }

      return  _this.apiCall('get',dataObj)
        .then(
        function(response){
          _this.list=_this.list.concat(response.data);
          _this.groupsHash=angular.extend(_this.groupsHash,response.data.reduce(function(hash,group){
            hash[group.id]=group;
            return hash;
          },{}));
          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.create=function(dataObj){
      if(!dataObj){
        return $q.reject(new Error('missing data'))
      }

      return  _this.apiCall('create',dataObj)
        .then(
        function(response){
          _this.list.push(response.data);
          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.update=function(group,dataObj){
      if(!dataObj || !group){
        return $q.reject(new Error('missing data'))
      }
      dataObj.id=group.id;
      return  _this.apiCall('update',dataObj)
        .then(
        function(response){
          group=angular.extend(group,response.data);
          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.delete=function(group_id){
      var dataObj={};
      if(group_id){
        dataObj.id=group_id;
      }
      return  _this.apiCall('delete',dataObj)
        .then(
        function(response){
          var group_idx=_this.list.reduce(function(group_index,local_group,idx){
            if(local_group.id==group_id){
              group_index=idx;
            }
            return group_index;
          },-1);
          _this.list.splice(group_idx,1);
          return response.data;
        },
        function(){
          return [];
        }
      )
    };

    this.add_member=function(dataObj){
      if(!dataObj){
        return $q.reject(new Error('missing data'))
      }

      return _this.apiCall('add_user',dataObj).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }

    this.remove_member=function(dataObj){
      if(!dataObj){
        return $q.reject(new Error('missing data'))
      }

      return _this.apiCall('remove_user',dataObj).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }

    this.create=function(){
      _this.list=[];
      _this.groupsHash={}
    }



  });
