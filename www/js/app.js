// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.values',
  'starter.directives',
  'starter.filters',
  'starter.services',
  'ngStorage',
  'monospaced.elastic',
  'statisfy',

  /*needed for webapp not so much for phones although could be used too*/
  'file-model',
  'lrFileReader',
  'ng.deviceDetector'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider,$httpProvider) {

    $httpProvider.interceptors.unshift(
      function ($q) {
        return {

          'response': function(response,request) {
              if(response.data.error_code){
                response.statusCode=response.data.error_code;

                return $q.reject(response);
              }
            return response;

          }
        };
      }
    );






  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl',
      resolve:{
          user:function(User,$q,$state,$timeout){
              return User.ready
                .then(function(){
                  return true;
                },
                function(){
                  $timeout(function(){

                    $state.go('app.auth.login');
                  })
                  return true;

                }
              )
                ;
          }
      }
    })
    .state('app.auth', {
      url: "/auth",
      views: {
        'menuContent' :{
          templateUrl: "templates/auth/index.html",
          controller:function($scope,$state,$ionicLoading){
            $ionicLoading.hide();
            if(/auth$/.test($state.$current.name)){
              $state.go('app.auth.login');
            }
            $scope.state=$state;
            $scope.$watch('state.$current',function(v){
              $scope.current_state= v.name.split('.').pop();
            })
            $scope.signup=function(){
              $scope.$broadcast('signUp');
            }
            $scope.login=function(){
              $scope.$broadcast('logIn');
            }
          }
        }
      }

    })

    .state('app.auth.login', {
      templateUrl: "templates/auth/login.html",
      controller:function($scope,$state,User,$ionicPopup,$ionicLoading,profileService){
        $ionicLoading.hide();
        $scope.authObject={};
        $scope.$on('logIn',function(){
          if($scope.loginForm.$valid){
            $scope.submitForm();
          }

        })

        $scope.submitForm=function(){
          User.login($scope.authObject).
            then(function(){
              $state.go('app.tutorial');
            },
            function(error){
              $ionicPopup.alert({
                title: 'We Are Sorry', // String. The title of the popup.
                template: error, // String (optional). The html template to place in the popup body.
                okText: 'Close', // String (default: 'OK'). The text of the OK button.
                okType: 'button-positive button-clear' // String (default: 'button-positive'). The type of the OK button.
              })
            }
          )
        }
      }

    })
    .state('app.auth.signup', {
      templateUrl: "templates/auth/signup.html",
      controller:function($scope,$state,User,$ionicLoading,profileService,Configs){
        $ionicLoading.hide();
        $scope.authObject={
          username:profileService.data.username,
          email:profileService.data.email
        };
        $scope.$on('signUp',function(){
          if($scope.signupForm.$valid){
            $scope.submitForm();
          }

        })

        $scope.submitForm=function(){
          var apiMethod=User.register;
          if(Configs.anonymous_user){
            $scope.authObject.auth_token=Configs.auth_token;
            apiMethod=User.promote;
          }
          apiMethod($scope.authObject).
            then(function(){
              var hash=MD5($scope.authObject.email);
              User.set_headshot('http://www.gravatar.com/avatar/'+hash+'.jpg')
                .then(function(){
                  User.profile.avatar_url='http://www.gravatar.com/avatar/'+hash+'.jpg';
                })
              $state.go('app.tutorial');
            })
        }
      }
    })

    .state('app.tutorial', {
      url: "/tutorial",
      views: {
        'menuContent' :{
          templateUrl:'templates/tutorial.html',
          controller:function($scope,instancesResponse,tutorialImages,$state,$window){
            $scope.tutorial=tutorialImages;
            $scope.moveOn=function(){
              $state.go('app.questions');
            };

          }

        }
      },
      resolve:{
        tutorialImages:function(cssBreakPoints,$q,$state,$ionicLoading){


          $ionicLoading.show();
          var res=cssBreakPoints.getWidthPointName();
          var imgPromises=[];



          function getImage(num,resolution){
            var idx=num;
            var image=new Image();
            var imgDef=$q.defer();
            imgPromises.push(imgDef.promise)
            image.onload=function(){
              imgDef.resolve(image);
            }
            image.onerror=function(){
              imgDef.reject(image);
            }
            image.src='img/tutorial/'+resolution+'/page_'+num+'.jpg'

          }




          for(var i=1;i<2;i++){
            getImage(i,res);
          }




          return $q.all(imgPromises).
            then(function(images){
              $ionicLoading.hide();
              return images;
            },
            function(){
              $state.go('app.questions')
            }
          )


        }
      }

    })

    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl:'templates/include_url.html',
          controller:function($scope,instancesResponse,$sce,$ionicHistory,previous,$state){
            $scope.url=$sce.trustAsResourceUrl(instancesResponse.about_url);
            $scope.page_title="Our Mission";
            $scope.close=function(){
              var previous_state=(previous && previous.name)?previous.name:'app.questions';
              $state.go(previous_state,{replace:true});
            }

          }
        }
      },
      resolve:{
        previous:function($state){
          return $state.current;
        }
      }

    })
    .state('app.terms', {
      url: "/terms",
      views: {
        'menuContent' :{
          templateUrl:'templates/include_url.html',
          controller:function($scope,instancesResponse,$sce,previous,$state){
            $scope.url=$sce.trustAsResourceUrl(instancesResponse.terms_and_conditions_url);
            $scope.page_title='Privacy, Terms & Credits';
            $scope.close=function(){
              var previous_state=(previous && previous.name)?previous.name:'app.questions';
              $state.go(previous_state,{replace:true});
            }
          }
        }
      },
      resolve:{
        previous:function($state){
          return $state.current;
        }
      }

    })
    .state('app.faq', {
      url: "/faq",
      views: {
        'menuContent' :{
          templateUrl:'templates/include_url.html',
          controller:function($scope,instancesResponse,$sce,previous,$state){
            $scope.url=$sce.trustAsResourceUrl(instancesResponse.faq_url);
            $scope.page_title='Help';
            $scope.close=function(){
              var previous_state=previous?previous.name:'app.questions';
              $state.go(previous_state,{replace:true});
            }
          }
        }
      },
      resolve:{
        previous:function($state){
          return $state.current;
        }
      }

    })
    .state('app.feedback', {
      url: "/feedback",
      views: {
        'menuContent' :{
          templateUrl:'templates/include_url.html',
          controller:function($scope,instancesResponse,$sce,previous,$state){
            $scope.url=$sce.trustAsResourceUrl(instancesResponse.feedback_url);
            $scope.page_title="Feedback";
            $scope.close=function(){
              var previous_state=previous?previous.name:'app.questions';
              $state.go(previous_state,{replace:true});
            }
          }
        }
      },
      resolve:{
        previous:function($state){
          return $state.current;
        }
      }

    })

    .state('app.profile', {
      url: "/profile/:user_id",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile/profile.html",
          controller:function($scope,$stateParams,$state,lrFileReader,$timeout,User,ExternalUser,profileService,Configs,$ionicSideMenuDelegate){
            $ionicSideMenuDelegate.canDragContent(false);
            $scope.ExternalUser=ExternalUser;
            $scope.configs=Configs;
            $scope.image_dialog={
              dialog_opened:false
            }

            $scope.$on('$stateChangeSuccess',function(state){
              if(/profile$/.test($state.$current.name)){
                if(!$stateParams.user_id){
                  $state.go('app.profile.notifications');
                }
                else{
                  $state.go('app.profile.questions',{user_id:$stateParams.user_id});
                }

              }
            })

            $scope.state=$state;
            $scope.$watch('state.$current',function(v){
              $scope.current_state= v.name.split('.').pop();
            })
            $scope.user=User;
            $scope.image_dialog.image=User.profile.data.avatar_url;

            $scope.onUpload=function(url){
              profileService.set_headshot(url)
                .then(function(){
                  $scope.image_dialog.image=url;
                  User.profile.data.avatar_url=url
                })

            }

            $scope.createCommunity=function(){
              $scope.$broadcast('createCommunity');
            }
            $scope.selected_profile=$stateParams.user_id?ExternalUser:User.profile.data;
          },
          resolve:{
            ExternalUser:function(user,$state,$stateParams,profileService,$q){

              var def=$q.defer();
              if(!$stateParams.user_id){
                return def.resolve({})
              }

              profileService.get($stateParams.user_id).
                then(
                function(profile){
                  def.resolve(profileService.otherProfileData);
                }
              )
              return def.promise;
            }
          }
        }

      }
    })

    .state('app.profile.notifications', {
      url:'/notifications',
      templateUrl: "templates/profile/notifications_list.html",
      controller:function($scope,messagesService,$q){
        $scope.messages=messagesService;

        $scope.loadMoreMessages=function(){
          messagesService.get()
            .then(function(){
              $scope.$broadcast('scroll.infiniteScrollComplete');
            })
        }

        $scope.delete=function(message){
          messagesService.delete(message.id)
            .then(function(){
              var idx=$scope.messages.data.list.indexOf(message);
              $scope.messages.data.list.splice(idx,1);
            })
        }

      },
      resolve:{
        messages:function(messagesService){
          return messagesService.get();
        }
      }
    })

    .state('app.profile.followers', {
      url:'/followers',
      templateUrl: "templates/profile/followers_list.html",
      resolve:{
        followers:function(User,$stateParams){
          return User.relationships.followers($stateParams.user_id);
        }
      },
      controller:function($scope,followers,User,$q,$ionicPopup,$stateParams){
        $scope.followers=followers;
        $scope.groups=User.groups;
        $scope.add2Group=function(member,group){
          if(member.group_ids.indexOf(group.id)>=0){
            return;
          }
          $scope.groups.add_member({id:group.id,user_id:member.id})
            .then(function(result){
              member.group_ids.push(group.id)
            })
        }
        $scope.removeFromGroup=function(member,group_id){
          $scope.groups.remove_member({id:group_id,user_id:member.id})
            .then(function(result){
              var idx=member.group_ids.indexOf(group_id);
              member.group_ids.splice(idx,1)
            })
        }
        $scope.external_user=$stateParams.user_id;

        /*****GROUPS DIALOG*******/


        $scope.showPopup = function() {
          $scope.data = {}

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            templateUrl: 'templates/profile/followers_popover.html',
            title: 'Manage your groups',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                  e.preventDefault();
                  if (!$scope.name) {
                   return
                  } else {
                    return $scope.createGroup($scope.name)
                  }
                }
              },
            ]
          });
          /*myPopup.then(function(name) {
            return $scope.createGroup(name)
          });*/
        };




        $scope.saveGroupData=function(){

        }

        $scope.removeGroup=function(group_id){
          User.groups.delete(group_id)
            .then(function(){
              User.relationships.followersList.forEach(function(member){
                var idx=member.group_ids.indexOf(group_id);
                member.group_ids.splice(idx,1);
              })
            })
        }
        $scope.createGroup=function(name){
          if(!name){
            return $q.reject(new Error('name missing'))
          }
          return User.groups.create({name:name}).
            then(function(){
              $scope.name='';
            })
        }

        $scope.updateGroup=function(group,name){
          if(!name || !group){
            return $q.reject(new Error('data missing'))
          }
          return User.groups.update(group,{name:name})
        }

      }
    })
    .state('app.profile.following', {
      url:'/following',
      templateUrl: "templates/profile/following_list.html",
      resolve:{
        following:function(User,$stateParams){
          return User.relationships.following($stateParams.user_id);
        }
      },
      controller:function($scope,following,relationshipsService,$timeout,$stateParams){
        var timeHandler,
          page= 0,
          per_page=20;

        $scope.following=angular.copy(following);
        $scope.search_text='';
        $scope.there_is_more=true;
        $scope.followable=[];
        $scope.external_user=$stateParams.user_id;


        $scope.inputTiming=function(){
          $timeout.cancel(timeHandler);
          $timeout($scope.findPeople,500);
        }

        $scope.findPeople=function(){
          $scope.followable.splice(0,$scope.followable.length);
          $scope.there_is_more=true;
          page=0;
          if(!$scope.search_text){
            for(var i=0;i<$scope.following.length;i++){
              if($scope.following[i].unfollowed){
                $scope.following.splice(i,1);
                i--;
              }
            }
            return;
          }
          $scope.paginate();
        };

        $scope.paginate=function(){
          page++;
          relationshipsService.followable($scope.search_text,per_page,page).then(
            function(people){
              $scope.followable=$scope.followable.concat(people);
              if(people.length<per_page){
                $scope.there_is_more=false;
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          )
        }

        $scope.follow=function(user){
          relationshipsService.follow(user.id)
            .then(function(){
              delete user.unfollowed;
              user.followed=true;
              var idx=$scope.following.indexOf(user);
              if(idx<0){
                $scope.following.push(user)

              }
            })
        }

        $scope.unfollow=function(user){
          relationshipsService.unfollow(user.id)
            .then(function(){
              user.unfollowed=true
              if(user.followed){
                var idx=$scope.following.indexOf(user);
                if(idx<0){
                  $scope.following.splice(idx,1);

                }
                delete user.followed;
              }
            })
        }
      }
    })

    .state('app.profile.communities', {
      url:'/communities',
      templateUrl: "templates/profile/communities_list.html",
      controller:'CommunitiesCtrl'
    })
    .state('app.profile.communities.join', {
      url:'/join',
      templateUrl: "templates/profile/communities/join.html",
      controller:function($scope,communitiesService,$timeout,$ionicPopup,User,$q){
        var timeHandler,
          page= 0,
          per_page=20;

        $scope.search_text='';
        $scope.there_is_more=true;
        $scope.communities=[];

        $scope.inputTiming=function(){
          $timeout.cancel(timeHandler);
          $timeout($scope.findCommunity,500);
        }

        $scope.findCommunity=function(){
          $scope.communities.splice(0,$scope.communities.length);
          $scope.there_is_more=true;
          page=0;
          if(!$scope.search_text){
            return;
          }
          $scope.paginate();
        };

        $scope.paginate=function(){
          page++;
          communitiesService.as_potential_member($scope.search_text,per_page,page).then(
            function(communities){
              $scope.communities=$scope.communities.concat(communities);
              if(communities.length<per_page){
                $scope.there_is_more=false;
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          )
        }

        $scope.showDescription=function(community){
          $ionicPopup.alert({
            template:(community.description||'No description provided') , // String (optional). The html template to place in the popup body.
            okText: 'Close' // String (default: 'OK'). The text of the OK button.
          })
        }

        $scope.joinCommunity=function(community){

          var promise;
          if(community.private){
            promise=$ionicPopup.prompt({
              title: 'Password Check',
              template: ('Enter community '+community.name+' password'),
              inputType: 'password',
              inputPlaceholder: 'Password'
            })
          }
          else{
            promise=$q.when('')
          }
          promise.then(function(password){
            if(!password && community.private){
              return
            }
            communitiesService.addMember(User.profile.data.user_id,community,password)
              .then(function(){
                community.i_am_member=true;
                communitiesService.as_memberList.push(community);
                var $idx=$scope.communities.filter(function(index,comm,$idx){
                  if(comm.id==community.id){
                    index=idx;
                  }
                  return index;
                },-1);
                $scope.communities.splice($idx,1);
              },function(e){
                $ionicPopup.alert(
                  {
                    title: 'Oops', // String. The title of the popup.
                    template: e.data.error_message, // String (optional). The html template to place in the popup body.
                    okText: 'Close', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-clear button-positive' // String (default: 'button-positive'). The type of the OK button.
                  }
                )
              })
          })




        };


      }
    })
    .state('app.profile.communities.create', {
      url:'/create',
      templateUrl: "templates/profile/communities/create.html",
      controller:function($scope,User,$ionicPopup){
        $scope.communityData={};
        $scope.createCommunity=function(){
          if(!$scope.communityData.name){
            $ionicPopup.alert({
              title: 'Oops', // String. The title of the popup.
              template: 'you forgot to give us a name for your comunity', // String (optional). The html template to place in the popup body.
              okText: 'Close', // String (default: 'OK'). The text of the OK button.
              okType: 'button-clear button-positive', // String (default: 'button-positive'). The type of the OK button.
            })
          }
          else if($scope.communityData.private && !$scope.communityData.password){
            $ionicPopup.alert({
              title: 'Oops', // String. The title of the popup.
              template: 'You set your community as private but no password is provided', // String (optional). The html template to place in the popup body.
              okText: 'Close', // String (default: 'OK'). The text of the OK button.
              okType: 'button-clear button-positive', // String (default: 'button-positive'). The type of the OK button.
            })
          }
          User.communities.createCommunity($scope.communityData)
        }

        $scope.$on('createCommunity',function(){
          if($scope.createCommunityForm.$valid){
            $scope.createCommunity();
          }
        });
      }
    })
    .state('app.profile.communities.mine', {
      url:'/mine',
      templateUrl: "templates/profile/communities/mine.html",
      controller:function($scope,User,$stateParams,communities,communitiesService,$ionicPopup,$q){
        $scope.communities=communities;
        $scope.external_user=$stateParams.user_id;
        $scope.otherUser=User.profile.otherProfileData;

        $scope.joinCommunity=function(community){

          var promise;
          if(community.private){
            promise=$ionicPopup.prompt({
              title: 'Password Check',
              template: ('Enter community '+community.name+' password'),
              inputType: 'password',
              inputPlaceholder: 'Password'
            })
          }
          else{
            promise=$q.when('')
          }
          promise.then(function(password){
            if(!password && community.private){
              return
            }
            communitiesService.addMember(User.profile.data.user_id,community,password)
              .then(function(){
                community.i_am_member=true;
                communitiesService.as_memberList.push(community)
              })
          })




        };

        $scope.leaveCommunity=function(community){

            communitiesService.removeMember(User.profile.data.user_id,community)
              .then(function(){
                community.i_am_member=false;
                var $idx=User.communities.as_memberList.filter(function(index,comm,idx){
                  if(comm.id==community.id){
                    index=idx
                  }
                  return index;
                },-1)
                if($idx>=0){
                  communitiesService.as_memberList.splice($idx,1);
                }
              })





        };

        $scope.iAmMember=function(community){
          return communities.as_memberList.filter(function(communityIBelong){
            return communityIBelong.id==community.id
          })[0];
        }

        $scope.showDescription=function(community){
          $ionicPopup.alert({
            template:(community.description||'No description provided') , // String (optional). The html template to place in the popup body.
            okText: 'Close' // String (default: 'OK'). The text of the OK button.
          })
        }

      },
      resolve:{
        communities:function(User,$stateParams,communitiesService,$q){
          if(!$stateParams.user_id) {
            return User.communities;
          }
            var communitiesArray=[
              communitiesService.as_member($stateParams.user_id),
              communitiesService.as_owner($stateParams.user_id),
              User.all_ready
            ];

            return $q.all(communitiesArray)
              .then(
              function(communities){
                var as_member=communities[0],
                  as_owner=communities[1];
                as_owner.forEach(function(community){
                  if(User.communities.as_memberList.filter(function(comm){
                    return community.id==comm.id
                  }).length){
                    community.i_am_member=true;
                  }
                })
                as_member.forEach(function(community){
                  if(User.communities.as_memberList.filter(function(comm){
                    return community.id==comm.id
                  }).length){
                    community.i_am_member=true;
                  }
                })


                return{
                  as_ownerList:as_owner,
                  as_memberList: as_member
                };

              }
            )



        }
      }
    })

    .state('app.profile.questions', {
      url:'/questions',
      templateUrl: "templates/profile/questions_list.html",
      controller:'ProfileQuestionsCtrl'
    })
    .state('app.profile.questions.asked', {
      url:'/asked',
      templateUrl: "templates/profile/questions/asked.html",
      resolve:{
        List:function(questionsService,$stateParams){
          return questionsService.getAsked($stateParams.user_id);
        }
      },
      controller:'ProfileQuestionsListCtrl'
    })
    .state('app.profile.questions.answered', {
      url:'/answered',

      templateUrl: "templates/profile/questions/answered.html",
      resolve:{
        List:function(questionsService,$stateParams){
          return questionsService.getAnswered($stateParams.user_id);
        }
      },
      controller:'ProfileQuestionsListCtrl'
    })
    .state('app.profile.questions.commented', {
      url:'/commented',
      templateUrl: "templates/profile/questions/commented.html",
      resolve:{
        List:function(commentsService, $stateParams){
          return commentsService.getUserComments($stateParams.user_id);
        }
      },
      controller:'ProfileQuestionsListCtrl'
    })

    .state('app.questions', {
      url: "/questions",
      views: {
        'menuContent' :{
          templateUrl: "templates/questions.html",
          controller: 'QuestionsCtrl',
          resolve:{
            List:function(User,questionsService,$ionicLoading){
              $ionicLoading.show();
              return User.ready.then(
                function(){
                  if(questionsService.questionsList.length){
                    return [];
                  }
                  return questionsService.get();
                }
              )
            }

          }
        }
      }
    })
    .state('app.question_types', {
      url: "/question_types",
      views: {
        'menuContent' :{
          templateUrl: "templates/create_question/question_types.html",
          controller: 'QuestionTypesCtrl'
        }
      }
    })
    .state('app.question_build_result', {
      url: "/question_build_result/:question_id",
      views: {
        'menuContent' :{
          templateUrl: "templates/create_question/question_build_result.html",
          controller:function($scope,$stateParams){
            $scope.question_id=$stateParams.question_id;
          }
        }
      }
    })
    .state('app.question', {
      url: "/question/:question_id",
      views: {
        'menuContent' :{
          templateUrl: "templates/question.html",
            resolve:{
                current_question:function(questionsService,$stateParams,$state,$timeout,$q,User){
                  return User.ready.then(
                    function(){

                      return questionsService.getQuestionById($stateParams.question_id);
                    }
                  ).
                  then(function(question){
                        if(question){
                          questionsService.start(question.id);
                          return question;
                        }
                        else{
                          $timeout(function(){
                            $state.go('app.questions')
                          });
                          return $q.reject(false)
                        }
                      },
                      function(){
                        $timeout(function(){
                          $state.go('app.questions')
                        })
                        return $q.reject(false)
                      }
                    );
                }
            },
            controller:function($scope, $stateParams,current_question,linearNavigation) {
              this.question=$scope.question=current_question;
              $scope.lnav=$scope.lnav=linearNavigation;

              $scope.skip=function(){

              }

            },
            controllerAs:'questionCtrl'
        }
      }
    })

    .state('app.question_stats', {
      url: "/question/:question_id/stats",
      views: {
        'menuContent' :{
          templateUrl: "templates/question_stats.html",
            resolve:{
                current_question:function(questionsService,$stateParams,$state){
                    return questionsService.getQuestionById($stateParams.question_id).
                      then(function(question){
                        if(question && question.summary){
                          return question;
                        }
                        else if(question){
                          return questionsService.getSummary(question);
                        }
                        else{
                          return questionsService.getQuestionDetails($stateParams.question_id);
                        }
                      }).
                      then(function(question){
                        if(!question){
                          throw('not found');
                        }
                        if(!angular.isObject(question.created_at)){
                          question.created_at=new Date(question.created_at*1000);
                        }
                        if(question.summary){
                          question.summary.published_at=new Date(question.summary.published_at*1000);
                        }

                        return question
                      }).
                      catch(
                        function(){
                          $timeout(function(){
                            $state.go('app.questions');
                          })
                          return $q.reject(false);
                        }
                    )
                }
            },
            controller:function($scope,$state,current_question,questionsService,commentsService,profileService,$ionicScrollDelegate,$timeout) {
              $scope.question=current_question;
              $scope.comments=[];
              $scope.comments_tab=true;
              $scope.activeTab={}
              questionsService.getNextID()
                .then(function(location){
                  $scope.next_id=location.id;
                })
              if(current_question.summary.choices){
                current_question.summary.choices.forEach(function(choice){
                  choice.choice=current_question.choices.filter(function(local_choice){
                    return local_choice.id==choice.id
                  })[0];
                })
              }

              commentsService.get(current_question.id).
                then(function(comments){
                  $scope.comments=$scope.comments.concat(comments);
                })

              $scope.postComment=function(msg) {
                var parent = $scope.activeComment ? $scope.activeComment : null;
                commentsService.post(msg, parent,current_question.id).
                  then(
                  function (comment) {
                    if(!comment){
                      return comment;
                    }
                    if (parent) {
                      parent.comment_children.push(comment);
                    }
                    else {
                      $scope.comments.unshift(comment)
                    }
                    return comment;

                  }
                ).
                finally(
                  function(){
                    $scope.activeComment=null;
                  }
                );
                $scope.new_comment='';
              }
              $scope.setActiveComment=function(comment){
                if(comment!=$scope.activeComment){
                  $scope.activeComment=comment;
                }
                else{
                  $scope.activeComment=null;
                }

              }
              $scope.goNext=function(){
                $state.go('app.question',{question_id:$scope.next_id});
              }
              $scope.selectComments=function(is_acomment_active){
                $scope.activeTab.comments_tab=is_acomment_active;
                $timeout(function(){
                  $ionicScrollDelegate.resize();
                  $timeout(function(){
                    $ionicScrollDelegate.scrollBottom();
                  })
                })
              }

            }

        }
      }
    })

    .state('app.question_target', {
      url: "/question/:question_id/target",
      views: {
        'menuContent' :{
          templateUrl: "templates/create_question/question_target.html",
            resolve:{
              current_question:function(questionsService,$stateParams,$state,$timeout,$q){
                return $q.when(questionsService.getQuestionById($stateParams.question_id)).
                  then(function(question){
                    if(question){
                      questionsService.start();
                      return question;
                    }
                    else{
                      $timeout(function(){
                        $state.go('app.questions')
                      });
                      return $q.reject(false)
                    }
                  },
                  function(){
                    $timeout(function(){
                      $state.go('app.questions')
                    })
                    return $q.reject(false)
                  }
                );
              }
            },
            controller:function($scope, $stateParams,current_question,linearNavigation,questionsService,$state,User,$ionicPopup,$ionicLoading) {
              $scope.question=current_question;
              $scope.lnav=$scope.lnav=linearNavigation;
              $scope.groups=[
                {
                  name:'STATISFY COMMUNITIES',
                  item_property:'community_ids',
                  group_property:'all_comunities',
                  items:User.communities.as_memberList
                },
                {
                  name:'STATISFY GROUPS',
                  group_property:'all_groups',
                  item_property:'group_ids',
                  items:User.groups.list
                },
                {
                  name:'STATISFY FOLLOWERS',
                  group_property:'all_followers',
                  item_property:'follower_ids',

                  items:User.relationships.followersList
                },
                {
                  name:'STATISFY FOLLOWED',
                  group_property:'all_followed',
                  item_property:'followed_ids',

                  items:User.relationships.followingList

                }
              ]
              $scope.universe={};

              $scope.isAllSelected=function(group){
                  return group.items.reduce(function(previous, element){
                    return previous && element.selected;
                  },true)
              }

              $scope.toggleSelectAll=function(group){
                  group.items.forEach(function(item){
                    item.selected=!group.selected
                  });
                  group.selected=!group.selected;

                  return group.items.reduce(function(previous, element){
                    return previous && element;
                  },true)
              };

              $scope.toggleItem=function(item,group){
                item.selected=!item.selected;
                if(!item.selected){
                  group.selected=false;
                }
                else{
                  group.selected=$scope.isAllSelected(group);
                }
              }

              /*
               * if given group is the selected group, deselect it
               * else, select the given group
               */
              $scope.toggleGroup = function(group) {
                if ($scope.isGroupShown(group)) {
                  $scope.shownGroup = null;
                } else {
                  $scope.shownGroup = group;
                }
              };
              $scope.isGroupShown = function(group) {
                return $scope.shownGroup === group;
              };

              $scope.publish=function(){
                current_question.$$buildedQuestion.target=$scope.buildTarget();
                $ionicLoading.show();
                questionsService.create(current_question.$$buildedQuestion)
                .then(
                  function(){
                    return questionsService.publish(current_question)
                  }

                )
                .then(
                  function(question){
                      $ionicLoading.hide();
                    $state.go('app.question_build_result',{question_id:question.id})
                  });

              }


              $scope.buildTarget=function(){
                return $scope.groups.reduce(function(targets,group){
                  if(!group.selected || (group.selected && !group.group_property)){
                    targets[group.item_property]=group.items.filter(function(item){
                      return item.selected
                    })
                    targets[group.item_property]=targets[group.item_property].map(function(item){
                      return item.id;
                    })
                  }
                  else{
                    targets[group.group_property]=true;
                  }
                  if($scope.universe.checked){
                    targets.all=true;
                  }
                  return targets
                },{})
              }
              $scope.showAlert=function(){
                $ionicPopup.alert({
                  template:'Your question will be anonymous',
                  okText: 'OK', // String (default: 'OK'). The text of the OK button.
                  okType: 'button-positive button-clear'
                });
              }
            }
        }
      }
    })

    .state('app.question_builder', {
      url: "/question/new/:question_id/:question_type",
      views: {
        'menuContent' :{
          templateUrl: "templates/create_question/question_builder.html",
          controller: 'QuestionBuilderCtrl'
        },
        resolve:{
            questionsList:function(){
                return questionsService.getQuestions();
            }
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/questions');
});

