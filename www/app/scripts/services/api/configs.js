'use strict';

/**
 * @ngdoc service
 * @name 2centsApp.api/configs
 * @description
 * # api/configs
 * Value in the 2centsApp.
 */
angular.module('statisfy',['ng'])
  .value('Configs',{
        base_url:'http://labs.statisfy.co/v/2.0/',
        api_signature:'eee0326c65497495144b5382085ea4370b7003bddd9608b2d2f7616d0a3d7fc4',
        device_vendor_identifier:'TEST',
        version:'1.2'
    });
