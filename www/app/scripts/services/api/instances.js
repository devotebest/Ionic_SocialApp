'use strict';

/**
 * @ngdoc service
 * @name 2centsApp.api/instances
 * @description
 * # api/instances
 * Service in the 2centsApp.
 */
angular.module('statisfy')
  .service('Instance', function ($http,Configs,$q,$localStorage,deviceDetector) {
    var _this=this,
      def=$q.defer();

    _this.ready=def.promise;
    var data={
      api_signature:Configs.api_signature ,
        device_vendor_identifier:Configs.device_vendor_identifier,
        platform:'ios',
        manufacturer:deviceDetector.browser,
        model:'web',
        os_version:deviceDetector.device,
        app_version:Configs.version
    };
    if($localStorage.instance_token){
      data.instance_token=$localStorage.instance_token
    }
     $http(
        {
            url:Configs.base_url+'instances.json',
            method:'POST',
            data:data
        }
    ).
    then(
        function(response){
            angular.extend(_this,response.data);
          if(response.data.instance_token){
            $localStorage.instance_token=response.data.instance_token
          }
            return _this;
        },
        function(err){
            console.log('error');
            //
            angular.extend(_this,instancesResponse);
            //
            return _this;
        }
    ).
    finally(function(response){
        return def.resolve(_this)
      });
  });
