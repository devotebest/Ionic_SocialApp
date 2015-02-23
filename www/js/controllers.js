angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state,User,$ionicPopup, messagesService,questionsService,Configs) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.state=$state;
    $scope.user=User;
  $scope.configs=Configs;
  // Create the login modal that we will use later
 $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    /*$scope.modal = modal;
    if(!user.token){
      $scope.login()
    }*/
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


    $scope.invite=function(){
      $timeout(function(){
        var myPopup = $ionicPopup.show({
          template:[
            '<div class="sharing-bar row">',
            ' <a href="http://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=dce7a7fc87a3f498359f8104db25130a&service=5&title=Check%20it%20out&link=http://ionic-test-2cents.herokuapp.com" target="_blank" class="col"><span class="icon ion-social-facebook"></span></a>',
            ' <a href="http://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=dce7a7fc87a3f498359f8104db25130a&service=7&title=Check%20it%20out&link=http://ionic-test-2cents.herokuapp.com" target="_blank" class="col"><span class="icon ion-social-twitter"></span></a>',
            ' <a href="http://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=dce7a7fc87a3f498359f8104db25130a&service=304&title=Check%20it%20out&link=http://ionic-test-2cents.herokuapp.com" target="_blank" class="col"><span class="icon ion-social-googleplus"></span></a>',
            '</div>'
          ].join(''),
          title: 'Share With',
          scope: $scope,
          buttons: [
            {
              text: 'CLOSE'
            }
          ]
        });
      })
    }

    $scope.logout=function(){
      User.logout()
        .then(function(){
          messagesService.clearRecords();
          questionsService.clearRecords();
          $state.go('app.auth.signup');
        })
    }

})

.controller('QuestionsCtrl', function($scope,$state,questionsService,categoriesList,$ionicScrollDelegate,$timeout,$ionicModal,$ionicLoading) {


$scope.$on('$ionicView.enter',function(){
      $ionicLoading.hide();
    })



    var selectedCategories=questionsService.getSelectedCategories(),
      scrollHandler=$ionicScrollDelegate.$getByHandle('mainScroll');

    $ionicModal.fromTemplateUrl('templates/feed_search_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });



  $scope.questions =questionsService;
  $scope.categories=categoriesList;
  $scope.qs=questionsService;
  $scope.goToQuestionTypes=function(){
    $state.go('app.question_types')
  }
  $scope.chooseFeed=function(type,category,forced){
    if($scope.qs.feed_type==type && !forced){
      return
    }
    $ionicLoading.show()

    $scope.view_categories=false;
    questionsService.chooseFeed(type,category)
      .finally(function(){
        $ionicLoading.hide();
      })
  };

  $scope.refreshFeed=function(){
    questionsService.refreshFeed()
      .then(function(returnedQuestions){
      }).
      finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      })
  };

  $scope.getMore=function(){
    $scope.qs.get(true)
      .finally(function(returnedQuestions){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })

  }

  $scope.applyCategories=function(){
    $scope.view_categories=false;
  }

  $scope.toggleCategory=function(id){
    var idx=selectedCategories.indexOf(id);
    if(idx>=0){
      selectedCategories.splice(idx,1);
    }
    else{
      selectedCategories.push(id)
    }
  }

  $scope.isSelected=function(id){
    return selectedCategories.indexOf(id)>=0
  }

  $scope.applyCategories=function(){
    $scope.chooseFeed('categories',selectedCategories,true);
    $scope.view_categories=false;

    $timeout(function(){
      scrollHandler.resize();
      scrollHandler.scrollTop();
    });

  }

  $scope.showCategories=function(){
    $scope.view_categories=true;
    $scope.qs.feed_type='categories'

    $timeout(function(){
      scrollHandler.resize();
      scrollHandler.scrollTop();
    });
  }

  $scope.showSearch=function(){
    $scope.qs.feed_type='search'
    $scope.modal.show();
  }

  $scope.searchFor=function(search_text){
    $scope.chooseFeed('search',search_text,true);
    $scope.modal.hide();
  }

})

.controller('NotificationsCtrl', function($scope,notificationsList,$state) {
    $scope.list=notificationsList.messages;
})
.controller('FollowersCtrl', function($scope,$state) {
    $scope.list=[1,2,3,4,5];
})
.controller('FollowingCtrl', function($scope,$state) {
    $scope.list=[1,2,3,4,5];
})
.controller('CommunitiesCtrl', function($scope,$state,$stateParams) {
    $scope.$on('$stateChangeSuccess',function(state){
      if(/communities$/.test($state.current.name)){
        $state.go('app.profile.communities.join')
      }
    })
    $scope.external_user=$stateParams.user_id;
  })
