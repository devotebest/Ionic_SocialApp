'use strict';

/**
 * @ngdoc service
 * @name wwwApp.comments
 * @description
 * # comments
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('commentsService', function($http,$q,commentsEndpoints,xhrHandler) {
    var _this=this;
    _this.root='';

    _this.apiCall=function(endpoint,dataObj){
      var url=_this.root+(commentsEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:commentsEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,commentsEndpoints[endpoint])
    }



    this.get=function(question_id){
      return  _this.apiCall('comments',{question_id:question_id})
        .then(
        function(response){
          return response.data;
        },
        function(){
          return [];
        }
      )
    }

    this.post=function(msg,parent,question_id){

      return _this.apiCall('post_comment',{content:msg,parent_id:parent.id,question_id:question_id}).
        then(
        function(response){
          return response.data
        },
        function(){
          return false;
        }
      );
    }

    this.getUserComments=function(user_id){
      var queryData={};
      if(user_id){
        queryData.user_id=user_id;
      }

      return _this.apiCall('user',queryData)
        .then(
        function(response){
          return response.data;
        }
      );
    }
  });
