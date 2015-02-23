'use strict';

/**
 * @ngdoc service
 * @name appApp.linearNavigation
 * @description
 * # linearNavigation
 * Service in the appApp.
 */
angular.module('starter.services')
  .service('linearNavigation', function linearNavigation($ionicHistory) {
    /*var service=$ionicHistory,
      history=this.history=$ionicHistory._getHistory().stack;*/
    this.goBack=function(){
      /*var backcount=2;
      if(service.getCurrentView()==history[history.length-backcount])
        backcount++;
      if(history.length<backcount){
        return
      }

      history[history.length-backcount].go();*/
    };
  });