.controller('ProfileQuestionsCtrl', function($scope,$state) {
    $scope.$on('$stateChangeSuccess',function(state){
      if(/questions$/.test($state.current.name)){
        $state.go('app.profile.questions.asked')
      }
    })
})
.controller('ProfileQuestionsListCtrl', function($scope,List) {
  $scope.list=List;
})
.controller('ProfileAnsweredQuestionsCtrl', function($scope,$state) {
})
.controller('ProfileCommentedQuestionsCtrl', function($scope,$state) {
})
.controller('ProfileAskedQuestionsCtrl', function($scope,$state) {
})
.controller('ChoiceResponseCtrl', function ($scope) {
   if(!$scope.answer){
            $scope.answer={}
        }
   if(!$scope.answer.choices){
            $scope.answer.choices=[];
        }

   $scope.toggleChoice=function(id){
            var idx=$scope.answer.choices.indexOf(id);
            if(idx>=0){
                $scope.answer.choices.splice(idx,1);
                return false;
            }
            if($scope.single){
                $scope.answer.choices.splice(0,$scope.answer.choices.length);
            }
            $scope.answer.choices.push(id)
        }

   $scope.isSelected=function(id){
            return ($scope.answer.choices.indexOf(id)>=0)
        }

   $scope.validate=function(){
          //$scope.question.answer={};
            return $scope.answer.choices.length>0;
        }

   $scope.buildQuestion=function(question){


      var newQuestion={
        title:question.title,
        rotate:false,
        image_url:question.image_url,
        choices:question.choices,
        'choices[title]':[],
        'choices[rotate]':[],
        $$url:question.$$url,
        category_id:question.category_id,
        description:question.description
      }

      if(question.min_responses || question.min_responses===0){
        newQuestion.min_responses=question.min_responses;
      }

      question.choices.forEach(function(choice){
        choice.title=choice.text;
        choice.rotate=false;
        newQuestion['choices[title]'].push(choice.text);
        newQuestion['choices[rotate]'].push(false);
        if(question.image_choice){
          newQuestion['choices[image_url]']=newQuestion['choices[image_url]']||[];
          newQuestion['choices[image_url]'].push(choice.image_url);
        }
        if(question.possible_muex || question.min_responses===0){
          newQuestion['choices[muex]']=newQuestion['choices[muex]']||[]
          newQuestion['choices[muex]'].push(choice.image_url);
        }
      })


      return newQuestion;
    }

   $scope.buildAnswer=function(){
      var answer={};
      if($scope.single){
        answer.choice_id=$scope.answer.choices[0]
      }
      else{
        answer.choice_ids=$scope.answer.choices.slice();
      }
      return answer;
   }

})
.controller('QuestionTypesCtrl',function($scope,questionTypes,$ionicPopup,questionsService){
        var qt=$scope.qt=questionTypes;
    $scope.$watch('$ionicView.enter',questionsService.initBuilding);
    $scope.showAlert=function(text){
      $ionicPopup.alert({
//        title: '', // String. The title of the popup.
//        subTitle: '', // String (optional). The sub-title of the popup.
        template: text, // String (optional). The html template to place in the popup body.
        okText: 'OK', // String (default: 'OK'). The text of the OK button.
        okType: 'button-positive button-clear' // String (default: 'button-positive'). The type of the OK button.
      });
    }
})
.controller('QuestionBuilderCtrl',function($scope,questionTemplates,$state,categoriesList,$q,linearNavigation,questionsService,$ionicPopup){
        $scope.lnav=$scope.lnav=linearNavigation;
    var template;

    $scope.question=angular.copy(questionsService.getQuestionById($state.params.question_id));
    if($scope.question && !$scope.question.then){
      $scope.template=questionTemplates.getTemplate($scope.question.type);
    }
    else{
      template=$scope.template=questionTemplates.getTemplate($state.params.question_type);
      $scope.question=JSON.parse(JSON.stringify(template));
    }


   /*     if($state.params.question_type!=='-1')
            {
              template=$scope.template=questionTemplates.getTemplate($state.params.question_type);
            $scope.question=JSON.parse(JSON.stringify(template));
        }
        else{
                $scope.question=angular.copy(questionsService.getQuestionById(-1));
              $scope.template=questionTemplates.getTemplate($scope.question.type);
        }
*/

        var categories=$scope.categories=categoriesList;

        $scope.setCategory=function($event,category){
            $scope.question.category_id=category.id;
            $scope.category_name=category.name;
            $scope.hideMenu($event);
        }

        $scope.$watch('question.category_id',function(){
            var new_cat=$scope.category_name=categoriesList.getDetails($scope.question.category_id);
            $scope.category_name=((new_cat && new_cat.name)?new_cat.name:'Choose ategory');
        })
        $scope.preview=function(){

          var validation=$scope.validate()

          if(validation.error){

            $ionicPopup.alert({
              template: validation.error,
              okText: 'Close', // String (default: 'OK'). The text of the OK button.
              okType: 'button-positive button-clear'
            });
            return;
          }
          questionsService.create($scope.question,-1)
              .then(
              function(question){
                $state.go('app.question',{question_id:question.id});
              }
            )
        };

    $scope.hideMenu=function(){
      $scope.show_categories=false;

    };

    $scope.showMenu=function(){
      $scope.show_categories=true;
    };

    $scope.$on('previewQuestion',$scope.preview);


  });
