'use strict';

/**
 * @ngdoc service
 * @name wwwApp.categories
 * @description
 * # categories
 * Value in the wwwApp.
 */
angular.module('starter.values')
  .service('categoriesList',function(categoriesResponse,$timeout){
    var _this=this;
    this.list=[];
    this.categoriesHash={};
    categoriesResponse.$promise.then(function(categories){
      _this.list=_this.list.concat(categories.map(function(wrapper){
        return wrapper.category;
      }));

      _this.categoriesHash=angular.extend(_this.list.reduce(function(value,category){
        value[category.id]=category;
        return value;
      },{}))

    })

    this.getDetails=function (id){
      if(_this.list.length){
        return angular.copy(_this.categoriesHash[id])
      }
      categoriesResponse.$promise.then(function(){
        $timeout(function(){
          response=angular.extend(response,_this.getDetails(id))

        })

      })

      var response={};





      return response;

    };

  });
