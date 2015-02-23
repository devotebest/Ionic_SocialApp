'use strict';

/**
 * @ngdoc service
 * @name wwwApp.question
 * @description
 * # question
 * Value in the wwwApp.
 */
angular.module('starter.values')
  .value('questionTypes', [
    {
            type:'yes_no',
            $$type:'select-question',
            $$url:'text_choice_question',
            $$max:2,
            $$label: 'Yes No',
            $$information_text:'some text for yes no',
            title:'Type your question here...',
            image_choice:false,
            choices:[
              {text:'',$placeholder:'Yes'},
              {text:'',$placeholder:'No'}
            ]
    },
    {
      type:'multiple_choice',
      $$type:'select-question',
      $$url:'text_choice_question',
      $$max:4,
      $$label: 'Multiple Choice',
      $$information_text:'some text for multiple choice',
      possible_muex:true,
      min_responses:1,
      title:'Type your question here...',
      choices:[
        {text:'',$placeholder:'Option 1'},
        {text:'',$placeholder:'Option 2'}
      ]
    },
    {
            type:'pick_one',
            $$type:'select-question',
            $$url:'image_choice_question',
            $$max:4,
            $$label: 'Pick One',
            title:'Type your question here...',
            $$information_text:'some text for pick one',
            image_choice:true,
            choices:[
              {text:'',$placeholder:'Option 1'},
              {text:'',$placeholder:'Option 2'}
            ]
        },
        {
            type:'pick_two',
            $$type:'select-question',
            $$url:'image_choice_question',
            $$max:4,
            $$label: 'Pick Two',
            title:'Type your question here...',
            $$information_text:'some text for pick two',
            image_choice:true,
            choices:[
              {text:'',$placeholder:'Option 1'},
              {text:'',$placeholder:'Option 2'}
            ]
        },
        {
            type:'open_ended',
            $$url:'text_question',
            $$type:'text',
            $$label: 'Open ended',
            $$information_text:'some text for open ended',
            title:'Type your question here...',
            min_characters:0,
            max_characters:255
        },
        {
            type:'prioritizer',
            $$url:'order_question',
            $$type:'sortable',
            $$label:'Prioritizer',
            $$information_text:'some text for prioritizer',
            title:'Type your question here...',
            image_ratio:'0.3',
            $$max:4,
            image_choice:true,
            choices:[
              {text:'',$placeholder:'Option 1'},
              {text:'',$placeholder:'Option 2'}
            ]
        }
    ]);
