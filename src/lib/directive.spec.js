'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The opInboxCompose directive', function() {

  let $compile, $rootScope, $scope, $window, element, emailElement, MAILTOHANDLER_CONSTANTS;

  beforeEach(function() {
    angular.mock.module('esn.mailto-handler');
  });

  beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_, _$window_, _MAILTOHANDLER_CONSTANTS_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    MAILTOHANDLER_CONSTANTS = _MAILTOHANDLER_CONSTANTS_;
  }));

  beforeEach(function() {
    $scope = $rootScope.$new();
    window.openpaas = {
      MAILTO_SPA_URL: 'http://mailto.open-paas.org.local'
    };
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
    expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank');
  });

  it('should call the open fn when put email in opInboxCompose attribute', function() {
    emailElement = compileDirective('<a op-inbox-compose="SOMEONE"/>');
    $window.open = sinon.spy();

    emailElement.click();
    expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank');
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

    emailElement.trigger('click');

    expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank');
  });

  it('should it should use the email address as the display name if display name is not defined', function() {
    emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE"/>');
    $window.open = sinon.spy();

    emailElement.trigger('click');

    expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank');
  });
  describe('window size', function() {
    it('should look at op-inbox-compose-width to set width', function() {
      emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" op-inbox-compose-width="1000" />');
      $window.open = sinon.spy();
      $window.screen = { height: 2000, width: 2000 };

      emailElement.trigger('click');

      expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', 'width=1000,height=600,menubar=no,toolbar=no,status=no,top=700,left=500');
    });

    it('should look at op-inbox-compose-height to set height', function() {
      emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" op-inbox-compose-height="1000" />');
      $window.open = sinon.spy();
      $window.screen = { height: 2000, width: 2000 };

      emailElement.trigger('click');

      expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', 'width=800,height=1000,menubar=no,toolbar=no,status=no,top=500,left=600');
    });

    it('should choose screen width when smaller than asked width', function() {
      emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" op-inbox-compose-width="1000" />');
      $window.open = sinon.spy();
      $window.screen = { height: 2000, width: 200 };

      emailElement.trigger('click');

      expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', 'width=200,height=600,menubar=no,toolbar=no,status=no,top=700,left=0');
    });

    it('should choose screen height when smaller than asked width', function() {
      emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" op-inbox-compose-height="1000" />');
      $window.open = sinon.spy();
      $window.screen = { height: 200, width: 2000 };

      emailElement.trigger('click');

      expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', 'width=800,height=200,menubar=no,toolbar=no,status=no,top=0,left=600');
    });
  });

  describe('window positioning', function() {
    it('should center the window horizontally and vertically', function() {
      emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" op-inbox-compose-width="1000" op-inbox-compose-height="800" />');
      $window.open = sinon.spy();
      $window.screen = { height: 2000, width: 2000 };

      emailElement.trigger('click');

      expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', 'width=1000,height=800,menubar=no,toolbar=no,status=no,top=600,left=500');
    });
  });

  it('should use sensible default when window.screen is not exposed', function() {
    emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" />');
    $window.open = sinon.spy();
    $window.screen = null;

    emailElement.trigger('click');

    const expected = `width=${MAILTOHANDLER_CONSTANTS.windowWidth},height=${MAILTOHANDLER_CONSTANTS.windowHeight},menubar=no,toolbar=no,status=no,top=0,left=0`;

    expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', expected);
  });

  it('should use sensible default when window.screen.(width|height) are not exposed', function() {
    emailElement = compileDirective('<a op-inbox-compose ng-href="mailto:SOMEONE" />');
    $window.open = sinon.spy();
    $window.screen = {};

    emailElement.trigger('click');

    const expected = `width=${MAILTOHANDLER_CONSTANTS.windowWidth},height=${MAILTOHANDLER_CONSTANTS.windowHeight},menubar=no,toolbar=no,status=no,top=0,left=0`;

    expect($window.open).to.have.been.calledWith('http://mailto.open-paas.org.local/mailto/?uri=mailto:SOMEONE', '_blank', expected);
  });
});
