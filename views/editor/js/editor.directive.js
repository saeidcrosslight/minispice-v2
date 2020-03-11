'use strict';

angular
        .module('editors.directive', [])
        .directive('editors', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/editor/page/editor.html'
            };
        })

        .directive('editorminispice', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/editor/page/editor.minispice.html'
            };
        });
