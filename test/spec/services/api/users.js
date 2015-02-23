'use strict';

describe('Service: api/users', function () {

  // load the service's module
  beforeEach(module('2centsApp'));

  // instantiate service
  var api/users;
  beforeEach(inject(function (_api/users_) {
    api/users = _api/users_;
  }));

  it('should do something', function () {
    expect(!!api/users).toBe(true);
  });

});
