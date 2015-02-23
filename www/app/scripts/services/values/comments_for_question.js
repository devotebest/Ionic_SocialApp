'use strict';

/**
 * @ngdoc service
 * @name wwwApp.values/commentsForQuestion
 * @description
 * # values/commentsForQuestion
 * Value in the wwwApp.
 */
angular.module('starter.values')
  .value('commentsForQuestion', [
    {
      "id": 328,
      "user_id": 120,
      "comment": "post a comment",
      "created_at": 1416030853,
      "email": "demouser_11@demousers.com",
      "ask_count": 0,
      "response_count": 3,
      "comment_count": 2,
      "comment_children": [
        {
          "id": 329,
          "user_id": 120,
          "comment": "another comment",
          "created_at": 1416030888,
          "email": "demouser_11@demousers.com",
          "ask_count": 0,
          "response_count": 3,
          "comment_count": 2,
          "comment_children": []
        }
      ]
    }
  ]);
