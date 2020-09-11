'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The opInboxCompose directive', function() {

  var $compile, $rootScope, $scope, $window, element, emailElement;

  beforeEach(function() {
    angular.mock.module('esn.mailto-handler');
  });

  beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_, _$window_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
  }));

  beforeEach(function() {
    $scope = $rootScope.$new();
  });

  function compileDirective(html, data) {
    element = angular.element(html);
    element.appendTo(document.body);

    if (data) {
      Object.keys(data).forEach(function(key) {
        element.data(key, data[key]);
      });
    }

    $compile(element)($scope);
    $scope.$digest();

    return element;
  }

  it('should call the open fn when clicked on mailto link', function() {
    emailElement = compileDirective('<a ng-href="mailto:SOMEONE" op-inbox-compose/>');
    $window.open = sinon.spy();

    emailElement.click();
    expect($window.open).to.have.been.calledWith('http://localhost:9876/mailto/?uri=mailto:SOMEONE', '_blank');
  });

  it('should call the open fn when put email in opInboxCompose attribute', function() {
    emailElement = compileDirective('<a op-inbox-compose="SOMEONE"/>');
    $window.open = sinon.spy();

    emailElement.click();
    expect($window.open).to.have.been.calledWith('http://localhost:9876/mailto/?uri=mailto:SOMEONE', '_blank');
  });

  it('should call the preventDefault and stopPropagation fn when clicked on mailto link', function() {
    emailElement = compileDirective('<a ng-href="mailto:SOMEONE" op-inbox-compose/>');
    var event = {
      type: 'click',
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy()
    };

    emailElement.trigger(event);

    expect(event.preventDefault).to.have.been.called;
    expect(event.stopPropagation).to.have.been.called;
  });

  it('should not call the open fn when the link does not contain mailto', function() {
    emailElement = compileDirective('<a ng-href="tel:SOMEONE" op-inbox-compose/>');
    $window.open = sinon.spy();

    emailElement.click();

    expect($window.open).to.have.not.been.called;
  });

  it('should not call the open fn when the link does not mailto and opInboxCompose attribute is undefined', function() {
    emailElement = compileDirective('<a op-inbox-compose/>');
    $window.open = sinon.spy();

    emailElement.click();

    expect($window.open).to.have.not.been.called;
  });

  it('should not call the open fn when the link does not mailto and opInboxCompose attribute is default', function() {
    emailElement = compileDirective('<a op-inbox-compose="op-inbox-compose"/>');
    $window.open = sinon.spy();

    emailElement.click();

    expect($window.open).to.have.not.been.called;
  });

  it('should call the open fn with correct email', function() {
    emailElement = compileDirective('<a ng-href="mailto:SOMEONE" op-inbox-compose/>');
    $window.open = sinon.spy();

    emailElement.click();

    expect($window.open).to.have.been.calledWith('http://localhost:9876/mailto/?uri=mailto:SOMEONE', '_blank');
  });

  it('should it should use the email address as the display name if display name is not defined', function() {
    emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE"/>');
    $window.open = sinon.spy();

    emailElement.click();

    expect($window.open).to.have.been.calledWith('http://localhost:9876/mailto/?uri=mailto:SOMEONE', '_blank');
  });
});
