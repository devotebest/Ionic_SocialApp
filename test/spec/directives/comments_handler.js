'use strict';

describe('Directive: commentsHandler', function () {

  // load the directive's module
  beforeEach(module('2centsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<comments-handler></comments-handler>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the commentsHandler directive');
  }));
});
