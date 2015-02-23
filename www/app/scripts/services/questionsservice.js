'use strict';

/**
 * @ngdoc service
 * @name wwwApp.questionsService
 * @description
 * # questionsService
 * Service in the wwwApp.
 */
angular.module('starter.services',[])
  .service('questionsService', function questionsService(questionsEndpoints,$q,xhrHandler,questionsTypeTranslator,profileService) {
    var previewQuestion,
      outOfFlowQuestion,
        _this=this,
      idsList=[],
      cursor= 0,
      page_size=50,
      category_ids=[];
      _this.feed_type="latest",
        
    _this.questionsList=[],    
    _this.category_ids=[];
    _this.my_feed_index=0;
    _this.root='questions/';
    _this.questions=[];
    _this.more_record=true;


    _this.apiCall=function(endpoint,dataObj){
      var url=_this.root+(questionsEndpoints[endpoint].path||endpoint)+'.json';
      var callObject={
        data:dataObj,
        url:url,
        method:questionsEndpoints[endpoint].method
      };
      return xhrHandler.call(callObject,questionsEndpoints[endpoint])
    }


    _this.get=function(force,search){

      if(_this.questionsList && _this.questionsList.length && !force){
        return $q.when(_this.questionsList);
      }

      var callObj={
        count:page_size,
        cursor:cursor,
        index:_this.my_feed_index
      };

      if(_this.category_ids.length){
        callObj.category_ids=_this.category_ids;
      }
      if(search){
        callObj.search_text=search;
      }

      return _this.apiCall(_this.feed_type,callObj).

        then(function(response){
          if(!cursor && !_this.my_feed_index){
            _this.questionsList.splice(0,_this.questionsList.length);
            idsList=[];
          }
          var questions=angular.isDefined(response.data.cursor)?response.data.questions:response.data;
          _this.there_is_more=questions.length===page_size;
          cursor=response.data.cursor;
          _this.questionsList=_this.questionsList.concat(questions.map(transformQuestion));
          return _this.questionsList;

        })
    };

    _this.getNextID=function(id){
      var idDefer=$q.defer();

      if(idsList[idsList.length-1].id!=id){
        var idx=idsList.indexOf(id);
        if(idx>=idsList.length){
          idx=-1;
        }
        idDefer.resolve({idx:(idx+1),id:idsList[idx+1]});

        idDefer.reject(null);
      }
      else if(_this.feed_type=='search'){
        iDefer.reject(null);
      }
      else{
        var next_index=idsList.length;
        _this.get()
          .then(function(){
            if(idsList[next_index]){
              return idDefer.resolve({id:idsList[next_index],idx:next_index});
            }
            return idDefer.reject(null);
          })
      }




      return idDefer.promise
    }

    _this.chooseFeed=function(type,extra){
      cursor=0;
      var search;
      category_ids=angular.isArray(extra)?extra:null;
      if(extra){
        if(angular.isArray(extra)){
          _this.category_ids=extra.slice();
        }
        else{
          search=extra;
        }
      }
      _this.feed_type=type;
      return _this.get(true,search);
    }

    _this.refreshFeed=function(){
      cursor=0;
      return _this.get(true);
    }

    _this.getQuestionById=function(id){
      if(previewQuestion && id==previewQuestion.id){
        return previewQuestion;
      }

      if(outOfFlowQuestion && id==outOfFlowQuestion.id){
        return outOfFlowQuestion;
      }
        return _this.get()
            .then(function(questions){
                return _this.questionsList.filter(function(q){
                    return (q && q.id && q.id.toString()==id.toString());
                })[0];
            }).
          then(
          function(question){
            if(question){
              return question
            }
            return _this.apiCall('question',{question_id:id}).
            then(function(response){
                return transformQuestion(response.data);
              })
          }
        )
    }

    _this.initBuilding=function(){
      previewQuestion=null;
    }

    _this.create=function(question,id){
      previewQuestion=null;

      if(id){
        question.id=id;
        if(question.choices && question.choices.length){
          question.choices.forEach(function(choice,idx){
            choice.id=idx;
          })
        }
        previewQuestion=question;
        return $q.when(question);
      }

      var type=question.$$url;
      delete question.$$url;


      return _this.apiCall(type,question).
        then(
        function(response){
          question.id=response.data.id;
          question.response_count=0;
          return question;
        }
      )


    }

    _this.publish=function(question){
      question.published_at=Date.now();
      question.published=true;
      return $q.when(question);
    }

    _this.respond=function(answer,question){
      if(!answer || !question){
        return $q.reject(new Error('missing data'));
      }
      return  _this.apiCall('response',answer)
       .then(function(response){
          question=angular.extend(question,response.data);
          question.response_count=question.summary.response_count;
          question.comment_count=question.summary.comment_count;

          /*replace choice ids*/
          try{
            question.summary.choices.forEach(function(choice,idx){
              choice.id=question.choices[idx].id;
            })
          }
          catch(e){

          }




          try{
            question.summary.choices.forEach(function(choice){
              choice.choice=question.choices.filter(function(option){
                return option.id==choice.id;
              })[0];
            })
          }
          catch(e){}
          finally{
            return question;
          }

        })
    }

    _this.getSelectedCategories=function(){
      return _this.category_ids;
    }

    /*
    * gets question from the server
    * */
    _this.getQuestionDetails=function(id){
      return _this.apiCall('question',{question_id:id})
    }

    /*
    * takes a question id and calls the questions/start api
    * */
    _this.start=function(id){
      return _this.apiCall('start',{question_id:id})
    }

    /*
    * returns the summary for a given question_id
    * */
    _this.getSummary=function(question){
      return _this.apiCall('summary',{question_id:question.id})
        .then(function(response){
          question=angular.extend(question,response.data);
          question.response_count=question.summary.response_count;
          question.comment_count=question.summary.comment_count;
          return question;
        })
    }
    /*
    * skips a question
    * */
    _this.skip=function(question){
      return _this.apiCall('skip',{question_id:question.id})
        .then(function(response){
          return _this.getNextID(question.id)
        })
        .then(function(nextPosition){
          _this.questionsList.splice((nextPosition.idx-1),1);
          return nextPosition.id;
        })
    }


    /*
     * returns the list of the questions answreded by a user
     * */
    _this.getAnswered=function(user_id){
      var queryData={};
      if(user_id){
        queryData.user_id=user_id;
      }

      return _this.apiCall('answered',queryData)
        .then(
        function(response){
          return response.data;
        }
      );
    }
    /*
     * returns the list of the questions answreded by a user
     * */
    _this.getCommented=function(user_id){
        var queryData={};
        if(user_id){
          queryData.user_id=user_id;
        }

        return _this.apiCall('commented',queryData)
          .then(
          function(response){
            return response.data;
          }
        );


    }
    /*
     * returns the list of the questions answreded by a user
     * */
    _this.getAsked=function(user_id){
      var queryData={};
      if(user_id){
        queryData.user_id=user_id;
      }

      return _this.apiCall('asked',queryData)
        .then(
        function(response){
          return response.data;
        }
      );


    }

    _this.offFlow=function(question){
      var idx=_this.questionsList.indexOf(question);
      if(idx>=0){
        _this.outOfFlowQuestion=_this.questionsList.splice(idx,1)[0]
      }
      else{
        _this.outOfFlowQuestion=question;
      }
    }

    function transformQuestion (original_question){

      idsList.push(original_question.id);
      original_question=original_question.question||original_question;
      original_question.created_at=new Date(original_question.created_at*1000);
      var question =angular.copy(original_question);
      if(!original_question.avatar_url){
        profileService.get_headshot(original_question.creator_id)
          .then(function(response){
            var oq=original_question;
            var nq=question;
            oq=angular.extend(oq,response);
            nq=angular.extend(nq,response);
          })
      }


      if(question.$$type){
        return question;
      }

      question=angular.extend(question,questionsTypeTranslator[question.type]);
      if(question.choices && question.choices.length){
        question.choices=question.choices.map(function(choice){
          choice.choice.text=choice.choice.title;
          return choice.choice;
        })
      }
      return question;
    }

    _this.clearRecords=function(){
      _this.questionsList=[];
        cursor= 0;
        page_size=50;
        category_ids=[];
      _this.feed_type="latest";
        _this.category_ids=[];
      _this.my_feed_index=0;
      _this.questions=[];
      _this.more_record=true;
    }
  });
