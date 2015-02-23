'use strict';

describe('Service: api/instances', function () {

  // load the service's module
  beforeEach(module('2centsApp'));

  // instantiate service
  var api/instances;
  beforeEach(inject(function (_api/instances_) {
    api/instances = _api/instances_;
  }));

  it('should do something', function () {
    expect(!!api/instances).toBe(true);
  });

});
