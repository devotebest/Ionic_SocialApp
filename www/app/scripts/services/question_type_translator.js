'use strict';

/**
 * @ngdoc service
 * @name wwwApp.questionTypeTranslator
 * @description
 * # questionTypeTranslator
 * Value in the wwwApp.
 */
angular.module('starter.values')
  .value('questionTypeTranslator', {
        yes_no:'single-choice',
        pick_one:'single-choice',
        single_choice:'single-choice',
        pick_two:'multi-choice',
        multiple_choice:'multi-choice',
        prioritizer:'sortable',
        open_ended:'text'
    });
