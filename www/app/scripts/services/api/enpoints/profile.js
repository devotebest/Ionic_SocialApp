'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('profileEndpoints', {
    profile:{
      required:{
        auth_token:'string'
      }
    },
    set_headshot:{
      required:{
        auth_token:'string',
        image_url:'string'
      },
      path:'profile/headshot'
    },
    get_headshot:{
      required:{
        auth_token:'string'
      },
      method:'GET',
      path:'profile/headshot'

    }

  });
