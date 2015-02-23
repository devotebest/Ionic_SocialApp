'use strict';

/**
 * @ngdoc service
 * @name wwwApp.comments
 * @description
 * # comments
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('messagesService', function($http,$q,messagesEndpoints,xhrHandler,$interval) {

    var _this=this,
      per_page=500,
      intervalHandler
      ;
    _this.root='';
    _this.more_to_come=true;
    _this.data={
      list:[]
    };
    _this.apiCall=function(endpoint,dataObj){
      var url=_this.root+(messagesEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:messagesEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,messagesEndpoints[endpoint])
    }

    _this.number_of_unread_messages=function(){
      return  _this.apiCall('number_of_unread_messages',{})
        .then(
        function(response){
          if(! intervalHandler){
            intervalHandler=$interval(_this.number_of_unread_messages,10000);
          }
          _this.data.number_of_unread_messages=response.data.number_of_unread_messages;

          if(response.data.number_of_unread_messages){
            _this.get();
          }


          return response.data;
        },
        function(){
          return 0;
        }
      )
    };

    _this.get=function(){
      if(!_this.more_to_come){
        return $q.when(_this.data.list);
      }

      var list_length=_this.data.list.length;
      return _this.apiCall('getPaginated',{
        previous_last_id:(list_length?_this.data.list[list_length-1]:{}).id,
        count:per_page
      }).then(
        function(response){
          var list=response.data?(response.data.messages?response.data.messages:[]):[];
          _this.data.list=_this.data.list.concat(
            list.map(function(item){
              return item.message;
            })
          );
          _this.more_to_come=list.length>=per_page;
          return _this.data.list;
        }
      )
    }

    _this.refreshList=function(){
      _this.more_to_come=true;
      _this.data.list.splice(0,_this.data.list.length);
      return _this.get();
    }

    _this.delete=function(message_id){
      return  _this.apiCall('delete',{id:message_id})
    }



    _this.clearRecords=function(){
      _this.data.list=[];
      _this.data.number_of_unread_messages=0;
      $interval.cancel(intervalHandler);

    }

  });
