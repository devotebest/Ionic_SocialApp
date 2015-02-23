'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('communitiesEndpoints', {
    as_member:{
      required:{
        auth_token:'string'
      },
      method:'GET',
      path:'communities/as_member'
    },
    as_owner:{
      required:{
        auth_token:'string'
      },
      method:'GET',
      path:'communities/as_owner'
    },
    as_potential:{
      required:{
        auth_token:'string'
      },
      method:'GET',
      path:'communities/as_potential_member'
    },
    create_community:{
      required:{
        auth_token:'string'
      },
      path:'communities'
    },
    add_member:{
      required:{
        auth_token:'string',
        user_id:'number',
        community_id:'number'
      },
      path:'communities/members'
    },
    remove_member:{
      required:{
        auth_token:'string',
        user_id:'number',
        community_id:'number'
      },
      path:'communities/members',
      method:'DELETE'
    }

  });
