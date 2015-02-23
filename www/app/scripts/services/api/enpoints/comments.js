'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('commentsEndpoints', {
    comments:{
      required:{
        auth_token:'string',
        question_id:'number',
      },
      method:'GET'
    },
    post_comment:{
      path:'comments',
      required:{
        auth_token:'string',
        question_id:'number',
        content:'string'
      }
    },
    user:{
      path:'comments/user',
      required:{
        auth_token:'string'
      }
    }

  });
