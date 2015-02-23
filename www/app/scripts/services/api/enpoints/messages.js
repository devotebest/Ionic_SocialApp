'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('messagesEndpoints', {
    number_of_unread_messages:{
      required:{
        auth_token:'string'
      },
      method:'GET',
      path:'messages/number_of_unread_messages'
    },
    read:{
      required:{
        auth_token:'string',
        id:'number'
      },
      path:'messages/read'
    },
    delete:{
      required:{
        auth_token:'string',
        id:'number'
      },
      path:'messages/delete'
    },
    read_multiple:{
      required:{
        auth_token:'string',
        ids:'string'
      },
      method:'PUT',
      path:'messages/read_multiple'
    },
    read_all:{
      required:{
        auth_token:'string'
      },
      path:'messages/read_all'
    },
    delete_all:{
      required:{
        auth_token:'string'
      },
      path:'messages/delete_all'
    },
    getPaginated:{
      required:{
        auth_token:'string'
      },
      path:'messages'
    },
    getAll:{
      required:{
        auth_token:'string'
      },
      path:'messages',
      method:'GET'

    }


  });
