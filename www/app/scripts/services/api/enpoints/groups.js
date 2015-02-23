'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('groupsEndpoints', {
    get:{
      required:{
        auth_token:'string'
      },
      method:'GET',
      path:'groups'
    },
    create:{
      required:{
        auth_token:'string',
        name:'string'
      },
      path:'group'
    },
    update:{
      required:{
        auth_token:'string',
        id:'number',
        name:'string'
      },
      method:'PUT',
      path:'group'
    },
    delete:{
      required:{
        auth_token:'string',
        id:'number'
      },
      method:'DELETE',
      path:'group'
    },
    add_user:{
      required:{
        auth_token:'string',
        id:'number',
        user_id:'number'
      },
      method:'PUT'
    },
    remove_user:{
      required:{
        auth_token:'string',
        id:'number',
        user_id:'number'
      },
      method:'PUT'
    }

  });
