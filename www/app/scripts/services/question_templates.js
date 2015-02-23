'use strict';

/**
 * @ngdoc service
 * @name wwwApp.questionTemplates
 * @description
 * # questionTemplates
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('questionTemplates', function questionTemplates(questionTypes) {
        var _this=this;
        _this.getTemplate=function(question_type){
            return angular.copy(questionTypes.filter(function(qt){
                return qt.type===question_type;
            })[0])
        }
  });
