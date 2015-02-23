'use strict';

/**
 * @ngdoc service
 * @name wwwApp.values/notificationsList
 * @description
 * # values/notificationsList
 * Value in the wwwApp.
 */
angular.module('starter.values')
  .value('questionsTypeTranslator',{
    TextQuestion:{type:'text',$$type:'open_ended'},
    YesNoQuestion:{type:'yes_no', $$type:'select-question'},
    MultipleChoiceQuestion:{type:'pick_two', $$type:'select-question',image_choice:true},
    TextChoiceQuestion:{type:'single_choice', $$type:'select-question'},
    ImageChoiceQuestion:{type:'pick_one', $$type:'select-question',image_choice:true},
    OrderQuestion:{type:'prioritizer', $$type:'sortable',image_choice:true}
  });
