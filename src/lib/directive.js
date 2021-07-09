const _ = require('lodash');

(function(angular) {
  'use strict';

  angular.module('esn.mailto-handler').directive('opInboxCompose', opInboxCompose);

  function opInboxCompose($parse, $window, MAILTOHANDLER_CONSTANTS) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        function _isEmailDefinedByOpInboxCompose() {
          return attrs.opInboxCompose && attrs.opInboxCompose !== 'op-inbox-compose';
        }

        function _findRecipientEmails() {
          if (_.contains(attrs.ngHref, 'mailto:')) {
            return attrs.ngHref.replace(/^mailto:/, '').split(',');
          }
          if (_isEmailDefinedByOpInboxCompose()) {
            return [attrs.opInboxCompose];
          }
        }

        function getWindowAttributes() {
          const defaultWindowWidth = attrs.opInboxComposeWidth && Number.isInteger(Number(attrs.opInboxComposeWidth)) ?
            Number(attrs.opInboxComposeWidth) : MAILTOHANDLER_CONSTANTS.windowWidth;
          const defaultWindowHeight = attrs.opInboxComposeHeight && Number.isInteger(Number(attrs.opInboxComposeHeight)) ?
            Number(attrs.opInboxComposeHeight) : MAILTOHANDLER_CONSTANTS.windowHeight;
          const sHeight = $window.screen && $window.screen.height || 0;
          const sWidth = $window.screen && $window.screen.width || 0;

          const wHeight = Math.min(defaultWindowHeight, sHeight || defaultWindowHeight);
          const wWidth = Math.min(defaultWindowWidth, sWidth || defaultWindowWidth);

          const top = Math.max(Math.round((sHeight - wHeight) / 2), 0);
          const left = Math.max(Math.round((sWidth - wWidth) / 2), 0);

          return `width=${wWidth},height=${wHeight},menubar=no,toolbar=no,status=no,top=${top},left=${left}`;
        }

        element.on('click', function(event) {
          var emails = _findRecipientEmails();

          if (emails || attrs.opInboxComposeUsers) {
            event.preventDefault();
            event.stopPropagation();

            var targets;

            if (attrs.opInboxComposeUsers) {
              var users = $parse(attrs.opInboxComposeUsers)(scope);

              targets = users.map(function(target) {
                // TODO: Write tests for this (esn-frontend-mailto-handler#2)
                var targetToAdded = {
                  name: target.name ||
                        typeof target.displayName === 'function' && target.displayName() ||
                        target.displayName ||
                        target.firstname + ' ' + target.lastname ||
                        target.preferredEmail,
                  email: target.email || target.preferredEmail
                };

                return Object.assign(target, targetToAdded);
              });

            } else {
              targets = emails.map(function(email) {
                return {
                  email: email,
                  name: attrs.opInboxComposeDisplayName || email
                };
              });
            }

            $window.open(getMailtoUrl(targets), '_blank', getWindowAttributes());
          }
        });
      }
    };

    function getMailtoUrl(targets) {
      const recipients = targets.map(function(target) {
        return target.email;
      }).join(',');

      return new URL('/mailto/?uri=mailto:' + encodeURIComponent(recipients), window.openpaas && window.openpaas.MAILTO_SPA_URL || $window.location.origin).toString();
    }
  }

})(angular);

require('./constant');
