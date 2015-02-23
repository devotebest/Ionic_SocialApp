'use strict';

describe('Service: linearNavigation', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var linearNavigation;
  beforeEach(inject(function (_linearNavigation_) {
    linearNavigation = _linearNavigation_;
  }));

  it('should do something', function () {
    expect(!!linearNavigation).toBe(true);
  });

});
