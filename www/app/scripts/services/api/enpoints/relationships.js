'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('relationshipsEndpoints', {
    followers:{
      required:{
        auth_token:'string'
      },
      method:'GET'
    },
    following:{
      required:{
        auth_token:'string'
      },
      method:'GET'
    },
    followable:{
      required:{
        auth_token:'string'
      },
      method:'GET'
    },
    follow:{
      required:{
        auth_token:'string'
      }
    },
    unfollow:{
      required:{
        auth_token:'string'
      }
    }

  });
