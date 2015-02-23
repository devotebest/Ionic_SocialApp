'use strict';

/**
 * @ngdoc service
 * @name wwwApp.globalImagesList
 * @description
 * # globalImagesList
 * Value in the wwwApp.
 */
angular.module('starter.values',[])
  .factory('globalImagesList',['Instance',function(Instance){
    var listsCollection={
      choices:[],
      questions:[]
    }


    Instance.ready.
      then(function(instance){
        listsCollection.questions=listsCollection.questions.concat(instance.background_images.map(function(url){
          return {url:url};
        }));
        listsCollection.choices=listsCollection.choices.concat(instance.background_choice_images.map(function(url){
          return {url:url};
        }));
        return listsCollection;
      })

      return listsCollection;
  }]);
