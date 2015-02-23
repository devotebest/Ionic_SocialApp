'use strict';

/**
 * @ngdoc service
 * @name wwwApp.values/notificationsList
 * @description
 * # values/notificationsList
 * Value in the wwwApp.
 */
angular.module('starter.values')
  .factory('categoriesResponse',['$http','xhrHandler','Instance','$q',function($http, xhrHandler,Instance, $q){
    var _this=this;
    _this.categories=[];
    var defer=$q.defer();
    _this.categories.$promise=defer.promise;
    var dataObj={instance_token:Instance.instance_token};
    var callObject={
      data:dataObj,
      url:'categories.json',
      method:'POST'
    };
    xhrHandler.call(callObject,{method:'POST'})
      .then(function(response){
        _this.categories=_this.categories.concat(response.data);
        defer.resolve(response.data);
      })


    return _this.categories;
  }])

