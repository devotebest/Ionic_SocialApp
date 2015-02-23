'use strict';

/**
 * @ngdoc service
 * @name wwwApp.cssBreakPoints
 * @description
 * # cssBreakPoints
 * Service in the wwwApp.
 */
angular.module('starter.services')
  .service('cssBreakPoints', function cssBreakPoints($window) {
    var _this=this,
    breakpoints={
      sm:{
        width:{
          min:0,
          max:640
        },
        height:{
          min:0,
          max:960
        }
      },
      md:{
        width:{
          min:641,
          max:750
        },
        height:{
          min:961,
          max:1334
        }
      },
      lg:{
        width:{
          min:751,
          max:960
        },
        height:{
          min:1335,
          max:1704
        }
      },
      xl:{
        width:{
          min:961
        },
        height:{
          min:1705
        }
      }
    }

    _this.getWidthPointName=function(width){
      width=+(width||$window.innerWidth);
      var point='xl';
      angular.forEach(breakpoints,function(values,label){
        if(width>=values.width.minwidth && width<=values.width.min){
          point=label;
        }
      })
      return point;
    }

  });
