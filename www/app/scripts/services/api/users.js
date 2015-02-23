'use strict';

/**
 * @ngdoc service
 * @name 2centsApp.api/users
 * @description
 * # api/users
 * Service in the 2centsApp.
 */
angular.module('statisfy')
  .service('User', function(Instance,userEndpoints,Configs,xhrHandler,$localStorage,relationshipsService,profileService,communitiesService,groupsService,$q,$ionicLoading,messagesService) {
        var _this=this,
          dependenciesReady=$q.defer();;

    _this.relationships=relationshipsService;
    _this.profile=profileService;
    _this.communities=communitiesService;
    _this.groups=groupsService;
    Configs.auth_token=$localStorage.auth_token

    Configs.auth_token=$localStorage.auth_token;
    Configs.anonymous_user=$localStorage.anonymous_user;
    Configs.previousRegistered=$localStorage.previousRegistered;
    _this.anonymous_user=Configs.anonymous_user;

        _this.root='users/'
        _this.all_ready=dependenciesReady.promise;
        _this.ready=Instance.ready.
            then(
            function(){
              var readyDefer=$q.defer();
              var canContinue;
              if(Configs.auth_token) {
                canContinue = $q.when(Configs.auth_token)
              }
              else if(Configs.previousRegistered){

              }
              else{
                canContinue=_this.anonymous();
              }

              canContinue.then(loadDependencies)
                .then(function(dependencies){
                  if(!dependencies[2].username){
                    return readyDefer.reject(null);
                  }

                  readyDefer.resolve(_this);
                    dependenciesReady.resolve(_this);
                    return _this;
                  },
                  function(e){
                    readyDefer.reject(e.data);
                  }
              )



                return readyDefer.promise;
            }
          )

        _this.userData={};

        _this.apiCall=function(endpoint,dataObj){
          dataObj.instance_token=Instance.instance_token;
          var url=_this.root+endpoint+'.json';
          var callObject={
            data:dataObj,
            url:url,
            method:userEndpoints[endpoint].method
          };
          $ionicLoading.show();
          return xhrHandler.call(callObject,userEndpoints[endpoint])
        }

        _this.login=function(authObject){
          return _this.apiCall('login',authObject).
            then(function(response){
              var dependenciesReady=$q.defer();
              _this.ready=dependenciesReady.promise;
              var user=response.data;
              _this.userData=angular.extend(_this.userData,user);
              Configs.auth_token=user.auth_token;
              Configs.user_id=user.user_id;
              $localStorage.auth_token=user.auth_token;
              $localStorage.auth_id=user.user_id;
              delete $localStorage.anonymous_user;
              delete Configs.anonymous_user;
              delete _this.anonymous_user
              $ionicLoading.hide();
              loadDependencies().
                then(function(){
                  dependenciesReady.resolve(_this);
                  return _this;
                })


              return _this;
            }
          )
        }
        _this.anonymous=function(authObject){
          return _this.apiCall('anonymous',{}).
            then(function(response){
              var dependenciesReady=$q.defer();
              _this.ready=dependenciesReady.promise;
              var user=response.data;
              _this.userData=angular.extend(_this.userData,user);
              Configs.auth_token=user.auth_token;
              Configs.user_id=user.user_id;
              Configs.anonymous_user=true;
              $localStorage.auth_token=user.auth_token;
              $localStorage.auth_id=user.user_id;
              $localStorage.anonymous_user=true;
              delete Configs.previousRegistered
              $localStorage.previousRegistered=null;
              _this.anonymous_user=Configs.anonymous_token;

              $ionicLoading.hide();
              loadDependencies().
                then(function(){
                  dependenciesReady.resolve(_this);
                  return _this;
                })


              return _this;
            },
            function(error){
              $ionicLoading.hide();
              return $q.reject(error)
            }
          )
        }
        _this.register=function(authObject){
            return _this.apiCall('register',authObject).
                then(function(response){
                    var user=response.data;
                    _this.userData=angular.extend(_this.userData,user);
                    Configs.auth_token=user.auth_token;
                    Configs.user_id=user.user_id;
                    $localStorage.auth_token=user.auth_token;
                    $localStorage.auth_id=user.user_id;
                    return _this.userData;
                })
              .
              finally(function(){
                $ionicLoading.hide();
              })
        }
        _this.promote=function(authObject){
            return _this.apiCall('promote',authObject).
                then(function(response){
                    var user=response.data;
                    _this.userData=angular.extend(_this.userData,user);
                    Configs.auth_token=user.auth_token;
                    Configs.user_id=user.user_id;
                    $localStorage.auth_token=user.auth_token;
                    $localStorage.auth_id=user.user_id;
                    return _this.userData;
                })
              .
              finally(function(){
                $ionicLoading.hide();
              })
        }


        _this.register_facebook=function(authObject){
            _this.apiCall('register/facebook',authObject).
                then(function(response){
                    _this.userData=angular.extend(_this.userData,response.data);
                    return _this.userData;
                })
        }
        _this.logout=function(){
            return _this.apiCall('logout',{}).
                then(function(response){
                delete $localStorage.auth_token;
                delete $localStorage.auth_id;
                delete Configs.auth_token
                _this.relationships.clear();
                _this.profile.clear();
                _this.communities.clear();
                _this.groups.clear();
                $ionicLoading.hide();
                return _this;
              })
        }

        _this.reset_password=function(authObject){
            _this.apiCall('reset_password',authObject).
                then(function(response){

                })
        }
        _this.location=function(authObject){
            _this.apiCall('location',authObject).
                then(function(response){

                })
        }

        _this.init=function(){
            _this.apiCall('init',{}).
                then(function(response){
                    _this.userData=angular.extend(_this.userData,response.data);
                    return _this.userData;
                })
        }

      function loadDependencies(){
        return $q.all(
          [
            _this.relationships.followers(),
            _this.relationships.following(),
            _this.profile.get(true),
            _this.groups.get(true),
            _this.communities.as_owner(true),
            _this.communities.as_member(true),
            messagesService.number_of_unread_messages()
          ]
        )
      }


  });
