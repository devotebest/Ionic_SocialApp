'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/xhrHandler
 * @description
 * # api/xhrHandler
 * Service in the wwwApp.
 */
angular.module('statisfy')
  .service('xhrHandler', function (Configs,$q,$timeout, $http) {
    var _this=this;
    _this.call=function(call,config){
        return _this.validate(call,config)
            .then(function(){
                var method=call.method||'POST';
                var xhrConfig={
                    url:(Configs.base_url+call.url),
                    method:method

                },
                data_holder=/PUT|POST/.test(method)?'data':'params'
                xhrConfig[data_holder]=angular.copy(call.data);
                xhrConfig[data_holder].auth_token=Configs.auth_token;
                return $http(xhrConfig);
            },
            function(response){
              if(response.data.error_code==401 || response.data.error_code==403){
               // return $state.go('app.auth')
              }
              return $q.reject(response.data.error_msg);
            }
        )
    }

    _this.validate=function(call,config){
        var def=$q.defer();
        if(!call.url || (call.method && !/DELETE|GET|POST|PUT|PATCH/.test(call.method)) || ((!call.method || /POST|PUT|PATCH/.test(call.method)) && !call.data)){
            console.log('xhr request error:');
            console.error(call);
            return $q.reject(new Error("Bad Request"))
        }
        if(!config){
            return $q.when(true);
        }

        if(call.method!==config.method){
            return $q.reject(new Error('Methods missmatch'));
        }

        var is_valid=true;
        angular.forEach(config.required,function(type,key){
            is_valid=is_valid && !!(key in call.data);
            if(!is_valid){
             return def.reject(new Error((key+' is required')));
            }
        })


        return $q.when(true);

    }
  });
