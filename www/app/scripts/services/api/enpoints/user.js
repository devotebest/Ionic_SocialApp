'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/user
 * @description
 * # api/enpoints/user
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('userEndpoints', {
    login:{
      required:{
        instance_token:'string',
        password:'string',
        $$xor:{
          email:'string',
          username:'string'
        }
      }
    },
    anonymous:{
      required:{
        instance_token:'string'
      }
    },
    register:{
      required:{
        email:'string',
        username:'string',
        password:'string',
        name:'string',
        birthdate:'string',
        gender:'string',
        instance_token:'string'
      }
    },
    promote:{
      required:{
        email:'string',
        username:'string',
        password:'string',
        birthdate:'string',
        gender:'string',
        instance_token:'string'
      }
    },
    logout:{
      required:{
        instance_token:'string'
      }
    },
    reset_password:{
      required:{
        instance_token:'string',
        $$xor:{
          email:'string',
          username:'string'
        }
      }
    },
    location:{
      required:{
        instance_token:'string',
        source:'string',
        accuracy:'string',
        longitude:'number',
        latitude:'number'
      }
    },
    'register/facebook':{
      required:{
        instance_token:'string',
        username:'string',
        facebook_token:'string'
      }
    },
    init:{
      method:'GET'
    }

  });
