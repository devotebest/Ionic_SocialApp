'use strict';

/**
 * @ngdoc service
 * @name wwwApp.api/enpoints/questions
 * @description
 * # api/enpoints/questions
 * Value in the wwwApp.
 */
angular.module('statisfy')
  .value('questionsEndpoints', {

        question:{
            method:'GET',
            required:{
                id:'number'
            }
        },
        responses:{
            method:'GET',
            required:{
                id:'number'
            }
        },
        latest:{},
        trending:{},
        myfeed:{},
        search:{},
        categories:{
          path:'latest'
        },
        asked:{},
        response:{
            required:{
                question_id:'number',
                $$xor:{
                    text:'string',
                    choice_id:"number",
                    choice_ids:'array'
                }
            }
        },
        answered:{},
        summary:{
            required:{
                question_id:'number'
            }
        },
        innapropriate:{
            required:{
                question_id:'number',
                reason:'string'
            }
        },
        like:{
            required:{
                question_id:'number'
            }
        },
        skip:{
            required:{
                question_id:'number'
            },
            method:'PUT'
        },
        follow:{
            required:{
                question_id:'number'
            }
        },
        start:{
            required:{
                question_id:'number'
            }
        },
        share:{
            required:{
                question_id:'number'
            }
        },
        text_question:{

        },
        text_choice_question:{

        },
        image_choice_question:{

        },
        multiple_choice_question:{

        }
    });
