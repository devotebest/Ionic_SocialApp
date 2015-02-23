'use strict';

/**
 * @ngdoc service
 * @name wwwApp.notifications
 * @description
 * # notifications
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('notifications', function notifications(notificationsResponse,unreadMessages,$interval) {
    var _this=this;

    function getNew(){
      angular.extend(_this,unreadMessages);
    };
    getNew();
    $interval(getNew,10000);
  });
